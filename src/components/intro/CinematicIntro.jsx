'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Avenix Studio — cinematic brand intro.
 *
 * A once-per-session, ~3.2s luxury reveal of the Avenix monogram lockup, in the
 * spirit of Apple / Linear / Stripe openers: soft scale + blur-in, a single thin
 * metallic light sweep, a gentle settle, then a cross-dissolve into the homepage.
 *
 * Coordination is deliberately render-cheap:
 *   • A blocking <head> script adds `intro-active` to <html> BEFORE first paint
 *     (see app/layout.js), which PAUSES the homepage's CSS entrance animations
 *     (.hero-in / .hero-line / .intro-reveal) so nothing flashes underneath.
 *   • This component owns only the overlay's own state — the page never
 *     re-renders. When the sweep finishes it removes `intro-active`, and the
 *     homepage's paused animations resume and stagger in beneath the fade.
 *
 * Plays on every homepage load/refresh. Skips entirely (and unpauses
 * immediately) for reduced-motion or non-home routes — so the site is always
 * reachable. It does not replay on in-app soft navigation (the layout, and thus
 * this component, is not remounted), only on full page loads.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_SWEEP = [0.4, 0, 0.2, 1];

/** ms timeline marker: when the logo settles and we begin the dissolve-out. */
const REVEAL_AT = 2600;

export function CinematicIntro() {
  const [mounted, setMounted] = useState(false); // overlay in the tree
  const [phase, setPhase] = useState('in'); // 'in' → 'out'
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const root = document.documentElement;

    let play = false;
    try {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      play = window.location.pathname === '/' && !reduce;
    } catch {
      play = false;
    }

    if (!play) {
      // Make sure the homepage is never left paused/hidden.
      root.classList.remove('intro-active');
      return;
    }

    setMounted(true);

    const toOut = setTimeout(() => {
      // Reveal the homepage beneath the fade — its entrance animations resume.
      root.classList.remove('intro-active');
      setPhase('out');
    }, REVEAL_AT);

    return () => clearTimeout(toOut);
  }, []);

  function handleOverlayAnimationComplete() {
    if (phase !== 'out') return;
    setMounted(false);
  }

  if (!mounted) return null;

  const out = phase === 'out';

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#0B0B0B', zIndex: 9999 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      onAnimationComplete={handleOverlayAnimationComplete}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        // Feather the logo's black field into the #0B0B0B canvas (no hard square).
        style={{
          boxShadow: '0 0 120px 60px #0B0B0B',
          willChange: 'transform, opacity, filter',
        }}
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
        animate={{
          opacity: 1,
          scale: out ? 0.9 : 1,
          filter: 'blur(0px)',
        }}
        transition={{
          opacity: { duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO },
          filter: { duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO },
          scale: out
            ? { duration: 0.7, ease: EASE_OUT_EXPO }
            : { duration: 1.0, delay: 0.3, ease: EASE_OUT_EXPO },
        }}
      >
        {/* Plain <img> on purpose: a one-time splash that must paint instantly on
            any device without depending on the Next image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Avenix Studio"
          width={320}
          height={320}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="h-auto w-[clamp(190px,44vw,320px)] select-none"
        />

        {/* Single thin metallic sweep — fast, elegant, no glow/flare. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ x: '-130%' }}
          animate={{ x: '130%' }}
          transition={{ duration: 0.85, delay: 2.0, ease: EASE_SWEEP }}
          style={{
            background:
              'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.10) 47%, rgba(245,222,179,0.55) 50%, rgba(255,255,255,0.10) 53%, transparent 58%)',
            mixBlendMode: 'screen',
            willChange: 'transform',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
