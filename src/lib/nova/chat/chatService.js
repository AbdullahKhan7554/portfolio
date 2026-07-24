/**
 * Nova chat — server-side orchestration for ONE conversation turn.
 *
 * Implements the required flow, provider-agnostically:
 *   messages → context builder → knowledge loader (KMS) → system prompt builder
 *            → provider (factory) → streaming tokens
 *
 * No business logic beyond assembling the request: no lead capture, no memory,
 * no analytics. Swapping `providerId` (openai → anthropic → gemini → local)
 * changes nothing here — the factory + BaseProvider contract absorb it.
 */
import { aiConfig } from '../config/aiConfig';
import { createModelRouter } from '../router';
import {
  resolveFallbackProviderId,
  resolveProviderConfigById,
} from '../providers/providerResolver';
import { buildSystemPrompt } from '../core/systemPromptBuilder';
import { buildContext } from '../core/contextBuilder';
import { toProviderMessages } from '../core/messageFormatter';
import { createKnowledgeService } from '../knowledge';
import { ProviderConfigError } from '../types/errors';
import { buildKnowledgePrompt } from './knowledgePrompt';
import { withRetry } from './retry';

/**
 * Prepare and open a streaming completion for a chat turn.
 *
 * @param {Object} input
 * @param {string} input.companyId                        active tenant (KMS + identity)
 * @param {Array<{role:'user'|'assistant',content:string}>} input.messages
 * @param {string} [input.providerId]                     defaults to aiConfig.defaultProvider
 * @param {Object} [input.providerConfig]                 runtime overrides (e.g. { apiKey, model })
 * @param {Object} [input.config]                         aiConfig override
 * @param {ReturnType<typeof createKnowledgeService>} [input.knowledgeService]  injectable (DI/testing)
 * @param {AbortSignal} [input.signal]                    cancellation
 * @param {string} [input.directive]                      per-turn instruction (from the orchestrator)
 * @returns {Promise<AsyncGenerator<string>>}             token stream
 */
