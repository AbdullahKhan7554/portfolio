'use client';

import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The ☰ ⇄ × toggle, shared by the floating pill and the open drawer.
 *
 * WHY ONE COMPONENT IN TWO PLACES
 * The drawer is z-modal (500) and the pill is z-header (200), so once the menu
 * opens the pill's trigger is buried underneath it — the morph animation on the
 * pill button is literally never seen. Rendering the SAME toggle inside the
 * drawer, at the same coordinates, is what makes the morph visible: the pill's
 * hamburger disappears behind the panel in the same frame the drawer's copy
 * fades in already rotating, so it reads as one continuous ☰ → ×.
 *
 * The coordinates are load-bearing, not incidental. The pill sits in a rail with
 * `px-4` (16px) and carries `px-5` (24px) of its own, so its trigger's right
 * edge is inset 40px; the rail's `top` and the pill's 64px height put the
 * trigger's centre at y=48. The drawer mirrors both numbers exactly (see
 * Header.jsx) rather than using `container-page`, whose 20px gutter would have
 * made the icon jump sideways by 20px as the menu opened.
 *
 * COLOUR is entirely token-driven — no `light`/`dark` prop. The drawer is a
 * `.theme-dark` subtree, so `bg-text-strong` and `border-border-strong` resolve
 * to their dark-block values automatically (§2). Focus comes from the global
 * `:focus-visible` outline in globals.css.
 *
 * 44x44 minimum touch target: `h-11 w-11`. Key 11 is NOT remapped in
 * tailwind.config.js, so it falls through to stock Tailwind's 2.75rem = 44px.
 * `h-10`/`h-12` would have resolved to --space-10/--space-12 (64px/96px).
 */
const LINES = [
  { closed: { rotate: 0, y: -5 }, opened: { rotate: 45, y: 0 } },
  { closed: { opacity: 1, scaleX: 1 }, opened: { opacity: 0, scaleX: 0.3 } },
  { closed: { rotate: 0, y: 5 }, opened: { rotate: -45, y: 0 } },
];

export const MenuToggle = forwardRef(function MenuToggle(
  { open, onClick, controls = 'mobile-menu', className },
  ref,
) {
  const reduced = useReducedMotion();

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn(
        'group relative grid h-11 w-11 place-items-center rounded-full border transition-colors duration-base',
        open ? 'border-accent' : 'border-border-strong hover:border-accent',
        className,
      )}
    >
      <span aria-hidden="true" className="relative block h-4 w-5">
        {LINES.map((line, i) => (
          <motion.span
            key={i}
            className={cn(
              'absolute left-0 block w-full rounded-full transition-colors duration-base',
              open ? 'bg-accent' : 'bg-text-strong group-hover:bg-accent',
            )}
            style={{
              height: '1.6px',
              top: 'calc(50% - 0.8px)',
              transformOrigin: 'center',
            }}
            initial={false}
            animate={open ? line.opened : line.closed}
            // 300ms — inside the 200–400ms brief, --ease-out-expo, no overshoot.
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT_EXPO }}
          />
        ))}
      </span>
    </button>
  );
});
