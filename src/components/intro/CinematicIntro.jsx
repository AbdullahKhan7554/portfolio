'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { IntroVisual } from './IntroVisual';

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
 *
 * The slab/logo/sweep artwork itself lives in <IntroVisual>, shared with
 * <RouteTransitionOverlay>. Everything below is the ENTRY-ONLY half: the gate
 * handoff, the homepage check, and the timeline. `variant="entry"` selects the
 * long timing there; this file still owns when it starts and stops.
 */

/** ms timeline marker: when the logo settles and we begin the dissolve-out. */
const REVEAL_AT = 2600;

export function CinematicIntro() {
  const [mounted, setMounted] = useState(false); // overlay in the tree
  const [phase, setPhase] = useState('in'); // 'in' → 'out'

  useEffect(() => {
    // NOTE: no "already started" ref-guard here. Under React StrictMode (dev),
    // the effect runs setup → cleanup → setup on mount; a guard that skips the
    // second setup would let the first cleanup's clearTimeout win and leave the
    // overlay stuck open forever. Keeping setup/cleanup symmetric means the
    // second setup simply re-arms a fresh hide timer. The [] deps already ensure
    // this only fires on real mounts (full page loads), never on soft nav.
    const root = document.documentElement;

    /**
     * Take ownership of the release from the <head> gate's dead-man's switch
     * (see INTRO_GATE in app/layout.js). That timer counts from HTML parse while
     * everything below counts from mount, so leaving it armed means the two race
     * on any slow hydration — it would strip `intro-active` while the overlay is
     * still opaque, and the hero's entrance would play out unseen beneath it.
     * React is demonstrably alive by this line, so the fallback has done its job
     * and both branches below release the class themselves.
     *
     * Safe unconditionally: the handle is only set on the homepage with motion
     * allowed, and `clearTimeout(undefined)` is a no-op everywhere else. Also
     * safe under StrictMode's double-invoke — clearing a cleared id does nothing.
     */
    clearTimeout(window.__avxIntroRelease);

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
    // Positioning wrapper only. IntroVisual carries no z-index of its own, so
    // the 9999 that must sit above every other layer is supplied here.
    <motion.div
      aria-hidden="true"
      className="fixed inset-0"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: out ? 0 : 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      onAnimationComplete={handleOverlayAnimationComplete}
    >
      <IntroVisual variant="entry" out={out} />
    </motion.div>
  );
}
