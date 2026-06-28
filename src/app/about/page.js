import { PageHeader } from '@/components/ui/PageHeader';
import { About } from '@/components/sections/About';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { philosophyPillars } from '@/content/whyMe';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Avenix Studio is the digital practice of Abdullah Khan — a Full-Stack MERN developer building premium, high-performance websites and web apps.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        )}
      />
      <PageHeader
        eyebrow="About"
        title="The studio behind the work."
        intro="Premium engineering, delivered directly. No agency overhead, no hand-offs — just a developer who treats your launch like their own."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <About />

      <Section
        eyebrow="Tech Philosophy"
        title="What I optimize for."
        intro="Four principles that shape every decision — from the first component to the final deploy."
      >
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {philosophyPillars.map((pillar) => (
            <RevealItem
              key={pillar.title}
              className="rounded-lg border border-border bg-surface p-6"
            >
              <h3 className="font-display text-h4 text-text-strong">{pillar.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{pillar.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </main>
  );
}
