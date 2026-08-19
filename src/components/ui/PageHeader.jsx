import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Inner-page hero band. Includes top padding to clear the fixed header and an
 * optional breadcrumb trail.
 *
 * IMAGE SUPPORT IS PURELY ADDITIVE (Phase 4A).
 * Nine routes render this component. Passing no `hero` leaves every one of them
 * rendering the same markup, classes and ground as before. That was the
 * constraint: extend the existing abstraction rather than introduce a second
 * hero system, and make the extension impossible to trip over by accident.
 *
 * When `hero` IS supplied the band becomes a dark cinematic panel:
 *   - `theme-dark` is applied by the component, not left to the caller. An image
 *     header without it would put --text-strong ink (near-black on the light
 *     palette) over a near-black photograph. Making contrast a caller
 *     responsibility is how that ships broken, so the component owns it.
 *   - A two-axis scrim sits between image and copy. The horizontal pass darkens
 *     the left, where the copy sits; the vertical pass anchors the top (under
 *     the floating navbar) and the bottom (into the next section). Both are
 *     built from --bg plus neutral alpha blacks, so they follow the token layer
 *     instead of hardcoding a hex.
 *   - A min-height in svh gives the art room to read as art, for the same reason
 *     the homepage hero uses svh: mobile browser chrome must not overshoot it.
 *
 * FULL-VIEWPORT MODEL (Phase 4D).
 * `fullScreen` defaults to `hasImage`, so an image hero fills the first screen
 * the way the homepage hero does. `min-height`, never `height`: the copy block
 * can outgrow a short landscape viewport, and a fixed height would clip it.
 * `svh` for the same reason it is used on the homepage — `vh` overshoots by the
 * mobile URL bar and pushes the next section below a fold it was measured to
 * meet, and `dvh` would re-flow the band mid-scroll as that bar retracts, which
 * is motion nobody asked for.
 *
 * A route can pass `fullScreen` explicitly in either direction. /contact uses
 * `fullScreen` WITHOUT a hero to get the viewport model on a type-led band; the
 * five other type-led consumers (/about, /free-audit,
 * /website-development-pakistan, /blog/[slug], /work/[slug]) pass neither and
 * are byte-identical to what shipped before.
 *
 * WHY THE BOTTOM PADDING CHANGES WITH THE MODEL
 * At 46svh the band was shorter than the viewport, so `pb-12` read as the gap
 * between the hero copy and whatever followed. At 100svh that padding is inside
 * the first screen — it is what lifts the copy off the bottom edge — so it no
 * longer separates anything. The separation moved to the FOLLOWING section,
 * which now carries its own top padding on the routes that lacked one. That is
 * the structural fix; there are no negative margins anywhere in this system.
 *
 * LAYERING: no negative z-index anywhere. The image and scrim are absolutely
 * positioned and the copy is `relative`, so DOM order alone stacks them. The
 * alternative — negative-z children under a section that paints its own
 * background — is the exact trap Hero.jsx needs `isolate` to work around, and
 * not creating it is cheaper than compensating for it.
 *
 * `pt-32 md:pt-40` (128px / 160px, stock Tailwind — 32 and 40 are not on the
 * remapped scale) is deliberately unchanged: it already clears the floating
 * navbar on inner pages, where the pill is always visible — 128 against an 80px
 * mobile pill bottom, 160 against a 104px desktop one.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
  className,
  /** Entry from src/content/pageHeroes.js, or null/undefined for a type-led band. */
  hero,
  /**
   * Fill the first screen. Defaults to `hasImage` — art gets the full viewport,
   * type-led bands keep the compact rhythm — and can be forced either way.
   */
  fullScreen,
}) {
  const hasImage = Boolean(hero?.src);
  const isFullScreen = fullScreen ?? hasImage;

  return (
    <header
      className={cn(
        // `pt-32 md:pt-40` (128px/160px — stock Tailwind; 32 and 40 are not on
        // the remapped scale) is deliberately unchanged from Phase 4A. It clears
        // the floating navbar on inner pages, where the pill is always visible:
        // 128 against an 80px mobile pill bottom, 160 against a 104px desktop
        // one. Under `items-end` it is a floor rather than an offset — it only
        // engages once the copy grows tall enough to reach the navbar.
        // `isolate` is load-bearing, not decoration (Phase 4E).
        //
        // The type-led branch below paints its glow with `-z-10`. A positioned
        // element with a negative z-index forms its own stacking context and is
        // painted in step 2 of the nearest ANCESTOR stacking context — and this
        // header, being `position: relative` with `z-index: auto`, was not one.
        // So the glow was hoisted to the root context and painted before the
        // header, whose own background then covered it. On routes that pass no
        // background the header is transparent and nothing was visibly wrong,
        // which is why this survived: it only bites where a ground is painted.
        // `theme-dark bg-bg` does paint one, so on /contact and /about the glow
        // was rendering into a layer nobody could see.
        //
        // `isolation: isolate` makes the header the stacking context, so its own
        // background paints at step 1 and the negative-z glow at step 2 — above
        // the ground, still below the copy. Same fix, same word, same reason as
        // Hero.jsx, which the LAYERING note above already points at.
        'isolate relative overflow-hidden pt-32 md:pt-40',
        hasImage && 'theme-dark bg-bg',
        isFullScreen
          ? // Bottom padding scales with the viewport instead of stepping at a
            // breakpoint, so the copy sits at a consistent optical height rather
            // than a consistent pixel one: ~101px at 844, ~130px at 1080, capped
            // at 160px. Bounds are --space tokens; only the middle term is
            // viewport-relative. The 64px floor also clears the iOS home
            // indicator (34px) without a second safe-area expression.
            'flex min-h-[100svh] items-end pb-[clamp(var(--space-10),12svh,var(--space-20))]'
          : hasImage
            ? 'flex min-h-[46svh] items-end pb-12 md:min-h-[54svh] md:pb-16'
            : 'pb-12 md:pb-16',
        className,
      )}
    >
      {hasImage ? (
        <>
          {/* `fill` already absolutely positions this to the header's inset. */}
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            // Full-bleed at every breakpoint, so the slot is always viewport
            // width.
            sizes="100vw"
            quality={80}
            // `eager` rather than the `lazy` default, which would be an LCP
            // anti-pattern on something this far above the fold.
            //
            // CORRECTION (Phase 4D, verified against the served HTML): the
            // original note here claimed `eager` "preloads nothing", and that is
            // not true of this Next version. `loading="eager"` emits a
            // <link rel="preload" as="image"> exactly as `priority` would — the
            // difference between the two is fetchPriority, not the preload. So
            // the contention with the self-hosted fonts that the note was trying
            // to avoid does exist, and it now exists on three routes rather than
            // two.
            //
            // Left as-is deliberately: STEP 12 forbids changing the loading
            // strategy without a measurable reason, and no Lighthouse or LCP
            // trace was available here. This is the note to act on when one is.
            loading="eager"
            className={cn('object-cover', hero.focalClass)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                'linear-gradient(90deg, var(--bg) 0%, hsl(0 0% 0% / 0.62) 48%, hsl(0 0% 0% / 0.32) 100%)',
                'linear-gradient(180deg, hsl(0 0% 0% / 0.58) 0%, hsl(0 0% 0% / 0.12) 42%, hsl(0 0% 0% / 0.55) 100%)',
              ].join(','),
            }}
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'var(--gradient-hero-glow)' }}
        />
      )}

      {/* `w-full` is load-bearing whenever the header is a flex container: a
          flex item shrink-wraps its content, so without it the container's
          max-width and gutters stop governing and the copy re-flows. `relative`
          keeps it above the absolutely-positioned image and scrim by DOM order
          alone — no z-index. */}
      <div className={cn('container-page', (hasImage || isFullScreen) && 'relative w-full')}>
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-caption text-muted">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 && <span className="text-faint">/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={crumb.path} className="transition-colors hover:text-accent">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-text-strong">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal className="flex max-w-3xl flex-col gap-5">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h1 className="text-h1 text-balance">{title}</h1>}
          {intro && <p className="measure text-lead text-muted">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
