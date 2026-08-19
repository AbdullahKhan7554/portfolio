import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

/**
 * 10 — Closing CTA.
 *
 * A small dedicated block, NOT a reuse of sections/Contact.jsx: that section
 * hardcodes the homepage's "07 — Let's Talk" eyebrow and embeds the full contact
 * form, so dropping it here would leak homepage numbering onto About and end a
 * narrative page with a form rather than an invitation.
 *
 * Both routes already exist (/contact, /work). Buttons follow the hero's
 * established `w-full sm:w-auto` pairing so the two CTAs read as a deliberate
 * pair on mobile rather than stacking at two different widths.
 */
export function AboutCta() {
  return (
    <Section id="about-cta" className="theme-dark bg-bg">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-h2 text-text-strong text-balance">
          Have something worth building?
        </h2>
        <p className="measure mt-5 text-lead text-text-muted">
          Let&rsquo;s turn it into something people use, remember, and grow with.
        </p>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto">
          <Button href="/contact" size="lg" className="w-full sm:w-auto" magnetic>
            Start a Project
          </Button>
          <Button
            href="/work"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            View Our Work
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
