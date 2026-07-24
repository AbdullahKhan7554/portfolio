/**
 * Nova Memory — public API (Milestone 9, standalone framework).
 *
 * Provider-agnostic conversation memory with pluggable storage (in-memory or
 * Supabase) selected by configuration and wired via dependency injection. No
 * AI, no embeddings, no vector search. NOT wired into the runtime.
 *
 * @example
 *   import { buildMemoryService } from '@/lib/nova/memory';
 *   // in-memory (default):
 *   const memory = buildMemoryService();
 *   await memory.appendMessage('conv_1', { role: 'user', content: 'hi' }, { companyId: 'avenix' });
 *   const { data } = await memory.loadConversation('conv_1');
 *
 *   // supabase (config.memory.strategy = 'supabase') — inject a client:
 *   const memory = buildMemoryService({ strategy: 'supabase', client: supabase });
 */

// Types + results
export {
  MESSAGE_ROLE,
  createMessage,
  createConversation,
  memoryOk,
  memoryFail,
} from './memoryTypes';

// Errors
export {
  MemoryError,
  MemoryConnectionError,
  MemoryNotFoundError,
  MemoryAdapterError,
  normalizeError,
} from './memoryErrors';

// Adapters
export { BaseMemoryAdapter } from './baseMemoryAdapter';
export { InMemoryAdapter } from './inMemoryAdapter';
export { SupabaseMemoryAdapter } from './supabaseMemoryAdapter';

// Registry / service / factory
export { MEMORY_STRATEGY, MemoryAdapterRegistry, createMemoryAdapterRegistry } from './memoryRegistry';
export { createMemoryService } from './memoryService';
export { createMemoryAdapter, buildMemoryService } from './memoryFactory';
