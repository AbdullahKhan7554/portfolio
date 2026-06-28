import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { aiWorkflow } from '@/content/whyMe';

export function AIWorkflow() {
  return (
    <Section
      id="ai-workflow"
      alt
      eyebrow="06 — AI-Assisted, Human-Owned"
      title="Modern velocity, disciplined craft."
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-lead text-muted">{aiWorkflow.intro}</p>
          <p className="measure mt-5 text-body text-muted">
            AI accelerates the repetitive parts of building software. Architecture,
            quality, security, and accessibility decisions stay with me. The result:
            faster delivery, fewer bugs, and code I can stand behind.
          </p>
        </Reveal>

        <RevealGroup className="flex flex-col gap-3" stagger={0.1}>
          {aiWorkflow.pipeline.map((node, i) => (
            <RevealItem
              key={node.step}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill border border-border-strong font-mono text-label text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <p className="font-display text-h4 text-text-strong">{node.step}</p>
                <p className="mt-0.5 text-body-sm text-muted">{node.detail}</p>
              </div>
              {i < aiWorkflow.pipeline.length - 1 && (
                <ArrowRight className="h-4 w-4 text-faint" aria-hidden="true" />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
