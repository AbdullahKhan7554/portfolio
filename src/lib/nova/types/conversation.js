/**
 * Nova — Conversation domain model. A container of messages plus metadata.
 * Pure data + a factory; behavior lives in ConversationManager.
 */
import { createId } from '../utils/ids';

export const CONVERSATION_STATUS = Object.freeze({
  ACTIVE: 'active',
  IDLE: 'idle',
  CLOSED: 'closed',
});

/**
 * @typedef {Object} ConversationMetadata
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {string|null} locale
 * @property {string} source        e.g. 'web'.
 * @property {string|null} leadId    Linked lead, once one exists.
 *
 * @typedef {Object} Conversation
 * @property {string} id
 * @property {'active'|'idle'|'closed'} status
 * @property {import('./message').NovaMessage[]} messages
 * @property {ConversationMetadata} metadata
 */

/**
 * Factory for a fresh conversation.
 * @param {{ id?:string, status?:string, messages?:Array, metadata?:object }} [input]
 * @returns {Conversation}
 */
export function createConversation({ id, status, messages, metadata } = {}) {
  const now = Date.now();
  return {
    id: id ?? createId('conv'),
    status: status ?? CONVERSATION_STATUS.ACTIVE,
    messages: messages ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      locale: null,
      source: 'web',
      leadId: null,
      ...(metadata || {}),
    },
  };
}
