/**
 * Nova KMS — company registry. Registers and resolves company configs so the
 * system supports UNLIMITED tenants. Holds config only (no markdown, no I/O);
 * loading/parsing is the loader/parser's job (single responsibility).
 */
import { createCompanyConfig } from './companySchema';

export class KnowledgeRegistry {
  constructor() {
    /** @type {Map<string, Readonly<import('./companySchema').CompanyConfig>>} */
    this._companies = new Map();
  }

  /**
   * Register a new company. Validates + freezes the config. Throws on duplicate.
   * @param {object} config
   */
  register(config) {
    const c = createCompanyConfig(config);
    if (this._companies.has(c.companyId)) {
      throw new Error(`Company "${c.companyId}" is already registered.`);
    }
    this._companies.set(c.companyId, c);
    return c;
  }

  /** Register or replace (idempotent). */
  upsert(config) {
    const c = createCompanyConfig(config);
    this._companies.set(c.companyId, c);
    return c;
  }

  /** @param {string} companyId @returns {object|null} */
  get(companyId) {
    return this._companies.get(companyId) ?? null;
  }

  /** @param {string} companyId */
  has(companyId) {
    return this._companies.has(companyId);
  }

  /** @param {string} companyId */
  unregister(companyId) {
    return this._companies.delete(companyId);
  }

  /** All registered configs. */
  list() {
    return [...this._companies.values()];
  }

  /** All registered ids. */
  ids() {
    return [...this._companies.keys()];
  }
}

/**
 * Build a registry pre-seeded with company configs (dependency injection).
 * @param {object[]} [configs]
 */
export function createKnowledgeRegistry(configs = []) {
  const registry = new KnowledgeRegistry();
  for (const config of configs) registry.register(config);
  return registry;
}
