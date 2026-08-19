import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

/**
 * 03 — Why Avenix Exists.
 *
 * Deliberately the quietest block on the page: one statement at pull-quote
 * scale, one narrow column beneath it, wide margins either side. After the
 * two-column density of Who We Are, the restraint is what makes it read as
 * conviction rather than another content block.
 *
 * NO founding narrative. The repository contains exactly one historical fact —
 * `foundingYear: 2023` — so anything resembling an origin story would be
 * invented. This section is philosophy, which is honest and stronger anyway.
 */
export function WhyWeExist() {
  return (
    <Section id="why-we-exist" alt eyebrow="03 — Why We Exist">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-display text-h2 leading-[1.15] text-text-strong text-balance">
            Good design and serious engineering shouldn&rsquo;t be a trade-off.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="measure mt-6 flex flex-col gap-4 text-body text-text-muted">
            <p>
              The split is easy to recognise once you have seen it a few times.
              On one side, studios that produce something genuinely beautiful and
              then hand over a build that buckles the moment real traffic,
              real content, or a second developer arrives. On the other,
              engineering shops that ship something entirely stable which nobody
              particularly wants to use.
            </p>
            <p>
              Businesses end up choosing a side, then paying twice — once for the
              work, and again for whichever half was missing.
            </p>
            <p>
              Avenix exists in that gap. The same people who decide how a product
              should feel are the ones responsible for how it behaves under load,
              which removes the negotiation entirely. It is not a broader service
              list. It is a refusal to treat the two as separate problems.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
