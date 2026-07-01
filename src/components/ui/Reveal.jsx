'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeRise, viewportOnce, staggerContainer } from '@/lib/motion';

/**
 * Safety net so content can never get stuck invisible. The reveal starts
 * `hidden` (opacity 0) and relies on `whileInView` firing. If the in-view
 * trigger never fires — a flaky IntersectionObserver, a hydration race, or an
 * element already on screen at mount — this forces the element visible instead
 * of leaving it at opacity 0. Reduced-motion users are shown immediately;
 * genuinely below-the-fold content keeps its normal scroll reveal.
 */
function useRevealFallback(ref) {
  const reduce = useReducedMotion();
  const [forced, setForced] = useState(false);
  useEffect(() => {
    if (reduce) {
      setForced(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    const t = setTimeout(() => setForced(true), 1000);
    return () => clearTimeout(t);
  }, [ref, reduce]);
  return forced;
}

/**
 * Scroll-reveal wrapper. Motion only enhances — content always ends up visible.
 * Use `delay` for sequencing or wrap children in <RevealGroup> + <RevealItem>
 * for staggered lists.
 */
export function Reveal({ children, as = 'div', delay = 0, className, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  const ref = useRef(null);
  const forced = useRevealFallback(ref);
  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={fadeRise}
      initial="hidden"
      animate={forced ? 'show' : undefined}
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({ children, as = 'div', stagger = 0.08, className, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  const ref = useRef(null);
  const forced = useRevealFallback(ref);
  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      animate={forced ? 'show' : undefined}
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, as = 'div', className, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={fadeRise} {...rest}>
      {children}
    </MotionTag>
  );
}
