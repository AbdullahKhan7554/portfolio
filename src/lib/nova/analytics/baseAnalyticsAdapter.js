/**
 * Nova Analytics — adapter contract (abstract). Concrete adapters implement
 * `record(entry)`. Provider-agnostic and runtime-independent (no runtime
 * imports). A Supabase adapter can be added later by extending this.
 */
export class BaseAnalyticsAdapter {
  constructor({ deps = {} } = {}) {
    if (new.target === BaseAnalyticsAdapter) {
      throw new TypeError('BaseAnalyticsAdapter is abstract; extend it with a concrete adapter.');
    }
    this.deps = deps;
  }

  /** Adapter id (e.g. 'in-memory'). Concrete adapters override. */
  get name() {
    throw new Error(`${this.constructor.name} must define get name().`);
  }

  /** Persist one event entry. @param {{event:string, payload:object, at:number}} _entry */
  // eslint-disable-next-line no-unused-vars
  async record(_entry) {
    throw new Error(`${this.constructor.name}.record() is not implemented.`);
  }
}
