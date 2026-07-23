'use client';

import { X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNova } from '../context/NovaContext';
import { NovaAvatar } from './NovaAvatar';

/**
 * Chat window header: assistant identity, online status, and close control.
 */
export function ChatHeader() {
  const { config, close } = useNova();
  const reduce = useReducedMotion();

  return (
    <header className="flex items-center gap-3 border-b border-[var(--nova-border)] bg-[var(--nova-surface)] px-4 py-3">
      <div className="relative">
        <NovaAvatar config={config} size={40} />
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--nova-surface)] bg-[var(--nova-accent)]"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.95rem] font-semibold text-[var(--nova-text)]">
          {config.assistantName}
        </p>
        <p className="truncate text-[0.75rem] text-[var(--nova-text-muted)]">
          {config.tagline || config.brandName}
        </p>
      </div>

      <motion.button
        type="button"
        onClick={close}
        aria-label="Close chat"
        whileTap={reduce ? undefined : { scale: 0.9 }}
        className="grid h-9 w-9 place-items-center rounded-full text-[var(--nova-text-muted)] transition-colors hover:bg-[var(--nova-surface-raised)] hover:text-[var(--nova-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)]"
      >
        <X className="h-5 w-5" />
      </motion.button>
    </header>
  );
}
