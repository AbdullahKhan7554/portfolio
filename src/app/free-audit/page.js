import { Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { LeadMagnetForm } from '@/components/forms/LeadMagnetForm';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Free Website Audit',
  description:
    'Get a free 5-point audit of your website — speed, SEO, mobile experience, and conversion potential, with specific fixes from Avenix Studio.',
  path: '/free-audit',
});

const checks = [
  'Performance & Core Web Vitals',
  'Technical & on-page SEO',
  'Mobile experience',
  'Conversion & lead capture',
  'Trust & credibility signals',
];

export default function FreeAuditPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Free Audit', path: '/free-audit' },
          ]),
        )}
      />
      <PageHeader
        eyebrow="Free Audit"
        title="A free 5-point review of your website."
        intro="No obligation. Just a clear, honest look at what's working, what's costing you customers, and exactly how to fix it."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Free Audit', path: '/free-audit' },
        ]}
      />

      <section className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-h3 text-text-strong">What you&rsquo;ll get</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-3 text-body text-muted">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-pill border border-border-strong text-accent">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            className="rounded-xl border border-border-strong p-8"
            style={{
              background:
                'radial-gradient(80% 120% at 50% -10%, hsl(35 72% 62% / 0.12), transparent 60%), var(--surface)',
            }}
          >
            <h2 className="font-display text-h3 text-text-strong">Request your audit</h2>
            <p className="mt-2 text-body-sm text-muted">
              Drop your email and website — I&rsquo;ll send your audit shortly.
            </p>
            <div className="mt-6">
              <LeadMagnetForm />
            </div>
            <p className="mt-3 text-caption text-faint">
              No spam. Unsubscribe anytime.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
