import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { getServiceSummaries } from '@/data/servicePages';
import { founderBio, founderFacts, founderProfiles } from '@/content/founder';
import { buildMetadata } from '@/lib/seo';
import {
  breadcrumbSchema,
  profilePageSchema,
  jsonLd,
  FOUNDER_ROLE,
  FOUNDER_IMAGE,
} from '@/lib/schema';

const NAME = siteConfig.brand.founder;
const STUDIO = siteConfig.brand.name;

export const metadata = buildMetadata({
  absoluteTitle: `${NAME} — ${FOUNDER_ROLE}, ${STUDIO}`,
  description: `${NAME}, founder of ${STUDIO} in Lahore, Pakistan: a full-stack developer building websites, web apps and AI automation with Next.js and React.`,
  path: '/founder',
});

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Founder', path: '/founder' },
];

/**
 * /founder — the founder profile (ProfilePage).
 *
 * Every founder fact on this page comes from src/content/founder.js, which is
 * also what the Person JSON-LD reads — so nothing in the schema is invisible
 * here. Add facts there, not inline.
 *
 * Distinct from /about by design: /about carries the studio's thinking and links
 * here for the person; this page carries who the founder is and links back.
 *
 * The services list is the STUDIO's offer, labelled as such — it is not a claim
 * about which of them the founder personally delivers.
 */
export default function FounderPage() {
  const services = getServiceSummaries();

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(profilePageSchema())}
      />

      <PageHeader
        eyebrow="Founder"
        title={NAME}
        intro={`${FOUNDER_ROLE} at ${STUDIO}, the software and AI studio in Lahore, Pakistan.`}
        breadcrumbs={crumbs}
      />

      <Section className="pt-0">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            {/* Same measured three-quarter crop as the About founder section —
                see the note in components/sections/about/Founder.jsx. */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-border-strong bg-surface shadow-lg">
              <Image
                src={FOUNDER_IMAGE}
                alt={`${NAME}, ${FOUNDER_ROLE.toLowerCase()} at ${STUDIO}, standing in a dark double-breasted suit`}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover object-[50%_15%]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="measure text-lead text-text-muted">{founderBio}</p>

            <dl className="mt-8 divide-y divide-border border-y border-border">
              {founderFacts.map((f) => (
                <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
                  <dt className="font-mono text-caption uppercase tracking-[0.14em] text-accent">
                    {f.label}
                  </dt>
                  <dd className="text-body text-text-strong">{f.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-body text-text-muted">
              <Link
                href="/about"
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                More on how {STUDIO} works
              </Link>
            </p>

            <h2 className="mt-10 font-display text-h4 text-text-strong">{STUDIO} services</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex items-center justify-between gap-4 py-3 text-body text-text-strong"
                  >
                    {s.eyebrow}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-accent transition-transform duration-base ease-out-quad group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-caption uppercase tracking-[0.14em]">
              {founderProfiles.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-accent hover:underline"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
              {siteConfig.social.linkedin && (
                <li>
                  <a
                    href={siteConfig.social.linkedin}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-accent hover:underline"
                  >
                    {STUDIO} on LinkedIn
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-10 flex w-full flex-wrap gap-3 sm:w-auto">
              <Button href="/about" size="lg" className="w-full sm:w-auto">
                About {STUDIO}
              </Button>
              <Button href="/work" variant="secondary" size="lg" className="w-full sm:w-auto">
                See the work
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
