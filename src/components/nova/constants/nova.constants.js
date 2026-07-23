/**
 * Nova — shared constants. Stable identifiers & enums used across the widget.
 * No logic, no state — just values.
 */

/** Message authorship. */
export const MESSAGE_ROLE = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

/** DOM ids used for ARIA wiring (aria-controls / dialog / live region). */
export const NOVA_IDS = {
  launcher: 'nova-launcher',
  window: 'nova-window',
  log: 'nova-log',
  input: 'nova-input',
};

/** Breakpoint at/below which the window renders as a full-screen sheet. */
export const MOBILE_QUERY = '(max-width: 767px)';
