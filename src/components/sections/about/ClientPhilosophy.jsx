import { Section } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { clientPhilosophy } from '@/content/about';

/**
 * 07 — How We Work With Clients.
 *
 * NOT the homepage process. The homepage scroll-story answers "what happens to
 * my project" (Discovery -> Design -> Development -> Testing -> Deployment); this
 * answers "what is it like to work with these people". Same five-beat shape, a
 * different question, and deliberately a different UI — reusing ScrollStorySection
 * here would make About read as a homepage rerun and would put a pinned panel on
 * a page that is already long.
 *
 * Hairline rows, not cards: a numbered editorial list carries sequence for free,
 * where six bordered boxes would imply six parallel options.
 */
export function ClientPhilosophy() {
  return (
    <Section id="how-we-work" alt eyebrow="07 — Working Together">
      <Reveal>
        <h2 className="font-display text-h2 text-text-strong text-balance">
          We&rsquo;d rather ask the awkward question early.
        </h2>
        <p className="measure mt-5 text-lead text-text-muted">
          A studio you can hand a task list to is easy to find. What changes the
          outcome is a partner who will tell you when the task list is wrong.
        </p>
      </Reveal>

      <RevealGroup className="mt-12 flex flex-col" stagger={0.06}>
        {clientPhilosophy.map((step, i) => (
          <RevealItem
            key={step.id}
            className="grid gap-3 border-t border-border py-6 md:grid-cols-[0.4fr_1fr] md:gap-10 md:py-8"
          >
            {/* Number and title share a cell so they stay locked together when
                the row collapses to one column on mobile. */}
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="font-mono text-eyebrow tracking-[0.18em] text-accent"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-h4 text-text-strong">{step.title}</h3>
            </div>
            <p className="text-body text-text-muted">{step.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
