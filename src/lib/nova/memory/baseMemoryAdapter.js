/**
 * Nova Memory — BaseMemoryAdapter: the storage contract (abstract).
 *
 * Adapters provide primitive persistence only: load / save / delete / list +
 * connection validation. Higher-level operations (append, trim, clear) live in
 * the service and compose these primitives, so every backend behaves uniformly.
 * Provider-agnostic: an adapter knows storage, never AI/providers.
 */
import { MemoryError } from './memoryErrors';

export class BaseMemoryAdapter {
  constructor({ deps = {} } = {}) {
    if (new.target === BaseMemoryAdapter) {
      throw new TypeError('BaseMemoryAdapter is abstract; extend it with a concrete adapter.');
    }
    this.deps = deps;
  }

  /** Adapter id (e.g. 'in-memory', 'supabase'). Concrete adapters override. */
  get name() {
    throw new MemoryError(`${this.constructor.name} must define get name().`, 'MEMORY_NO_NAME');
  }

  /** @returns {Promise<{ok:boolean, missing:string[]}>} */
  async validateConnection() {
    return { ok: true, missing: [] };
  }

  /** @param {string} _id @returns {Promise<import('./memoryTypes').Conversation|null>} */
  // eslint-disable-next-line no-unused-vars
  async load(_id) {
    throw new MemoryError(`${this.constructor.name}.load() is not implemented.`, 'MEMORY_NOT_IMPLEMENTED');
  }

  /** @param {import('./memoryTypes').Conversation} _conversation @returns {Promise<import('./memoryTypes').Conversation>} */
  // eslint-disable-next-line no-unused-vars
  async save(_conversation) {
    throw new MemoryError(`${this.constructor.name}.save() is not implemented.`, 'MEMORY_NOT_IMPLEMENTED');
  }

  /** @param {string} _id @returns {Promise<boolean>} */
  // eslint-disable-next-line no-unused-vars
  async delete(_id) {
    throw new MemoryError(`${this.constructor.name}.delete() is not implemented.`, 'MEMORY_NOT_IMPLEMENTED');
  }

  /** @param {string} [_companyId] @returns {Promise<import('./memoryTypes').Conversation[]>} */
  // eslint-disable-next-line no-unused-vars
  async list(_companyId) {
    throw new MemoryError(`${this.constructor.name}.list() is not implemented.`, 'MEMORY_NOT_IMPLEMENTED');
  }
}
