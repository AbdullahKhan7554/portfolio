import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { perfCommitments, philosophyPillars } from '@/content/whyMe';

export function PerfSEO() {
  return (
    <Section
      id="performance"
      eyebrow="07 — Performance & SEO"
      title="The luxury is backed by numbers."
      intro="Speed and discoverability aren't add-ons — they're guarantees. Here's the standard every project is held to."
      headerAlign="center"
    >
      <RevealGroup
        className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-5 md:grid-cols-4"
        stagger={0.08}
      >
        {perfCommitments.map((metric) => (
          <RevealItem
            key={metric.label}
            className="rounded-lg border border-border bg-surface p-6 text-center"
          >
            <p className="font-display text-h2 text-success">
              <Counter
                value={metric.value}
                decimals={metric.decimals || 0}
                prefix={metric.prefix || ''}
                suffix={metric.suffix || ''}
              />
            </p>
            <p className="mt-2 text-caption text-muted">{metric.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup
        className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.07}
      >
        {philosophyPillars.map((pillar) => (
          <RevealItem key={pillar.title} className="text-center md:text-left">
            <h3 className="font-display text-h4 text-text-strong">{pillar.title}</h3>
            <p className="mt-1 text-body-sm text-muted">{pillar.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
