import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { principles } from '@/content/about';

/**
 * 08 — Principles. The page's second dark anchor.
 *
 * Distinct from the deleted homepage "AI-Assisted, Human-Owned" section by
 * design: that argued a position about AI workflow, this states company values,
 * and only one of the six ("Human Judgment") touches AI at all.
 *
 * Hairline grid, no filled cards. On a near-black ground, six raised surfaces
 * would read as a dashboard; borders alone keep it editorial and let the amber
 * index numerals do the structural work.
 */
export function Principles() {
  return (
    <Section
      id="principles"
      className="theme-dark bg-bg"
      eyebrow="08 — Principles"
    >
      <Reveal>
        <h2 className="font-display text-h2 text-text-strong text-balance">
          What we hold to.
        </h2>
      </Reveal>

      <RevealGroup
        className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {principles.map((principle, i) => (
          <RevealItem key={principle.id} className="border-t border-border pt-5">
            <span
              aria-hidden="true"
              className="font-mono text-eyebrow tracking-[0.18em] text-accent"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 font-display text-h4 text-text-strong">
              {principle.title}
            </h3>
            <p className="mt-2 text-body-sm text-text-muted">
              {principle.description}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
