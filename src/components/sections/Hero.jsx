'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Badge';
import { siteConfig } from '@/config/site';

/**
 * ⚠️ HEADLINE — PENDING SELECTION. Three agency-positioning options are defined
 * below; ACTIVE_HEADLINE renders option 0 as a TEMPORARY default so the page is
 * not broken while Abdullah picks. Change the index (or delete the losers) once
 * the choice is made. Design system §8: agency statement, not "I build websites".
 */
const HEADLINE_OPTIONS = [
  {
    id: 'impact',
    lines: ['We Build Digital Products That'],
    tail: '',
    tailAccent: 'Drive Real Impact',
  },
  {
    id: 'capability',
    lines: ['We Build The Web, Mobile', 'And AI Products Ambitious'],
    tail: 'Brands',
    tailAccent: 'Run On',
  },
  {
    id: 'outcome',
    lines: ['Engineering And Marketing', 'That Turn Ambitious Brands'],
    tail: 'Into',
    tailAccent: 'Category Leaders',
  },
  {
    id: 'partnership',
    lines: ['One Studio For Everything', 'Your Brand Ships'],
    tail: '',
    tailAccent: 'Online',
  },
];
const ACTIVE_HEADLINE = 0;

/**
 * Three stats, per Abdullah's figures. "16+" matches the entry count in
 * content/caseStudies.js. "100% Client Satisfaction" is Abdullah's own claim —
 * it is not derived from any data in this repo (the case studies carry no
 * ratings, and the Seven Guys site still shows "No reviews yet").
 */
const TRUST = ['16+ Projects Shipped', '7+ Live Clients', '100% Client Satisfaction'];

/**
 * Hero background — final.webp, 1536x1024 (3:2). If the file is ever missing
 * the `onError` handler hides the image and the aurora backdrop shows through,
 * so the hero never renders broken.
 *
 * WEBP, NOT THE PNG MASTER. The source was a 1.74 MB PNG — a lossless format
 * carrying a photographic render, which is the worst pairing available. Re-
 * encoded at q92 it is 115 KB (93.4% smaller) and measures 42.0 dB PSNR over
 * the region that actually ships on mobile, i.e. visually lossless.
 *
 * This is the OPTIMIZER'S INPUT, not what ships: next/image re-encodes to
 * AVIF/WebP per the Accept header (see `images.formats` in next.config.mjs).
 * Shrinking the source therefore does not shrink the delivered bytes much —
 * what it buys is a far cheaper decode on every cache miss, and 1.6 MB off the
 * repo. q92 was chosen over q82 (58 KB) specifically to keep generation loss
 * negligible when the optimizer re-encodes lossy-on-lossy.
 *
 * `sizes` is set on the element itself — see the note there; it is not 100vw.
 */
const HERO_BG = '/images/final.webp';

