import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from '@/components/ui/Parallax';
import { siteConfig } from '@/config/site';
import { founderParagraphs } from '@/content/about';

/**
 * 04 — The Founder. The page's visual anchor.
 *
 * THE CROP IS MEASURED, NOT CHOSEN BY EYE.
 * The source is 864x1821 — a ~1:2.11 full-length standing portrait. Letting that
 * ratio drive the layout would make the image column roughly twice the height of
 * its width and tower over the copy. Landmarks measured off the asset: head top
 * ~8% of height, eyes ~17%, shoulders ~31%, hands ~73%.
 *
 * In a 4:5 box, `object-cover` matches the WIDTH (the source is proportionally
 * far taller), so the visible window is 1.25w / 2.11w = 59.3% of the source
 * height. `object-position: 50% 15%` places the top of that window at
 * 0.15 x (1 - 0.593) = 6.1% — just above the head — and its bottom at ~65.4%,
 * below the hands. That is a true three-quarter editorial crop: headroom kept,
 * empty grass at the base discarded.
 *
 * ROLE: "Founder & Full-Stack Developer" is passed as a literal, NOT read from
 * `siteConfig.brand.role`. That config value is "Full-Stack MERN Developer" — a
 * personal engineering title that pulls against company positioning in the one
 * section meant to establish authority. The name still comes from config.
 */
const FOUNDER_ROLE = 'Founder & Full-Stack Developer';

export function Founder() {
  return (
    <Section
      id="founder"
      // Dark contrast block, opted into per the design system. Everything inside
      // is token-driven, so it inverts automatically.
      className="theme-dark bg-bg"
      eyebrow="04 — The Person Behind Avenix"
    >
      {/* Image first in the DOM so mobile gets image -> text with no ordering
          utilities; `lg:` restores the two-column composition. This is a
          re-ordered stack, not a shrunk grid. */}
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Parallax distance={24} innerClassName="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border-strong bg-surface shadow-lg">
              <Image
                src="/images/abdullah-khan.webp"
                alt={`${siteConfig.brand.founder}, founder of ${siteConfig.brand.name}`}
                fill
                // Image column is ~45vw from lg, full width below it.
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover object-[50%_15%] [filter:saturate(0.9)_contrast(1.03)]"
              />
            </div>
          </Parallax>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-h2 text-text-strong text-balance">
            Someone has to be responsible for the result.
          </h2>

          <div className="measure mt-6 flex flex-col gap-4 text-body text-text-muted">
            {founderParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          {/* Attribution sits AFTER the argument deliberately: the section is
              about the thinking, and the name is the signature on it rather
              than the headline above it. */}
          <div className="mt-8 border-t border-border pt-6">
            <p className="font-display text-h4 text-text-strong">
              {siteConfig.brand.founder}
            </p>
            <p className="mt-1 font-mono text-caption uppercase tracking-[0.18em] text-accent">
              {FOUNDER_ROLE}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
