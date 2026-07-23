'use client';

import { ArrowUp, Square } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Composer action button. Submits a message, or — while a response is streaming
 * — becomes a Stop control that cancels it. Disabled (dimmed) when idle with no
 * text.
 */
export function SendButton({ disabled, streaming, onStop }) {
  const reduce = useReducedMotion();

  if (streaming) {
    return (
      <motion.button
        type="button"
        onClick={onStop}
        aria-label="Stop response"
        whileTap={reduce ? undefined : { scale: 0.92 }}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--nova-surface-raised)] text-[var(--nova-text)] ring-1 ring-[var(--nova-border)] transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)]"
      >
        <Square className="h-3.5 w-3.5" fill="currentColor" />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      aria-label="Send message"
      whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--nova-accent)] text-[var(--nova-accent-text)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--nova-bg)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
    </motion.button>
  );
}
