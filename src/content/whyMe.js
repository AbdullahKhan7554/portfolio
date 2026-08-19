/**
 * "Why Avenix" differentiators. Four items, headline 3-6 words, supporting line
 * under 20 — spicy AND short, per the copy brief.
 *
 * Item 1 takes the sharpest stance (it names the industry failure mode); the
 * rest assert what Avenix is rather than what competitors are not. Every claim
 * traces to something already true of the studio — nothing invented.
 */
export const differentiators = [
  {
    id: 'direct',
    icon: 'MessageSquare',
    title: 'No handoff after the pitch',
    description:
      'The engineers who quoted your project are the ones writing it. There’s no second team.',
  },
  {
    id: 'conversion',
    icon: 'Target',
    title: 'Pretty doesn’t pay the bills',
    description:
      'Every layout is engineered around one outcome — a booking, a sale, an enquiry.',
  },
  {
    id: 'performance',
    icon: 'Gauge',
    title: 'Speed isn’t a premium tier',
    description:
      'Core Web Vitals in the green on every Next.js build. Never an upsell.',
  },
  {
    id: 'breadth',
    icon: 'Layers',
    title: 'One team, not four vendors',
    description:
      'Web development, AI automation, and digital marketing in-house. Nothing gets lost in between.',
  },
];

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
