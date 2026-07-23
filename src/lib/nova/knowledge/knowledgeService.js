/**
 * Nova KMS — knowledge service (composition root). Wires registry + loader +
 * parser + validator + search into one façade via dependency injection, with a
 * per-company cache. This is the single entry point the AI layer will consume
 * in a later milestone. No AI, no API routes, no backend service.
 */
import { knowledgeRegistry } from './companies';
import { createKnowledgeLoader } from './loader';
import { parseDocuments } from './parser';
import { validateCompanyKnowledge } from './validator';
import { buildSearchIndex, search as keywordSearch } from './search';

/**
 * @param {Object} [deps]
 * @param {import('./registry').KnowledgeRegistry} [deps.registry]  injected registry
 * @param {ReturnType<typeof createKnowledgeLoader>} [deps.loader]  injected loader
 * @param {string} [deps.baseDir]                                   knowledge root override
 */
export function createKnowledgeService({ registry = knowledgeRegistry, loader, baseDir } = {}) {
  const load = loader || createKnowledgeLoader({ baseDir });
  const cache = new Map();

  /**
   * Load + parse + validate + index a company's knowledge (cached).
   * @param {string} companyId
   * @param {{ force?:boolean }} [opts]
   */
  async function getKnowledge(companyId, { force = false } = {}) {
    if (!force && cache.has(companyId)) return cache.get(companyId);

    const config = registry.get(companyId);
    if (!config) {
      throw new Error(
        `Unknown company "${companyId}". Registered: ${registry.ids().join(', ') || 'none'}.`,
      );
    }

    const rawDocs = await load.loadCompany(config);
    const documents = parseDocuments(rawDocs);
    const validation = validateCompanyKnowledge(documents);
    const index = buildSearchIndex(documents, { companyId });

    const result = { config, documents, validation, index };
    cache.set(companyId, result);
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
