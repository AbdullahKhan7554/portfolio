/**
 * Nova chat — retry architecture (PLACEHOLDER, Milestone 4).
 *
 * Wraps an async operation so retry/backoff can be added later in ONE place.
 * Today it executes the operation exactly once (no retries), preserving the
 * intended call site and signature. A future implementation can add attempts,
 * exponential backoff + jitter, and error classification without changing
 * callers.
 *
 * @template T
 * @param {() => Promise<T> | T} operation
 * @param {{ retries?: number, backoffMs?: number }} [options]
 * @returns {Promise<T>}
 */
// eslint-disable-next-line no-unused-vars
export async function withRetry(operation, { retries = 0, backoffMs = 500 } = {}) {
  // Placeholder: single attempt. Retry/backoff arrives in a later milestone.
  return operation();
}
