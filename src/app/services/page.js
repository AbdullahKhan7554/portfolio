import { PageHeader } from '@/components/ui/PageHeader';
import { Services } from '@/components/sections/Services';
import { FAQ } from '@/components/sections/FAQ';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { engagementSteps } from '@/content/process';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, servicesSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Transparent web development packages from Avenix Studio — from high-converting landing pages to full-stack MERN applications. Fixed quotes, clear timelines.',
  path: '/services',
});

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
        eyebrow="Services"
        title="Web that works as hard as you do."
        intro="Every engagement is scoped around a real business outcome — with a transparent process and a fixed quote before any work begins."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <Services />

      <Section
        eyebrow="How we'll work together"
        title="A simple, predictable journey."
        alt
      >
        <RevealGroup className="grid gap-5 md:grid-cols-5" stagger={0.08}>
          {engagementSteps.map((step, i) => (
            <RevealItem
              key={step.id}
              className="rounded-lg border border-border bg-surface p-5"
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
            Tell me about your project and I&rsquo;ll recommend the right scope — no
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
