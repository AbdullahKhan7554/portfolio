import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { WhyMe } from '@/components/sections/WhyMe';
import { Process } from '@/components/sections/Process';
import { ClientLogoStrip } from '@/components/sections/ClientLogoStrip';
import { TechStack } from '@/components/sections/TechStack';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { getServiceSummaries } from '@/data/servicePages';
import { buildMetadata } from '@/lib/seo';
import { professionalServiceSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({ path: '/' });

/**
 * Homepage-only chrome. This is the one route that opens on a full-bleed dark
 * hero (`.theme-dark`), so the layout's white `themeColor` put a white browser
 * bar directly above near-black. #0A0A0B is the hero's own ground
 * (--obsidian-950).
 *
 * Scoped here rather than on the root layout so /about, /services, /work,
 * /blog and /contact — which all open on a white PageHeader — keep white
 * chrome. Next merges viewport shallowly along the segment tree, so this
 * overrides ONLY themeColor; colorScheme, width and initialScale still come
 * from app/layout.js.
 */
export const viewport = { themeColor: '#0A0A0B' };

export default function HomePage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalServiceSchema())}
      />
      <Hero />
      <Services />

      {/*
        SERVICE LINK ROW — DELIBERATELY UN-NUMBERED.
        Section eyebrows on this page are hardcoded and numbered ("01 — Services",
        "02 — ..."), and that numbering is a locked part of the design system. So
        this block passes NO eyebrow: it carries a title only, which means it
        adds no number, consumes no number, and leaves every existing eyebrow
        exactly where it was. Reordering rules are untouched.

        It exists because the homepage is the site's strongest page and, before
        this, it linked to no service page at all — <Services /> is a scroll
        story with no outbound links. A row of descriptive anchors here is the
        cheapest real internal-linking improvement available.

        THREE COLUMNS, NOT FOUR. There are five service routes now, and five
        cards in a four-column grid leave one orphan on its own row. Three gives
        a 3+2 layout and wider cards, which the longer H1 anchors need.
      */}
      <Section title="Explore each service in detail.">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {getServiceSummaries().map((service) => (
            <RevealItem key={service.slug}>
              <Link
                href={service.href}
                className="card-premium group flex h-full flex-col justify-between gap-4 p-5 transition-transform duration-base ease-out-quad hover:-translate-y-1"
              >
                <span className="font-display text-h4 text-text-strong">{service.title}</span>
                <span className="inline-flex items-center gap-2 text-body-sm text-accent">
                  Learn more
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

      <WhyMe />
      <Process />
      <ClientLogoStrip />
      <TechStack />
      <PricingTeaser />
      <FAQ />
      <Contact />
    </main>
  );
}
