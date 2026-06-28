'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Decorative floating geometry layer (aria-hidden, pointer-events-none). A few
 * abstract amber/obsidian shapes at very low opacity drift on scroll, each at a
 * different speed/direction — quiet depth that never competes with content.
 * GPU transforms only; frozen under reduced motion.
 *
 * Drop inside any `position: relative` section; it covers the section bounds.
 */
export function FloatingShapes({ className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Distinct speeds/directions per shape.
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-55, 55]);
  const y3 = useTransform(scrollYProgress, [0, 1], [95, -95]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-30, 80]);
  const rot = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const z = (v) => (reduced ? 0 : v);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {/* thin amber ring, upper-left */}
      <motion.span
        style={{ y: z(y1), opacity: 0.12, willChange: 'transform' }}
        className="absolute left-[5%] top-[14%] h-40 w-40 rounded-full border border-accent"
      />
      {/* soft amber orb, upper-right */}
      <motion.span
        style={{
          y: z(y2),
          opacity: 0.16,
          willChange: 'transform',
          background:
            'radial-gradient(circle at 50% 50%, hsl(35 72% 62% / 0.55), transparent 70%)',
        }}
        className="absolute right-[9%] top-[18%] h-28 w-28 rounded-full blur-md"
      />
      {/* rotated rounded square outline, lower-right */}
      <motion.span
        style={{ y: z(y3), rotate: z(rot), opacity: 0.5, willChange: 'transform' }}
        className="absolute right-[15%] bottom-[12%] h-28 w-28 rounded-2xl border border-border-strong"
      />
      {/* small amber ring, lower-left */}
      <motion.span
        style={{ y: z(y4), opacity: 0.1, willChange: 'transform' }}
        className="absolute left-[16%] bottom-[8%] h-16 w-16 rounded-full border border-accent"
      />
    </div>
  );
}
