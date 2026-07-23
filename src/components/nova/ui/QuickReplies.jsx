'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useNova } from '../context/NovaContext';
import { MESSAGE_ROLE } from '../constants/nova.constants';
import { makeChipsContainer, chipVariants } from '../animations/nova.animations';

/**
 * Suggested-prompt chips from config. Shown until the visitor sends their
 * first message, then hidden to keep the conversation clean.
 */
export function QuickReplies() {
  const { config, messages, sendMessage } = useNova();
  const reduce = useReducedMotion();

  const replies = config.quickReplies || [];
  const hasUserSpoken = messages.some((m) => m.role === MESSAGE_ROLE.USER);
  if (hasUserSpoken || replies.length === 0) return null;

  return (
    <motion.div
      role="group"
      aria-label="Suggested questions"
      variants={makeChipsContainer(reduce)}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2 px-3 pb-3"
    >
      {replies.map((reply) => (
        <motion.button
          key={reply}
          type="button"
          variants={chipVariants}
          onClick={() => sendMessage(reply)}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="rounded-full border border-[var(--nova-border)] bg-[var(--nova-surface)] px-3 py-1.5 text-[0.8rem] text-[var(--nova-text)] transition-colors hover:border-[var(--nova-accent)] hover:text-[var(--nova-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)]"
        >
          {reply}
        </motion.button>
      ))}
    </motion.div>
  );
}
