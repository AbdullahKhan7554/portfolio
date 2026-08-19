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
      'Websites and web apps engineered on Next.js and React — fast, accessible, and built to scale with the business behind them.',
    chips: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'CMS'],
  },
  {
    id: 'mobile-app-development',
    icon: 'Smartphone',
    name: 'Mobile App Development',
    tagline: 'Cross-platform apps, concept to store',
    description:
      'Cross-platform mobile apps taken from concept through to store listing — one codebase, a native feel on both iOS and Android.',
    // Avenix offers BOTH frameworks — the choice is made per project, driven by
    // the client's requirements (confirmed by Abdullah, design system §6 query).
    chips: ['Cross-platform', 'React Native', 'Flutter', 'App Store', 'Google Play'],
  },
  {
    id: 'ai-automation',
    icon: 'Workflow',
    name: 'AI Automation & AI Agents',
    tagline: 'Workflow automation and agent pipelines',
    description:
      'Automate the repetitive work that eats your team’s week — from lead routing to multi-step agent pipelines wired into the tools you already run.',
    chips: ['n8n', 'WhatsApp Business API', 'Custom Agents', 'Integrations'],
  },
  {
    id: 'ai-chatbots',
    icon: 'Bot',
    name: 'AI Chatbots',
    tagline: 'LLM chat that qualifies and hands off',
    description:
      'Assistants that answer and qualify on your website and WhatsApp, then pass the conversation to your CRM with the full context attached.',
    chips: ['LLM', 'Groq', 'Lead Capture', 'CRM Handoff'],
  },
  {
    id: 'digital-marketing',
    icon: 'TrendingUp',
    name: 'Digital Marketing',
    tagline: 'Search, paid, and the numbers behind them',
    description:
      'Paid search and social campaigns that put you in front of the right people — with the analytics to show which channel is actually earning its budget.',
    chips: ['Google Ads', 'Meta Ads', 'Social Ads', 'Analytics'],
  },
  {
    id: 'branding',
    icon: 'Palette',
    name: 'Graphic Design & Branding',
    tagline: 'Identity systems that travel',
    description:
      'Identity that holds up everywhere your brand shows up — logo and type through to a documented, reusable brand system.',
    chips: ['Identity', 'Logo', 'Guidelines', 'Brand Systems'],
  },
  {
    id: 'seo',
    icon: 'Search',
    name: 'SEO',
    tagline: 'Technical, on-page, and off-page search',
    description:
      'Get found by the people already searching for what you do — technical foundations, on-page structure, and the authority signals that move you up the results page.',
    chips: ['Technical SEO', 'On-Page', 'Off-Page', 'AEO / GEO', 'Analytics'],
  },
  {
    id: 'video-editing',
    icon: 'Clapperboard',
    name: 'Video Editing',
    tagline: 'Edits cut for retention',
    description:
      'Short-form and long-form edits built to hold attention — hooks, pacing, and captions tuned to each platform.',
    chips: ['Reels', 'YouTube', 'Shorts', 'Promos'],
  },
];
