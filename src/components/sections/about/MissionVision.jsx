import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { missionVision } from '@/content/about';

/**
 * 05 / 06 — Mission and Vision, as one section with two movements.
 *
 * They are combined because each is ~40 words of statement copy; as two full
 * sections with their own eyebrow, H2 and intro they produce a repetitive
 * "statement, statement" beat and roughly two screens of scroll for very little
 * content. Set side by side, the contrast BECOMES the design — which sharpens
 * the distinction the brief asks for rather than blurring it: present tense and
 * operational on the left, future tense and structural on the right.
 *
 * Both keep their own h2, so the heading hierarchy and SEO are identical to
 * shipping them as separate sections.
 */
const { mission, vision } = missionVision;

function Movement({ label, title, children }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">
        {label}
      </span>
      <h2 className="mt-4 font-display text-h3 leading-[1.2] text-text-strong text-balance">
        {title}
      </h2>
      <p className="mt-4 text-body text-text-muted">{children}</p>
    </div>
  );
}

export function MissionVision() {
  return (
    <Section id="mission-vision" eyebrow="05 — Mission & Vision">
      <RevealGroup
        // The divider is a border on the second cell rather than a separate
        // element, so it flips from a top rule (stacked) to a left rule
        // (side by side) without any extra markup or a hidden spacer.
        className="grid gap-10 lg:grid-cols-2 lg:gap-16"
        stagger={0.08}
      >
        <RevealItem>
          <Movement label={mission.label} title={mission.title}>
            {mission.body}
          </Movement>
        </RevealItem>

        <RevealItem className="border-t border-border pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <Movement label={vision.label} title={vision.title}>
            {vision.body}
          </Movement>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
