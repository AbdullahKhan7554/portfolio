import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { perfCommitments } from '@/content/whyMe';
import { trackRecord } from '@/content/about';

/**
 * 09 — Client Success / Trust.
 *
 * WHAT IS AND IS NOT CLAIMED HERE, precisely:
 *  - `trackRecord` states scope of work to date. Both figures are corroborated
 *    in-repo (16 entries in content/caseStudies.js, 9 in data/clients.js) and
 *    are framed as what Avenix has built, never as outcomes clients achieved.
 *  - `perfCommitments` are presented as STANDARDS HELD — the wording below says
 *    "we hold ourselves to", not "our clients achieved". They are engineering
 *    targets in the repo, and inflating them into client results would be
 *    fabrication.
 *  - "100% Client Satisfaction" is deliberately absent. It remains untouched on
 *    the homepage; on a page whose entire job is earning trust through
 *    substance, an unauditable percentage argues against itself.
 *
 * Hairline stat rows rather than filled cards, so the numbers read as a record
 * rather than as marketing furniture.
 */
export function TrustStandard() {
  return (
    <Section id="trust" alt eyebrow="09 — Standards">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-h2 text-text-strong text-balance">
            We measure the work by what it lets you do next.
          </h2>
          <p className="measure mt-5 text-lead text-text-muted">
            A finished project is not the outcome. The outcome is a business that
            can move faster afterwards — a stronger foundation to build on, systems
            that hold, and a product its customers do not have to think about.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
            {trackRecord.map((item) => (
              <div key={item.id}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="font-display text-h3 text-text-strong">
                    {item.value}
                  </span>
                  <span className="mt-1 block font-mono text-caption uppercase tracking-[0.14em] text-text-faint">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">
            Standards we hold ourselves to
          </p>
          <RevealGroup className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6" stagger={0.06}>
            {perfCommitments.map((metric) => (
              <RevealItem key={metric.label} className="border-t border-border pt-4">
                <p className="font-display text-h4 text-text-strong">
                  <Counter
                    value={metric.value}
                    decimals={metric.decimals ?? 0}
                    prefix={metric.prefix ?? ''}
                    suffix={metric.suffix ?? ''}
                  />
                </p>
                <p className="mt-1 text-caption text-text-muted">{metric.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </Section>
  );
}
