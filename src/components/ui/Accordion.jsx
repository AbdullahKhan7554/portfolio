'use client';

import { useState, useId } from 'react';
import { motion } from 'framer-motion';
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
            {/* Always mounted, so every answer is in the server HTML (crawlable),
                not only the open one. Closed panels collapse to height 0 /
                opacity 0 — the same values and transition the old
                mount/unmount animation used — and are aria-hidden so screen
                readers still only hear the open answer. `initial={false}` renders
                the resting state on first paint with no animation, as before. */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              initial={false}
              animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <p className="measure border-l-2 border-accent pb-6 pl-4 text-body text-muted">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
