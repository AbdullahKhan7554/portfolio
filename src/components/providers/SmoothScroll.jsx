'use client';

import { useEffect } from 'react';

/**
 * Global Lenis smooth scroll. Disabled under reduced-motion and on
 * touch / small screens (native momentum is better there) per TRD §12.
 *
 * The wrapper stays server-rendered (children are unaffected). The Lenis library
 * is dynamically imported on the client ONLY when smooth scroll actually applies
 * (desktop, motion allowed), keeping it out of the initial JS payload.
 *
 * WHY THE INSTANCE IS PUBLISHED ON `window`.
 * TransitionProvider has to snap Lenis's scroll position to the top of a newly
 * arrived route while the transition slab still covers the viewport — Next
 * resets NATIVE scroll on navigation, but Lenis keeps its own animated position
 * and will scroll the user back down from that stale value on the next wheel
 * event. That provider sits OUTSIDE this one in the tree (deliberately, so the
 * fixed overlay is never a child of the scroll container), so it cannot receive
 * the instance through context or a ref without inverting that nesting.
 *
 * `window.__avxLenis` is the smallest handoff that respects the ordering. It is
 * intentionally allowed to be undefined: Lenis only runs on desktop pointers
 * with motion allowed, so on a phone, or under prefers-reduced-motion, there is
 * no instance and every reader must already handle its absence.
 */
export function SmoothScroll({ children }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.innerWidth < 1024;
    if (prefersReduced || isTouch || isSmall) return undefined;

    let lenis;
    let rafId;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      window.__avxLenis = lenis;

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      // Cleared on the way out so nothing can call scrollTo on a destroyed
      // instance — under StrictMode's double-invoked effects in dev, the first
      // cleanup runs while a second instance is being created.
      if (window.__avxLenis === lenis) window.__avxLenis = null;
    };
  }, []);

  return children;
}
