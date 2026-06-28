/**
 * Service packages (PRD §7.11, reframed for Avenix Studio's broader MERN
 * positioning). Indicative pricing per PRD — displayed as "from".
 */
export const services = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'High-converting single-page presence',
    priceFrom: '$300',
    bestFor: 'Campaigns, single offers, MVP landing pages',
    recommended: false,
    features: [
      'One conversion-focused page',
      'Copy guidance & structure',
      'Lead form + WhatsApp click-to-chat',
      'On-page technical SEO',
      'Core Web Vitals tuned',
    ],
    cta: 'Start a Launch project',
  },
  {
    id: 'business',
    name: 'Business Website',
    tagline: 'The complete brand & lead engine',
    priceFrom: '$700',
    bestFor: 'Clinics, gyms, salons & growing businesses',
    recommended: true,
    features: [
      '5–7 page Next.js website',
      'On-page + local technical SEO',
      'Gallery, reviews & social proof',
      'WhatsApp booking + Maps',
      'Analytics & conversion tracking',
      'Performance & accessibility pass',
    ],
    cta: 'Build my website',
  },
  {
    id: 'app',
    name: 'Custom Web App',
    tagline: 'Full-stack MERN product engineering',
    priceFrom: 'from $2,000',
    bestFor: 'Startups, e-commerce & bespoke platforms',
    recommended: false,
    features: [
      'Full-stack MERN / Next.js application',
      'Auth, database & REST APIs',
      'Third-party integrations',
      'Scalable, maintainable architecture',
      'CI/CD & production hardening',
    ],
    cta: 'Request a custom quote',
  },
];
