import { Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Start a project with Avenix Studio. Get a fixed quote and a clear timeline — or reach Abdullah Khan directly on WhatsApp.',
  path: '/contact',
});

const channels = [
  { Icon: Mail, label: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  {
    Icon: Phone,
    label: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`,
  },
  { Icon: MapPin, label: `${siteConfig.contact.location} · ${siteConfig.contact.timezone}` },
];

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const pkg = params?.package || '';
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        )}
      />
      <PageHeader
        eyebrow="Let's Talk"
        title="Start Your Project."
        intro="Tell me what you're building and the outcome that matters most. I reply within one business day — or message me on WhatsApp for a faster response."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      <section className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              {channels.map(({ Icon, label, href }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-pill border border-border-strong text-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="text-body text-muted transition-colors hover:text-text-strong"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-body text-muted">{label}</span>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <p className="mb-3 text-body-sm text-muted">Prefer to chat now?</p>
              <WhatsAppButton source="contact-page" />
            </div>
            <p className="measure text-body-sm text-faint">
              Your details are only used to respond to your enquiry. No spam, ever.
            </p>
          </Reveal>

          <Reveal>
            <ContactForm defaultPackage={pkg} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
