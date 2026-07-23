/**
 * Nova — Message domain model. The atomic unit of a conversation.
 * Provider-agnostic; adapters translate this into vendor payloads.
 */
import { createId } from '../utils/ids';

/** Who authored a message. `system` is instructions, never shown in the UI. */
export const MESSAGE_ROLE = Object.freeze({
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
});

/**
 * @typedef {Object} NovaMessage
 * @property {string} id
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 * @property {number} at            Epoch ms.
 * @property {Object} metadata      Free-form (e.g. tokens, toolCallId, error).
 */

/**
 * Factory for a well-formed message. Guards the role so malformed messages
 * cannot enter a conversation.
 * @param {{ role:string, content:string, id?:string, at?:number, metadata?:object }} input
 * @returns {NovaMessage}
 */
export function createMessage({ role, content, id, at, metadata } = {}) {
  if (!Object.values(MESSAGE_ROLE).includes(role)) {
    throw new TypeError(`createMessage: invalid role "${role}".`);
  }
  return {
    id: id ?? createId('msg'),
    role,
    content: String(content ?? ''),
    at: at ?? Date.now(),
    metadata: metadata ?? {},
  };
}
