/**
 * Blog posts. Stored as structured, typed content (data-shaped) so the
 * components stay CMS-agnostic — the documented upgrade path is MDX/Velite or
 * Sanity without touching the rendering code.
 *
 * Block types: { type: 'p' | 'h2' | 'ul', text? , items? }
 */
export const posts = [
  {
    slug: 'website-development-pakistan',
    href: '/website-development-pakistan',
    title: 'Website Development in Pakistan: Ultimate 2026 Guide',
    excerpt:
      'The complete 2026 guide to website development in Pakistan — costs, types, process, and how to choose the right developer for clinics, gyms, law firms & more.',
    category: 'Web Development',
    date: '2026-01-20',
    readingTime: '28 min read',
  },
  {
    slug: 'why-your-business-website-needs-to-be-fast',
    title: 'Why a fast website is the cheapest marketing you can buy',
    excerpt:
      'Speed is not a technical vanity metric. It is the quiet difference between a visitor who books and one who bounces — and it compounds across every channel you pay for.',
    category: 'Performance',
    date: '2026-06-10',
    readingTime: '4 min read',
    content: [
      {
        type: 'p',
        text: 'Most business owners think of their website as a brochure. The better mental model is a storefront on the busiest street in the world — where the rent is your ad spend, and the door takes three seconds to open. Every second of delay is customers turning around before they ever see what you offer.',
      },
      { type: 'h2', text: 'Slow sites leak money everywhere' },
      {
        type: 'p',
        text: 'A slow site does not just frustrate visitors. It lowers your search ranking, raises the cost of every paid click, and erodes trust before a word of your copy is read. The damage is invisible because it happens off-screen — in the people who never stayed long enough to convert.',
      },
      { type: 'h2', text: 'What "fast" actually means' },
      {
        type: 'ul',
        items: [
          'Largest Contentful Paint under 2 seconds — your main content appears almost instantly.',
          'No layout shift — nothing jumps around as the page loads.',
          'Instant interactions — taps and clicks respond within 200 milliseconds.',
        ],
      },
      {
        type: 'p',
        text: 'These are the Core Web Vitals Google measures, and they are exactly what I build to on every project. The result is a site that feels premium, ranks better, and quietly converts more of the traffic you already have.',
      },
    ],
  },
  {
    slug: 'whatsapp-first-lead-capture-for-local-business',
    title: 'WhatsApp-first lead capture: meet customers where they already are',
    excerpt:
      'For most local businesses, the highest-converting "contact form" is a one-tap WhatsApp message. Here is how to design for the way clients actually reach out.',
    category: 'Conversion',
    date: '2026-05-22',
    readingTime: '3 min read',
    content: [
      {
        type: 'p',
        text: 'Long contact forms assume a patient, desktop visitor. Real customers are on their phone, between tasks, deciding in seconds whether to reach out at all. The lower the friction, the more leads you capture — and almost nothing is lower-friction than a prefilled WhatsApp message.',
      },
      { type: 'h2', text: 'Why it works' },
      {
        type: 'ul',
        items: [
          'It is the channel people already use every day — no new app, no account.',
          'A prefilled message removes the blank-page hesitation.',
          'Conversations feel personal, which builds trust faster than a form receipt.',
        ],
      },
      { type: 'h2', text: 'Designing it well' },
      {
        type: 'p',
        text: 'A good implementation keeps a contact form for those who prefer it, but makes WhatsApp the obvious, repeated call-to-action — in the hero, after proof, and in a persistent button on mobile. Every tap is tracked, so you know which sections actually drive conversations.',
      },
      {
        type: 'p',
        text: 'It is a small detail. It is also, repeatedly, the single change that moves a local business site from "nice" to "booked".',
      },
    ],
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
