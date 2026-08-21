'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { siteConfig } from '@/config/site';

/**
 * The visual half of the route transition. State lives in TransitionProvider;
 * this component only renders it.
 *
 * BRAND, NOT A SPINNER. An obsidian slab (`theme-dark bg-bg` — the same
 * intentional-contrast-block pattern the hero, /contact and the footer use)
 * carrying the monogram in the amber text wipe, over a hairline with an amber
 * segment sweeping across it. No new colour, no new radius, no raw hex.
 *
 * NO IMAGE ON PURPOSE. `<Logo />` would be the more literal brand mark, but it
 * renders `/logo3-trimmed.png`, and the one moment this overlay exists is the
 * moment the browser is already fetching a new route's payload. A mark that has
 * to win a race against that is a mark that sometimes shows a blank box, so the
 * motif is type + tokens and costs zero requests.
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
          className="theme-dark fixed inset-0 z-transition grid place-items-center bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Reduced motion gets a hard cut rather than a crossfade. The global
          // reduced-motion override in tokens.css only zeroes CSS durations —
          // Framer animates in JS and never sees it — so this has to be
          // explicit rather than inherited.
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT_EXPO }}
        >
          <div className="flex flex-col items-center gap-5">
            <span className="text-amber-wipe font-display text-h2 font-black leading-none tracking-[0.18em]">
              {siteConfig.brand.monogram}
            </span>

            <span className="relative block h-px w-20 overflow-hidden bg-border">
              {reduced ? (
                <span className="absolute inset-y-0 left-0 w-1/3 bg-accent" />
              ) : (
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/3 bg-accent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '300%' }}
                  transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
                />
              )}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
