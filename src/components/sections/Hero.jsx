'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { heroFontVariables } from '@/lib/heroFonts';

/**
 * ============================================================================
 * HOMEPAGE HERO — v2 (2026-11-25)
 * ----------------------------------------------------------------------------
 * Cinematic, GSAP-driven hero. Approved deviations from the locked design
 * system, scoped to THIS section only:
 *   • GSAP + ScrollTrigger for motion (the rest of the site stays on Framer
 *     Motion + Lenis).
 *   • General Sans / DM Sans / IBM Plex Mono (lib/heroFonts.js) in place of
 *     Satoshi / Inter / Geist Mono.
 *
 * Layers, back to front:
 *   bg (photo, mouse parallax + scroll zoom) → scrim → floor veil → grain →
 *   spotlight (follows cursor) → gold orbital → copy → stats bar → scroll veil
 *
 * Motion contract:
 *   • Reduced motion → no GSAP at all. The SSR markup is the final state.
 *   • Homepage first load → CSS (globals.css `.hx-*` under `html.intro-active`)
 *     holds the start positions beneath the cinematic intro; the timeline plays
 *     the moment CinematicIntro removes `intro-active`.
 *   • Client-side navigation back to `/` → no gate, the timeline plays on mount
 *     (layout effect, so the start state is applied before first paint).
 *   • Pointer effects (parallax, spotlight, orbital tilt) only on fine pointers.
 * ============================================================================
 */

// SSR-safe layout effect: runs before paint on the client, silent on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Headline — SEO-approved H1 copy. `accent` renders in champagne gold. Kept as
 * data so the word-reveal markup below stays generic.
 */
const HEADLINE = {
  lead: 'Web & App Development, SEO & Marketing Agency in',
  accent: 'Lahore',
};

/** Tagline directly under the H1 (moved out of the H1 in the SEO pass). */
const TAGLINE = 'We Build Digital Products That Drive Real Impact.';

const SUPPORT =
  'Web, mobile, and AI products for ambitious brands. Designed, engineered and marketed end to end.';

/**
 * Three stats, per Abdullah's figures. "16+" matches the entry count in
 * content/caseStudies.js. "100% Client Satisfaction" is Abdullah's own claim —
 * it is not derived from any data in this repo. Rendered at their FINAL values
 * on the server (crawlers, no-JS, reduced motion); GSAP counts up from zero.
 */
const STATS = [
  { value: 16, suffix: '+', label: 'Projects shipped' },
  { value: 7, suffix: '+', label: 'Live clients' },
  { value: 100, suffix: '%', label: 'Client satisfaction' },
];

/**
 * Hero background — final.webp, 1536x1024 (3:2), q92 re-encode of the PNG
 * master (115 KB vs 1.74 MB). next/image re-encodes to AVIF/WebP per request.
 * If the file is ever missing, `onError` swaps in the aurora fallback.
 */
const HERO_BG = '/images/final.webp';

