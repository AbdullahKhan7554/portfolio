/**
 * Nova Data — factory. Wires a shared adapter into repository instances (DI)
 * and builds a registry of all repositories. Keeps construction separate from
 * the registry and the adapter (SOLID).
 */
import { createRepositoryRegistry } from './repositoryRegistry';
import { REPOSITORY_CLASSES } from './repositories';
import { createSupabaseAdapter } from './supabaseAdapter';

/**
 * Instantiate a repository with an injected adapter.
 * @param {new (deps:{adapter:object, table?:string})=>import('./baseRepository').BaseRepository} RepoClass
 * @param {{ adapter:object, table?:string }} deps
 */
export function createRepository(RepoClass, { adapter, table } = {}) {
  return new RepoClass({ adapter, table });
}

/**
 * Build a registry containing all repositories, all sharing one adapter (DI).
 * @param {Object} options
 * @param {object} options.adapter                 injected data adapter (required)
 * @param {Record<string, Function>} [options.classes]  name → RepoClass
 * @param {Record<string, string>} [options.tables]     per-repository table overrides
 * @returns {import('./repositoryRegistry').RepositoryRegistry}
 */
export function buildRepositoryRegistry({ adapter, classes = REPOSITORY_CLASSES, tables = {} } = {}) {
  if (!adapter) throw new Error('buildRepositoryRegistry requires an adapter (dependency injection).');
  const registry = createRepositoryRegistry();
  for (const [name, RepoClass] of Object.entries(classes)) {
    registry.register(createRepository(RepoClass, { adapter, table: tables[name] }));
  }
  return registry;
}

export { createSupabaseAdapter };
