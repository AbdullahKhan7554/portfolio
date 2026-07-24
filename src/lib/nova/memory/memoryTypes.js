/**
 * Nova Memory — domain types + result factories. Pure data; no I/O, no AI, no
 * knowledge of providers. A conversation is a container of messages.
 */

/** Message authorship (generic; memory never interprets these). */
export const MESSAGE_ROLE = Object.freeze({
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
});

function createId(prefix = 'conv') {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`;
}

/**
 * @typedef {Object} MemoryMessage
 * @property {string} role
 * @property {string} content
 * @property {number} timestamp   epoch ms
 */

/** Factory for a well-formed message. */
export function createMessage({ role, content, timestamp } = {}) {
  return {
    role,
    content: String(content ?? ''),
    timestamp: timestamp ?? Date.now(),
  };
}

/**
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {string|null} companyId
 * @property {MemoryMessage[]} messages
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/** Factory for a conversation. */
export function createConversation({ id, companyId, messages, createdAt, updatedAt } = {}) {
  const now = Date.now();
  return {
    id: id ?? createId('conv'),
    companyId: companyId ?? null,
    messages: Array.isArray(messages) ? messages : [],
    createdAt: createdAt ?? now,
    updatedAt: updatedAt ?? now,
  };
}

/** Normalized memory result — success. */
export function memoryOk(data, metadata = {}) {
  return { ok: true, data, error: null, metadata };
}

/** Normalized memory result — failure. */
export function memoryFail(error, metadata = {}) {
  const message = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
  return { ok: false, data: null, error: message, metadata };
}
