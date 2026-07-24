/**
 * Nova Data — public API (Milestone 7, framework only).
 *
 * A provider-agnostic, READ-ONLY repository/data layer. Repositories depend on
 * an injected adapter (the SupabaseAdapter is one implementation), so the data
 * source is swappable. NO business logic, NO inserts/updates/deletes, and this
 * layer is NOT wired into the runtime — it is the foundation only.
 *
 * @example  Build the layer with an injected Supabase client (not wired here):
 *   import { createSupabaseAdapter, buildRepositoryRegistry } from '@/lib/nova/data';
 *   const adapter = createSupabaseAdapter({ client: supabase });   // supabase-js client
 *   const repos = buildRepositoryRegistry({ adapter });
 *   const { ok, data } = await repos.require('company').findById('avenix');
 */

// Types + result factories
export { REPOSITORY, DEFAULT_TABLES, repoSuccess, repoFailure } from './repositoryTypes';

// Errors + normalization
export {
  RepositoryError,
  ConnectionError,
  QueryError,
  NotFoundError,
  normalizeError,
} from './repositoryErrors';

// Adapter (Supabase)
export { SupabaseAdapter, createSupabaseAdapter } from './supabaseAdapter';

// Repository pattern
export { BaseRepository } from './baseRepository';
export {
  CompanyRepository,
  ProductRepository,
  FAQRepository,
  KnowledgeRepository,
  LeadRepository,
  ConversationRepository,
  REPOSITORY_CLASSES,
} from './repositories';

// Registry + factory
export { RepositoryRegistry, createRepositoryRegistry } from './repositoryRegistry';
export { createRepository, buildRepositoryRegistry } from './repositoryFactory';
