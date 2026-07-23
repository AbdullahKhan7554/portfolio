/**
 * Nova — analytics event constants (widget-owned namespace).
 *
 * These are Nova's OWN event names, kept independent so the widget stays
 * portable across host apps. Values are snake_case to match common analytics
 * sinks (and the host's existing `whatsapp_click`), so a thin adapter can map
 * `NovaEvent.*` onto the host tracker 1:1 without redefining anything here.
 *
 * Emission is wired in a later milestone; this file only declares the vocabulary.
 */
export const NovaEvent = Object.freeze({
  CHAT_OPENED: 'chat_opened',
  CHAT_CLOSED: 'chat_closed',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  QUICK_REPLY_CLICKED: 'quick_reply_clicked',
  LEAD_STARTED: 'lead_started',
  LEAD_UPDATED: 'lead_updated',
  LEAD_COMPLETED: 'lead_completed',
  BOOK_CALL: 'book_call',
  WHATSAPP_CLICK: 'whatsapp_click',
  PROVIDER_ERROR: 'provider_error',
});

/** @typedef {(typeof NovaEvent)[keyof typeof NovaEvent]} NovaEventName */
