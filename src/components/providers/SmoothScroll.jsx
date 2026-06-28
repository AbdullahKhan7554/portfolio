'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Global Lenis smooth scroll. Disabled under reduced-motion and on
 * touch / small screens (native momentum is better there) per TRD §12.
 */
export function SmoothScroll({ children }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.innerWidth < 1024;
    if (prefersReduced || isTouch || isSmall) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
