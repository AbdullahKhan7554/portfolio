/**
 * Blog posts. Stored as structured, typed content (data-shaped) so the
 * components stay CMS-agnostic — the documented upgrade path is MDX/Velite or
 * Sanity without touching the rendering code.
 *
 * Block types: { type: 'p' | 'h2' | 'ul', text? , items? }
 *
 * COVERS
 * `cover: { src, alt }` is the full-bleed banner rendered above the title by
 * <PostCover>. It lives on the post object rather than in a separate registry
 * because — unlike the shared page-hero art in src/content/pageHeroes.js, where
 * one photograph serves three routes — each of these is specific to exactly one
 * post and could not be reused if it tried.
 *
 * Every cover is a 3:2 WebP in public/blogs/, named for the slug it belongs to.
 * The 1536x1024 PNG masters they were derived from are retained beside them and
 * are referenced by nothing.
 *
 * ALT TEXT DELIBERATELY DOES NOT RESTATE THE TITLE. Each of these images has the
 * post's headline set into it as artwork, and the <h1> saying the same words
 * sits directly below the band — alt that repeated it would have a screen reader
 * announce the title twice in a row. So the alt describes the ILLUSTRATION, the
 * same convention pageHeroes.js follows.
 *
 * `cover` is optional. A post without one renders exactly the header that
 * shipped before it existed.
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
    cover: {
      src: '/blogs/website-development-pakistan.webp',
      alt: 'A laptop showing a code editor on a bright desk, beside a notebook lettered "plan, design, develop, launch" and a mug reading "building digital futures", with an outline map of Pakistan and floating development, responsive, SEO, design and growth tiles behind it',
    },
  },
  {
    slug: 'why-your-business-website-needs-to-be-fast',
    title: 'Why a fast website is the cheapest marketing you can buy',
    excerpt:
      'Speed is not a technical vanity metric. It is the quiet difference between a visitor who books and one who bounces — and it compounds across every channel you pay for.',
    category: 'Performance',
    date: '2026-06-10',
    readingTime: '4 min read',
    cover: {
      src: '/blogs/why-your-business-website-needs-to-be-fast.webp',
      alt: 'A laptop displaying a dark website hero with amber light-trails, surrounded by floating panels reporting a PageSpeed score of 98, a 1.2 second load time and passing Core Web Vitals, next to a speedometer dial reading 1.2s',
    },
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
    cover: {
      src: '/blogs/whatsapp-first-lead-capture-for-local-business.webp',
      alt: 'A phone standing on a dark stone ledge showing a contact screen with a green "chat on WhatsApp" button, beside a WhatsApp logo and a chat bubble in which a customer asks to discuss their project',
    },
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
