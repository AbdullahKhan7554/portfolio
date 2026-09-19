import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Tag } from '@/components/ui/Badge';
import { siteConfig } from '@/config/site';
import { getCaseStudy } from '@/content/caseStudies';
import { getServicePage, SERVICE_CTA } from '@/data/servicePages';
import {
  serviceSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from '@/lib/schema';

/**
 * ============================================================================
 * Shared renderer for the four /services/<slug> routes.
 * ----------------------------------------------------------------------------
 * A SERVER COMPONENT, deliberately — no 'use client'. Everything that search
 * engines and answer engines read (the copy, the FAQ answers and all three
 * JSON-LD blocks) is therefore in the server HTML rather than assembled after
 * hydration.
 *
 * WHY THE JSON-LD LIVES HERE AND NOT IN EACH page.js
 * The repo's convention is schema-at-the-top-of-the-route, and that is right for
 * pages with bespoke schema. These four are structurally identical, so the same
 * three blocks would be copy-pasted four times and could silently diverge — or
 * be forgotten entirely when a fifth service route is added. Emitting them from
 * the component that renders the content means a route cannot exist without its
 * structured data. The route files stay thin on purpose.
 *
 * WHY <details> AND NOT <Accordion>
 * ui/Accordion.jsx renders `{isOpen && <panel>}`, so with its default only ONE
 * answer is in the DOM at a time and the rest never reach the server HTML. For
 * a marketing page that is a fine interaction; for a page whose FAQ exists to be
 * quoted by answer engines it removes the content being optimised for. Native
 * <details> keeps every answer in the served markup, collapsed but present, with
 * no JavaScript and no accessibility work to redo. The FAQPage JSON-LD carries
 * the same answers for machine consumers — the two can never disagree because
 * both read `page.faqs`.
 *
 * Styling uses existing semantic-token utilities only; no new colour, no new
 * art, nothing added to the token layer.
 * ============================================================================
 */
export function ServiceDetail({ slug }) {
  const page = getServicePage(slug);
  // A route file passing an unknown slug is a build-time authoring mistake, and
  // silently rendering an empty page would hide it. Better to fail loudly.
  if (!page) {
    throw new Error(
      `ServiceDetail: no entry for slug "${slug}" in src/data/servicePages.js`,
    );
  }

  const path = `/services/${page.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: page.eyebrow, path },
  ];

  // Resolved against the real case-study data, then filtered: a slug that stops
  // existing drops out of the grid instead of rendering a card that 404s.
  const studies = page.caseStudies.slugs.map(getCaseStudy).filter(Boolean);
  const related = page.related
    .map((s) => getServicePage(s))
    .filter(Boolean)
    .map((s) => ({ href: `/services/${s.slug}`, label: s.h1, eyebrow: s.eyebrow }));

  return (
    <main id="main">
      {/* Structured data — server-rendered, three blocks, no overlap with the
          Organization/Person/WebSite nodes already injected by app/layout.js. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({
            name: page.h1,
            description: page.metaDescription,
            path,
            serviceType: page.serviceType,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(page.faqs))}
      />

      <PageHeader eyebrow={page.eyebrow} title={page.h1} intro={page.intro} breadcrumbs={crumbs} />

      {/* ---- Answer-first summary (AEO) -------------------------------------
          One self-contained paragraph that answers "what is this service and
          who provides it" without depending on anything above or below it, so
          an answer engine can lift it whole. */}
      <Section className="pt-0">
        <Reveal>
          <p className="measure text-lead text-text">{page.lede}</p>
        </Reveal>
      </Section>

      {/* ---- What we offer --------------------------------------------------- */}
      <Section
        alt
        eyebrow="What we offer"
        title={`Where ${siteConfig.brand.name} comes in.`}
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {page.offerings.map((o) => (
            <RevealItem key={o.title} className="card-premium p-6">
              <h3 className="font-display text-h4 text-text-strong">{o.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{o.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ---- Process --------------------------------------------------------- */}
      <Section eyebrow="How we work" title="The process, step by step.">
        <RevealGroup className="grid gap-5 md:grid-cols-5" stagger={0.08}>
          {page.process.map((step, i) => (
            <RevealItem key={step.title} className="card-premium p-5">
              <span className="font-mono text-eyebrow text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-h4 text-text-strong">{step.title}</h3>
              <p className="mt-1 text-body-sm text-muted">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ---- Tech stack ------------------------------------------------------ */}
      <Section alt eyebrow="Tech stack" title="What we build it with.">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {page.stack.map((group) => (
            <RevealItem key={group.label} className="card-premium p-6">
              <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                {group.label}
              </span>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ---- Related work ----------------------------------------------------
          Real case studies from src/content/caseStudies.js only. `note` is the
          honest framing for the two services with no published case study of
          their own — it says so rather than letting adjacent cards imply it. */}
      {studies.length > 0 && (
        <Section eyebrow="Related work" title="Recent builds." intro={page.caseStudies.note}>
          <RevealGroup className="grid gap-5 md:grid-cols-3" stagger={0.08}>
            {studies.map((study) => (
              <RevealItem key={study.slug}>
                <Link
                  href={`/work/${study.slug}`}
                  className="card-premium group flex h-full flex-col p-6 transition-transform duration-base ease-out-quad hover:-translate-y-1"
                >
                  <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                    {study.niche}
                  </span>
                  <h3 className="mt-3 font-display text-h4 text-text-strong">{study.title}</h3>
                  <p className="mt-2 text-body-sm text-muted">{study.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-body-sm text-text-strong">
                    Read the case study
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-base ease-out-quad group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* ---- FAQ ------------------------------------------------------------- */}
      <Section
        alt
        id="faq"
        eyebrow="Questions"
        title="Straight answers."
        intro="The questions we are asked most about this service, answered directly so you can decide before you call."
      >
        <div className="max-w-3xl divide-y divide-border border-y border-border">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-h4 text-text transition-colors duration-fast hover:text-text-strong">
                <h3 className="m-0 font-display text-h4">{faq.question}</h3>
                {/* Token-driven plus/minus built from borders — no new asset. */}
                <span
                  aria-hidden="true"
                  className="relative h-5 w-5 shrink-0 text-accent transition-transform duration-base ease-out-quad group-open:rotate-45"
                >
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                </span>
              </summary>
              <p className="measure mt-3 text-body text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ---- Related services (internal linking) ----------------------------- */}
      {related.length > 0 && (
        <Section eyebrow="Other services" title="What else we do." className="pb-0">
          <RevealGroup className="grid gap-4 sm:grid-cols-3" stagger={0.06}>
            {related.map((r) => (
              <RevealItem key={r.href}>
                <Link
                  href={r.href}
                  className="card-premium group flex h-full items-center justify-between gap-4 p-5"
                >
                  <span className="font-display text-h4 text-text-strong">{r.label}</span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-accent transition-transform duration-base ease-out-quad group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* ---- CTA -------------------------------------------------------------- */}
      <Section>
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border-strong bg-surface p-10 text-center">
          <h2 className="text-h2">{SERVICE_CTA.title}</h2>
          <p className="measure text-lead text-muted">{SERVICE_CTA.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/contact" size="lg" magnetic>
              Get a quote
            </Button>
            <WhatsAppButton source={`service-${page.slug}`} size="lg" />
          </div>
        </div>
      </Section>
    </main>
  );
}
