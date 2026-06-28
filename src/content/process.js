/** Development process (PRD §7.3) — client-benefit framing. */
export const processSteps = [
  {
    id: 'discovery',
    title: 'Discovery',
    description:
      'I learn your business, your customers, and the one outcome that matters most — so every decision is aimed at it.',
    deliverables: ['Goals', 'Scope', 'Sitemap'],
  },
  {
    id: 'design',
    title: 'Design',
    description:
      'A premium, on-brand interface designed mobile-first, built to guide visitors toward action.',
    deliverables: ['UI', 'Tokens', 'Prototype'],
  },
  {
    id: 'development',
    title: 'Development',
    description:
      'Clean, component-driven engineering on Next.js — fast, accessible, and built to scale.',
    deliverables: ['Next.js', 'Components', 'CMS'],
  },
  {
    id: 'testing',
    title: 'Testing',
    description:
      'I catch the bugs so your customers never do — cross-device, cross-browser, and accessibility checked.',
    deliverables: ['QA', 'A11y', 'Forms'],
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description:
      'Launched on Vercel with SSL, analytics, and SEO live — plus a support window after go-live.',
    deliverables: ['Vercel', 'SEO', 'Support'],
  },
];

/** Client engagement journey (PRD §7.10) — the business journey. */
export const engagementSteps = [
  { id: 'inquiry', title: 'Inquiry', description: 'You reach out via the form or WhatsApp.' },
  { id: 'call', title: 'Consultation', description: 'A short call to understand your goals.' },
  { id: 'proposal', title: 'Proposal', description: 'A fixed quote, scope, and timeline.' },
  { id: 'build', title: 'Build', description: 'Design and development with milestone reviews.' },
  { id: 'handover', title: 'Handover', description: 'Launch, training, and a support window.' },
];
