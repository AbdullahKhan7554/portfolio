import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Tilt } from '@/components/ui/Tilt';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { cn } from '@/lib/utils';
import { services } from '@/content/services';

function PriceCard({ service }) {
  const featured = service.recommended;
  return (
    <RevealItem className="h-full">
      <Tilt
        max={7}
        className={cn(
          'relative flex h-full flex-col rounded-lg border bg-surface p-6 transition-colors duration-base',
          featured
            ? 'border-accent shadow-glow'
            : 'border-border hover:border-accent',
        )}
      >
      {featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-pill bg-accent px-3 py-1 font-mono text-caption uppercase tracking-[0.12em] text-accent-on">
          <Sparkles className="h-3 w-3" aria-hidden="true" /> Recommended
        </span>
      )}
      <h3 className="font-display text-h4 text-text-strong">{service.name}</h3>
      <p className="mt-1 text-body-sm text-muted">{service.tagline}</p>

      <p className="mt-5 font-mono text-caption uppercase tracking-[0.12em] text-faint">
        Best for
      </p>
      <p className="mt-1 text-body-sm text-text">{service.bestFor}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-border pt-6">
        {service.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-body-sm text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?package=${service.id}`}
        className={cn(
          'mt-7 inline-flex h-11 items-center justify-center rounded-pill px-6 text-label font-medium transition-all duration-base',
          featured
            ? 'bg-accent text-accent-on hover:bg-accent-hover hover:shadow-glow'
            : 'border border-border-strong text-text hover:border-accent hover:text-text-strong',
        )}
        data-package={service.id}
      >
        {service.cta}
      </Link>
      </Tilt>
    </RevealItem>
  );
}

export function Services() {
  return (
    <Section
      id="services"
      alt
      eyebrow="03 — Services"
      title="Engagements built around outcomes."
      intro="Clear scope and a defined path from idea to launch. Pick the engagement that fits — every one is engineered to perform, and you get a fixed quote before any work begins."
    >
      <FloatingShapes />
      <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" stagger={0.1}>
        {services.map((service) => (
          <PriceCard key={service.id} service={service} />
        ))}
      </RevealGroup>
      <Reveal className="mt-8">
        <p className="text-caption text-faint">
          Every project is scoped and quoted individually — you always get a
          fixed, transparent quote before work begins. No surprises.
        </p>
      </Reveal>
    </Section>
  );
}
