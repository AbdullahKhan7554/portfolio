import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Services } from '@/components/sections/Services';
import { FAQ } from '@/components/sections/FAQ';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { engagementSteps } from '@/content/process';
import { getServiceSummaries } from '@/data/servicePages';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, servicesSchema, jsonLd } from '@/lib/schema';
import { getPageHero } from '@/content/pageHeroes';

/**
 * The hub title names the four things people actually search for, because
 * "Services — Avenix Studio" told a searcher nothing about what is sold here.
 * `absoluteTitle` for the same reason the four detail routes use it: the
 * services have to come before the brand, not after it.
 */
export const metadata = buildMetadata({
  absoluteTitle: 'Software, AI, Mobile App & SEO Services | Avenix Studio',
  description:
    'Avenix Studio services — custom software development, AI automation, mobile app development and SEO, delivered by one accountable team from Lahore, Pakistan.',
  path: '/services',
});

/** Dark image hero — see the note in app/about/page.js. #0A0A0B = --obsidian-950. */
export const viewport = { themeColor: '#0A0A0B' };

export default function ServicesPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(servicesSchema())}
      />
      <PageHeader
        hero={getPageHero('/services')}
        eyebrow="Services"
        title="Web that works as hard as you do."
        intro="Every engagement is scoped around a real business outcome. You see the process and a fixed quote before any work begins."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <Services />

      {/*
        THE HUB LINK GRID. /services previously described the catalogue and then
        dead-ended — every "service" on it was a card with nowhere to go, so the
        page had to rank for eight different intents by itself and ranked for
        none of them. These four links are the routes that each own one intent.

        Anchor text is the page's own H1, not "learn more": the anchor is the
        strongest internal signal about what the target page is for, and four
        identical "learn more" links describe nothing.

        Rendered from getServiceSummaries() rather than a literal list, so a new
        entry in src/data/servicePages.js appears here, in the sitemap and in
        the footer without three separate edits.
      */}
      <Section
        alt
        eyebrow="Explore in detail"
        title="Four services, four dedicated pages."
        intro="Each one covers what we do, how we work, the stack we build on, and the questions clients ask before they start."
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {getServiceSummaries().map((s) => (
            <RevealItem key={s.slug}>
              <Link
                href={s.href}
                className="card-premium group flex h-full flex-col p-6 transition-transform duration-base ease-out-quad hover:-translate-y-1"
              >
                <span className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                  {s.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-h3 text-text-strong">{s.title}</h3>
                <p className="mt-2 text-body-sm text-muted">{s.intro}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-body-sm text-text-strong">
                  Explore {s.eyebrow.toLowerCase()}
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

      <Section
        eyebrow="How we'll work together"
        title="A simple, predictable journey."
        alt
      >
        <RevealGroup className="grid gap-5 md:grid-cols-5" stagger={0.08}>
          {engagementSteps.map((step, i) => (
            <RevealItem
              key={step.id}
              className="card-premium p-5"
            >
              <span className="font-mono text-eyebrow text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-h4 text-text-strong">{step.title}</h3>
              <p className="mt-1 text-body-sm text-muted">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <FAQ />

      <Section className="pt-0">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border-strong bg-surface p-10 text-center">
          <h2 className="text-h2">Not sure which package fits?</h2>
          <p className="measure text-lead text-muted">
            Tell us about your project and we&rsquo;ll recommend the right scope — no
            pressure, no jargon.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
              size="lg"
              magnetic
            >
              Book a call
            </Button>
            <WhatsAppButton source="services-cta" size="lg" />
          </div>
        </div>
      </Section>
    </main>
  );
}
