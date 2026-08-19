import { Target, Gauge, MessageSquare, Layers } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { differentiators } from '@/content/whyMe';

const ICONS = { Target, Gauge, MessageSquare, Layers };

/**
 * One differentiator as a divider-separated row.
 *
 * The internal layout is icon-left / text-right at EVERY breakpoint — it never
 * reflows into a second arrangement on mobile, so the section reads as one
 * consistent vertical treatment throughout. Only padding and type scale change.
 */
function Row({ item }) {
  const Icon = ICONS[item.icon] || Target;
  return (
    <RevealItem as="li" className="group border-b border-border">
      <div className="flex items-start gap-5 py-6 md:gap-8 md:py-8">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border-strong text-accent transition-colors duration-base group-hover:border-accent">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-h4 text-text-strong transition-colors duration-base group-hover:text-accent">
            {item.title}
          </h3>
          <p className="measure mt-2 text-body text-muted">{item.description}</p>
        </div>
      </div>
    </RevealItem>
  );
}

export function WhyMe() {
  return (
    <Section
      id="why-me"
      eyebrow="02 — Why Avenix"
      title="Fewer people. Better decisions."
      intro="What separates a web development agency that ships from one that just invoices."
    >
      {/* Vertical stack. Constrained to max-w-4xl rather than the full 1360px
          container: four short rows spanning the whole width would leave the
          copy stranded in a lot of empty space. The stagger is unchanged at
          70ms, which now cascades top-to-bottom in reading order. */}
      <RevealGroup
        as="ul"
        className="mt-10 max-w-4xl border-t border-border"
        stagger={0.07}
      >
        {differentiators.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </RevealGroup>
    </Section>
  );
}
