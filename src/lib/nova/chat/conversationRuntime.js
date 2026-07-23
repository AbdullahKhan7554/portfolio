/**
 * Nova — conversation runtime (Milestone 5D integration glue ONLY).
 *
 * Binds the Conversation Orchestrator (5C) to the streaming chat pipeline (5D
 * = KMS + system prompt + OpenAI provider). Responsibilities are strictly:
 *   1. let the orchestrator decide the turn (it owns all sales/lead logic),
 *   2. serialize that decision into a one-line directive,
 *   3. reuse `createChatStream` to phrase + stream the reply, grounded in KMS.
 *
 * No business decisions are made here — the orchestrator controls the
 * conversation, the provider only phrases, the knowledge service only grounds.
 */
import { conversationOrchestrator as defaultOrchestrator } from '../orchestrator';
import { ACTION } from '../orchestrator/orchestratorConfig';
import { createChatStream } from './chatService';

/** Latest user message from the running history. */
function lastUserMessage(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'user') return messages[i].content;
  }
  return '';
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
 * Run one conversation turn end-to-end.
 * @param {Object} input
 * @param {string} input.companyId
 * @param {Array<{role:string,content:string}>} input.messages
 * @param {object} [input.state]                     prior orchestrator state (in-memory round-trip)
 * @param {object} [input.orchestrator]              injectable (DI/testing)
 * @param {string} [input.providerId]
 * @param {object} [input.providerConfig]
 * @param {object} [input.config]
 * @param {object} [input.knowledgeService]
 * @param {AbortSignal} [input.signal]
 * @returns {Promise<{ stream:AsyncGenerator<string>, updatedState:object, nextStage:string, assistantAction:object }>}
 */
export async function runConversationTurn({
  companyId,
  messages,
  state,
  orchestrator = defaultOrchestrator,
  providerId,
  providerConfig,
  config,
  knowledgeService,
  signal,
}) {
  // 1) Orchestrator controls the conversation (sales + lead engines inside it).
  const { assistantAction, nextStage, updatedState } = orchestrator.process(
    lastUserMessage(messages),
    state || undefined,
  );

  // 2) Turn decision → directive (glue only).
  const directive = buildTurnDirective(assistantAction);

  // 3) Reuse the existing streaming pipeline (knowledge + provider).
  const stream = await createChatStream({
    companyId,
    messages,
    providerId,
    providerConfig,
    config,
    knowledgeService,
    signal,
    directive,
  });

  return { stream, updatedState, nextStage, assistantAction };
}
