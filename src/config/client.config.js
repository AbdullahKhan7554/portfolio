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

/**
 * Canonical deploy URL, normalised.
 *
 * THE https UPGRADE IS NOT COSMETIC. This one string feeds `siteConfig.url`,
 * which feeds `metadataBase`, every `alternates.canonical`, every OG/Twitter
 * `url`, every sitemap entry and every JSON-LD `url` on the site. A deploy env
 * carrying `http://` therefore makes the site self-declare http canonicals on
 * every page while serving https — so the scheme is forced here rather than
 * trusted from the environment.
 *
 * localhost and 127.0.0.1 are exempt: the dev server is genuinely http, and
 * upgrading it would break local OG/canonical resolution.
 *
 * This is a guard, not a fix. The env var itself should still be corrected in
 * the deploy platform — a value that is wrong here is also wrong everywhere
 * else it is read.
 */
const RAW_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);
const IS_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)(:|$|\/)/.test(RAW_SITE_URL);
const SITE_URL = IS_LOCAL ? RAW_SITE_URL : RAW_SITE_URL.replace(/^http:\/\//, 'https://');

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
    /**
     * NOTE: currently unread. It is surfaced as `siteConfig.brand.shortDescription`
     * but nothing consumes that — the string that actually drives page metadata
     * and the Organization schema is `seo.description` below. Kept in sync
     * anyway so the two can never drift into contradicting each other, and so a
     * future consumer inherits the company positioning rather than the old
     * freelancer framing.
     */
    shortDescription:
      'Avenix Studio is a digital product studio building premium websites, web applications, AI systems and digital experiences for ambitious brands.',
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
    /**
     * THE HOMEPAGE TITLE (and the fallback for any route that passes no title).
     * Deliberately NOT brand-led: the brand already ranks for its own name, and
     * a title that only says "Avenix Studio" gives a searcher looking for a
     * supplier nothing to match on. Leads with what is sold, then the market,
     * then the brand. Uses a pipe rather than the em dash `titleTemplate` uses,
     * because this string bypasses that template entirely.
     */
    defaultTitle:
      'Software Development & AI Automation Company in Pakistan | Avenix Studio',
    titleTemplate: '%s — Avenix Studio',
    /**
     * THE EFFECTIVE SITE DESCRIPTION. Two consumers, both verified:
     *   1. lib/seo.js `buildMetadata` — the fallback for every route that does
     *      not pass its own `description` (so it becomes the meta description,
     *      the OG description and the Twitter description).
     *   2. lib/schema.js `organizationSchema` — read directly as the
     *      Organization's `description`.
     * Both keep working unchanged; only the wording moved from freelancer
     * framing ("...development by Abdullah Khan") to the company as the primary
     * entity. Length kept near 155 chars so it is not truncated in results.
     */
    description:
      'Avenix Studio is a software development and AI automation company in Lahore, Pakistan — custom software, mobile apps, AI agents and SEO for growing businesses.',
    /**
     * Ordered by positioning, not volume: the brand and what it is come first.
     * "Abdullah Khan" is retained because the founder is a real, searched entity
     * and Person schema is injected site-wide — but it no longer leads, and the
     * personal job titles ("MERN Stack Developer", "Full-Stack Developer") are
     * gone in favour of what the studio sells. No stuffing: every term maps to
     * something the site actually offers.
     */
    keywords: [
      'Avenix Studio',
      'digital product studio',
      'web development',
      'web design',
      'web application development',
      'AI development',
      'AI automation',
      'AI agents',
      'software development',
      'digital experiences',
      'Next.js development',
      'technical SEO',
      'Abdullah Khan',
    ],
    locale: 'en_US',
    ogImageAlt: 'Avenix Studio — digital product studio for web, applications and AI',
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
