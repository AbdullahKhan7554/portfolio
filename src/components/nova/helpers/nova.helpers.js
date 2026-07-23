/**
 * Nova — pure helper functions. No React, no side effects on import.
 */

let counter = 0;

/** Collision-resistant client-side id for messages. */
export function createId() {
  counter += 1;
  return `nova_${Date.now().toString(36)}_${counter}`;
}

/** Locale-aware short time, e.g. "14:32". Safe on bad input. */
export function formatTime(value) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

/**
 * Map a theme palette to the `--nova-*` CSS custom properties consumed by the
 * widget's Tailwind arbitrary-value classes (e.g. `bg-[var(--nova-surface)]`).
 * Returns a style object ready to spread onto an element.
 */
export function toCssVars(palette = {}) {
  return {
    '--nova-bg': palette.bg,
    '--nova-surface': palette.surface,
    '--nova-surface-raised': palette.surfaceRaised,
    '--nova-text': palette.text,
    '--nova-text-muted': palette.textMuted,
    '--nova-border': palette.border,
    '--nova-accent': palette.accent,
    '--nova-accent-text': palette.accentText,
    '--nova-user-bubble': palette.userBubble,
    '--nova-user-text': palette.userText,
    '--nova-assistant-bubble': palette.assistantBubble,
    '--nova-assistant-text': palette.assistantText,
  };
}
