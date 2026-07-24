/**
 * Nova Memory — strategy registry. Maps a storage strategy name → an adapter
 * factory, so the storage backend is selected ENTIRELY by configuration
 * (no code changes to switch). Injectable; no singleton is forced on callers.
 */
import { InMemoryAdapter } from './inMemoryAdapter';
import { SupabaseMemoryAdapter } from './supabaseMemoryAdapter';

export const MEMORY_STRATEGY = Object.freeze({
  IN_MEMORY: 'in-memory',
  SUPABASE: 'supabase',
});

export class MemoryAdapterRegistry {
  constructor() {
    /** @type {Map<string, (options:object)=>object>} */
    this._factories = new Map();
  }

  register(strategy, factory) {
    this._factories.set(strategy, factory);
    return this;
  }

  has(strategy) {
    return this._factories.has(strategy);
  }

  /** Instantiate the adapter for a strategy with injected options. */
  create(strategy, options = {}) {
    const factory = this._factories.get(strategy);
    if (!factory) {
      throw new Error(
        `Unknown memory strategy "${strategy}". Available: ${this.strategies().join(', ') || 'none'}.`,
      );
    }
    return factory(options);
  }

  strategies() {
    return [...this._factories.keys()];
  }
}

/** Build a registry seeded with the built-in strategies. */
export function createMemoryAdapterRegistry() {
  const registry = new MemoryAdapterRegistry();
  registry.register(MEMORY_STRATEGY.IN_MEMORY, (options = {}) => new InMemoryAdapter(options));
  registry.register(MEMORY_STRATEGY.SUPABASE, (options = {}) => new SupabaseMemoryAdapter(options));
  return registry;
}
