import {
  Target,
  Gauge,
  Search,
  MessageSquare,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { differentiators } from '@/content/whyMe';

const ICONS = { Target, Gauge, Search, MessageSquare, Layers, ShieldCheck };

function Cell({ item }) {
  const Icon = ICONS[item.icon] || Target;
  return (
    <RevealItem
      className={cn(
        'group flex flex-col rounded-lg border border-border bg-surface p-6 transition-all duration-base hover:border-accent',
        item.hero && 'md:col-span-2 md:row-span-1',
      )}
    >
      <span className="grid h-11 w-11 place-items-center rounded-md border border-border-strong text-accent transition-colors group-hover:border-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3
        className={cn(
          'mt-5 font-display text-text-strong',
          item.hero ? 'text-h3' : 'text-h4',
        )}
      >
        {item.title}
      </h3>
      <p className="mt-2 text-body-sm text-muted">{item.description}</p>
    </RevealItem>
  );
}

export function WhyMe() {
  return (
    <Section
      id="why-me"
      eyebrow="04 — Why Avenix"
      title="A Partner, Not A Vendor."
      intro="The difference between a website that exists and one that performs is in the details — and the details are the whole job."
    >
      <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3" stagger={0.07}>
        {differentiators.map((item) => (
          <Cell key={item.id} item={item} />
        ))}
      </RevealGroup>
    </Section>
  );
}
