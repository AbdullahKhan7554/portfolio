import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

/**
 * Brand lockup — `public/logo3.png`.
 *
 * The artwork already contains the "AVENIX STUDIO" wordmark, so no text
 * wordmark is rendered beside it.
 *
 * SIZING: intrinsic width/height are passed so the source's own aspect ratio
 * drives layout; height is fixed and width follows via `w-auto`. There is
 * deliberately NO transform-scale and NO `overflow-hidden` wrapper — an earlier
 * version scaled the image 2.16x inside a cropped box to hide the source's
 * transparent padding, and any rounding in that chain clipped the wordmark
 * horizontally. `object-contain` on an aspect-correct box cannot crop.
 *
 * THE PADDING IS TRIMMED IN THE ASSET, NOT IN CSS.
 * logo3.png is a 1254x1254 canvas whose artwork occupies only 785x587 of it —
 * measured, not estimated — i.e. 62.6% x 46.8%. Height classes size the BOX, so
 * 53% of every value went to transparent margin: at 44px the visible lockup was
 * 20.6px tall and the wordmark inside it barely 7px. That is the whole "logo is
 * too small" complaint, and no CSS height could fix it without also inflating
 * the empty margin.
 *
 * logo3-trimmed.png is logo3.png with that margin removed (sharp `trim`, so the
 * artwork is bit-identical — only the canvas changed). Same 44px box now renders
 * 44px of actual ink: 2.1x larger with no scaling, no clipping, and no
 * re-drawing of the mark. The original is untouched on disk.
 *
 * REMAINING LIMITATION: this is still a VERTICALLY STACKED lockup (mark over
 * wordmark), so in a 64px bar the "AVENIX" text is ~13px however it is sized.
 * Legible, not prominent. A horizontal lockup is the only real fix for that and
 * is a brand decision, not a layout one.
 *
 * Heights use keys 9 and 11 deliberately: the spacing scale is remapped in
 * tailwind.config.js, and the obvious-looking `h-10`/`h-12` resolve to 64px and
 * 96px, not 40px and 48px. Key 9 and 11 fall through to stock Tailwind.
 */
export function Logo({ className, compact = false }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} — home`}
      className={cn('group inline-flex items-center', className)}
    >
      <Image
        src="/logo3-trimmed.png"
        alt={siteConfig.brand.name}
        width={785}
        height={587}
        priority
        // Widest render is 44px x 1.337 ≈ 59px.
        sizes="(min-width: 768px) 60px, 48px"
        className={cn(
          'w-auto object-contain transition-opacity duration-base group-hover:opacity-85',
          // 36px in the 64px mobile pill / 44px in the 72px desktop pill —
          // 14px of breathing room above and below in both cases.
          compact ? 'h-[32px]' : 'h-9 md:h-11',
        )}
      />
    </Link>
  );
}
