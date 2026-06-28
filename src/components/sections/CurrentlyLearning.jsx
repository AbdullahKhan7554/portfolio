import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { currentlyLearning } from '@/content/techStack';

export function CurrentlyLearning() {
  return (
    <Section id="learning" alt className="py-12">
      <Reveal className="flex flex-col items-center gap-5 text-center">
        <span className="eyebrow">09 — Always Improving</span>
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {currentlyLearning.map((item) => (
            <li
              key={item}
              className="rounded-pill border border-border bg-surface px-4 py-2 font-mono text-caption uppercase tracking-[0.12em] text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
