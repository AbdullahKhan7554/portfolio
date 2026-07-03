/**
 * Case studies — built from Abdullah's 6 real projects (PRD §7.2).
 * INTEGRITY RULE: only metrics documented in the PRD are stated as results.
 * Anything not verifiable is framed qualitatively, never invented.
 *
 * `type` drives the Featured Work filter. `featured` controls Home placement.
 */

export const PROJECT_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'dental', label: 'Dental' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'salon', label: 'Salon' },
  { id: 'live', label: 'Live Clients' },
];

export const caseStudies = [
  {
    slug: 'smile-heaven-dental',
    title: 'Smile Heaven Dental',
    client: 'Smile Heaven Dental Clinic',
    type: 'dental',
    niche: 'Dental Clinic',
    year: '2024',
    liveUrl: 'https://smile-heaven-roan.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/smile-heaven.png',
    summary:
      'A booking-first website that turns local search into seated appointments — transparent pricing, proof, and one-tap WhatsApp.',
    problem:
      'The clinic relied on word of mouth and had no credible web presence. Prospective patients could not see pricing, real results, or an easy way to book — so trust and bookings leaked to competitors.',
    solution: [
      'A fast Next.js site with a transparent treatment-and-pricing menu',
      'Before/after gallery and review surfacing to build instant trust',
      'FAQ + SEO blog targeting local "dental clinic" search intent',
      'One-tap WhatsApp booking and structured data for local discovery',
    ],
    results: [
      { value: 30, suffix: '+', label: 'Google reviews surfaced' },
      { value: 5.0, decimals: 1, suffix: '★', label: 'Rating positioning' },
      { value: 100, suffix: '%', label: 'Schema + OG coverage' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Technical SEO', 'Vercel'],
  },
  {
    slug: 'voila-luxury-skincare',
    title: 'Voila Luxury Skincare',
    client: 'Voila Luxury Skincare',
    type: 'skincare',
    niche: 'Luxury Skincare Clinic',
    year: '2024',
    liveUrl: 'https://viola-brown.vercel.app',
    isLive: true,
    featured: true,
    image: '/images/work/voila.png',
    summary:
      'A premium multi-page presence for a luxury clinic — treatment storytelling, a bridal journey, and SEO-ready depth.',
    problem:
      'A luxury skincare brand needed a digital presence that matched its in-clinic experience: editorial, multi-treatment, and discoverable — not a one-page template.',
    solution: [
      'Multi-page Next.js architecture with dedicated treatment pages',
      'Bridal section and results gallery for high-intent visitors',
      'Skin-journal blog structured for local SEO authority',
      'Google Maps integration and WhatsApp booking',
    ],
    results: [
      { value: 113, suffix: '+', label: 'Client reviews showcased' },
      { value: 12, suffix: '+', label: 'Structured treatment pages' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Technical SEO', 'Vercel'],
  },
  {
    slug: 'xtreme-fitness',
    title: 'XTREME Fitness',
    client: 'XTREME Fitness',
    type: 'fitness',
    niche: 'Gym & Fitness',
    year: '2024',
    liveUrl: 'https://xtremefitnesstudio.com',
    isLive: true,
    featured: false,
    image: '/images/work/xtreme.png',
    summary:
      'A conversion-focused gym site built around memberships and lead capture, with a confident 24/7 positioning.',
    problem:
      'The gym needed to convert visitors into memberships and leads, with clear programs and pricing that removed friction from signing up.',
    solution: [
      'Hero stats and program breakdown that communicate value fast',
      '3-tier membership pricing engineered for conversion',
      'Facilities showcase, testimonials, and a lead form',
      'Google Maps and a persistent WhatsApp CTA',
    ],
    results: [
      { value: 3, suffix: '', label: 'Membership tiers' },
      { value: 24, suffix: '/7', label: 'Access positioning' },
      { value: 1, suffix: '-tap', label: 'Lead capture' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'gym-website',
    title: 'Gym Website',
    client: 'Fitness Business',
    type: 'fitness',
    niche: 'Gym & Fitness',
    year: '2023',
    liveUrl: 'https://gym-website-psi-lemon.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/gym.png',
    summary:
      'A repeatable, lead-focused gym layout — proof that the conversion structure scales across fitness clients.',
    problem:
      'A fitness business needed a clean, conversion-oriented layout covering programs and memberships without bespoke overhead.',
    solution: [
      'Programs and membership sections with a clear hierarchy',
      'Lead-focused structure repeatable across gym clients',
      'Performance-first Next.js build',
    ],
    results: [
      { value: 100, suffix: '%', label: 'Reusable template' },
      { value: 0, prefix: '<', suffix: 's CLS', label: 'Layout stability' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'builtu-gym',
    title: 'Builtu Gym',
    client: 'Builtu Gym',
    type: 'fitness',
    niche: 'Live Client · Custom Domain',
    year: '2025',
    liveUrl: 'https://builtugym.com',
    isLive: true,
    featured: true,
    image: '/images/work/builtu.png',
    summary:
      'A production gym website running live on a custom domain for a paying client — real-world proof of delivery.',
    problem:
      'A paying gym client needed a production website on their own domain — reliable, fast, and ready to represent the brand publicly.',
    solution: [
      'Production Next.js build deployed on a custom domain with SSL',
      'Conversion-oriented structure for memberships and enquiries',
      'Maintained and live for a real business',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live custom domain' },
      { value: 100, suffix: '%', label: 'Real-client production' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'scissors-vip-salon',
    title: 'Scissors VIP Salon',
    client: 'Scissors VIP Salon',
    type: 'salon',
    niche: 'Live Client · Custom Domain',
    year: '2025',
    liveUrl: 'https://scissorsvipsalon.com',
    isLive: true,
    featured: true,
    image: '/images/work/scissors.png',
    summary:
      'A production salon website live on a custom domain — premium presentation for a real paying client.',
    problem:
      'A salon needed a polished, trustworthy online presence on its own domain to attract and reassure new clients.',
    solution: [
      'Production salon site on a custom domain with SSL',
      'Premium, brand-aligned presentation',
      'Services and contact paths optimized for enquiries',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live custom domain' },
      { value: 100, suffix: '%', label: 'Real-client production' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCaseStudies() {
  return caseStudies.filter((c) => c.featured);
}

export function filterCaseStudies(type) {
  if (!type || type === 'all') return caseStudies;
  if (type === 'live') return caseStudies.filter((c) => c.isLive && c.liveUrl);
  return caseStudies.filter((c) => c.type === type);
}
