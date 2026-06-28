import { Mail, Phone, MapPin } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { siteConfig } from '@/config/site';

export function Contact({ defaultPackage = '' }) {
  return (
    <Section
      id="contact"
      eyebrow="12 — Let's Talk"
      title="Start Your Project."
      intro="Tell me what you're building. I'll reply within one business day with next steps — or reach me on WhatsApp for a faster response."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-pill border border-border-strong text-accent">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-body text-muted transition-colors hover:text-text-strong"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-pill border border-border-strong text-accent">
                <Phone className="h-4 w-4" aria-hidden="true" />
              </span>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                className="text-body text-muted transition-colors hover:text-text-strong"
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-pill border border-border-strong text-accent">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-body text-muted">
                {siteConfig.contact.location} · {siteConfig.contact.timezone}
              </span>
            </li>
          </ul>
          <p className="measure text-body-sm text-faint">
            Your details are only used to respond to your enquiry. No spam, ever.
          </p>
        </Reveal>

        <Reveal>
          <ContactForm defaultPackage={defaultPackage} />
        </Reveal>
      </div>
    </Section>
  );
}
