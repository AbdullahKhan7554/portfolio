import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { WhyMe } from '@/components/sections/WhyMe';
import { Process } from '@/components/sections/Process';
import { ClientLogoStrip } from '@/components/sections/ClientLogoStrip';
import { TechStack } from '@/components/sections/TechStack';
import { PricingTeaser } from '@/components/sections/PricingTeaser';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { buildMetadata } from '@/lib/seo';
import { professionalServiceSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({ path: '/' });

/**
 * Homepage-only chrome. This is the one route that opens on a full-bleed dark
 * hero (`.theme-dark`), so the layout's white `themeColor` put a white browser
 * bar directly above near-black. #0A0A0B is the hero's own ground
 * (--obsidian-950).
 *
 * Scoped here rather than on the root layout so /about, /services, /work,
 * /blog and /contact — which all open on a white PageHeader — keep white
 * chrome. Next merges viewport shallowly along the segment tree, so this
 * overrides ONLY themeColor; colorScheme, width and initialScale still come
 * from app/layout.js.
 */
export const viewport = { themeColor: '#0A0A0B' };

export default function HomePage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(professionalServiceSchema())}
      />
      <Hero />
      <Services />
      <WhyMe />
      <Process />
      <ClientLogoStrip />
      <TechStack />
      <PricingTeaser />
      <FAQ />
      <Contact />
    </main>
  );
}
