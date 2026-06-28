/**
 * Shared Framer Motion variants. All motion is transform/opacity only (GPU
 * friendly) and gated by `prefers-reduced-motion` at the token level + via
 * the `viewport={{ once: true }}` reveal pattern. Content is visible by
 * default; these only enhance.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
export const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94];

/** Fade + short rise — the workhorse scroll reveal. */
export const fadeRise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

/** Simple fade. */
export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_QUAD } },
};

/** Stagger container — children reveal in sequence. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Line/word mask reveal — for kinetic headlines (clip lives in CSS). */
export const maskRise = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/**
 * Default viewport config for `whileInView`. `amount: 'some'` fires as soon as
 * any part of the element enters — so tall containers (e.g. cards that stack
 * into a single column on mobile) reliably reveal instead of staying hidden
 * when a fixed fraction never fits the viewport. `margin` triggers slightly
 * before the element fully reaches the fold.
 */
export const viewportOnce = { once: true, amount: 'some', margin: '0px 0px -10% 0px' };
