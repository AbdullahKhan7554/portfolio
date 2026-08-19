'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** --ease-out-quad, as a Framer-consumable array. */
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94];

/**
 * Vertical progress indicator — a single changing numeral rather than a stacked
 * list with one item highlighted. The active number leaves upward as the next
 * rises in, so it reads as a counter ticking over rather than a list scrolling.
 *
 * The "/ NN" total is deliberate: with only one numeral visible there is no
 * longer a visible list to infer length from, so without it the reader knows
 * where they are but not how much is left. The rail alone conveys that too
 * coarsely at a glance.
 *
 * The rail fill is a motion value (`scaleY`), so it tracks scroll on the
 * compositor without re-rendering React. Only the numeral depends on
 * `activeIndex`, which the parent changes once per chapter.
 *
 * Stays `aria-hidden`: every chapter's number and label are already rendered as
 * real text by ScrollStoryItem (and in SSR), so this duplicates existing content
 * rather than carrying any of its own.
 */
export function ProgressIndicator({ count, activeIndex, progress, className }) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.3; // --dur-base

  return (
    <div
      aria-hidden="true"
      className={cn('flex select-none items-stretch gap-5', className)}
    >
      {/* Rail — spans the component's full height. */}
      <div className="relative w-px flex-none bg-[var(--border)]/25">
        <motion.span
          className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
          style={reduced ? { scaleY: 1 } : { scaleY: progress }}
        />
      </div>

      {/* Counter, vertically centred against the rail. */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5 font-mono tracking-[0.06em]">
          {/* Fixed-size box: the two numerals overlap during the exchange, so
              nothing reflows as the digits swap. */}
          <span className="relative block h-[1.15em] w-[2ch] text-h4 text-accent">
            <AnimatePresence initial={false}>
              <motion.span
                key={activeIndex}
                className="absolute inset-0"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: '55%' }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: '0%' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: '-55%' }}
                transition={{ duration, ease: EASE_OUT_QUAD }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="text-caption text-[var(--text-faint)]">
            / {String(count).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
