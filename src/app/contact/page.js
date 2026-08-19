import { Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/forms/ContactForm';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { siteConfig } from '@/config/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, contactPageSchema, jsonLd } from '@/lib/schema';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Start a project with Avenix Studio. Get a fixed quote and a clear timeline — or reach Abdullah Khan directly on WhatsApp.',
  path: '/contact',
});

/**
 * Dark type-led hero — see the note in app/about/page.js. #0A0A0B = --obsidian-950.
 * Contact carries no photograph (Phase 4D), but its band is still an obsidian
 * ground, so the chrome has to match it exactly as it does on /about.
 */
export const viewport = { themeColor: '#0A0A0B' };

/**
 * `id` exists so React keys are stable. Keying on `label` broke when
 * NEXT_PUBLIC_CONTACT_EMAIL and NEXT_PUBLIC_CONTACT_PHONE are unset: both
 * labels resolve to '' and React saw two children with the same key.
 * Entries with no label are filtered out rather than rendered blank.
 */
const channels = [
  {
    id: 'email',
    Icon: Mail,
    label: siteConfig.contact.email,
    href: siteConfig.contact.email ? `mailto:${siteConfig.contact.email}` : undefined,
  },
  {
    id: 'phone',
    Icon: Phone,
    label: siteConfig.contact.phone,
    href: siteConfig.contact.phone
      ? `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`
      : undefined,
  },
  {
    id: 'location',
    Icon: MapPin,
    label: `${siteConfig.contact.location} · ${siteConfig.contact.timezone}`,
  },
].filter((c) => Boolean(c.label));

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(contactPageSchema())}
      />
      {/* NO hero image here, by specification — and no empty image slot either:
          `fullScreen` takes the viewport model without going anywhere near the
          image branch, so nothing is reserved for art that is never coming.

          The dark ground is the reason this works at full height. A
          full-viewport band of the light --bg with type pinned to the bottom
          would read as a blank page rather than an intentional one; obsidian
          plus the existing --gradient-hero-glow makes the same empty space read
          as composition, and matches the three image heroes it now sits beside.
          `theme-dark bg-bg` as a className is the exact pattern /about already
          uses — PageHeader declares no ground of its own, so the second class is
          what paints it. */}
      <PageHeader
        className="theme-dark bg-bg"
        fullScreen
        eyebrow="Let's Talk"
        title="Start Your Project."
        intro="Tell us what you're building and the outcome that matters most. We reply within one business day — or message us on WhatsApp for a faster response."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />

      {/* `py-`, not `pb-`. The hero above is now a full-viewport band, so its own
          bottom padding sits INSIDE the first screen and no longer separates
          anything — this section has to carry its own top spacing. The clamp is
          the same one `Section` uses, so the rhythm matches every other section
          on the site rather than being a value invented here. */}
      <section className="container-page py-[clamp(var(--space-12),10vw,var(--space-24))]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              {channels.map(({ id, Icon, label, href }) => (
                <li key={id} className="flex items-center gap-3">
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
