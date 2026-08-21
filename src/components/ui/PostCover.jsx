import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Full-bleed banner above a blog post's title.
 *
 * WHY THIS IS NOT `PageHeader`'s `hero` PROP
 * That prop exists and does render a full-width image — but it overlays the H1
 * on the photograph behind a two-axis scrim and flips the band to `theme-dark`.
 * These covers already carry the post title as baked-in typography, so the H1
 * would land on top of a headline that is already in the frame, in a different
 * typeface, at a different size. The art is the header's SUBJECT here, not its
 * ground, so it gets its own band and the title stays on the light canvas below.
 *
 * ASPECT RATIO IS PER-BREAKPOINT BECAUSE THE ART IS COMPOSED, NOT A TEXTURE.
 * The sources are 3:2 (1536x1024) with their type set roughly 20%-52% down the
 * frame. Rendering 3:2 full-bleed on desktop would make the banner 1280px tall
 * at 1920 wide and push the title clean off the first screen. `2/1` on `md:` up
 * crops 25% of the height — 12.5% from each edge — which stays clear of the 20%
 * mark where the type starts. Mobile keeps the native 3:2, where a full-bleed
 * band is only ~260px tall and nothing needs cropping at all. Anything wider
 * than 2:1 (21:9 crops 36%) starts eating the headline, so this is a ceiling
 * rather than a preference.
 *
 * NO `Reveal` WRAPPER, DELIBERATELY. This is the LCP element on the routes that
 * use it; starting it at opacity 0 and waiting on an IntersectionObserver would
 * delay the largest paint to animate something that is already on screen at
 * mount. `PageHeader` renders its own hero <Image> unwrapped for the same
 * reason — the reveal treatment starts below the fold.
 *
 * `priority` (not the `loading="eager"` that PageHeader documents at length):
 * these routes have no competing image hero, so this is unambiguously the LCP
 * candidate and wants the high fetchPriority as well as the preload.
 */
export function PostCover({ cover, className }) {
  if (!cover?.src) return null;

  return (
    // `pt-32 md:pt-40` is lifted verbatim from PageHeader, which is now rendered
    // BELOW this band with its own top padding zeroed out. The floating navbar
    // still has to be cleared by whatever comes first in <main>, and these are
    // the values already measured against it (128px against an 80px mobile pill
    // bottom, 160px against a 104px desktop one).
    <div className={cn('pt-32 md:pt-40', className)}>
      {/* The hairline is load-bearing on this palette: the covers have near-white
          backgrounds and the page canvas is #FFFFFF, so without it the top and
          bottom edges of the art dissolve into the page. `bg-surface-raised`
          holds the box's ground while the image decodes so the band does not
          flash white at full height. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border bg-surface-raised md:aspect-[2/1]">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="100vw"
          quality={80}
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
