import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { getServiceSummaries } from '@/data/servicePages';
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
  description: `${NAME} is the founder of ${STUDIO}, a software and AI studio in Lahore, Pakistan, building with Next.js and the MERN stack since ${siteConfig.brand.foundingYear}.`,
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
 * EVERY FACT HERE IS SOURCED, nothing is new: name, role and founding year from
 * client.config.js and the About founder section; the stack from
 * `identity.role` and knowledge/avenix/company.md; the build types from
 * caseStudies.js; the services from servicePages.js. There is no published CV
 * (public/abdullah-khan-cv.pdf is a placeholder), so there is no career history,
 * education or credential list — add one only from a real source.
 *
 * Distinct from /about by design: /about carries the studio's thinking and links
 * here for the person; this page carries who the founder is and links back.
 *
 * Profiles: GitHub is the founder's own. LinkedIn is the STUDIO's company page
 * and is labelled as such — it is not presented as a personal profile.
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
            <div className="measure flex flex-col gap-4 text-body text-text-muted">
              <p>
                {NAME} founded {STUDIO} in Lahore in {siteConfig.brand.foundingYear} and still
                works on the code. The title is {FOUNDER_ROLE}, and both halves are literal:
                running the studio, and building what it ships.
              </p>
              <p>
                The engineering background is full-stack JavaScript: Next.js and the MERN
                stack, which is what most Avenix builds run on, from live client websites on
                their own domains to e-commerce and multi-branch online ordering platforms.
              </p>
              <p>
                The studio started from one objection: that businesses are asked to choose
                between work that looks considered and work that is built properly. Avenix
                treats those as one practice, and Abdullah stays accountable for the result
                after it ships.{' '}
                <Link
                  href="/about"
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  More on how the studio works
                </Link>
                .
              </p>
            </div>

            <h2 className="mt-10 font-display text-h4 text-text-strong">
              What Abdullah works on at {STUDIO}
            </h2>
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
              {siteConfig.social.github && (
                <li>
                  <a
                    href={siteConfig.social.github}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-accent hover:underline"
                  >
                    GitHub
                  </a>
                </li>
              )}
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
