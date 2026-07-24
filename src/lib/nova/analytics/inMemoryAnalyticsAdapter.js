/**
 * Nova Analytics — default in-memory adapter. Volatile array-backed store.
 * No I/O, no external deps.
 */
import { BaseAnalyticsAdapter } from './baseAnalyticsAdapter';

export class InMemoryAnalyticsAdapter extends BaseAnalyticsAdapter {
  /** @param {Object} [options] @param {Array} [options.store] injectable backing array (DI) */
  constructor({ store } = {}) {
    super({ deps: {} });
    this._events = Array.isArray(store) ? store : [];
  }

  get name() {
    return 'in-memory';
  }

  async record(entry) {
    this._events.push(entry);
    return entry;
  }

  /** Snapshot of recorded events. */
  events() {
    return [...this._events];
  }

  clear() {
    this._events = [];
  }
}
