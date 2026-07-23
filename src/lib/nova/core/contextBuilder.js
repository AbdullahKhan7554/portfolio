/**
 * Nova — context builder. Assembles the prompt payload that fits a token
 * budget: keeps the system prompt, then the most RECENT messages that fit once
 * space is reserved for the response. Pure and provider-agnostic — the token
 * estimator is swappable. No AI calls.
 */
import { estimateTokens, estimateMessagesTokens } from '../utils/tokenEstimator';

/**
 * @param {Object} params
 * @param {string} [params.system]                     system prompt text
 * @param {import('../types/message').NovaMessage[]} params.messages
 * @param {number} [params.tokenBudget]                total prompt token ceiling
 * @param {number} [params.reserveForResponse]         tokens to leave for output
 * @returns {{
 *   system: string,
 *   messages: import('../types/message').NovaMessage[],
 *   estimatedTokens: number,
 *   trimmed: number
 * }}
 */
export function buildContext({
  system = '',
  messages = [],
  tokenBudget = 6000,
  reserveForResponse = 1024,
} = {}) {
  const available = Math.max(0, tokenBudget - reserveForResponse - estimateTokens(system));

  // Walk newest → oldest, keeping messages until the budget is exhausted.
  const kept = [];
  let used = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const cost = estimateMessagesTokens([messages[i]]);
    if (used + cost > available) break;
    kept.push(messages[i]);
    used += cost;
  }
  kept.reverse();

  return {
    system,
    messages: kept,
    estimatedTokens: estimateTokens(system) + used,
    trimmed: messages.length - kept.length,
  };
}
