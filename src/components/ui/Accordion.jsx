'use client';

import { useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Accessible accordion (TRD §8.6). Uses <button aria-expanded> + region,
 * animates measured height (not max-height hacks). One item open by default.
 */
export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 py-5 text-left',
                  'font-display text-h4 text-text transition-colors duration-fast hover:text-text-strong',
                )}
              >
                <span>{item.question}</span>
                <Plus
                  className={cn(
                    'h-5 w-5 shrink-0 text-accent transition-transform duration-base ease-out-quad',
                    isOpen && 'rotate-45',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="measure border-l-2 border-accent pb-6 pl-4 text-body text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
