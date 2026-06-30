import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Accordion } from '@/components/ui/Accordion';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema';
import {
  wdpMeta,
  wdpBlocks,
  wdpFaqs,
  wdpHowTo,
} from '@/content/websiteDevPakistan';

export const metadata = buildMetadata({
  title: wdpMeta.title,
  description: wdpMeta.description,
  path: wdpMeta.path,
  keywords: [
    'website development in Pakistan',
    'website development company Pakistan',
    'web design Pakistan',
    'custom website development Pakistan',
    'website cost in Pakistan',
  ],
});

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Website Development', path: '/website-development' },
  { name: 'Website Development in Pakistan (2026)', path: wdpMeta.path },
];

function articleSchema() {
  const url = `${siteConfig.url}${wdpMeta.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Ultimate Guide to Website Development in Pakistan (2026)',
    description: wdpMeta.description,
    image: siteConfig.seo.ogImage.url,
    datePublished: wdpMeta.datePublished,
    dateModified: wdpMeta.dateModified,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: wdpMeta.author,
      jobTitle: 'Founder & Lead Developer',
      worksFor: { '@type': 'Organization', name: siteConfig.brand.name },
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'The Website Development Process',
    step: wdpHowTo.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

function Block({ block }) {
  switch (block.type) {
    case 'tldr':
      return (
        <div className="my-8 rounded-xl border border-accent/40 bg-surface p-6 shadow-glow">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
            TL;DR
          </p>
          <p className="mt-3 text-body text-text">{block.text}</p>
        </div>
      );
    case 'h2':
      return (
        <h2 className="mt-12 font-display text-h3 text-text-strong">{block.text}</h2>
      );
    case 'h3':
      return (
        <h3 className="mt-8 font-display text-h4 text-text-strong">{block.text}</h3>
      );
    case 'ul':
      return (
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-body text-muted marker:text-accent">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <blockquote className="my-6 rounded-lg border-l-2 border-accent bg-surface p-5 text-body text-text">
          {block.text}
        </blockquote>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th
                    key={h}
                    className="border-b border-border-strong px-3 py-2 text-left font-display text-text-strong"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="align-top">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border-b border-border px-3 py-2 text-muted"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'sources':
      return (
        <ul className="mt-4 flex flex-col gap-2 text-body-sm">
          {block.items.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      );
    default:
      return <p className="mt-4 text-body text-muted">{block.text}</p>;
  }
}

export default function WebsiteDevelopmentPakistanPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(articleSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(howToSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(wdpFaqs))}
      />

      <PageHeader
        eyebrow="Guide"
        title="The Ultimate Guide to Website Development in Pakistan (2026)"
        intro="Costs, website types, the build process, the right technology, and how to choose a developer you won't regret — for clinics, gyms, law firms, restaurants, real estate, and startups."
        breadcrumbs={crumbs}
      >
        <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-caption uppercase tracking-[0.12em] text-faint">
          <span className="text-accent">By {wdpMeta.author}</span>
          <span>{wdpMeta.readingTime}</span>
        </div>
      </PageHeader>

      <article className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <Reveal className="max-w-3xl">
          {wdpBlocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </Reveal>

        <h2 className="mt-12 font-display text-h3 text-text-strong">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 max-w-3xl">
          <Accordion items={wdpFaqs} defaultOpen={0} />
        </div>
      </article>

      <Section className="pt-0">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border-strong bg-surface p-10 text-center">
          <h2 className="text-h2">Build a website that actually works.</h2>
          <p className="measure text-lead text-muted">
            Fast, mobile-first, SEO-ready websites engineered around real business
            outcomes. Get a fixed, transparent quote before any work begins.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/contact" size="lg" magnetic>
              Get Your Free Quote
            </Button>
            <WhatsAppButton source="wdp-guide-cta" size="lg" />
            <Button href="/free-audit" variant="secondary" size="lg">
              Free 5-Point Audit
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
