import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { getClientsWithLogos } from '@/data/clients';

/**
 * Continuous client-logo marquee — a pure trust signal, so logos carry no link
 * wrapper and no per-logo hover, which would imply interactivity that isn't
 * there. The full case studies (with their live-site links) stay on /work.
 *
 * Motion reuses the existing `animate-marquee` / `pause-on-hover` / `mask-fade-x`
 * primitives already powering the Toolkit marquee — no new animation invented,
 * and the reduced-motion fallback comes free: the global override in tokens.css
 * zeroes animation duration and iteration count, resolving the track to a
 * static row of logos.
 *
 * Renders NOTHING until at least one client has a real logo asset, so it can be
 * wired up safely before the artwork lands. See src/data/clients.js.
 */
export function ClientLogoStrip() {
  const logos = getClientsWithLogos();
  if (logos.length === 0) return null;

  // Duplicated track so the translateX(-50%) loop wraps seamlessly. The second
  // copy is aria-hidden so screen readers announce each client exactly once.
  const Track = ({ duplicate = false }) => (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16"
      aria-hidden={duplicate || undefined}
    >
      {logos.map((client) => (
        <li key={`${client.slug}${duplicate ? '-dup' : ''}`} className="shrink-0">
          <Image
            src={client.logo}
            alt={duplicate ? '' : client.name}
            width={200}
            height={64}
            sizes="(max-width: 768px) 120px, 180px"
            className="h-8 w-auto object-contain opacity-70 md:h-11"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Section
      id="clients"
      alt
      eyebrow="04 — Clients"
      title="Trusted by growing businesses."
      intro="Real businesses running on websites and platforms built by Avenix Studio."
      headerAlign="center"
    >
      <div className="mask-fade-x group relative mt-8 flex overflow-hidden">
        <div
          className="animate-marquee pause-on-hover flex"
          style={{ '--marquee-duration': '38s' }}
        >
          <Track />
          <Track duplicate />
        </div>
      </div>

      <Reveal className="mt-10 flex justify-center">
        <Button href="/work" variant="secondary" size="lg">
          View Full Portfolio
        </Button>
      </Reveal>
    </Section>
  );
}
