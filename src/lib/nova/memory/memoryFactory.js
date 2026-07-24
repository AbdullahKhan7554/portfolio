/**
 * Nova Memory — factory (composition root, DI). Selects the storage strategy
 * from configuration (`aiConfig.memory.strategy`) and wires the adapter into a
 * memory service. Switching in-memory ⇄ supabase is config-only.
 */
import { aiConfig } from '../config/aiConfig';
import { createMemoryService } from './memoryService';
import { createMemoryAdapterRegistry } from './memoryRegistry';

/**
 * Create an adapter for a strategy via the registry (DI).
 * @param {Object} options
 * @param {string} options.strategy
 * @param {import('./memoryRegistry').MemoryAdapterRegistry} [options.registry]
 */
export function createMemoryAdapter({ strategy, registry = createMemoryAdapterRegistry(), ...options } = {}) {
  return registry.create(strategy, options);
}

/**
 * Build a fully-wired memory service. Strategy resolves from `strategy` →
 * `config.memory.strategy` → 'in-memory'. Client/repository/store are injected
 * per strategy. No singletons, no globals.
 *
 * @param {Object} [deps]
 * @param {Object} [deps.config]           aiConfig override
 * @param {import('./memoryRegistry').MemoryAdapterRegistry} [deps.registry]
 * @param {Object} [deps.adapter]          pre-built adapter (skips strategy resolution)
 * @param {string} [deps.strategy]         override config strategy
 * @param {Object} [deps.client]           supabase client (supabase strategy)
 * @param {Object} [deps.repository]       read repository (supabase strategy)
 * @param {Map} [deps.store]               backing store (in-memory strategy)
 * @param {string} [deps.table]
 * @param {number} [deps.maxMessages]
 * @param {number} [deps.cacheTtlMs]
 */
export function buildMemoryService({
  config = aiConfig,
  registry = createMemoryAdapterRegistry(),
  adapter,
  strategy,
  client,
  repository,
  store,
  table,
  maxMessages,
  cacheTtlMs,
} = {}) {
  const resolvedStrategy = strategy || config?.memory?.strategy || 'in-memory';
  const resolvedAdapter =
    adapter || createMemoryAdapter({ strategy: resolvedStrategy, registry, client, repository, store, table });
  return createMemoryService({ adapter: resolvedAdapter, config, maxMessages, cacheTtlMs });
}
