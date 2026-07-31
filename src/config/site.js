/**
 * ============================================================================
 * Site Configuration — the public, non-secret shape components import.
 * ----------------------------------------------------------------------------
 * This is now a thin adapter over `client.config.js` (the single source of
 * truth). Every client-specific value lives there; this file only reshapes it
 * into the `siteConfig` structure existing components already consume. To
 * rebrand, edit `client.config.js` + `.env` — never this file.
 *
 * Secrets are NEVER read here; server-only values live in src/lib/env.js.
 * ============================================================================
 */
import { clientConfig as c } from './client.config';

export const siteConfig = {
  brand: {
    name: c.identity.brandName,
    shortName: c.identity.shortName,
    wordmark: c.identity.wordmark,
    legalName: c.identity.legalName,
    monogram: c.identity.monogram,
    founder: c.identity.founder,
    role: c.identity.role,
    descriptor: c.identity.descriptor,
    foundingYear: c.identity.foundingYear,
    tagline: c.identity.tagline,
    shortDescription: c.identity.shortDescription,
  },

  url: c.urls.site,

  contact: {
    email: c.contact.email,
    phone: c.contact.phone,
    whatsappNumber: c.contact.whatsappNumber,
    whatsappMessage: c.contact.whatsappMessage,
    location: c.contact.location,
    timezone: c.contact.timezone,
    address: c.contact.address,
  },

  availability: {
    open: c.contact.availabilityOpen,
    label: c.contact.availabilityLabel,
  },

  cv: {
    path: c.urls.cvPath,
    updated: c.urls.cvUpdated,
  },

  social: {
    github: c.social.github,
    linkedin: c.social.linkedin,
    instagram: c.social.instagram,
    facebook: c.social.facebook,
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  analytics: {
    ga4Id: c.analytics.ga4Id,
    clarityId: c.analytics.clarityId,
  },

  seo: {
    defaultTitle: c.seo.defaultTitle,
    titleTemplate: c.seo.titleTemplate,
    description: c.seo.description,
    keywords: c.seo.keywords,
    locale: c.seo.locale,
    ogImage: {
      url: c.urls.ogImage,
      width: 1200,
      height: 630,
      type: 'image/png',
      alt: c.seo.ogImageAlt,
    },
    twitterHandle: c.social.twitterHandle,
  },
};

/**
 * Organization (+ founder) data used to build JSON-LD structured data.
 * Kept separate so schema generators have one typed shape to read.
 */
export const organizationSchemaData = {
  name: siteConfig.brand.name,
  legalName: siteConfig.brand.legalName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  email: siteConfig.contact.email,
  foundingDate: String(siteConfig.brand.foundingYear),
  founder: {
    name: siteConfig.brand.founder,
    jobTitle: 'Founder & Lead Developer',
  },
  sameAs: Object.values(siteConfig.social).filter(Boolean),
  areaServed: 'Worldwide',
  address: siteConfig.contact.address,
};

export default siteConfig;
