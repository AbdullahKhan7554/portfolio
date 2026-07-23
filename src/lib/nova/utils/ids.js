/**
 * Nova — id generation. Prefers the platform UUID; degrades gracefully.
 * Pure aside from reading the ambient clock / RNG.
 */

/**
 * Namespaced, collision-resistant id, e.g. `conv_1a2b...`.
 * @param {string} [prefix]
 * @returns {string}
 */
export function createId(prefix = 'nova') {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`;
}
