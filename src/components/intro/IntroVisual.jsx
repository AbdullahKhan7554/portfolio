'use client';

import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { siteConfig } from '@/config/site';

/**
 * The Avenix brand slab — one visual, two drivers.
 *
 * PURE PRESENTATION. No timers, no effects, no hooks. Everything it does is a
 * function of its props, so the entry intro and the route transition render the
 * SAME logo lockup and the SAME metallic sweep rather than two lookalikes that
 * drift apart on the next edit.
 *
 *   • <CinematicIntro>            variant="entry"  — once per full page load
 *   • <RouteTransitionOverlay>    variant="route"  — every soft navigation
 *
 * NO z-index, NO `fixed`. This fills whatever positioned element the driver
 * wraps it in, because the two drivers stack at deliberately different heights
 * (the entry intro sits above everything at 9999; the route overlay sits at
 * z-transition/550, under the toast layer so the skip link still wins). Baking a
 * value in here would silently break one of them.
 *
 * TIMING is the only real difference. The entry runs to a ~3.3s timeline it
 * owns; the route overlay has a 500ms floor and must read as one continuous
 * motion inside it rather than a truncated version of the long one — so the
 * blur-in is compressed and the sweep is pulled forward to overlap it.
 *
 * The HAIRLINE is route-only. On entry the timeline is fixed and known, so a
 * progress-ish signal would be theatre; on a navigation it is the honest part of
 * the overlay — it keeps moving when a route fetch outlasts the floor.
 */

/** Sweep uses a symmetric ease so the highlight crosses at a constant-ish clip. */
const EASE_SWEEP = [0.4, 0, 0.2, 1];

const TIMING = {
  entry: {
    // Matches the original CinematicIntro exactly — do not retune without
    // re-checking REVEAL_AT (2600ms) in CinematicIntro.jsx.
    lockup: { duration: 0.9, delay: 0.3 },
    // Scale runs 100ms longer than opacity/filter on entry — the lockup keeps
    // settling for a beat after it has finished resolving. Deliberate, and the
    // reason this is a separate key rather than reusing `lockup`.
    scaleIn: { duration: 1.0, delay: 0.3 },
    outScale: { duration: 0.7 },
    sweep: { duration: 0.85, delay: 2.0 },
  },
  route: {
    // Sized to the 500ms MIN_DISPLAY_MS floor in TransitionProvider. The sweep
    // starts before the lockup has finished resolving so the two read as a
    // single gesture; both are clear of the 280ms exit crossfade.
    lockup: { duration: 0.35, delay: 0.05 },
    scaleIn: { duration: 0.35, delay: 0.05 },
    outScale: { duration: 0.3 },
    sweep: { duration: 0.6, delay: 0.15 },
  },
};

export function IntroVisual({ variant = 'entry', out = false, reduced = false }) {
  const t = TIMING[variant] ?? TIMING.entry;
  const isRoute = variant === 'route';

  return (
    // `theme-dark` + `bg-bg` rather than the literal #0B0B0B the entry intro
    // used to inline: same obsidian to within 1/255, but it goes through the
    // semantic layer like every other contrast block on the site.
    <div className="theme-dark grid h-full w-full place-items-center bg-bg">
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          style={{
            // Feather the logo's own black field into the slab so it never
            // reads as a hard square. Tracks --bg, so it cannot drift from the
            // canvas behind it.
            boxShadow: '0 0 120px 60px var(--bg)',
            willChange: 'transform, opacity, filter',
          }}
          initial={reduced ? false : { opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            scale: out ? 0.9 : 1,
            filter: 'blur(0px)',
          }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  opacity: { ...t.lockup, ease: EASE_OUT_EXPO },
                  filter: { ...t.lockup, ease: EASE_OUT_EXPO },
                  scale: out
                    ? { ...t.outScale, ease: EASE_OUT_EXPO }
                    : { ...t.scaleIn, ease: EASE_OUT_EXPO },
                }
          }
        >
          {/* Plain <img> on purpose: a splash that must paint instantly on any
              device without depending on the Next image optimizer. The root
              layout preloads /logo.png (as="image", fetchPriority="high"), so by
              the time any navigation can fire it is already decoded and the
              route variant never shows an empty box. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={siteConfig.brand.name}
            width={320}
            height={320}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className={
              isRoute
                ? 'h-auto w-[clamp(140px,30vw,220px)] select-none'
                : 'h-auto w-[clamp(190px,44vw,320px)] select-none'
            }
          />

          {/* Single thin metallic sweep — fast, elegant, no glow/flare. */}
          {reduced ? null : (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              initial={{ x: '-130%' }}
              animate={{ x: '130%' }}
              transition={{ ...t.sweep, ease: EASE_SWEEP }}
              style={{
                background:
                  'linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.10) 47%, rgba(245,222,179,0.55) 50%, rgba(255,255,255,0.10) 53%, transparent 58%)',
                mixBlendMode: 'screen',
                willChange: 'transform',
              }}
            />
          )}
        </motion.div>

        {isRoute ? (
          <span className="relative block h-px w-20 overflow-hidden bg-border">
            {reduced ? (
              <span className="absolute inset-y-0 left-0 w-1/3 bg-accent" />
            ) : (
              <motion.span
                className="absolute inset-y-0 left-0 w-1/3 bg-accent"
                initial={{ x: '-100%' }}
                animate={{ x: '300%' }}
                transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
              />
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}
