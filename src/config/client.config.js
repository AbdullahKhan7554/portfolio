/**
 * ============================================================================
 * CLIENT CONFIG — single source of truth for every client-specific value.
 * ----------------------------------------------------------------------------
 * To launch a new client instance: edit THIS file + `.env`, drop in brand assets
 * under /public, then seed the Knowledge Base (see docs/new-client-setup.md).
 * `config/site.js` and `config/nova.config.js` read from here — do not hardcode
 * brand strings, links, colors, or copy anywhere else.
 *
 * Per-deploy values read `process.env.*` (public NEXT_PUBLIC_* only — no secrets)
 * with generic fallbacks. Brand-fixed values are literals; replace them per client.
 * ============================================================================
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const clientConfig = {
  // --- Identity ------------------------------------------------------------
  identity: {
    /** Tenant key: KB, sales packages, nurture, memory are all scoped by this. */
    companyId: 'avenix',
    brandName: 'Avenix Studio',
    /** Short brand label (PWA short_name, dashboard title). */
    shortName: 'Avenix',
    legalName: 'Avenix Studio',
    /** Uppercase brand mark for the giant footer wordmark. */
    wordmark: 'AVENIX',
    /** Sticky-header monogram / favicon. */
    monogram: 'AS',
    /** Nova assistant display name. */
    assistantName: 'Nova',
    founder: 'Abdullah Khan',
    role: 'Full-Stack MERN Developer',
    descriptor: 'NEXT.JS · PERFORMANCE · CONVERSION',
    foundingYear: 2023,
    tagline: 'Premium web engineering for ambitious brands.',
    shortDescription:
      'Avenix Studio is the digital practice of Abdullah Khan — building fast, scalable, conversion-focused web applications with Next.js and the MERN stack for startups, businesses, and international clients.',
  },

  // --- URLs & assets -------------------------------------------------------
  urls: {
    /** Canonical deploy URL (env-driven per deploy). */
    site: SITE_URL,
    /** Brand's public website (used in the KB company registry). */
    website: 'https://www.avenixstudios.com',
    logo: '/logo.png',
    ogImage: `${SITE_URL}/og-image.png`,
    founderPhoto: '/images/abdullah-khan.png',
    cvPath: '/abdullah-khan-cv.pdf',
    cvUpdated: 'June 2026',
  },

  // --- Contact (public) ----------------------------------------------------
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    /** International format, digits only (no "+"). */
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    whatsappMessage: "Hi Abdullah — I found Avenix Studio and I'd like to discuss a project.",
    location: 'Lahore, Pakistan',
    timezone: 'PKT (GMT+5)',
    address: { locality: 'Lahore', region: 'Punjab', country: 'PK' },
    availabilityLabel: 'Available for new projects',
    availabilityOpen: true,
  },

  // --- Email (non-secret; the from-NAME for transactional email) -----------
  email: {
    fromName: 'Avenix Studio',
  },

  // --- Social + analytics --------------------------------------------------
  social: {
    github: 'https://github.com/AbdullahKhan7554',
    linkedin: 'https://www.linkedin.com/company/avenix-studio/',
    instagram: 'https://www.instagram.com/avenix_studios/',
    facebook: 'https://www.facebook.com/profile.php?id=61591556996767',
    twitterHandle: '@avenixstudio',
  },
  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID || '',
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || '',
  },

  // --- SEO defaults --------------------------------------------------------
  seo: {
    defaultTitle: 'Avenix Studio — Premium Full-Stack Web Development',
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
    ogImageAlt: 'Avenix Studio — Premium Full-Stack Web Development by Abdullah Khan',
  },

  // --- Nova widget copy + theme --------------------------------------------
  widget: {
    tagline: 'AI Concierge',
    welcomeMessage:
      "Hi, I'm Nova 👋 — your guide here. Ask about recent work, services, or how a project comes together, and I'll point you in the right direction.",
    inputPlaceholder: 'Ask Nova anything…',
    errorMessage:
      "Sorry — I couldn't respond just now. Please try again in a moment, or reach out directly.",
    quickReplies: ['Explore recent work', 'Services & packages', 'Start a project', 'How you work'],
    launcher: {
      ariaLabel: 'Chat with Nova',
      positionClassName: 'bottom-[5.75rem] right-5 md:bottom-[6.5rem] md:right-6',
    },
    theme: {
      dark: {
        bg: '#0f0e13',
        surface: '#16151a',
        surfaceRaised: '#1c1b21',
        text: '#f6f3ee',
        textMuted: '#97949f',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: '#e3a857',
        accentText: '#0a0a0b',
        userBubble: '#e3a857',
        userText: '#0a0a0b',
        assistantBubble: '#1c1b21',
        assistantText: '#ede9e2',
      },
      light: {
        bg: '#ffffff',
        surface: '#faf8f4',
        surfaceRaised: '#ffffff',
        text: '#1a1916',
        textMuted: '#5c5850',
        border: 'rgba(0, 0, 0, 0.10)',
        accent: '#a66c28',
        accentText: '#ffffff',
        userBubble: '#a66c28',
        userText: '#ffffff',
        assistantBubble: '#efece5',
        assistantText: '#1a1916',
      },
    },
  },

  // --- Nova behavior policy ------------------------------------------------
  policy: {
    /** false = never quote a specific price (current guardrail). true = allowed. */
    quotePricesAllowed: false,
  },

  // --- Lead-nurture sequence (points at this client's email_templates keys) -
  nurture: {
    sequenceKey: 'avenix_lead_nurture',
    sequence: [
      { templateKey: 'avenix_welcome', delayMinutes: 0 },
      { templateKey: 'avenix_followup', delayMinutes: 4320 },
    ],
  },
};

export default clientConfig;
