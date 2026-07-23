'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useNova } from '../context/NovaContext';
import { NovaAvatar } from './NovaAvatar';

/**
 * Three-dot "assistant is typing" indicator. Gentle, slow bounce; frozen to
 * static dots under reduced motion. Announced once to screen readers.
 */
export function TypingIndicator() {
  const { config } = useNova();
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-2"
    >
      <NovaAvatar config={config} size={28} className="mt-auto" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[var(--nova-assistant-bubble)] px-3.5 py-3">
        <span className="sr-only">{config.assistantName} is typing…</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--nova-text-muted)]"
            animate={reduce ? undefined : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={
              reduce
                ? undefined
                : { duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
