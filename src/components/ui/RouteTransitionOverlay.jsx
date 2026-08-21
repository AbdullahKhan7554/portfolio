'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { IntroVisual } from '@/components/intro/IntroVisual';

/**
 * The visual half of the route transition. State lives in TransitionProvider;
 * this component only renders it.
 *
 * BRAND, NOT A SPINNER. The artwork is <IntroVisual variant="route" /> — the
 * SAME obsidian slab, logo lockup and metallic sweep the entry intro plays, on
 * a timeline compressed to fit the 500ms floor, over the amber hairline that
 * keeps moving when a route fetch outlasts it.
 *
 * THE IMAGE IS NOW SAFE. This used to be a type-only monogram, on the reasoning
 * that a mark fetched at the exact moment the browser is pulling a new route's
 * payload would sometimes show a blank box. That no longer applies: the root
 * layout preloads /logo.png with `as="image" fetchPriority="high"` in <head>, so
 * it is decoded long before any navigation can be clicked — including from a
 * cold entry on a non-homepage route, where the entry intro never runs.
 *
 * `aria-hidden` is deliberate: this is decoration. The announcement is handled
 * by the polite live region in TransitionProvider, so a screen reader hears
 * "Loading page…" once rather than having a decorative slab described to it.
 *
 * LAYOUT SHIFT: none possible. `fixed inset-0` takes it out of flow entirely and
 * nothing here touches document overflow — see the note on Lenis in
 * TransitionProvider for why the scrollbar is deliberately left alone.
 */
export function RouteTransitionOverlay({ active }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-transition"
          aria-hidden="true"
          // z-transition (550) sits above the mobile drawer and Nova (both
          // z-modal, 500) so a drawer mid-exit-animation cannot paint over the
          // overlay, and below z-toast (600) so the skip link still wins.
          className="fixed inset-0 z-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Reduced motion gets a hard cut rather than a crossfade. The global
          // reduced-motion override in tokens.css only zeroes CSS durations —
          // Framer animates in JS and never sees it — so this has to be
          // explicit rather than inherited.
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT_EXPO }}
        >
          <IntroVisual variant="route" reduced={reduced} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
