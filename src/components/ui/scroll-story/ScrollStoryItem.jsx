'use client';

import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';

/**
 * One chapter of a scroll story: eyebrow label, display title, body copy, image.
 *
 * Two variants:
 *  - `pinned`  — absolutely stacked inside the sticky viewport; opacity/translate
 *                are driven directly off the parent's scroll progress, so the
 *                transition costs zero React renders.
 *  - `stacked` — mobile / reduced-motion. Plain document flow, no scroll
 *                coupling; entrance is the site's standard in-view Reveal.
 *
 * Hooks are called unconditionally in both variants (rules of hooks); the
 * `stacked` variant simply doesn't bind the resulting motion values.
 *
 * NOTE: the stacked variant used to have NO entrance animation at all. Every
 * per-element style below is gated on `isPinned`, and nothing else animated it,
 * so on a phone — where the pin is dropped — Services and Process (the two
 * largest homepage sections) rendered as flat static content while every other
 * section revealed on scroll. The `Reveal` wrappers below are what close that
 * gap; they are inert on desktop, where the scroll-linked transforms still own
 * the motion entirely.
 */
export function ScrollStoryItem({
  item,
  index,
  total,
  progress,
  isActive = false,
  variant = 'pinned',
  reduced = false,
  leadFraction = 0.22,
}) {
  // Each item owns an equal slice of the pinned scroll distance. Content fades
  // in at the head of its slice and out at the tail, leaving a long static hold
  // in the middle so the step is readable rather than strobing past.
  //
  // `leadFraction` is supplied by the parent as (transition distance / chapter
  // distance), NOT a fixed fraction — so lengthening a chapter lengthens only
  // the hold, while the cross-fade keeps costing the same amount of scroll and
  // therefore feels identically paced.
  const seg = 1 / Math.max(total, 1);
  const start = index * seg;
  const end = start + seg;
  const lead = seg * leadFraction;

  /**
   * (A) Stagger. Title, description and chips no longer share one transform —
   * each entrance is pushed slightly later so the eye lands on the title first
   * and the block assembles instead of arriving as a slab. The offset is a
   * fraction of the fade window, not a fixed time, so it scales with whatever
   * `chapterVh` a section uses. Exit timing is deliberately NOT staggered:
   * content leaves together, which reads as decisive rather than draggy.
   */
  const stagger = lead * 0.4;
  const win = (offset) => [
    start - lead + offset,
    start + lead + offset,
    end - lead,
    end + lead,
  ];
  const FADE = [0, 1, 1, 0];
  const RISE = [20, 0, 0, -20];

  const titleOpacity = useTransform(progress, win(0), FADE);
  const titleY = useTransform(progress, win(0), RISE);
  const descOpacity = useTransform(progress, win(stagger), FADE);
  const descY = useTransform(progress, win(stagger), RISE);
  const metaOpacity = useTransform(progress, win(stagger * 2), FADE);
  const metaY = useTransform(progress, win(stagger * 2), RISE);
  const imageOpacity = useTransform(progress, win(0), FADE);

  // Image settles from a slight overscale across the whole slice — slow, no zoom.
  const imageScale = useTransform(progress, [start - lead, end + lead], [1.05, 1]);
  /**
   * (B) Counter-directional drift. The copy travels +20 → −20 (down to up); the
   * image runs the opposite way, so the two planes separate as the chapter
   * passes. Cheaper than real parallax and reads as depth rather than motion.
   */
  const imageY = useTransform(progress, [start - lead, end + lead], [-14, 14]);

  const isPinned = variant === 'pinned';

  /**
   * Stacked entrance. `Reveal` is used rather than a hand-rolled `whileInView`
   * so this inherits the site's existing reveal contract wholesale: the shared
   * `fadeRise` variant, `viewportOnce` (`amount: 'some'`, which is what makes
   * tall single-column mobile blocks fire reliably), and — importantly — the
   * `useRevealFallback` safety net that forces content visible if the
   * IntersectionObserver never fires. Rolling our own would have re-introduced
   * the exact "stuck at opacity 0" risk that component exists to prevent.
   *
   * Under reduced motion the wrapper is dropped entirely rather than being fed
   * a zero duration: `Reveal` animates from `hidden`, and its reduced-motion
   * path still tweens y:24 -> 0. Rendering plain elements is the honest
   * no-motion result, and matches how the pinned branch already collapses to a
   * bare cross-fade for these users.
   */
  const animateStacked = !isPinned && !reduced;
  const CopyWrap = animateStacked ? Reveal : 'div';
  const MediaWrap = animateStacked ? Reveal : motion.div;
  // `delay` is a no-op if Framer resolves the variant's own transition first;
  // either way both blocks still reveal, so this is a nicety, not a dependency.
  const mediaMotionProps = animateStacked
    ? { delay: 0.1 }
    : {
        style: !isPinned
          ? undefined
          : reduced
            ? { opacity: imageOpacity }
            : { opacity: imageOpacity, scale: imageScale, y: imageY },
      };
  /**
   * Per-element style. The wrapper no longer animates — each child owns its own
   * transform so they can be staggered. Under reduced motion the stagger and all
   * translation are dropped: every element shares the title's plain cross-fade.
   */
  const styleFor = (opacity, y) => {
    if (!isPinned) return undefined;
    if (reduced) return { opacity: titleOpacity };
    return { opacity, y };
  };

  return (
    <div
      className={cn(
        isPinned
          ? // Stacked in the same grid cell so items cross-fade in place.
            'col-start-1 row-start-1 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16'
          : 'grid w-full grid-cols-1 items-center gap-8',
        // Inactive chapters stay in the DOM (and readable by assistive tech) but
        // must never intercept a pointer.
        isPinned && !isActive && 'pointer-events-none',
      )}
    >
      {/* Copy — one flex column so label → title → description share a single
          left edge and one consistent gap token, instead of three ad-hoc margins
          that drifted out of rhythm. `min-w-0` stops long words forcing the
          grid column wider than its track. */}
      <CopyWrap className="flex min-w-0 max-w-xl flex-col justify-center gap-4">
        <motion.p
          style={styleFor(titleOpacity, titleY)}
          className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent"
        >
          {String(index + 1).padStart(2, '0')}
          {item.label ? ` / ${item.label}` : ''}
        </motion.p>

        {/* h3, not h2: the section already owns an h2, and two headings at the
            same optical size gave the block no hierarchy. */}
        <motion.h3
          style={styleFor(titleOpacity, titleY)}
          className="font-display text-h3 text-text-strong"
        >
          {item.title}
        </motion.h3>

        {item.description && (
          <motion.p
            style={styleFor(descOpacity, descY)}
            className="text-lead text-muted"
          >
            {item.description}
          </motion.p>
        )}

        {item.meta?.length > 0 && (
          <motion.ul
            style={styleFor(metaOpacity, metaY)}
            className="mt-2 flex flex-wrap gap-2"
          >
            {item.meta.map((m) => (
              <li
                key={m}
                className="rounded-pill border border-[var(--chip-border)] bg-[var(--chip-bg)] px-3 py-1 text-caption font-medium tracking-[0.02em] [color:var(--chip-text)]"
              >
                {m}
              </li>
            ))}
          </motion.ul>
        )}
      </CopyWrap>

      {/* Media. The box is 3:2 because every source asset is 1536x1024 (3:2) —
          the container ratio matches the image ratio exactly, so `object-cover`
          fills the frame while cropping nothing. `contain` would have been the
          alternative but would letterbox for no benefit once the ratios agree.
          Height is governed purely by column width — capping it with `max-h`
          would break the ratio and start cropping again on short viewports. */}
      {item.image && (
        <MediaWrap
          {...mediaMotionProps}
          // Token-driven border/ground rather than white-alpha, so the frame
          // reads correctly in both the dark panel and the light variant.
          className="relative aspect-[3/2] w-full max-w-[36rem] overflow-hidden rounded-lg border border-border bg-[var(--surface-raised)] lg:justify-self-end"
        >
          <Image
            src={item.image}
            alt={item.imageAlt ?? ''}
            fill
            sizes="(max-width: 1023px) 100vw, 45vw"
            className="object-cover"
            // Only the first chapter is worth eager-loading; the rest arrive as
            // the story is scrolled, per the spec's "avoid loading many huge
            // images at once".
            priority={index === 0}
            loading={index === 0 ? undefined : 'lazy'}
          />
        </MediaWrap>
      )}
    </div>
  );
}
