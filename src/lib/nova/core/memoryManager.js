/**
 * Nova — conversation memory abstraction.
 *
 * `MemoryStore` is the interface every persistence backend implements;
 * `InMemoryStore` is the default volatile implementation (a Map). This keeps
 * storage swappable via dependency injection — a localStorage or database
 * adapter can be dropped in later WITHOUT touching callers. No backend, no
 * network, no external service here.
 */
import { NotImplementedError } from '../types/errors';

/** Abstract persistence contract. */
export class MemoryStore {
  // eslint-disable-next-line no-unused-vars
  async save(_conversation) {
    throw new NotImplementedError('MemoryStore.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async load(_id) {
    throw new NotImplementedError('MemoryStore.load() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(_id) {
    throw new NotImplementedError('MemoryStore.delete() must be implemented.');
  }

  async list() {
    throw new NotImplementedError('MemoryStore.list() must be implemented.');
  }
}

/** Default in-process store. Volatile — cleared on reload. */
export class InMemoryStore extends MemoryStore {
  constructor() {
    super();
    /** @type {Map<string, import('../types/conversation').Conversation>} */
    this._map = new Map();
  }

  async save(conversation) {
    this._map.set(conversation.id, conversation);
    return conversation;
  }

  async load(id) {
    return this._map.get(id) ?? null;
  }

  async delete(id) {
    return this._map.delete(id);
  }

  async list() {
    return [...this._map.values()];
  }

  async clear() {
    this._map.clear();
  }
}
