/**
 * Service catalogue — design system §6 (LOCKED). Replaces the previous
 * package-shaped list; pricing now lives in its own phase, so no `priceFrom`
 * here. Each entry is one card: icon, title, 2-line description, tool chips,
 * "Learn More" link.
 *
 * `name` and `tagline` are REQUIRED by src/lib/schema.js (servicesSchema →
 * OfferCatalog itemListElement) — do not rename them.
 *
 * `icon` is a lucide-react export name, mapped in sections/Services.jsx.
 */
export const services = [
  {
    id: 'web-development',
    icon: 'Code2',
    name: 'Web Development',
    tagline: 'Production-grade Next.js & React builds',
    description:
      'Websites and web apps engineered on Next.js and React, fast and accessible, built to scale with the business behind them.',
    chips: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'CMS'],
  },
  {
    id: 'mobile-app-development',
    icon: 'Smartphone',
    name: 'Mobile App Development',
    tagline: 'Cross-platform apps, concept to store',
    description:
      'Cross-platform mobile apps taken from concept through to store listing. One codebase, a native feel on both iOS and Android.',
    // Avenix offers BOTH frameworks — the choice is made per project, driven by
    // the client's requirements (confirmed by Abdullah, design system §6 query).
    chips: ['Cross-platform', 'React Native', 'Flutter', 'App Store', 'Google Play'],
  },
  {
    id: 'seo',
    icon: 'Search',
    name: 'SEO',
    tagline: 'Technical, on-page, and off-page search',
    description:
      'Get found by the people already searching for what you do. Technical foundations, on-page structure, and the authority signals that move you up the results page.',
    chips: ['Technical SEO', 'On-Page', 'Off-Page', 'AEO / GEO', 'Analytics'],
  },
  {
    id: 'meta-ads',
    icon: 'TrendingUp',
    name: 'Meta Ads (Facebook & Instagram)',
    tagline: 'Facebook & Instagram campaigns that bring leads',
    description:
      'Facebook and Instagram ad campaigns built to bring in leads and sales, with the targeting, testing and tracking to show what your budget returns.',
    chips: ['Facebook Ads', 'Instagram Ads', 'Lead Campaigns', 'Retargeting', 'Analytics'],
  },
  {
    id: 'ai-automation',
    icon: 'Workflow',
    name: 'AI Automation & AI Agents',
    tagline: 'Workflow automation and agent pipelines',
    description:
      'AI agents and chatbots that take repetitive work off your team, from answering and qualifying leads to multi-step workflows wired into the tools you already run.',
    chips: ['n8n', 'WhatsApp Business API', 'Custom Agents', 'Integrations'],
  },
];
