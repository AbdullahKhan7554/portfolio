/**
 * Nova Memory — memory service (façade). Composes adapter primitives into the
 * public Memory API, applies the max-history trim (aiConfig.memory.maxMessages),
 * and keeps a 60s TTL cache keyed by conversation id.
 *
 * Provider-agnostic: it never touches AI/providers. Every method returns a
 * NORMALIZED result and NEVER throws — the runtime can never be crashed by it.
 */
import { aiConfig } from '../config/aiConfig';
import { createConversation, createMessage, memoryOk, memoryFail } from './memoryTypes';
import { normalizeError } from './memoryErrors';

const DEFAULT_CACHE_TTL_MS = 60_000;

/**
 * @param {Object} deps
 * @param {import('./baseMemoryAdapter').BaseMemoryAdapter} deps.adapter  injected storage adapter (DI)
 * @param {number} [deps.maxMessages]   overrides aiConfig.memory.maxMessages (0 = unlimited)
 * @param {number} [deps.cacheTtlMs]
 * @param {Object} [deps.config]        aiConfig override
 */
export function createMemoryService({ adapter, maxMessages, cacheTtlMs = DEFAULT_CACHE_TTL_MS, config = aiConfig } = {}) {
  if (!adapter) throw new Error('createMemoryService requires an adapter (dependency injection).');

  const limit = maxMessages ?? config?.memory?.maxMessages ?? 0; // 0 = unlimited
  /** @type {Map<string, { value:object, expiresAt:number }>} */
  const cache = new Map();

  const cacheGet = (id) => {
    const hit = cache.get(id);
    return hit && Date.now() < hit.expiresAt ? hit.value : null;
  };
  const cacheSet = (id, value) => cache.set(id, { value, expiresAt: Date.now() + cacheTtlMs });

  /** Keep only the newest `limit` messages (remove oldest). No summarization. */
  const trim = (messages) =>
    limit > 0 && messages.length > limit ? messages.slice(messages.length - limit) : messages;

  async function loadConversation(conversationId) {
    try {
      const cached = cacheGet(conversationId);
      if (cached) return memoryOk(cached, { cached: true });
      const conversation = await adapter.load(conversationId);
      if (conversation) cacheSet(conversationId, conversation);
      return memoryOk(conversation ?? null, { cached: false });
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  async function appendMessage(conversationId, message, { companyId } = {}) {
    try {
      const existing = await adapter.load(conversationId);
      const conversation = existing || createConversation({ id: conversationId, companyId });
      conversation.messages = trim([...conversation.messages, createMessage(message)]);
      conversation.updatedAt = Date.now();
      const saved = (await adapter.save(conversation)) || conversation;
      cacheSet(conversationId, saved);
      return memoryOk(saved);
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  async function trimConversation(conversationId, { max } = {}) {
    try {
      const conversation = await adapter.load(conversationId);
      if (!conversation) return memoryOk(null);
      const cap = max ?? limit;
      conversation.messages =
        cap > 0 && conversation.messages.length > cap
          ? conversation.messages.slice(conversation.messages.length - cap)
          : conversation.messages;
      conversation.updatedAt = Date.now();
      const saved = (await adapter.save(conversation)) || conversation;
      cacheSet(conversationId, saved);
      return memoryOk(saved);
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  async function clearConversation(conversationId) {
    try {
      const conversation = await adapter.load(conversationId);
      if (!conversation) return memoryOk(null);
      conversation.messages = [];
      conversation.updatedAt = Date.now();
      const saved = (await adapter.save(conversation)) || conversation;
      cacheSet(conversationId, saved);
      return memoryOk(saved);
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  async function listConversations(companyId) {
    try {
      const conversations = await adapter.list(companyId);
      return memoryOk(conversations || []);
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  async function deleteConversation(conversationId) {
    try {
      const removed = await adapter.delete(conversationId);
      cache.delete(conversationId);
      return memoryOk(Boolean(removed));
    } catch (e) {
      return memoryFail(normalizeError(e));
    }
  }

  return {
    adapter,
    maxMessages: limit,
    loadConversation,
    appendMessage,
    trimConversation,
    clearConversation,
    listConversations,
    deleteConversation,
    clearCache: () => cache.clear(),
  };
}
