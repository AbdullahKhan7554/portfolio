'use client';

import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollStoryItem } from './ScrollStoryItem';
import { ProgressIndicator } from './ProgressIndicator';
import { useIsDesktop } from './useIsDesktop';

/**
 * Scroll-driven sticky storytelling panel — the dark "chapter" that interrupts
 * the white page (spec: WHITE → DARK CINEMATIC → WHITE).
 *
 * HOW THE PIN WORKS
 * A tall outer wrapper (N x 100vh) provides the scroll distance; an inner
 * `position: sticky` box 100vh tall stays put while that distance is consumed.
 * This is ordinary sticky positioning — the browser's scroll is never hijacked,
 * intercepted, or synthesised, so momentum, keyboard paging, find-in-page and
 * the scrollbar all behave exactly as the user expects. When the wrapper ends
 * the pin releases on its own and the next white section follows.
 *
 * WHY IT DOESN'T THRASH REACT
 * Chapter transitions are bound to `scrollYProgress` through `useTransform`, so
 * they animate on motion values and never re-render on scroll. React state
 * changes exactly once per chapter change — only to move the progress numeral
 * and set `aria-current` — not on every frame.
 *
 * DEGRADATION
 * Below 1024px, or under `prefers-reduced-motion`, the pin is dropped entirely
 * and chapters render as a plain vertical stack: one item at a time, full-size
 * images, nothing sticky, next section always reachable. That is a different
 * layout, not a shrunken one.
 *
 * @param {object[]} items  [{ id, label, title, description, image, imageAlt, meta? }]
 */
/**
 * Scroll distance the user must travel to move through ONE chapter. 100vh read
 * as rushed — the chapter changed before its copy had been comfortably read.
 */
const CHAPTER_VH = 170;

/**
 * Scroll distance each cross-fade consumes, held CONSTANT in viewport units.
 * This is the reason the transition still feels the same speed after the
 * chapters were lengthened: the fade always costs ~22vh of scroll, so making a
 * chapter longer buys hold time, not a slower animation.
 */
const TRANSITION_VH = 22;

export function ScrollStorySection({
  id,
  eyebrow,
  title,
  intro,
  items = [],
  className,
  chapterVh = CHAPTER_VH,
  transitionVh = TRANSITION_VH,
  /**
   * 'dark' (default) renders the near-black cinematic panel from the original
   * spec. 'light' keeps the identical layout and motion but stays on the site's
   * light tokens — used where a section should read as part of the white page
   * rather than as an interrupting chapter. Everything inside is token-driven,
   * so the only difference is whether `.theme-dark` is applied.
   */
  theme = 'dark',
}) {
  const isLight = theme === 'light';
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Sticky storytelling is desktop-only and motion-only.
  const isPinned = isDesktop && !reduced;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // One state write per chapter boundary — never per frame.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!isPinned || items.length === 0) return;
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length)));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  if (items.length === 0) return null;

  const header = (eyebrow || title || intro) && (
    <header className="max-w-3xl">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && (
        <h2 className="mt-4 font-display text-h2 text-text-strong text-balance">
          {title}
        </h2>
      )}
      {intro && <p className="measure mt-4 text-lead text-muted">{intro}</p>}
    </header>
  );

  return (
    <section
      id={id}
      // `theme-dark` re-points the semantic tokens, so anything token-driven
      // dropped in here inverts automatically; --story-bg overrides the ground
      // to the near-black the spec calls for.
      className={cn('relative', !isLight && 'theme-dark', className)}
      style={{ backgroundColor: isLight ? 'var(--bg-alt)' : 'var(--story-bg)' }}
    >
      {/* Very subtle top glow — the only ornament, no neon, no glass. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />

      {/* The section header sits OUTSIDE the pinned viewport and scrolls away
          normally. Keeping it inside cost ~200px of a 100vh box — with a second
          heading and an image below it, the content overflowed and was clipped
          by the pin's `overflow-hidden` on shorter laptop viewports. Out here it
          introduces the chapter, then hands the whole screen to the story. */}
      {header && (
        <div className="container-page pt-[clamp(var(--space-12),9vw,var(--space-20))]">
          {header}
        </div>
      )}

      <div
        ref={wrapperRef}
        style={isPinned ? { height: `${items.length * chapterVh}vh` } : undefined}
        className="relative"
      >
        <div
          className={cn(
            isPinned
              ? // pt clears the floating navbar. Without it a chapter centred
                // in a full 100vh box collides with the pill on ~720px laptop
                // viewports.
                //
                // 6.5rem = 104px, written out rather than tokenised because it
                // is a measurement of another element, not a rhythm step: the
                // pill sits at `top-6` (--space-6, 32px) and is 72px tall, so
                // its bottom edge is at exactly 104px. No --space-* value
                // equals 104 (space-12 is 96, space-16 is 128).
                //
                // Was a top-padding utility on spacing keys 20 / 24 (with an
                // `md` step). The original comment computed 96px from stock
                // Tailwind, but both keys are remapped in tailwind.config.js to
                // --space-20/--space-24 — 10rem and 12rem — so it was actually
                // applying 160px/192px. In an h-screen box with justify-center
                // that pushed every pinned chapter ~90px below true centre and
                // ate the headroom on short laptops. The responsive step is
                // dropped too: this branch only ever renders at >=1024px
                // (isPinned requires useIsDesktop), so the pre-`md` value was
                // unreachable.
                //
                // Keys are named, not written as class literals, on purpose:
                // Tailwind scans comment text too, so spelling them out here
                // regenerated the very utilities this replaced.
                'sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[6.5rem]'
              : 'pb-[clamp(var(--space-12),9vw,var(--space-20))] pt-10',
          )}
        >
          <div className="container-page w-full">
            {isPinned ? (
              <div className="flex items-center gap-10">
                {/* Given an explicit share of the viewport (not the content
                    row's height) so the rail reads as a full-height element.
                    68vh rather than 100vh: a rail running edge to edge would
                    collide with the header above and the section boundary below,
                    which reads as an accident rather than a decision. */}
                <ProgressIndicator
                  count={items.length}
                  activeIndex={activeIndex}
                  progress={scrollYProgress}
                  className="hidden h-[68vh] shrink-0 self-center lg:flex"
                />

                {/* Single grid cell: every chapter occupies it and cross-fades,
                    so the layout box never changes size between steps. */}
                <div className="grid flex-1 grid-cols-1 grid-rows-1">
                  {items.map((item, i) => (
                    <ScrollStoryItem
                      key={item.id ?? i}
                      item={item}
                      index={i}
                      total={items.length}
                      progress={scrollYProgress}
                      isActive={i === activeIndex}
                      variant="pinned"
                      reduced={reduced}
                      leadFraction={transitionVh / chapterVh}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Stacked: mobile + reduced motion. Plain flow, one per screenful. */
              <div className="flex flex-col gap-[clamp(var(--space-10),12vw,var(--space-16))]">
                {items.map((item, i) => (
                  <ScrollStoryItem
                    key={item.id ?? i}
                    item={item}
                    index={i}
                    total={items.length}
                    progress={scrollYProgress}
                    isActive
                    variant="stacked"
                    reduced={reduced}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
