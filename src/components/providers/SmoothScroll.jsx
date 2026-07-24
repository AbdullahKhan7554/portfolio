'use client';

import { useEffect } from 'react';

/**
 * Global Lenis smooth scroll. Disabled under reduced-motion and on
 * touch / small screens (native momentum is better there) per TRD §12.
 *
 * The wrapper stays server-rendered (children are unaffected). The Lenis library
 * is dynamically imported on the client ONLY when smooth scroll actually applies
 * (desktop, motion allowed), keeping it out of the initial JS payload.
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
    };
  }, []);

  return children;
}
