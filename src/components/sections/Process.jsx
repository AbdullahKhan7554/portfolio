import { Compass, PenTool, Code2, ShieldCheck, Rocket } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Badge';
import { processSteps } from '@/content/process';

/** One quiet, on-brand icon per phase — elevates the timeline without clutter. */
const STEP_ICONS = {
  discovery: Compass,
  design: PenTool,
  development: Code2,
  testing: ShieldCheck,
  deployment: Rocket,
};

export function Process() {
  return (
    <Section
      id="process"
      alt
      eyebrow="05 — How I Work"
      title="A Clear System, Every Time."
      intro="No black boxes. From first conversation to post-launch support, you always know what's happening and why."
    >
      <RevealGroup className="relative mt-10" stagger={0.08}>
        {/* Continuous accent rail the nodes sit on. */}
        <span
          aria-hidden="true"
          className="absolute left-6 bottom-6 top-6 w-px bg-gradient-to-b from-accent via-border to-transparent"
        />

        <ol className="flex flex-col gap-4">
          {processSteps.map((step, i) => {
            const Icon = STEP_ICONS[step.id] ?? Compass;
            return (
              <RevealItem key={step.id} as="li" className="relative pl-16">
                {/* Node marker on the rail. */}
                <span className="absolute left-0 top-1.5 grid h-12 w-12 place-items-center rounded-pill border border-border-strong bg-bg text-accent shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                {/* Step card. */}
                <div className="group rounded-lg border border-border bg-surface p-6 transition-all duration-base ease-out-quad hover:-translate-y-0.5 hover:border-accent">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-faint">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-border transition-colors duration-base group-hover:bg-accent"
                    />
                  </div>

                  <h3 className="mt-3 font-display text-h3 text-text-strong">{step.title}</h3>
                  <p className="measure mt-2 text-body text-muted">{step.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {step.deliverables.map((d) => (
                      <Tag key={d}>{d}</Tag>
                    ))}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </ol>
      </RevealGroup>
    </Section>
  );
}