export function Hero() {
  const [bgOk, setBgOk] = useState(true);

  return (
    // `theme-dark` scopes the semantic tokens to their dark values (§2: the hero
    // is an intentional dark contrast block). Without it the light-theme ink
    // would render near-black over the dark background image.
    <section
      id="hero"
      // No top padding: the navbar is hero-gated and never overlays this
      // section, so reserving header height here would only push the content
      // off-centre.
      // 88svh, not 100: leaving ~12vh of the next section showing signals there
      // is more below, which is what stops a full-bleed hero feeling indulgent.
      // `svh` (not `vh`) so mobile browser chrome doesn't overshoot.
      // 78svh below `md`, measured rather than guessed. The copy block is
      // ~600-680px on a phone (the headline wraps to 4-5 lines and BOTH CTAs
      // wrap to their own row), so 88svh only bites on tall handsets — at
      // 430x932 it reserved 820px for 600px of copy and left ~220px of dead
      // ground. 78svh tracks the content instead of overshooting it: tall
      // phones keep a ~60px optical margin, and short ones (320x568) were
      // always content-driven, so nothing there regresses.
      // py-6/py-8 (32/48px in this project's scale, NOT Tailwind's 24/32px):
      // the desktop value is unchanged; trimming 32px on mobile is what buys
      // back the "next section peeking" cue at 375x667, where the content
      // block is otherwise exactly one viewport tall.
      // `isolate` is load-bearing, not decorative. The background image, aurora
      // and scrim are all negative-z children. Without a stacking context on
      // this section they paint against the nearest ancestor one — i.e. BEHIND
      // this section's own background-color, which `.theme-dark` sets to
      // var(--bg). Result: a flat black slab with the image invisible.
      // `isolation: isolate` makes #hero its own stacking context, so negative-z
      // children paint above its background but still below the copy.
      // TOP PADDING IS NAVBAR CLEARANCE, MEASURED — not a nudge.
      // Since Phase 2c the pill is always visible below `lg`, so it overlaps the
      // hero on every phone and tablet. Its bottom edge is top + height:
      // below md  -> 16 + 64  =  80px
      // md to lg  -> 32 + 72  = 104px
      // lg and up -> gated hidden at hero start -> no clearance needed, so the
      //              original 48px (py-8) is restored rather than inherited.
      //
      // The clamp is height-aware because a FIXED clearance is wrong at both
      // ends: 104px is comfortable on a 390x844 handset but pure waste on a
      // 375x667 one, where the copy block already measures ~723px and every
      // padding pixel pushes the trust chips further past the fold. The floors
      // (88px / 112px) are the real constraint — each sits ~8px below its pill's
      // bottom edge, so clearance is guaranteed at any viewport height, while
      // 12svh/14svh lets tall phones breathe up to the original values.
      // Padding on a centre-aligned flex is the right lever here: short content
      // still centres, tall content is simply guaranteed to start below the
      // pill. Nothing is pushed down by a fixed offset.
      //
      // FULL VIEWPORT AT EVERY WIDTH — one `min-h-[100svh]`, no md override.
      // The hero was 78svh (mobile, Phase 2e) then 88svh from `md` up, both
      // deliberate: the exposed sliver of the next section acted as a scroll
      // cue. Phase 2e took mobile to 100svh; this takes the rest, so the whole
      // ladder is gone and the first viewport is only ever the hero.
      // Losing the peek costs nothing on `md` and up — the "Scroll" affordance
      // below is `hidden md:inline-flex`, and at 100svh it now sits at the true
      // bottom of the viewport instead of 12svh above it, which is where a
      // scroll cue actually belongs.
      //
      // svh, not dvh or vh. On first paint mobile chrome is shown, so the
      // visible viewport IS the small viewport and 100svh fills it exactly. dvh
      // would match on load but then resize the hero as chrome retracts mid
      // scroll — continuous reflow for no gain. vh equals lvh, which overshoots
      // and hides content behind the chrome. Desktop has no dynamic chrome, so
      // all four units are identical there.
      //
      // min-height, never height: this section is `overflow-hidden`, so a fixed
      // height would CLIP the copy on short viewports (the block measures ~683px
      // against a 667px iPhone SE) rather than letting the section grow past the
      // fold. The growth is the safety valve.
      className="theme-dark isolate relative flex min-h-[100svh] items-center overflow-hidden pb-6 pt-[clamp(5.5rem,12svh,6.5rem)] md:pb-8 md:pt-[clamp(7rem,14svh,8rem)] lg:pt-8"
    >
      {/* Layer 0 — aurora backdrop. This is the FALLBACK for a missing image,
          not decoration layered under a working one.
          Rendered only when the image has failed. It sits at -z-30 beneath a
          full-bleed -z-20 image, so whenever the photograph loads — which is
          every normal page view — none of it was ever visible: three 50vw+
          blurred layers and a rotating conic gradient animated forever behind
          an opaque cover image. That is continuous compositor work on the
          phones this section was just rebuilt for, for zero visual output.
          Mounting it on `!bgOk` keeps the graceful degradation (onError flips
          the flag and React swaps this in) and costs nothing the rest of the
          time. While the image is still decoding the section shows its own
          .theme-dark ground, which is the same near-black the aurora sits on. */}
      {!bgOk && (
        <div aria-hidden="true" className="hero-aurora -z-30">
          <span className="hero-orb hero-orb--1" />
          <span className="hero-orb hero-orb--2" />
          <span className="hero-orb hero-orb--3" />
          <span className="hero-sheen" />
        </div>
      )}

      {/* Layer 1 — background image. `fill` takes it out of flow entirely, so it
          reserves no layout box and cannot cause CLS. Priority-loaded: this is
          the LCP element. Hides itself if the asset is absent. */}
      {bgOk && (
        <Image
          src={HERO_BG}
          alt=""
          aria-hidden="true"
          fill
          priority
          // NOT 100vw. `object-cover` on a portrait viewport scales the image
          // to fill the HEIGHT, so it renders ~1.5x the hero height wide —
          // roughly 2.5x the viewport width on a phone. Declaring 100vw made
          // the browser fetch a 1200px source for a slot rendering at ~990 CSS
          // px on a DPR-3 screen (≈2970 device px), i.e. a ~2.9x upscale, which
          // is the softness. 150vw lands on the 1920 entry in `deviceSizes`
          // and roughly halves that to ~1.5x. 200vw would be more correct still
          // but skips 2048 and jumps straight to the 3840 variant, which is not
          // a trade worth making on a mobile LCP image.
          sizes="(max-width: 639px) 150vw, (max-width: 1023px) 130vw, 100vw"
          quality={82}
          // Subject (the lit monolith) sits at ~60-84% across a 3:2 frame while
          // the copy sits left. A portrait viewport only shows ~33% of the
          // image width, so the default 50% centre crop framed the empty sky
          // between the copy and the subject — the tower was cropped out
          // entirely. 78% re-centres that window on the subject: verified to
          // contain the full 60-84% span at 320/375/390/412/430. From `lg` the
          // viewport is wide enough that the crop is vertical, not horizontal,
          // so the original centred composition is restored.
          className="-z-20 object-cover object-[78%_50%] lg:object-center"
          onError={() => setBgOk(false)}
        />
      )}

      {/* Layer 2 — contrast scrim. Moved from an inline style to `.hero-scrim`
          in globals.css purely so it can carry a media query: the desktop
          gradient is weighted to the LEFT (copy left, photo right), but the
          mobile crop puts the subject directly behind full-width copy, so the
          same gradient leaves the lead paragraph over the lit doorway. The
          mobile variant re-weights it vertically instead. Values and the
          desktop appearance are unchanged. */}
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 -z-10" />

      <div className="container-page w-full">
        {/* 5xl, not 4xl: the block was filling only 66% of the 1360px container,
            leaving the composition weighted hard to the left. */}
        <div className="max-w-5xl">
          <div className="hero-in" style={{ animationDelay: '0.05s' }}>
            <span className="eyebrow normal-case tracking-[0.02em]">
              Digital Product Studio · Est. {siteConfig.brand.foundingYear}
            </span>
          </div>

          {/* COMPACT VERTICAL LADDER BELOW 400px.
              At 375x667 the block measures ~723px against a 667px viewport, so
              the trust chips fell ~40px past the fold. The four `max-[399px]:`
              overrides below recover exactly that 40px out of WHITESPACE only —
              no type scale change, no content removed, no negative margins:

                eyebrow -> h1     32 -> 16  (-16)   an eyebrow belongs to its
                                                     heading; 32px read as a gap
                h1 -> paragraph   24 -> 16  ( -8)
                paragraph -> CTA  32 -> 24  ( -8)
                CTA -> chips      32 -> 24  ( -8)
                                          = -40px

              `gap-3` (12px) is deliberately NOT touched in either flex row: it
              separates two 52px full-width tap targets and is already at the
              floor for comfortable stacked buttons.

              A `max-` variant rather than a new `xs` screen: the breakpoint set
              in tailwind.config.js is part of the locked design system, and this
              is a single-section concern. Existing values stay the default and
              nothing outside 399px-and-below can be affected. */}
          <h1 className="mt-6 font-display text-h1 font-normal leading-[1.08] tracking-[-0.02em] text-text-strong max-[399px]:mt-4">
            {HEADLINE_OPTIONS[ACTIVE_HEADLINE].lines.map((line, i) => (
              <span key={line} className="hero-line-clip">
                <span
                  className="hero-line"
                  style={{ animationDelay: `${0.12 + i * 0.1}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
            <span className="hero-line-clip">
              <span
                className="hero-line"
                style={{
                  animationDelay: `${
                    0.12 + HEADLINE_OPTIONS[ACTIVE_HEADLINE].lines.length * 0.1
                  }s`,
                }}
              >
                {HEADLINE_OPTIONS[ACTIVE_HEADLINE].tail}{' '}
                <span className="text-amber-wipe">
                  {HEADLINE_OPTIONS[ACTIVE_HEADLINE].tailAccent}
                </span>
                .
              </span>
            </span>
          </h1>

          {/* mt-5 (24px), not mt-7: 7 is NOT remapped in tailwind.config.js, so
              mt-7 fell through to Tailwind's stock 1.75rem and sat off the
              --space-* scale this section otherwise runs on.
              No colour class. `text-muted` was a dead class — the config nests
              muted under `colors.text`, so the real utility is
              `text-text-muted` and `text-muted` compiled to nothing. The
              paragraph has therefore always inherited --text from .theme-dark,
              and that is the correct value to keep: over the mobile crop, the
              actual --text-muted (#97949f) measures ~1.7:1 against the lit
              doorway and would fail AA outright. Stated explicitly so a later
              repo-wide rename of the dead class cannot silently darken it. */}
          <p
            className="hero-in measure mt-5 text-lead max-[399px]:mt-4"
            style={{ animationDelay: '0.5s' }}
          >
            Web, mobile, and AI products for ambitious brands. Designed,
            engineered and marketed end to end.
          </p>

          {/* mt-6 (32px), not mt-9: 9 is not remapped either and resolved to
              Tailwind's stock 2.25rem. */}
          <div
            className="hero-in mt-6 flex flex-wrap items-center gap-3 max-[399px]:mt-5"
            style={{ animationDelay: '0.62s' }}
          >
            {/* Full-width below `sm`. The two labels differ in length, so on a
                phone they wrapped to separate rows at their own intrinsic
                widths — a ragged stack with three different edges. Matching
                their width makes it read as a deliberate stacked pair, and
                gives both a full-width tap target. Unchanged from `sm` up,
                where they sit side by side. */}
            <Button href="/contact" size="lg" className="w-full sm:w-auto" magnetic>
              Start a Project
            </Button>
            <Button
              href="/work"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              View Our Work
            </Button>
          </div>

          {/* mt-10 IS on the scale (--space-10, 64px) and is kept on desktop.
              On a phone the trust chips wrap to two rows, so a 64px lead-in was
              the single largest gap in the block; 32px below `md` keeps the
              ladder monotonic (32 / 24 / 32 / 32) without touching desktop. */}
          <div
            className="hero-in mt-6 flex flex-wrap items-center gap-3 max-[399px]:mt-5 md:mt-10"
            style={{ animationDelay: '0.74s' }}
          >
            {TRUST.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <a
        // #case-studies no longer exists — that section was deleted and replaced
        // by ClientLogoStrip. Services is now the first section below the hero.
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-caption uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent md:inline-flex"
      >
        Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
