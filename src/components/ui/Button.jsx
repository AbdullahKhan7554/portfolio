'use client';

import { forwardRef, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

const MotionLink = motion.create(Link);

const VARIANTS = {
  primary:
    'bg-accent text-accent-on hover:bg-accent-hover hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:bg-accent-pressed',
  secondary:
    'border border-border-strong text-text hover:border-accent hover:text-text-strong hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
  ghost: 'text-text-muted hover:text-accent',
};

const SIZES = {
  sm: 'h-9 px-4 text-label',
  md: 'h-11 px-6 text-body',
  lg: 'h-[52px] px-8 text-body',
};

/**
 * Single source of truth for CTAs. Supports internal/external links, the
 * magnetic cursor-follow interaction (desktop only), and analytics events.
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    href,
    magnetic = false,
    analyticsEvent,
    analyticsParams,
    className,
    onClick,
    type = 'button',
    ...rest
  },
  ref,
) {
  const localRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const canMagnetize =
    magnetic &&
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 768px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleMove(e) {
    if (!canMagnetize) return;
    const el = localRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-12, Math.min(12, mx * 0.35)));
    y.set(Math.max(-12, Math.min(12, my * 0.35)));
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }
  function handleClick(e) {
    if (analyticsEvent) trackEvent(analyticsEvent, analyticsParams);
    onClick?.(e);
  }

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-pill font-sans font-medium',
    'transition-all duration-base ease-out-quad will-change-transform',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const motionProps = {
    ref: (node) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    style: { x: sx, y: sy },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: classes,
    onClick: handleClick,
    whileTap: { scale: 0.96 },
  };

  // Premium content: a metallic sheen that sweeps across on hover (skipped on
  // ghost buttons, which have no surface), with the label lifted above it.
  const inner = (
    <>
      {variant !== 'ghost' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-pill"
        >
          <span className="absolute left-0 top-0 h-full w-1/3 -translate-x-[160%] -skew-x-[20deg] bg-white/25 blur-md transition-transform duration-[750ms] ease-out group-hover:translate-x-[420%]" />
        </span>
      )}
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    const isHttp = /^https?:\/\//.test(href);
    const isProtocol = /^(mailto:|tel:)/.test(href);
    // http(s) opens in a new tab; mailto:/tel: are plain anchors (no new tab).
    if (isHttp || isProtocol) {
      return (
        <motion.a
          href={href}
          target={isHttp ? '_blank' : undefined}
          rel={isHttp ? 'noopener noreferrer' : undefined}
          {...motionProps}
          {...rest}
        >
          {inner}
        </motion.a>
      );
    }
    return (
      <MotionLink href={href} {...motionProps} {...rest}>
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button type={type} {...motionProps} {...rest}>
      {inner}
    </motion.button>
  );
});
