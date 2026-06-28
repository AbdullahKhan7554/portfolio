'use client';

import { motion } from 'framer-motion';
import { fadeRise, viewportOnce, staggerContainer } from '@/lib/motion';

/**
 * Scroll-reveal wrapper. Content is visible by default if JS/motion is off
 * (motion only enhances). Use `delay` for sequencing or wrap children in
 * <RevealGroup> + <RevealItem> for staggered lists.
 */
export function Reveal({ children, as = 'div', delay = 0, className, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={fadeRise}
      initial="hidden"
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
  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
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
