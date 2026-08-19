/**
 * Toolkit — tabbed by discipline. Items are Abdullah's source-of-truth stack,
 * used VERBATIM: nothing added, nothing removed.
 *
 * Sub-group labels are presentational only — they organise each tab's list for
 * scanning and never move an item between tabs.
 *
 * GSAP appears in BOTH Web Platforms and Design & Animation by intent (dual
 * relevance). Note this supersedes an earlier decision in this project to drop
 * GSAP because it is not an installed dependency here — as a capability claim
 * that call belongs to Abdullah, not to the repo's package.json.
 */
export const techCategories = [
  {
    id: 'web',
    label: 'Web Platforms',
    groups: [
      { label: 'Framework', items: ['Next.js', 'React', 'JavaScript'] },
      { label: 'Styling & Motion', items: ['Tailwind', 'GSAP', 'Three.js'] },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Apps',
    groups: [
      { label: 'Cross-platform', items: ['React Native', 'Expo', 'Flutter'] },
      { label: 'Backend services', items: ['Firebase'] },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    groups: [
      { label: 'Models', items: ['OpenAI', 'Gemini', 'Claude'] },
      { label: 'Automation', items: ['n8n', 'Make'] },
      { label: 'Patterns', items: ['AI Agents', 'RAG'] },
    ],
  },
  {
    id: 'backend',
    label: 'Database & Backend',
    groups: [
      { label: 'Runtime', items: ['Node.js'] },
      { label: 'Databases', items: ['Supabase', 'PostgreSQL', 'MongoDB', 'Redis'] },
      { label: 'Interfaces', items: ['REST APIs'] },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Deployment',
    groups: [
      { label: 'Hosting', items: ['Vercel', 'AWS', 'Cloudflare'] },
      { label: 'Delivery', items: ['Docker', 'GitHub', 'CI/CD'] },
    ],
  },
  {
    id: 'motion',
    label: 'Design & Animation',
    groups: [
      { label: 'Design', items: ['Figma', 'Framer', 'After Effects'] },
      { label: 'Animation', items: ['GSAP', 'Framer Motion', 'Lottie'] },
    ],
  },
];

/** Marquee strip beneath the panel — headline tools only. */
export const techMarquee = [
  'Next.js',
  'React',
  'Tailwind',
  'React Native',
  'Flutter',
  'OpenAI',
  'Claude',
  'n8n',
  'Node.js',
  'Supabase',
  'PostgreSQL',
  'Vercel',
  'Docker',
  'Figma',
];
