'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Scroll parallax (GPU translate only). As the element passes through the
 * viewport, the inner node drifts vertically by ±`distance`px, creating layered
 * depth against the rest of the page. Driven by the page scroll position (which
 * Lenis smooths), so it inherits the buttery feel for free.
 *
 * The outer node is measured but never transformed (so we never measure our own
 * offset → no feedback/jitter); only the inner node moves. No-op under
 * prefers-reduced-motion.
 */
export function Parallax({
  children,
  className,
  innerClassName,
  distance = 50,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    // `relative` is required, not cosmetic: useScroll measures against this
    // node, and Framer warns (and computes the offset wrongly) when the target
    // is position:static. Section wraps every title in a Parallax, so a static
    // container produced that warning on essentially every page.
    <div ref={ref} className={cn('relative', className)} {...rest}>
      <motion.div
        className={innerClassName}
        style={{ y: reduced ? 0 : y, willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
