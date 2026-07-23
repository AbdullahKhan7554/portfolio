'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNova } from '../context/NovaContext';
import { NOVA_IDS } from '../constants/nova.constants';
import { NOVA_EASE } from '../animations/nova.animations';

/**
 * The persistent floating launcher. Toggles the chat window and crossfades its
 * icon (Sparkles ⇄ X). Fully keyboard-accessible with a visible focus ring.
 */
export function FloatingButton() {
  const { config, isOpen, toggle, vars } = useNova();
  const reduce = useReducedMotion();

  return (
    <motion.button
      id={NOVA_IDS.launcher}
      type="button"
      onClick={toggle}
      style={vars}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={NOVA_IDS.window}
      aria-label={
        isOpen ? 'Close chat' : config.launcher?.ariaLabel || `Chat with ${config.assistantName}`
      }
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5, ease: NOVA_EASE }}
      whileHover={reduce ? undefined : { scale: 1.05 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      className={cn(
        'fixed z-overlay grid h-14 w-14 place-items-center rounded-full',
        'bg-[var(--nova-accent)] text-[var(--nova-accent-text)] shadow-lg ring-1 ring-black/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nova-bg)]',
        config.launcher?.positionClassName ||
          'bottom-5 right-5 md:bottom-6 md:right-6',
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isOpen ? 'close' : 'open'}
          initial={reduce ? false : { opacity: 0, rotate: -40, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 40, scale: 0.6 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: NOVA_EASE }}
          className="grid place-items-center"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
