/**
 * Nova Data — shared types + result factories for the repository layer.
 *
 * The normalized, provider-agnostic result every repository read resolves to.
 * Pure data helpers; no business logic, no I/O.
 */

/** Repository names (keys used by the registry). */
export const REPOSITORY = Object.freeze({
  COMPANY: 'company',
  PRODUCT: 'product',
  FAQ: 'faq',
  KNOWLEDGE: 'knowledge',
  LEAD: 'lead',
  CONVERSATION: 'conversation',
});

/** Default table names (config — a tenant can override per repository). */
export const DEFAULT_TABLES = Object.freeze({
  [REPOSITORY.COMPANY]: 'companies',
  [REPOSITORY.PRODUCT]: 'products',
  [REPOSITORY.FAQ]: 'faqs',
  [REPOSITORY.KNOWLEDGE]: 'knowledge_documents',
  [REPOSITORY.LEAD]: 'leads',
  [REPOSITORY.CONVERSATION]: 'conversations',
});

/**
 * @typedef {Object} RepositoryResult
 * @property {boolean} ok
 * @property {any} data            rows / row / value on success (null on failure)
 * @property {string|null} error   normalized message on failure
 * @property {number|null} count   total count when requested
 * @property {Object} metadata     free-form
 *
 * @typedef {Object} QueryOptions
 * @property {Object} [filters]    { column: value } equality filters
 * @property {string} [columns]    column selection (default '*')
 * @property {number} [limit]
 * @property {number} [offset]
 * @property {{ column:string, ascending?:boolean }} [orderBy]
 */

/** Build a success RepositoryResult. */
export function repoSuccess(data, { count = null, metadata = {} } = {}) {
  return { ok: true, data, error: null, count, metadata };
}

/** Build a failure RepositoryResult. */
export function repoFailure(error, { metadata = {} } = {}) {
  const message = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
  return { ok: false, data: null, error: message, count: null, metadata };
}
