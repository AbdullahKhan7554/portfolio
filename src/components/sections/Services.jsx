import { ScrollStorySection } from '@/components/ui/scroll-story';
import { services } from '@/data/services';

/**
 * Service → image mapping, keyed by service `id`. Explicit rather than derived
 * from the filename, because the two sets do not line up one-to-one:
 *
 *   • Social Media Management was discontinued as a service and removed from
 *     data/services.js entirely.
 *   • `seo.png` is reserved for the standalone SEO service once its copy is
 *     approved; it is unused until that entry exists.
 *
 * Verified by opening the files, not by guessing from filenames.
 */
const SERVICE_IMAGES = {
  'web-development': 'web.png',
  'mobile-app-development': 'mobileapp.png',
  'ai-automation': 'automation.png',
  'ai-chatbots': 'chatbot.png',
  'digital-marketing': 'digital.webp',
  branding: 'graphic.png',
  // seo.webp is 1792x1024 (7:4), not the 3:2 every other asset uses — the 3:2
  // frame crops ~14% off the sides. The monitor is centred so nothing essential
  // is lost, but it is the only asset not natively matching the frame.
  seo: 'seo.webp',
  'video-editing': 'video.png',
};

const STORY_ITEMS = services.map((service) => {
  const file = SERVICE_IMAGES[service.id];
  return {
    id: service.id,
    label: 'Services',
    title: service.name,
    description: service.description,
    meta: service.chips,
    image: file ? `/images/services/${file}` : undefined,
    imageAlt: file ? `${service.name} — Avenix Studio service overview` : undefined,
  };
});

export function Services() {
  return (
    <ScrollStorySection
      id="services"
      eyebrow="01 — Services"
      title="Everything Your Brand Needs, Under One Roof."
      intro="Eight disciplines, one accountable team — so strategy, build, and growth never get lost in the hand-off between vendors."
      items={STORY_ITEMS}
      // Services stays on the light palette; How We Work keeps
      // the dark cinematic panel.
      theme="light"
      chapterVh={170}
    />
  );
}
