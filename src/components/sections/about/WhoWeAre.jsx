import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { disciplines } from '@/content/about';

/**
 * 02 — Who We Are.
 *
 * The five disciplines are rendered as a definition list of running prose, NOT
 * as five icon cards. The brief is explicit about that, and the card version
 * also flattens the argument: cards imply five separate services you can buy
 * individually, which is the exact positioning this section exists to reject.
 * A list where the discipline is the only accented word keeps them legible when
 * skimmed while the sentence still reads as one continuous idea.
 */
export function WhoWeAre() {
  return (
    <Section id="who-we-are" eyebrow="02 — Who We Are">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-h2 text-text-strong text-balance">
            Five disciplines. One process.
          </h2>
          <p className="measure mt-5 text-lead text-text-muted">
            Avenix Studio is not a web development company that also does design.
            Strategy, design, engineering, AI and growth are run as a single
            practice, because the gaps between them are where most digital
            projects quietly lose their value.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="flex flex-col">
            {disciplines.map((d) => (
              <div
                key={d.id}
                // Hairline rows rather than bordered boxes — the rule belongs to
                // the rhythm of the list, not to each item as a container.
                className="border-t border-border py-5 first:border-t-0 first:pt-0"
              >
                <dt className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">
                  {d.name}
                </dt>
                <dd className="mt-2 text-body text-text-muted">{d.clause}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
