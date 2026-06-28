/** "Why Work With Me" differentiators (PRD §7.4) — each backed by a concrete claim. */
export const differentiators = [
  {
    id: 'conversion',
    icon: 'Target',
    title: 'Conversion-focused',
    description:
      'Every layout is engineered to move visitors toward booking, buying, or enquiring — not just to look good.',
    hero: true,
  },
  {
    id: 'performance',
    icon: 'Gauge',
    title: 'Engineered for speed',
    description:
      'Core Web Vitals "good", Lighthouse 90+, instant loads. Performance is a feature, not an afterthought.',
  },
  {
    id: 'seo',
    icon: 'Search',
    title: 'Real technical SEO',
    description:
      'Schema, metadata, sitemaps, and clean architecture so you get found — built in from day one.',
  },
  {
    id: 'direct',
    icon: 'MessageSquare',
    title: 'Direct with the developer',
    description:
      'No agency overhead or account managers. You work with the person who actually builds it.',
  },
  {
    id: 'scalable',
    icon: 'Layers',
    title: 'Built to scale',
    description:
      'Clean, component-driven MERN architecture that grows with your business — and stays maintainable.',
  },
  {
    id: 'reliable',
    icon: 'ShieldCheck',
    title: 'Reliable & transparent',
    description:
      'Fixed quotes, clear timelines, and you own everything. No lock-in, no surprises.',
  },
];

/** AI-powered workflow capabilities (PRD §7.5). */
export const aiWorkflow = {
  intro:
    'I use modern AI tooling to deliver faster — without ever outsourcing judgment. Every line is reviewed, typed where it matters, tested, and owned.',
  pipeline: [
    { step: 'Plan', detail: 'Architecture and decisions made by me, not the AI.' },
    { step: 'Build', detail: 'AI accelerates boilerplate and repetitive work.' },
    { step: 'Review', detail: 'Human review for quality, security, and a11y.' },
    { step: 'Ship', detail: 'Tested, performant, production-ready code.' },
  ],
};

/** Performance & SEO commitment scoreboard (PRD §7.6). */
export const perfCommitments = [
  { value: 95, suffix: '+', label: 'Lighthouse score' },
  { value: 2.0, decimals: 1, prefix: '<', suffix: 's', label: 'Largest Contentful Paint' },
  { value: 0.1, decimals: 1, prefix: '<', suffix: '', label: 'Cumulative Layout Shift' },
  { value: 200, prefix: '<', suffix: 'ms', label: 'Interaction to Next Paint' },
];

/** Tech philosophy pillars (PRD §7.7). */
export const philosophyPillars = [
  { title: 'Clean Code', description: 'Readable, modular, and easy to maintain or hand over.' },
  { title: 'Accessibility', description: 'Usable by everyone — WCAG 2.2 AA built in, not bolted on.' },
  { title: 'Performance', description: 'Fast by design, measured on every change.' },
  { title: 'Scalability', description: 'Architecture that grows without rewrites.' },
];
