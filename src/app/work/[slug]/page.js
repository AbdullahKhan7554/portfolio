import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { caseStudies, getCaseStudy } from '@/content/caseStudies';
import { BrowserMock } from '@/components/ui/BrowserMock';
import { Counter } from '@/components/ui/Counter';
import { Tag, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return buildMetadata({ title: 'Case study not found', noIndex: true });
  return buildMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
  });
}

function articleSchema(study) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${study.title} — Case Study`,
    description: study.summary,
    author: { '@type': 'Person', name: siteConfig.brand.founder },
    publisher: { '@type': 'Organization', name: siteConfig.brand.name },
    about: study.niche,
    datePublished: study.year,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const others = caseStudies.filter((c) => c.slug !== study.slug && c.featured).slice(0, 1);
  const next = others[0] || caseStudies.find((c) => c.slug !== study.slug);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: study.title, path: `/work/${study.slug}` },
  ];

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(articleSchema(study))}
      />

      <PageHeader breadcrumbs={crumbs} eyebrow={study.niche}>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-h1">{study.title}</h1>
          {study.isLive && <StatusBadge status="live" label="Live" />}
        </div>
        <p className="measure text-lead text-muted">{study.summary}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button href={study.liveUrl} variant="secondary">
            Visit live site <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button href="/contact" variant="ghost">
            Start a similar project
          </Button>
        </div>
      </PageHeader>

      <div className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <Reveal>
          <BrowserMock
            title={study.title}
            url={study.liveUrl}
            niche={study.niche}
            image={study.image}
          />
        </Reveal>

        {/* Results */}
        <Reveal className="mt-12">
          <h2 className="eyebrow">Results</h2>
          <dl className="mt-5 grid gap-6 border-y border-border py-8 sm:grid-cols-3">
            {study.results.map((stat, i) => (
              <div key={i}>
                <dt className="font-display text-h2 text-accent">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals || 0}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                  />
                </dt>
                <dd className="mt-1 text-body-sm text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Problem / Solution */}
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-h3 text-text-strong">The problem</h2>
            <p className="measure mt-4 text-body text-muted">{study.problem}</p>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-h3 text-text-strong">What I built</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {study.solution.map((point) => (
                <li key={point} className="flex items-start gap-2 text-body text-muted">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Tech */}
        <Reveal className="mt-12">
          <h2 className="eyebrow">Built with</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {study.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </Reveal>

        {/* CTA + next */}
        <Reveal className="mt-16 flex flex-col items-start gap-6 rounded-xl border border-border-strong bg-surface p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-h3 text-text-strong">
              Want results like this?
            </h2>
            <p className="mt-2 text-body text-muted">
              Let&rsquo;s talk about your project — fixed quote, clear timeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
              magnetic
            >
              Book a call
            </Button>
            <WhatsAppButton source={`case-study-${study.slug}`} />
          </div>
        </Reveal>

        {next && (
          <Reveal className="mt-12">
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center justify-between border-t border-border pt-8"
            >
              <span>
                <span className="font-mono text-caption uppercase tracking-[0.18em] text-faint">
                  Next project
                </span>
                <span className="mt-1 block font-display text-h3 text-text-strong">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-6 w-6 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        )}
      </div>
    </main>
  );
}