export async function createChatStream({
  companyId,
  messages,
  providerId,
  providerConfig = {},
  config = aiConfig,
  knowledgeService,
  signal,
  directive = '',
  context,
}) {
  const resolvedProviderId = providerId || config.defaultProvider;

  // 1) Knowledge loader (Milestone 3 KMS) — resolves company config + documents.
  const kms = knowledgeService || createKnowledgeService();
  const { config: company, documents } = await kms.getKnowledge(companyId);

  // 2) System prompt builder — identity + grounding, all from the active company.
  //    M12: when the runtime injects relevant `context` (from search()), use it
  //    as the grounding instead of the whole knowledge base. Falls back to the
  //    full KB only when no context was injected (backward compatible).
  const knowledge = context !== undefined ? context : buildKnowledgePrompt(documents);
  const baseSystem = buildSystemPrompt({
    identity: { assistantName: company.assistantName, brandName: company.brandName },
    sections: config.prompts,
    knowledge,
  });
  // The orchestrator (5C) decides WHAT to do this turn; the provider only
  // phrases it. Appended as an instruction — no business logic in the provider.
  const system = directive
    ? `${baseSystem}\n\n# This turn (follow exactly)\n${directive}`
    : baseSystem;

  // 3) Context builder — trim history to the token budget (reserving output).
  const ctx = buildContext({
    system,
    messages,
    tokenBudget: config.contextTokenBudget,
    reserveForResponse: config.maxResponseTokens,
  });

  // 4) Model router(s) — the PRIMARY provider (AI_PROVIDER) selects its model
  //    (NOVA_MODEL) and owns its own in-provider failover chain, exactly as
  //    before. When FALLBACK_PROVIDER is set (opt-in), a SECOND provider is
  //    prepared so the SAME request can transparently fall through to it if the
  //    primary fails BEFORE any token reaches the client (see
  //    streamAcrossProviders). When unset, this is a single-provider chain and
  //    behaves byte-for-byte as today.
  const primaryRouter = createModelRouter({
    providerId: resolvedProviderId,
    providerConfig: { ...config.providers[resolvedProviderId], ...providerConfig },
  });

  let fallbackRouter = null;
  const fallbackId = resolveFallbackProviderId(process.env);
  if (fallbackId && fallbackId !== resolvedProviderId) {
    // The fallback provider's own secret/base URL come from its env vars; its
    // model + in-provider failover are resolved by createModelRouter exactly as
    // if it were the primary — NVIDIA's path is unchanged when it is the fallback.
    const fcfg = resolveProviderConfigById(fallbackId, process.env);
    fallbackRouter = createModelRouter({
      providerId: fallbackId,
      providerConfig: {
        ...config.providers[fallbackId],
        apiKey: fcfg.apiKey,
        model: fcfg.model,
        baseUrl: fcfg.baseUrl,
      },
    });
  }

  // Readiness: unchanged for the single-provider case (throw if the primary is
  // not configured). With a configured, ready fallback the request can still be
  // served even when the primary itself is not ready.
  const primaryCheck = primaryRouter.validate();
  if (!primaryCheck.ok && !(fallbackRouter && fallbackRouter.validate().ok)) {
    throw new ProviderConfigError(
      `Nova model/provider is not ready: ${primaryCheck.missing.join(', ')}.`,
      primaryCheck.missing,
    );
  }

  // Ordered attempt chain: primary first, then the optional cross-provider fallback.
  const chain = [{ providerId: resolvedProviderId, router: primaryRouter }];
  if (fallbackRouter) chain.push({ providerId: fallbackId, router: fallbackRouter });

  // 5) Streaming response — TRUE incremental streaming. The cross-provider
  //    fallback decision happens BEFORE the first token is yielded to the
  //    client; once tokens flow, a later failure fails cleanly (no mid-stream
  //    switch, no duplicate output). Retry wrapper is a placeholder (single attempt).
  const streamParams = {
    system: ctx.system,
    messages: toProviderMessages(ctx.messages),
    temperature: config.temperature,
    maxTokens: config.maxResponseTokens,
    signal,
  };
  return withRetry(() => streamAcrossProviders(chain, streamParams), { retries: 0 });
}

/**
 * Cross-provider failover as a TRUE passthrough stream. Tries each provider's
 * router in order; a failure is only recoverable BEFORE the first token is
 * yielded — once streaming to the client has begun, the error propagates (no
 * mid-stream switch, no duplicated/corrupted output). A client abort never
 * triggers fallback. With a single-entry chain this is a plain passthrough,
 * identical to calling `router.stream()` directly.
 *
 * @param {Array<{providerId:string, router:import('../router').ModelRouter}>} chain
 * @param {object} params  provider stream params (system, messages, temperature, ...)
 */
async function* streamAcrossProviders(chain, params) {
  let lastError;
  for (let i = 0; i < chain.length; i += 1) {
    const { providerId, router } = chain[i];
    let started = false;
    try {
      for await (const token of router.stream(params)) {
        started = true;
        yield token; // immediate passthrough — no buffering
      }
      return; // completed successfully on this provider
    } catch (err) {
      // Already streaming to the client, or the client aborted → cannot switch;
      // fail cleanly with the original error (no silent mid-stream retry).
      if (started || params.signal?.aborted || err?.name === 'AbortError') throw err;
      lastError = err;
      const next = chain[i + 1];
      if (next) {
        // eslint-disable-next-line no-console
        console.log(
          `[Nova Router]\nCross-provider fallback: "${providerId}" failed before streaming ` +
            `(${err?.status ?? err?.code ?? err?.name ?? 'error'}).\n` +
            `Falling through to "${next.providerId}".`,
        );
      }
      // No next provider → fall out of the loop and rethrow below.
    }
  }
  throw lastError;
}
