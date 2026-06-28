import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { AvailabilityPill } from '@/components/ui/AvailabilityPill';
import { Reveal } from '@/components/ui/Reveal';
import { FooterPremium } from './FooterPremium';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Conversion block */}
      <div className="relative" style={{ background: 'var(--gradient-hero-glow)' }}>
        <div className="container-page py-[clamp(var(--space-12),9vw,var(--space-20))] text-center">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6">
            <AvailabilityPill />
            <h2 className="text-h1 text-balance">
              Let&rsquo;s build something{' '}
              <span className="text-amber-wipe">worth shipping</span>.
            </h2>
            <p className="measure text-lead text-muted">
              Tell me about your project. You&rsquo;ll get a fixed quote, a clear
              timeline, and a partner who treats your launch like their own.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
                size="lg"
                magnetic
              >
                Book a call
              </Button>
              <WhatsAppButton source="footer" size="lg" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Premium 4-column brand footer + giant AVENIX wordmark */}
      <FooterPremium />
    </footer>
  );
}
