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
import { createProvider } from '../providers/providerFactory';
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
}) {
  const resolvedProviderId = providerId || config.defaultProvider;

  // 1) Knowledge loader (Milestone 3 KMS) — resolves company config + documents.
  const kms = knowledgeService || createKnowledgeService();
  const { config: company, documents } = await kms.getKnowledge(companyId);

  // 2) System prompt builder — identity + grounding, all from the active company.
  const knowledge = buildKnowledgePrompt(documents);
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

  // 4) Provider (factory) — isolated adapter; config (incl. secret) injected here.
  const provider = createProvider(resolvedProviderId, {
    ...config.providers[resolvedProviderId],
    ...providerConfig,
  });
  const check = provider.validateConfig();
  if (!check.ok) {
    throw new ProviderConfigError(
      `Provider "${resolvedProviderId}" is missing config: ${check.missing.join(', ')}.`,
      check.missing,
    );
  }

  // 5) Streaming response — retry wrapper is a placeholder (single attempt).
  return withRetry(
    () =>
      provider.stream({
        system: ctx.system,
        messages: toProviderMessages(ctx.messages),
        temperature: config.temperature,
        maxTokens: config.maxResponseTokens,
        signal,
      }),
    { retries: 0 },
  );
}
