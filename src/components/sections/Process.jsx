import { ScrollStorySection } from '@/components/ui/scroll-story';
import { processSteps } from '@/content/process';

/**
 * "How We Work" — rendered as the dark scroll-story chapter (design spec:
 * WHITE → DARK CINEMATIC → WHITE). The five delivery stages become the five
 * pinned chapters; copy and deliverables come straight from content/process.js
 * so this file holds no content of its own.
 *
 * Image filenames match each step's `id` exactly (discovery, design,
 * development, testing, deployment) in /public/images/how-we-work.
 */
const STORY_ITEMS = processSteps.map((step) => ({
  id: step.id,
  label: step.title,
  title: step.title,
  description: step.description,
  image: `/images/how-we-work/${step.id}.png`,
  imageAlt: `${step.title} stage of the Avenix delivery process`,
  meta: step.deliverables,
}));

export function Process() {
  return (
    <ScrollStorySection
      id="process"
      eyebrow="03 — How We Work"
      title="A Clear System, Every Time."
      intro="No black boxes. From first conversation to post-launch support, you always know what's happening and why."
      items={STORY_ITEMS}
    />
  );
}
