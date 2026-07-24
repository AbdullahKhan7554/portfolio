/**
 * Nova — conversation runtime (Milestone 5D glue + Milestone 10 memory).
 *
 * Binds the Conversation Orchestrator (5C) to the streaming chat pipeline (5D
 * = KMS + system prompt + NVIDIA provider). Responsibilities are strictly:
 *   1. let the orchestrator decide the turn (it owns all sales/lead logic),
 *   2. serialize that decision into a one-line directive,
 *   3. reuse `createChatStream` to phrase + stream the reply, grounded in KMS.
 *
 * Milestone 10 adds conversation memory around that pipeline (using ONLY the
 * Memory Framework from M9): restore + merge history before streaming, and
 * persist the user + assistant messages. Streaming is unchanged — tokens pass
 * through immediately; the only accumulation is the assistant text for saving.
 * Memory failures never break chat.
 *
 * Milestone 11 adds provider-agnostic tool execution (using ONLY the Tool
 * Framework from M6): after the stream completes, any tool call in the assistant
 * text is executed through the injected ToolRouter and appended to the
 * conversation. Detection/execution happen POST-stream, so tokens are never
 * buffered; tool failures resolve to normalized ToolResults and never crash.
 *
 * No business decisions are made here — the orchestrator controls the
 * conversation, the provider only phrases, the knowledge service only grounds.
 */
import { conversationOrchestrator as defaultOrchestrator } from '../orchestrator';
import { ACTION } from '../orchestrator/orchestratorConfig';
import { buildMemoryService } from '../memory';
import { createKnowledgeService } from '../knowledge';
import { createChatStream } from './chatService';
import { getDefaultToolRouter, parseToolCalls, runToolCalls } from './toolRuntime';
import { buildGroundingContext } from './contextInjection';
import { defaultIntentPlanner } from '../planner';

/**
 * Default memory service (lazy). A single instance persists conversations across
 * turns/requests for the in-memory strategy; injection overrides it (DI).
 * Strategy is resolved entirely from aiConfig.memory.strategy inside M9.
 */
let defaultMemory = null;
function getDefaultMemory() {
  if (!defaultMemory) defaultMemory = buildMemoryService();
  return defaultMemory;
}

/**
 * Default Knowledge Service (lazy). A single instance is shared between the
 * grounding search and the chat pipeline so they reuse the SAME cached
 * knowledge index; injection overrides it (DI).
 */
let defaultKnowledgeService = null;
function getDefaultKnowledgeService() {
  if (!defaultKnowledgeService) defaultKnowledgeService = createKnowledgeService();
  return defaultKnowledgeService;
}

/** Latest user message from the running history. */
function lastUserMessage(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'user') return messages[i].content;
  }
  return '';
}

/** New conversation id when the runtime doesn't provide one. */
function createConversationId() {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `conv_${rand}`;
}

/** Server-side memory log (never surfaced to the client). */
function logMemory(op, err) {
  // eslint-disable-next-line no-console
  console.error('[Nova Memory]', op, err?.message || err);
}

/** Restore persisted history as { role, content } messages (empty on failure). */
async function loadHistory(memory, conversationId) {
  try {
    const res = await memory.loadConversation(conversationId);
    if (res?.ok && res.data?.messages?.length) {
      return res.data.messages.map((m) => ({ role: m.role, content: m.content }));
    }
  } catch (e) {
    logMemory('loadConversation', e);
  }
  return [];
}

/** Merge restored history with the current request; newest message last, deduped. */
function mergeHistory(history, current) {
  const key = (m) => `${m.role}::${m.content}`;
  const seen = new Set((current || []).map(key));
  const restored = (history || []).filter((m) => !seen.has(key(m)));
  return [...restored, ...(current || [])];
}

/** Append a message; memory failures are logged and swallowed (chat never breaks). */
async function safeAppend(memory, conversationId, message, companyId) {
  try {
    const res = await memory.appendMessage(conversationId, message, { companyId });
    if (res && res.ok === false) logMemory('appendMessage', res.error);
  } catch (e) {
    logMemory('appendMessage', e);
  }
}

/**
 * True passthrough stream: yields every token immediately (no buffering) while
 * accumulating the assistant text ONLY to persist it after completion. The
 * assistant message is saved solely on a successful, non-aborted stream — so
 * an abort or failure never saves a partial/duplicate reply.
 */
async function* persistOnComplete(
  stream,
  { memory, conversationId, companyId, signal, toolRouter, toolResults },
) {
  let assistantText = '';
  let completed = false;
  try {
    for await (const token of stream) {
      assistantText += token; // accumulation for memory/tools ONLY (the one allowed exception)
      yield token; // immediate passthrough — tokens reach the client at once
    }
    completed = true;
  } finally {
    if (completed && !signal?.aborted) {
      if (assistantText) {
        await safeAppend(memory, conversationId, { role: 'assistant', content: assistantText }, companyId);
      }
      // Milestone 11: provider-agnostic tool execution (post-stream — never buffers tokens).
      if (toolRouter) {
        const calls = parseToolCalls(assistantText);
        if (calls.length) {
          const results = await runToolCalls(toolRouter, calls, { companyId, conversationId });
          for (const result of results) {
            if (toolResults) toolResults.push(result);
            await safeAppend(memory, conversationId, { role: 'tool', content: JSON.stringify(result) }, companyId);
          }
        }
      }
    }
  }
}

