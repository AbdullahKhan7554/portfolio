/**
 * Nova — Framer Motion variants. Premium, slow, restrained motion
 * (Apple / Linear / Stripe feel): transform + opacity only, long expo easing.
 *
 * Factories take a `reduce` flag (from `useReducedMotion`) and collapse to a
 * near-instant opacity change when the user prefers reduced motion — Framer
 * runs in JS, so it is not covered by the global CSS reduced-motion override.
 */

export const NOVA_EASE = [0.16, 1, 0.3, 1];

/** The chat window: gentle rise + subtle scale from the corner. */
export const makeWindowVariants = (reduce) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduce ? 0.001 : 0.5, ease: NOVA_EASE },
  },
  exit: reduce
    ? { opacity: 0, transition: { duration: 0.001 } }
    : { opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.3, ease: NOVA_EASE } },
});

/** A single message bubble easing into place. */
export const makeBubbleVariants = (reduce) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.001 : 0.4, ease: NOVA_EASE },
  },
});

/** Quick-reply chips: soft staggered entrance. */
export const makeChipsContainer = (reduce) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduce ? 0 : 0.06,
      delayChildren: reduce ? 0 : 0.08,
    },
  },
});

export const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: NOVA_EASE } },
};
