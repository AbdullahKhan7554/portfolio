/**
 * Nova chat — rate-limit hook (PLACEHOLDER, Milestone 4).
 *
 * A single seam the API route awaits before serving a turn. It currently always
 * allows. A real limiter (per-IP fixed window via src/lib/rate-limit, or an
 * external store like Upstash/Vercel KV) can be dropped in here later WITHOUT
 * touching the route or the AI layer.
 *
 * @param {Request} _request
 * @param {{ key?: string }} [_options]
 * @returns {Promise<{ allowed: boolean, remaining: number, limit: number }>}
 */
// eslint-disable-next-line no-unused-vars
export async function rateLimitHook(_request, _options = {}) {
  return { allowed: true, remaining: Infinity, limit: Infinity };
}
