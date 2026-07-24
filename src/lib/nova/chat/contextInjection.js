/**
 * Nova — context injection / grounding (Milestone 12).
 *
 * Builds a compact grounding block from the RELEVANT company documents for the
 * current user message, using ONLY the existing Knowledge Service `search()`
 * API (which reuses the already-built, cached knowledge index — no re-parsing,
 * no re-indexing, no direct Supabase access, no duplicated search logic).
 *
 * Rules enforced here: relevant-only (never the whole KB), ordered by relevance,
 * de-duplicated, and capped to a token budget derived from aiConfig. Any failure
 * (no company, empty knowledge, repository down, search error) degrades to an
 * empty string so chat continues normally.
 */
import { estimateTokens } from '../utils/tokenEstimator';
import { aiConfig } from '../config/aiConfig';

/** Share of the context token budget reserved for injected grounding. */
const GROUNDING_BUDGET_RATIO = 0.4;

/**
 * @param {{ search: Function }} knowledgeService  injected Knowledge Service (DI)
 * @param {string} companyId
 * @param {string} userMessage
 * @param {{ config?:object, limit?:number }} [options]
 * @returns {Promise<string>}  grounding block ('' when nothing relevant / on failure)
 */
export async function buildGroundingContext(knowledgeService, companyId, userMessage, { config = aiConfig, limit = 5 } = {}) {
  try {
    if (typeof knowledgeService?.search !== 'function' || !companyId || !userMessage) return '';

    // Existing search() → ranked, relevant results from the cached index.
    const results = await knowledgeService.search(companyId, userMessage, { limit });
    if (!Array.isArray(results) || results.length === 0) return '';

    const budget = Math.max(
      0,
      Math.floor(((config?.contextTokenBudget ?? aiConfig.contextTokenBudget) || 0) * GROUNDING_BUDGET_RATIO),
    );

    const seen = new Set();
    const blocks = [];
    let used = 0;

    // Results arrive ordered by relevance (score desc) — preserve that order.
    for (const r of results) {
      if (!r || (r.score ?? 0) <= 0) continue; // relevant only
      const key = `${r.docId}::${r.heading}`;
      if (seen.has(key)) continue; // no duplicate documents
      const block = `## ${r.heading}\n${r.snippet ?? ''}`.trim();
      if (!block) continue;
      const cost = estimateTokens(block) + 4;
      if (used + cost > budget) break; // respect the token budget
      seen.add(key);
      blocks.push(block);
      used += cost;
    }

    return blocks.join('\n\n');
  } catch {
    return ''; // search failure → graceful, ungrounded but working chat
  }
}
