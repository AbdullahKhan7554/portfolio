/**
 * Nova — message formatter. Pure translation between the internal NovaMessage
 * shape and the normalized, provider-agnostic ProviderMessage shape (and a
 * plain-text transcript). Vendor-specific mapping stays inside each adapter.
 */
import { MESSAGE_ROLE } from '../types/message';

/**
 * Reduce internal messages to `{ role, content }` for a provider.
 * @param {import('../types/message').NovaMessage[]} messages
 * @param {{ includeSystem?: boolean }} [options]
 * @returns {import('../providers/baseProvider').ProviderMessage[]}
 */
export function toProviderMessages(messages = [], { includeSystem = false } = {}) {
  return messages
    .filter((m) => includeSystem || m.role !== MESSAGE_ROLE.SYSTEM)
    .map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Render messages as a readable transcript (logging / debugging / fallback).
 * @param {import('../types/message').NovaMessage[]} messages
 * @returns {string}
 */
export function toTranscript(messages = []) {
  return messages.map((m) => `${m.role}: ${m.content}`).join('\n');
}
