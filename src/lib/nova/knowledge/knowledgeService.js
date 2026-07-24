/**
 * Nova KMS — knowledge service (composition root). Wires the company registry +
 * the READ-ONLY repository layer + parser + validator + search into one façade,
 * with a per-company TTL cache.
 *
 * Milestone 8: the DATA SOURCE is now the Supabase repository layer (via DI),
 * not the file/markdown loader. The PUBLIC API is unchanged — `createKnowledge
 * Service()`, `getKnowledge(companyId)`, `search(...)`, and the returned
 * `{ config, documents, validation, index }` shape are identical, so existing
 * callers keep working. No AI, no API routes, no writes (read-only).
 */
import { knowledgeRegistry } from './companies';
import { validateCompanyKnowledge } from './validator';
import { buildSearchIndex, search as keywordSearch } from './search';
import { buildRepositoryRegistry, createSupabaseAdapter } from '../data';
import { loadKnowledgeFromRepositories } from './supabaseKnowledgeSource';

/** In-memory cache TTL (60s). */
const DEFAULT_CACHE_TTL_MS = 60_000;

/**
 * @param {Object} [deps]
 * @param {Object} [deps.registry]        company config registry (fallback/identity)
 * @param {Object} [deps.repositories]    injected RepositoryRegistry (DI)
 * @param {Object} [deps.supabaseClient]  injected Supabase client (DI) — used to build repositories
 * @param {boolean} [deps.includeProducts]
 * @param {number} [deps.cacheTtlMs]
 */
export function createKnowledgeService({
  registry = knowledgeRegistry,
  repositories,
  supabaseClient,
  includeProducts = true,
  cacheTtlMs = DEFAULT_CACHE_TTL_MS,
} = {}) {
  // Inject the RepositoryRegistry (DI); otherwise build one from an injected
  // Supabase client. With no client the adapter is disconnected and repository
  // reads return normalized errors — the service degrades, never crashes.
  const repos =
    repositories || buildRepositoryRegistry({ adapter: createSupabaseAdapter({ client: supabaseClient }) });

  /** @type {Map<string, { value:object, expiresAt:number }>} */
  const cache = new Map();

  /**
   * Load + parse + validate + index a company's knowledge (cached, TTL 60s).
   * @param {string} companyId
   * @param {{ force?:boolean }} [opts]
   */
  async function getKnowledge(companyId, { force = false } = {}) {
    const now = Date.now();
    if (!force) {
      const hit = cache.get(companyId);
      if (hit && now < hit.expiresAt) return hit.value;
    }

    const { config, documents } = await loadKnowledgeFromRepositories({
      repositories: repos,
      registry,
      companyId,
      includeProducts,
    });
    if (!config) {
      throw new Error(
        `Unknown company "${companyId}". Registered: ${registry.ids().join(', ') || 'none'}.`,
      );
    }

    const validation = validateCompanyKnowledge(documents);
    const index = buildSearchIndex(documents, { companyId });

    const result = { config, documents, validation, index };
    cache.set(companyId, { value: result, expiresAt: now + cacheTtlMs });
    return result;
  }

  /**
   * Keyword-search a company's knowledge.
   * @param {string} companyId
   * @param {string} query
   * @param {{ limit?:number }} [options]
   */
  async function search(companyId, query, options) {
    const { index } = await getKnowledge(companyId);
    return keywordSearch(index, query, options);
  }

  return {
    registry,
    getKnowledge,
    search,
    clearCache: () => cache.clear(),
  };
}
