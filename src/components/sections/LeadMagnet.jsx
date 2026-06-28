import { Reveal } from '@/components/ui/Reveal';
import { LeadMagnetForm } from '@/components/forms/LeadMagnetForm';

export function LeadMagnet() {
  return (
    <section id="free-audit" className="scroll-mt-24 py-[clamp(var(--space-12),9vw,var(--space-20))]">
      <div className="container-page">
        <Reveal
          className="relative overflow-hidden rounded-xl border border-border-strong p-8 md:p-12"
          style={{
            background:
              'radial-gradient(80% 120% at 50% -10%, hsl(35 72% 62% / 0.12), transparent 60%), var(--surface)',
          }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="eyebrow">10 — Free Audit</span>
              <h2 className="mt-4 font-display text-h2 text-text-strong">
                A free 5-point audit of your current website.
              </h2>
              <p className="measure mt-4 text-lead text-muted">
                Get a clear, no-obligation review of your site&rsquo;s speed, SEO,
                mobile experience, and conversion potential — with specific,
                actionable fixes.
              </p>
            </div>
            <div>
              <LeadMagnetForm />
              <p className="mt-3 text-caption text-faint">
                No spam. Just a genuinely useful audit. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