export function Hero() {
  const [bgOk, setBgOk] = useState(true);
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const html = document.documentElement;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let gateObserver;
    let removePointer = () => {};

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const words = q('.hx-word');
      const fades = q('[data-hx-fade]');
      const counters = q('[data-hx-count]');
      const bg = q('.hx-bg')[0];
      const orbit = q('.hx-orbit')[0];
      const orbitTilt = q('.hx-orbit-tilt')[0];

      // ---- Start state (inline; supersedes the CSS gate once applied) -----
      // `y: 0` is load-bearing. While `intro-active` is on <html>, the CSS gate
      // holds each word at translateY(110%); GSAP would read that as a PIXEL
      // offset and keep it after the yPercent tween ends, leaving the headline
      // parked below its clip. Zeroing y hands the whole offset to yPercent.
      gsap.set(words, { y: 0, yPercent: 110 });
      gsap.set(fades, { autoAlpha: 0, y: 22 });
      gsap.set(q('.hx-rule'), { scaleX: 0 });
      if (bg) gsap.set(bg, { scale: 1.1 });
      if (orbit) gsap.set(orbit, { autoAlpha: 0, scale: 0.86 });
      counters.forEach((el) => {
        el.textContent = '0';
      });

      // ---- Entrance -------------------------------------------------------
      // expo.out everywhere: fast start, long settle, no overshoot.
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      if (bg) intro.to(bg, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0);
      intro
        .to(q('.hx-rule'), { scaleX: 1, duration: 1 }, 0.1)
        .to(q('[data-hx-fade="eyebrow"]'), { autoAlpha: 1, y: 0, duration: 0.9 }, 0.15)
        .to(words, { yPercent: 0, duration: 1.15, stagger: 0.055 }, 0.22)
        .to(
          q('[data-hx-fade="body"]'),
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 },
          0.7,
        )
        .to(q('[data-hx-fade="bar"]'), { autoAlpha: 1, y: 0, duration: 1 }, 1.0);
      if (orbit) {
        intro.to(
          orbit,
          { autoAlpha: 1, scale: 1, duration: 2, ease: 'power3.out' },
          0.45,
        );
      }
      counters.forEach((el, i) => {
        const end = Number(el.dataset.hxCount);
        const state = { v: 0 };
        intro.to(
          state,
          {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          },
          1.1 + i * 0.12,
        );
      });

      if (html.classList.contains('intro-active')) {
        gateObserver = new MutationObserver(() => {
          if (!html.classList.contains('intro-active')) {
            gateObserver.disconnect();
            intro.play();
          }
        });
        gateObserver.observe(html, { attributes: true, attributeFilter: ['class'] });
      } else {
        intro.play();
      }

      // ---- Orbital: slow continuous orbit ----------------------------------
      const spin = gsap.to(q('.hx-orbit-spin'), {
        rotation: 360,
        duration: 36,
        ease: 'none',
        repeat: -1,
        svgOrigin: '300 300',
      });
      const counterSpin = gsap.to(q('.hx-orbit-spin-rev'), {
        rotation: -360,
        duration: 64,
        ease: 'none',
        repeat: -1,
        svgOrigin: '300 300',
      });

      // ---- Cinematic scroll-out into the next section ----------------------
      // Copy lifts and dissolves, the photograph keeps zooming and sinks into
      // the section's own ground. Scrubbed, so it is tied to the scrollbar,
      // not a timer.
      const scrollOut = {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      };
      gsap.to(q('.hx-content'), {
        yPercent: -14,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: scrollOut,
      });
      gsap.to(q('.hx-bar'), {
        yPercent: -30,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: scrollOut,
      });
      gsap.to(q('.hx-bg-scroll'), {
        scale: 1.14,
        yPercent: 7,
        ease: 'none',
        scrollTrigger: scrollOut,
      });
      gsap.to(q('.hx-veil'), { opacity: 0.9, ease: 'none', scrollTrigger: scrollOut });
      if (orbit) {
        gsap.to(q('.hx-orbit-scroll'), {
          yPercent: -18,
          rotate: 24,
          ease: 'none',
          scrollTrigger: scrollOut,
        });
      }

      // ---- Pointer: parallax, spotlight, orbital tilt + speed --------------
      if (finePointer) {
        const spot = q('.hx-spotlight')[0];
        const bgX = bg
          ? gsap.quickTo(bg, 'x', { duration: 1.4, ease: 'power3.out' })
          : null;
        const bgY = bg
          ? gsap.quickTo(bg, 'y', { duration: 1.4, ease: 'power3.out' })
          : null;
        const spotX = gsap.quickTo(spot, 'x', { duration: 0.7, ease: 'power3.out' });
        const spotY = gsap.quickTo(spot, 'y', { duration: 0.7, ease: 'power3.out' });
        const tiltY = orbitTilt
          ? gsap.quickTo(orbitTilt, 'rotationY', { duration: 1.2, ease: 'power3.out' })
          : null;
        const tiltX = orbitTilt
          ? gsap.quickTo(orbitTilt, 'rotationX', { duration: 1.2, ease: 'power3.out' })
          : null;
        if (orbitTilt)
          gsap.set(orbitTilt, { rotationX: 64, rotationZ: -14, rotationY: 0 });

        let spotOn = false;
        let fast = false;

        const onMove = (e) => {
          const r = root.getBoundingClientRect();
          const px = e.clientX - r.left;
          const py = e.clientY - r.top;
          const nx = px / r.width - 0.5; // -0.5 … 0.5
          const ny = py / r.height - 0.5;

          bgX?.(-nx * 26);
          bgY?.(-ny * 18);
          spotX(px);
          spotY(py);
          tiltY?.(nx * 18);
          tiltX?.(64 - ny * 12);

          if (!spotOn) {
            spotOn = true;
            gsap.to(spot, { opacity: 1, duration: 0.8, ease: 'power2.out' });
          }

          // Near the orbital → it quickens; away → it settles back.
          if (orbit) {
            const o = orbit.getBoundingClientRect();
            const dx = e.clientX - (o.left + o.width / 2);
            const dy = e.clientY - (o.top + o.height / 2);
            const near = Math.hypot(dx, dy) < o.width * 0.5;
            if (near !== fast) {
              fast = near;
              gsap.to([spin, counterSpin], {
                timeScale: near ? 5 : 1,
                duration: near ? 0.9 : 1.6,
                ease: 'power2.out',
              });
              gsap.to(q('.hx-orbit-glow'), {
                opacity: near ? 1 : 0.55,
                duration: 0.9,
                ease: 'power2.out',
              });
            }
          }
        };

        const onLeave = () => {
          spotOn = false;
          gsap.to(spot, { opacity: 0, duration: 0.9, ease: 'power2.out' });
          bgX?.(0);
          bgY?.(0);
          tiltY?.(0);
          tiltX?.(64);
          if (fast) {
            fast = false;
            gsap.to([spin, counterSpin], {
              timeScale: 1,
              duration: 1.6,
              ease: 'power2.out',
            });
          }
        };

        root.addEventListener('pointermove', onMove, { passive: true });
        root.addEventListener('pointerleave', onLeave);
        removePointer = () => {
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
        };
      }
    }, root);

    return () => {
      gateObserver?.disconnect();
      removePointer();
      ctx.revert();
    };
  }, []);

  const words = HEADLINE.lead.split(' ');

  return (
    // `theme-dark`: the hero is an intentional dark contrast block (§2).
    // `isolate`: makes #hero its own stacking context so the negative-z layers
    //   paint above the section's background but below the copy.
    // `hx` + font variables: hero-only typefaces (lib/heroFonts.js).
    // `id="hero"` is load-bearing: Header.jsx observes it to gate the navbar.
    // Top padding = navbar clearance below `lg` (the pill overlaps the hero on
    // phones/tablets; floors sit ~8px under its bottom edge), restored to the
    // plain value from `lg`, where the navbar is hidden until the hero passes.
    // min-h, never h: overflow is hidden, so a fixed height would clip the copy
    // on short viewports instead of letting the section grow.
    <section
      id="hero"
      ref={rootRef}
      className={`hx ${heroFontVariables} theme-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[clamp(5.5rem,12svh,6.5rem)] md:pt-[clamp(7rem,14svh,8rem)] lg:pt-8`}
    >
      {/* Fallback backdrop — mounted only if the photograph fails to load. */}
      {!bgOk && (
        <div aria-hidden="true" className="hero-aurora -z-30">
          <span className="hero-orb hero-orb--1" />
          <span className="hero-orb hero-orb--2" />
          <span className="hero-orb hero-orb--3" />
          <span className="hero-sheen" />
        </div>
      )}

      {/* Photograph. Two wrappers so the scroll zoom (outer) and the pointer
          parallax + entrance settle (inner .hx-bg) never fight over the same
          transform. `fill` keeps it out of flow: no reserved box, no CLS. */}
      {bgOk && (
        <div
          aria-hidden="true"
          className="hx-bg-scroll pointer-events-none absolute inset-0 -z-20"
        >
          <div className="hx-bg">
            <Image
              src={HERO_BG}
              alt="Glowing doorway in a dark monolith on a rocky island at dusk, symbolising Avenix Studio software and AI automation"
              aria-hidden="true"
              fill
              priority
              // NOT 100vw: object-cover on a portrait viewport renders the image
              // ~2.5x the viewport width, so 150vw/130vw request a source that
              // is not upscaled into softness on high-DPR phones.
              sizes="(max-width: 639px) 150vw, (max-width: 1023px) 130vw, 100vw"
              quality={82}
              // The lit monolith sits at ~60–84% across the frame. 78% keeps it
              // in a portrait crop; from `lg` the crop is vertical, so centre.
              className="object-cover object-[78%_50%] lg:object-center"
              onError={() => setBgOk(false)}
            />
          </div>
        </div>
      )}

      {/* Contrast scrim (globals.css) — left-weighted on desktop, vertical on
          mobile; tuned so the copy holds AA over the brightest ground. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hx-floor pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="hx-grain pointer-events-none absolute inset-0 -z-10"
      />
      <div aria-hidden="true" className="hx-spotlight -z-10" />

      {/* Gold orbital — sits over the monolith, `lg` and up only: below that the
          copy spans the full width and the rings would run through it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4vw] top-1/2 -z-10 hidden w-[min(40vw,40rem)] -translate-y-1/2 lg:block"
      >
        <div className="hx-orbit-scroll">
          <div className="hx-orbit aspect-square w-full">
            <div className="hx-orbit-tilt">
              <svg
                viewBox="0 0 600 600"
                className="h-full w-full overflow-visible"
                fill="none"
              >
                <defs>
                  <linearGradient
                    id="hx-ring"
                    x1="0"
                    y1="0"
                    x2="600"
                    y2="600"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0"
                      style={{ stopColor: 'var(--amber-300)', stopOpacity: 0.9 }}
                    />
                    <stop
                      offset="0.5"
                      style={{ stopColor: 'var(--amber-500)', stopOpacity: 0.25 }}
                    />
                    <stop
                      offset="1"
                      style={{ stopColor: 'var(--amber-400)', stopOpacity: 0.85 }}
                    />
                  </linearGradient>
                  <radialGradient id="hx-orb">
                    <stop offset="0" stopColor="#fff6e6" />
                    <stop offset="0.35" style={{ stopColor: 'var(--amber-300)' }} />
                    <stop
                      offset="1"
                      style={{ stopColor: 'var(--amber-500)', stopOpacity: 0 }}
                    />
                  </radialGradient>
                </defs>

                {/* Outer ring + travelling orb */}
                <g className="hx-orbit-spin">
                  <circle
                    cx="300"
                    cy="300"
                    r="270"
                    stroke="url(#hx-ring)"
                    strokeWidth="1.25"
                  />
                  <circle
                    className="hx-orbit-glow"
                    cx="570"
                    cy="300"
                    r="26"
                    fill="url(#hx-orb)"
                    opacity="0.55"
                  />
                  <circle cx="570" cy="300" r="4.5" fill="#fff4e0" />
                </g>

                {/* Inner dashed ring, counter-rotating, with a smaller satellite */}
                <g className="hx-orbit-spin-rev">
                  <circle
                    cx="300"
                    cy="300"
                    r="200"
                    style={{ stroke: 'var(--amber-400)' }}
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="2 9"
                  />
                  <circle cx="100" cy="300" r="3" style={{ fill: 'var(--amber-300)' }} />
                </g>

                {/* Fixed hairline — reads as the orbital plane */}
                <circle
                  cx="300"
                  cy="300"
                  r="135"
                  style={{ stroke: 'var(--amber-500)' }}
                  strokeOpacity="0.16"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-out veil: fades the whole hero towards the section ground. */}
      <div
        aria-hidden="true"
        className="hx-veil pointer-events-none absolute inset-0 z-[1]"
      />

      {/* ---- Copy ---------------------------------------------------------- */}
      <div className="container-page flex w-full flex-1 items-center py-6 md:py-8">
        <div className="hx-content w-full max-w-5xl">
          <p
            data-hx-fade="eyebrow"
            className="hx-label flex items-center gap-3 text-text-muted"
          >
            <span className="hx-rule" aria-hidden="true" />
            <span>
              Digital Product Studio <span className="text-accent">·</span>{' '}
              {/* Dropped below `sm` so the eyebrow holds one line on phones; the
                  H1 already names the city. */}
              <span className="hidden sm:inline">
                Lahore <span className="text-accent">·</span>{' '}
              </span>
              Est. {siteConfig.brand.foundingYear}
            </span>
          </p>

          <h1 className="hx-title mt-6 max-[399px]:mt-4">
            {words.map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="hx-word-clip">
                  <span className="hx-word">{w}</span>
                </span>{' '}
              </span>
            ))}
            <span className="hx-word-clip">
              <span className="hx-word hx-gold">{HEADLINE.accent}</span>
            </span>
          </h1>

          <p
            data-hx-fade="body"
            className="hx-tagline mt-6 max-w-[34rem] max-[399px]:mt-5"
          >
            {TAGLINE}
          </p>

          <p data-hx-fade="body" className="hx-support mt-3">
            {SUPPORT}
          </p>

          <div
            data-hx-fade="body"
            className="mt-8 flex flex-wrap items-center gap-3 max-[399px]:mt-6"
          >
            {/* Full-width below `sm` so the stacked pair shares one edge. */}
            <Button href="/contact" size="lg" className="w-full sm:w-auto" magnetic>
              Start a Project
            </Button>
            <Button
              href="/work"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              magnetic
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>

      {/* ---- Stats bar + scroll cue ------------------------------------------
          In flow (not absolute) so on short screens it pushes the section
          taller instead of overlapping the copy. */}
      <div className="hx-bar container-page relative z-[2] w-full pb-6 md:pb-8">
        <div
          data-hx-fade="bar"
          className="flex items-end justify-between gap-6 border-t border-white/[0.12] pt-5 md:pt-6"
        >
          <dl className="grid w-full max-w-xl grid-cols-3 gap-4 md:gap-10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end gap-2">
                <dt className="hx-label text-text-muted">{s.label}</dt>
                <dd className="hx-stat">
                  <span data-hx-count={s.value}>{s.value}</span>
                  <span className="hx-gold">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#services"
            aria-label="Scroll to services"
            className="hx-label group hidden shrink-0 items-center gap-4 text-text-muted transition-colors duration-base hover:text-accent md:inline-flex"
          >
            <span>Scroll</span>
            <span className="hx-scroll-track" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
