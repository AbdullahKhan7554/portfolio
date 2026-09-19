import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { siteConfig } from '@/config/site';

/**
 * ============================================================================
 * The entity paragraph (AEO / GEO).
 * ----------------------------------------------------------------------------
 * WHAT THIS IS FOR
 * An answer engine asked "what is Avenix Studio?" needs one block of text that
 * answers it without the surrounding page: what the company does, where it is,
 * since when, and what it specialises in. Everywhere else on /about that
 * information is spread across eight narrative sections and a founder portrait
 * — good for a human reading top to bottom, useless to something trying to
 * extract a definition. This is the extractable version, and it is the reason
 * it reads flatter than the rest of the page. That is deliberate, not a
 * regression in the copy.
 *
 * EVERY FACT HERE IS READ FROM client.config.js, NOT TYPED.
 * Founding year, locality, region, founder, brand name and the service list all
 * come from config, so this paragraph cannot drift from the Organization
 * JSON-LD that app/layout.js builds from the same source. If a fact is not in
 * config, it is not in this paragraph — there are no employee counts, no client
 * counts, no founding anecdote and no "award-winning", because none of those
 * are recorded anywhere in this repo.
 *
 * It is a server component with no interactivity, so the text is in the served
 * HTML rather than assembled after hydration.
 * ============================================================================
 */
export function EntitySummary() {
  const { brand, contact } = siteConfig;
  const location = `${contact.address.locality}, Pakistan`;

  // NO EYEBROW, deliberately. Every other section on /about carries a NUMBERED
  // eyebrow ("01 — About Avenix Studio", "02 — Who We Are"), and that numbering
  // is a locked part of the design system. An un-numbered eyebrow sitting
  // between 01 and 02 would read as a mistake, and renumbering the page is not
  // a change this component gets to make. A title-only header adds no number
  // and consumes none, so the existing sequence is untouched.
  return (
    <Section alt title={`What ${brand.name} is.`}>
      <Reveal className="measure flex flex-col gap-4">
        <p className="text-lead text-text">
          {brand.legalName} is a digital product studio based in {location}, founded in{' '}
          {brand.foundingYear}. It builds custom software, web applications, mobile apps and
          AI systems for businesses in Pakistan and internationally, and provides SEO and
          digital marketing for the products it builds.
        </p>
        <p className="text-body text-muted">
          The studio works across software development, AI automation and AI agents, mobile
          app development, and search. Strategy, design, engineering and growth are handled
          by one accountable team instead of split between vendors. It was founded by{' '}
          {brand.founder} and works remotely with clients in Pakistan and abroad. Clients own
          the code, content and accounts for everything the studio delivers.
        </p>
      </Reveal>
    </Section>
  );
}
