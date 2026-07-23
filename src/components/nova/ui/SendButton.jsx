'use client';

import { ArrowUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Submit control for the composer. Disabled (and dimmed) until there is text.
 */
export function SendButton({ disabled }) {
  const reduce = useReducedMotion();

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
