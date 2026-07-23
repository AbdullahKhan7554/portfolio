/**
 * Nova — ConversationManager. Owns the lifecycle of a single conversation:
 * appending well-formed messages, tracking status, and (optionally) persisting
 * through an injected MemoryStore. It orchestrates domain objects only — no AI
 * calls, no provider knowledge, no qualification logic.
 */
import {
  createConversation,
  CONVERSATION_STATUS,
} from '../types/conversation';
import { createMessage, MESSAGE_ROLE } from '../types/message';

export class ConversationManager {
  /**
   * @param {Object} [deps]
   * @param {import('../types/conversation').Conversation} [deps.conversation]
   * @param {import('./memoryManager').MemoryStore} [deps.memory]  injected store
   */
  constructor({ conversation, memory } = {}) {
    this.conversation = conversation ?? createConversation();
    this.memory = memory ?? null;
  }

  /** @param {Object} [deps] */
  static create(deps) {
    return new ConversationManager(deps);
  }

  get id() {
    return this.conversation.id;
  }

  get messages() {
    return this.conversation.messages;
  }

  get status() {
    return this.conversation.status;
  }

  /** Append a user message. @returns {import('../types/message').NovaMessage} */
  addUserMessage(content, metadata) {
    return this._append(MESSAGE_ROLE.USER, content, metadata);
  }

  /** Append an assistant message (used once generation is wired). */
  addAssistantMessage(content, metadata) {
    return this._append(MESSAGE_ROLE.ASSISTANT, content, metadata);
  }

  /** Append a system message. */
  addSystemMessage(content, metadata) {
    return this._append(MESSAGE_ROLE.SYSTEM, content, metadata);
  }

  /** @param {'active'|'idle'|'closed'} status */
  setStatus(status) {
    if (!Object.values(CONVERSATION_STATUS).includes(status)) {
      throw new TypeError(`Invalid conversation status "${status}".`);
    }
    this.conversation.status = status;
    return this._touch();
  }

  /** Full snapshot (deep enough to be safe to serialize). */
  snapshot() {
    return {
      ...this.conversation,
      messages: [...this.conversation.messages],
      metadata: { ...this.conversation.metadata },
    };
  }

  /** @private */
  _append(role, content, metadata) {
    const message = createMessage({ role, content, metadata });
    this.conversation.messages.push(message);
    this._touch();
    return message;
  }

  /** @private Persists (fire-and-forget) if a store was injected. */
  _touch() {
    this.conversation.metadata.updatedAt = Date.now();
    this.memory?.save?.(this.conversation);
    return this.conversation;
  }
}
