import { ScrollStorySection } from '@/components/ui/scroll-story';
import { processSteps } from '@/content/process';

/**
 * ⚠️ TEMPORARY ISOLATION HARNESS — delete before deploy.
 *
 * Exercises the scroll-story primitives on their own, with white sections above
 * and below so the WHITE → DARK → WHITE handoff and the sticky release can be
 * checked without any real section wired up. Uses existing /public/images so no
 * placeholder assets are invented.
 */
export const metadata = {
  title: 'Scroll story test',
  robots: { index: false, follow: false },
};

/**
 * Real `processSteps` content, not invented filler — the harness only tells the
 * truth about spacing and hold time if the copy is the length the live section
 * will actually carry.
 */
const ITEMS = processSteps.map((step) => ({
  id: step.id,
  label: step.title,
  title: step.title,
  description: step.description,
  image: `/images/how-we-work/${step.id}.png`,
  imageAlt: `${step.title} stage of the Avenix delivery process`,
  meta: step.deliverables,
}));

export default function ScrollStoryTestPage() {
  return (
    <main id="main">
      <section className="container-page py-24">
        <h1 className="font-display text-h1 text-text-strong">White section above</h1>
        <p className="measure mt-4 text-lead text-muted">
          Scroll down. The dark chapter below should pin, advance through five
          steps, then release into the white section underneath.
        </p>
      </section>

      <ScrollStorySection
        id="story-test"
        eyebrow="00 — Harness"
        title="A cinematic chapter."
        intro="Pinned on desktop, stacked on mobile and under reduced motion."
        items={ITEMS}
      />

      <section className="container-page py-24">
        <h2 className="font-display text-h2 text-text-strong">White section below</h2>
        <p className="measure mt-4 text-lead text-muted">
          If the handoff felt smooth and nothing jumped, the release is correct.
        </p>
      </section>
    </main>
  );
}
