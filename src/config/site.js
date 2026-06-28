/**
 * ============================================================================
 * Avenix Studio — Centralized Site Configuration (single source of truth)
 * ----------------------------------------------------------------------------
 * ALL public, non-secret information lives here. Components must import from
 * this file rather than hardcoding brand strings, links, or contact details.
 *
 *   • Per-environment public values (URL, analytics IDs, contact channels) are
 *     read from NEXT_PUBLIC_* env vars with safe placeholder fallbacks, so the
 *     site always builds — even with no .env file.
 *   • Secrets (Resend key, delivery inbox) are NEVER read here. They are read
 *     only on the server in src/lib/env.js.
 *
 * To rebrand or go live: edit this file + .env.local. No component code changes.
 * ============================================================================
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://avenixstudio.com'
).replace(/\/$/, '');

export const siteConfig = {
  // --- Brand identity ------------------------------------------------------
  brand: {
    name: 'Avenix Studio',
    legalName: 'Avenix Studio',
    /** Shown in the sticky-header monogram & favicon. */
    monogram: 'AS',
    founder: 'Abdullah Khan',
    role: 'Full-Stack MERN Developer',
    /** One-line studio descriptor used in footer / about lockups. */
    descriptor: 'NEXT.JS · PERFORMANCE · CONVERSION',
    foundingYear: 2023,
    tagline: 'Premium web engineering for ambitious brands.',
    /** A confident, outcome-led elevator line (≤ 160 chars for meta reuse). */
    shortDescription:
      'Avenix Studio is the digital practice of Abdullah Khan — building fast, scalable, conversion-focused web applications with Next.js and the MERN stack for startups, businesses, and international clients.',
  },

  // --- Canonical URL -------------------------------------------------------
  url: SITE_URL,

  // --- Contact channels (public) ------------------------------------------
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'abdullahqayyum1041@gmail.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+92 302 6234429',
    /** International format, digits only (no "+"). Used to build wa.me links. */
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923026234429',
    /** Default prefilled WhatsApp message. */
    whatsappMessage:
      "Hi Abdullah — I found Avenix Studio and I'd like to discuss a project.",
    location: 'Lahore, Pakistan',
    timezone: 'PKT (GMT+5)',
    address: {
      locality: 'Lahore',
      region: 'Punjab',
      country: 'PK',
    },
  },

  // --- Availability signal -------------------------------------------------
  availability: {
    open: true,
    label: 'Available for new projects',
  },

  // --- CV / Resume ---------------------------------------------------------
  cv: {
    /** Drop the real PDF at /public/abdullah-khan-cv.pdf to enable. */
    path: '/abdullah-khan-cv.pdf',
    updated: 'June 2026',
  },

  // --- Social links --------------------------------------------------------
  social: {
    github: 'https://github.com/AbdullahKhan7554',
    linkedin: 'https://www.linkedin.com/in/abdullah-khan',
    x: 'https://x.com/avenixstudio',
    instagram: 'https://instagram.com/avenixstudio',
  },

  // --- Primary navigation --------------------------------------------------
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  // --- Analytics (public IDs) ---------------------------------------------
  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '',
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
  },

  // --- SEO defaults --------------------------------------------------------
  seo: {
    defaultTitle: 'Avenix Studio — Premium Full-Stack Web Development',
    /** %s is replaced by the page title on inner routes. */
    titleTemplate: '%s — Avenix Studio',
    description:
      'Avenix Studio — premium Full-Stack MERN & Next.js development by Abdullah Khan. Fast, scalable, conversion-focused websites and web apps for startups, businesses, and international clients.',
    keywords: [
      'Avenix Studio',
      'Abdullah Khan',
      'Full-Stack Developer',
      'MERN Stack Developer',
      'Next.js Developer',
      'React Developer',
      'Web Application Development',
      'Technical SEO',
      'Premium Web Design',
      'Conversion-focused websites',
    ],
    locale: 'en_US',
    /** Open Graph image — 1200×630. Generated dynamically at /opengraph-image. */
    ogImage: {
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: 'Avenix Studio — Premium Full-Stack Web Development by Abdullah Khan',
    },
    twitterHandle: '@avenixstudio',
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
