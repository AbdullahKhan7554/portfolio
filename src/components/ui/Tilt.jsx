'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Pointer-driven 3D tilt wrapper (GPU transforms only). Rotates toward the
 * cursor with spring physics and a subtle lift, then eases back on leave.
 * No-ops under reduced-motion and on coarse (touch) pointers — content stays
 * perfectly usable; the tilt is pure enhancement.
 */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.02,
  spring = { stiffness: 150, damping: 16, mass: 0.4 },
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const rx = useSpring(useMotionValue(0), spring);
  const ry = useSpring(useMotionValue(0), spring);
  const sc = useSpring(useMotionValue(1), spring);

  function handleMove(e) {
    if (reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ry.set(px * max);
    rx.set(-py * max);
    sc.set(scale);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
    sc.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        scale: sc,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