/**
 * Serialize the orchestrator's already-made decision into a single instruction
 * for the provider to phrase. Pure formatting — no decisions taken here.
 */
function buildTurnDirective(action) {
  switch (action?.type) {
    case ACTION.ASK:
      return `Ask the visitor exactly one short, friendly question to get this: "${action.prompt}". Do not ask anything else this turn.${
        action.error ? ` Their last answer was invalid (${action.error}); gently ask again.` : ''
      }`;
    case ACTION.RECOMMEND: {
      const label = action.recommendation?.name || action.recommendation?.serviceId || 'the best-fit option';
      return `Recommend "${label}" in 2–3 sentences, grounded in the company knowledge, explaining why it fits what they described, then ask if they'd like to proceed.`;
    }
    case ACTION.COMPLETE:
      return 'Warmly thank the visitor and tell them the team will follow up shortly. Do not ask any further questions.';
    case ACTION.SAY:
    default:
      return action?.message
        ? `Convey this naturally in one short, warm message: "${action.message}"`
        : '';
  }
}

/**
 * Run one conversation turn end-to-end (with memory persistence).
 * @param {Object} input
 * @param {string} input.companyId
 * @param {Array<{role:string,content:string}>} input.messages
 * @param {object} [input.state]                     prior orchestrator state (round-tripped; carries conversationId)
 * @param {object} [input.orchestrator]              injectable (DI/testing)
 * @param {object} [input.memory]                    injectable Memory Service (DI); defaults to the shared instance
 * @param {object} [input.toolRouter]                injectable Tool Router (DI); defaults to the shared instance
 * @param {string} [input.providerId]
 * @param {object} [input.providerConfig]
 * @param {object} [input.config]
 * @param {object} [input.knowledgeService]          injectable Knowledge Service (DI); defaults to the shared instance
 * @param {object} [input.planner]                   injectable Intent Planner (DI); defaults to the shared planner
 * @param {AbortSignal} [input.signal]
 * @returns {Promise<{ stream:AsyncGenerator<string>, updatedState:object, nextStage:string, assistantAction:object, toolResults:Array, executionPlan:object }>}
 */
export async function runConversationTurn({
  companyId,
  messages,
  state,
  orchestrator = defaultOrchestrator,
  memory = getDefaultMemory(),
  toolRouter = getDefaultToolRouter(),
  knowledgeService = getDefaultKnowledgeService(),
  planner = defaultIntentPlanner,
  providerId,
  providerConfig,
  config,
  signal,
}) {
  // 0) Conversation id from the runtime state; create one automatically if missing.
  const conversationId = state?.conversationId || createConversationId();

  // 1) Restore persisted history and merge with the current request (newest last).
  const history = await loadHistory(memory, conversationId);
  const merged = mergeHistory(history, messages || []);

  // 2) Orchestrator controls the conversation (unchanged — newest user message).
  const { assistantAction, nextStage, updatedState: orchestratorState } = orchestrator.process(
    lastUserMessage(messages),
    state || undefined,
  );
  // Carry the conversation id forward so the runtime restores the same thread.
  const updatedState = { ...orchestratorState, conversationId };

  // 3) Turn decision → directive (glue only).
  const directive = buildTurnDirective(assistantAction);

  // 4) Persist the user message now, so it survives even if streaming aborts.
  const userText = lastUserMessage(messages);
  if (userText) await safeAppend(memory, conversationId, { role: 'user', content: userText }, companyId);

  // 4b) M12: inject RELEVANT company context via the existing search() (cached
  //     index; relevant-only, ordered, deduped, token-budgeted; graceful on any
  //     failure). Shares the injected Knowledge Service with the chat pipeline.
  const context = await buildGroundingContext(knowledgeService, companyId, userText, { config });

  // 4c) M13: classify the request into an execution plan (planning only — the
  //     planner never executes anything; the plan is returned for the caller).
  const executionPlan = planner.plan({
    message: userText,
    config: { companyId },
    directive,
    state,
    assistantAction,
  });

  // 5) Reuse the existing streaming pipeline (knowledge + provider) with merged history.
  const rawStream = await createChatStream({
    companyId,
    messages: merged,
    providerId,
    providerConfig,
    config,
    knowledgeService,
    signal,
    directive,
    context,
  });

  // 6) Stream tokens straight through; after completion save the assistant reply
  //    and run any tool calls it contains (results populate `toolResults`).
  const toolResults = [];
  const stream = persistOnComplete(rawStream, {
    memory,
    conversationId,
    companyId,
    signal,
    toolRouter,
    toolResults,
  });

  return { stream, updatedState, nextStage, assistantAction, toolResults, executionPlan };
}
