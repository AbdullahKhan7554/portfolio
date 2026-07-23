/**
 * Nova — token estimation.
 *
 * A deliberately cheap heuristic (~4 chars/token) used by the context builder
 * to keep prompts within budget. This is an ESTIMATE, not a real tokenizer —
 * a provider-accurate tokenizer can be injected later without changing callers.
 */

/** Rough characters-per-token for English-ish text. */
const CHARS_PER_TOKEN = 4;
/** Per-message overhead (role markers, delimiters). */
const MESSAGE_OVERHEAD = 4;

/**
 * Estimate tokens for a string.
 * @param {string} text
 * @returns {number}
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(String(text).length / CHARS_PER_TOKEN);
}

/**
 * Estimate tokens for a list of messages (content + per-message overhead).
 * @param {Array<{ content:string }>} messages
 * @returns {number}
 */
export function estimateMessagesTokens(messages = []) {
  return messages.reduce(
    (total, m) => total + estimateTokens(m.content) + MESSAGE_OVERHEAD,
    0,
  );
}
