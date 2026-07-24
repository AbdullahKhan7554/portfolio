/**
 * Nova Memory — in-memory adapter. Volatile Map-backed storage (default). Clones
 * on read/write so callers can't mutate stored state. No I/O, no external deps.
 */
import { BaseMemoryAdapter } from './baseMemoryAdapter';

const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));

export class InMemoryAdapter extends BaseMemoryAdapter {
  /**
   * @param {Object} [options]
   * @param {Map} [options.store]   injectable backing store (DI)
   */
  constructor({ store } = {}) {
    super({ deps: {} });
    /** @type {Map<string, import('./memoryTypes').Conversation>} */
    this._store = store ?? new Map();
  }

  get name() {
    return 'in-memory';
  }

  async validateConnection() {
    return { ok: true, missing: [] };
  }

  async load(id) {
    return this._store.has(id) ? clone(this._store.get(id)) : null;
  }

  async save(conversation) {
    this._store.set(conversation.id, clone(conversation));
    return clone(conversation);
  }

  async delete(id) {
    return this._store.delete(id);
  }

  async list(companyId) {
    return [...this._store.values()]
      .filter((c) => !companyId || c.companyId === companyId)
      .map(clone);
  }
}
