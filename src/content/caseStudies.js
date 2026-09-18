/**
 * Case studies — built from Abdullah's 6 real projects (PRD §7.2).
 * INTEGRITY RULE: only metrics documented in the PRD are stated as results.
 * Anything not verifiable is framed qualitatively, never invented.
 *
 * `type` drives the Featured Work filter. `featured` controls Home placement.
 *
 * `service` maps a build to the /services/<slug> page it belongs under, so each
 * case study can link back to the service that sells it. Every value must be a
 * real slug in src/data/servicePages.js.
 *
 * `seoTitle` / `seoDescription` are OPTIONAL and used ONLY by generateMetadata
 * in app/work/[slug]/page.js — never rendered on the page. They exist because
 * eight of these entries carry a formulaic one-line `summary` ("A modern
 * website for a solar energy company, built with Next.js") that is unique as a
 * string but interchangeable as a search result. The replacements are composed
 * from each entry's OWN `problem` copy, so no new claim is introduced — the
 * on-page `summary` is deliberately left exactly as it was.
 */

export const PROJECT_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'dental', label: 'Dental' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'salon', label: 'Salon' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'solar', label: 'Solar' },
  { id: 'events', label: 'Events' },
  { id: 'law', label: 'Legal' },
  { id: 'accounting', label: 'Accountancy' },
  { id: 'pet', label: 'Pet Care' },
  { id: 'homeservices', label: 'Home Services' },
  { id: 'business', label: 'Business' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'live', label: 'Live Clients' },
];

export const caseStudies = [
  {
    slug: 'smile-heaven-dental',
    /** Which /services/<slug> page this build belongs under. */
    service: 'seo',
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
    /** Which /services/<slug> page this build belongs under. */
    service: 'seo',
    title: 'Voila Luxury Skincare',
    client: 'Voila Luxury Skincare',
    type: 'skincare',
    niche: 'Luxury Skincare Clinic',
    year: '2024',
    liveUrl: 'https://viola-brown.vercel.app',
    isLive: true,
    featured: false,
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
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
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
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
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
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
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
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    title: 'Scissors VIP Salon',
    client: 'Scissors VIP Salon',
    type: 'salon',
    niche: 'Live Client · Custom Domain',
    year: '2025',
    liveUrl: 'https://scissorsvipsalon.com',
    isLive: true,
    featured: false,
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
  {
    slug: 'pet-care',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Pet Care Website Design & Development — Case Study',
    seoDescription:
      'How we built a fast, trustworthy website for a pet care business to present its services and capture enquiries, engineered on Next.js by Avenix Studio.',
    title: 'Pet Care Website',
    client: 'Pet Care Business',
    type: 'pet',
    niche: 'Pet Care',
    year: '2025',
    liveUrl: 'https://pet-steel-eta.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/pet.png',
    summary: 'A clean, conversion-focused website for a pet care business, built with Next.js.',
    problem:
      'A pet care business needed a fast, trustworthy online presence to present its services and capture enquiries.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'accountancy-firm',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Accountancy Firm Website Design & Development — Case Study',
    seoDescription:
      'How we built a credible, professional web presence for an accountancy firm to present its services and win client trust, engineered on Next.js.',
    title: 'Accountancy Firm Website',
    client: 'Accountancy Firm',
    type: 'accounting',
    niche: 'Accountancy',
    year: '2025',
    liveUrl: 'https://accountance.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/account.png',
    summary: 'A professional website for an accountancy firm, built with Next.js.',
    problem:
      'An accountancy firm needed a credible, professional web presence to present its services and win client trust.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'solar-company',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Solar Company Website Design & Development — Case Study',
    seoDescription:
      'How we built a fast, credible website for a solar energy company to present its offering and generate leads, engineered on Next.js by Avenix Studio.',
    title: 'Solar Company Website',
    client: 'Solar Energy Company',
    type: 'solar',
    niche: 'Solar Energy',
    year: '2025',
    liveUrl: 'https://solar-compan.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/solar.png',
    summary: 'A modern website for a solar energy company, built with Next.js.',
    problem:
      'A solar energy company needed a fast, credible website to present its offering and generate leads.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Lead-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'events',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Events Business Website Design & Development — Case Study',
    seoDescription:
      'How we built an attractive, fast website for an events business to showcase its work and capture enquiries, engineered on Next.js by Avenix Studio.',
    title: 'Events Website',
    client: 'Events Business',
    type: 'events',
    niche: 'Events',
    year: '2025',
    liveUrl: 'https://event-ivory.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/event.png',
    summary: 'A polished website for an events business, built with Next.js.',
    problem:
      'An events business needed an attractive, fast website to showcase its work and capture enquiries.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'law-firm',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Law Firm Website Design & Development — Case Study',
    seoDescription:
      'How we built a credible, authoritative web presence for a law firm to present its practice areas and win client trust, engineered on Next.js.',
    title: 'Law Firm Website',
    client: 'Law Firm',
    type: 'law',
    niche: 'Legal',
    year: '2025',
    liveUrl: 'https://law-firm-pi-ebon.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/law.png',
    summary: 'A professional website for a law firm, built with Next.js.',
    problem:
      'A law firm needed a credible, authoritative web presence to present its practice areas and win client trust.',
    solution: [
      'Fast Next.js build with a clear practice-areas structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'real-estate',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Real Estate Website Design & Development — Case Study',
    seoDescription:
      'How we built a fast, attractive website for a real estate business to present listings and capture enquiries, engineered on Next.js by Avenix Studio.',
    title: 'Real Estate Website',
    client: 'Real Estate Business',
    type: 'realestate',
    niche: 'Real Estate',
    year: '2025',
    liveUrl: 'https://realestate-nine-beige-15.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/real estate (1).png',
    summary: 'A modern website for a real estate business, built with Next.js.',
    problem:
      'A real estate business needed a fast, attractive website to present listings and capture enquiries.',
    solution: [
      'Fast Next.js build with a clear listings structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'home-services',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Home Services Website Design & Development — Case Study',
    seoDescription:
      'How we built a fast, trustworthy website for a home services business to present its services and book jobs, engineered on Next.js by Avenix Studio.',
    title: 'Home Services Website',
    client: 'Home Services Business',
    type: 'homeservices',
    niche: 'Home Services',
    year: '2025',
    liveUrl: 'https://homeservice-swart.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/service.png',
    summary: 'A clean website for a home services business, built with Next.js.',
    problem:
      'A home services business needed a fast, trustworthy website to present its services and book jobs.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Booking-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'electronics-store',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    title: 'Electronics Store Website',
    client: 'Multi Electronics',
    type: 'ecommerce',
    niche: 'Electronics',
    year: '2025',
    liveUrl: 'https://electronics-flame.vercel.app',
    isLive: true,
    featured: true,
    image: '/images/work/New Multi Electronics.png',
    summary:
      'A full-stack e-commerce website for an electronics store — a React storefront backed by a Node.js/Express API, SQL database, Supabase, and Cloudinary media.',
    problem:
      'An electronics business needed a complete e-commerce platform — not just a storefront, but a real backend to manage products, orders, and media.',
    solution: [
      'React storefront with product browsing and cart',
      'Node.js + Express.js REST API with a SQL database',
      'Supabase for data/auth and Cloudinary for product image hosting',
      'Full end-to-end e-commerce flow from catalog to checkout',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Full-stack build' },
    ],
    tech: ['React', 'Node.js', 'Express.js', 'SQL', 'Supabase', 'Cloudinary'],
  },
  {
    // Public name is Agriprom (confirmed). `slug` is intentionally left as
    // 'forward-solution' so the existing /work/forward-solution URL keeps
    // resolving — changing it would break any live link to this case study.
    slug: 'forward-solution',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    seoTitle: 'Agriprom — Business Solutions Website Case Study',
    seoDescription:
      'How we built a fast, credible website for Agriprom, a business solutions company, to present its offering and generate enquiries — engineered on Next.js.',
    title: 'Agriprom',
    client: 'Agriprom Pakistan',
    type: 'business',
    niche: 'Business Solutions',
    year: '2025',
    liveUrl: 'https://forward-solution.vercel.app',
    isLive: true,
    featured: true,
    image: '/images/work/agriprom.png',
    summary: 'A modern website for a business solutions company, built with Next.js.',
    problem:
      'A business solutions company needed a fast, credible website to present its offering and generate enquiries.',
    solution: [
      'Fast Next.js build with a clear services structure',
      'Mobile-first, brand-aligned presentation',
      'Enquiry-focused layout and calls to action',
    ],
    results: [
      { value: 1, suffix: '', label: 'Live deployment' },
      { value: 100, suffix: '%', label: 'Mobile-first delivery' },
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'seven-guys',
    /** Which /services/<slug> page this build belongs under. */
    service: 'software-development',
    title: 'Seven Guys',
    client: 'Seven Guys',
    type: 'restaurant',
    niche: 'Restaurant · 3 Branches',
    year: '2026',
    liveUrl: 'https://seven-guys-teal.vercel.app',
    isLive: true,
    featured: false,
    image: '/images/work/seven-guys.png',
    summary:
      'An online ordering platform that puts all three Seven Guys branches behind a single checkout. Customers choose delivery or pickup up front, the order routes to the right kitchen, and they can follow it from confirmation through to arrival.',
    problem:
      'Seven Guys was taking orders by phone across three Gujranwala branches. Every order meant a call, a menu recited down the line, and a manual hand-off to whichever kitchen was nearest — with no way for a customer to browse the full menu, confirm what they had ordered, or see where it had got to.',
    solution: [
      'Full online menu with cart and checkout, replacing verbal phone ordering',
      'Delivery or pickup selected up front, with the order routed to the chosen branch',
      'Live order tracking so customers can follow an order after checkout',
      'Branch locator with per-branch directions for all three Gujranwala locations',
      'WhatsApp and direct-call ordering retained alongside the online flow',
      'Customer accounts for order history and repeat ordering',
    ],
    // Feature-based outcomes: this build has no review count or trading metrics
    // to cite yet, so nothing numeric is claimed beyond the branch count, which
    // is verifiable. Entries without `value` render as plain labels.
    results: [
      { value: 3, label: 'Branches unified in one ordering flow' },
      { label: 'Live order tracking' },
      { label: 'WhatsApp + call ordering integrated' },
    ],
    tech: ['Next.js', 'Supabase', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCaseStudies() {
  return caseStudies.filter((c) => c.featured);
}

/**
 * Slugs rendered on /work, in display order. This list — not array position —
 * is the ordering mechanism, so reordering the showcase never means moving
 * 25-line object literals around. Anything absent from this list is hidden from
 * /work (its detail page still resolves by direct URL).
 *
 * TODO — awaiting case-study data (year, summary, problem, solution, results,
 * tech) before these can be added:
 *   'paper-boat'  → slot 5, screenshot ready at /images/work/paperboat.png,
 *                   live at https://paperboat.live
 *   'seven-guys'  → slot 7, no screenshot supplied either
 */
export const SHOWCASE_ORDER = [
  'builtu-gym',
  'xtreme-fitness',
  'forward-solution', // Agriprom
  'scissors-vip-salon',
  // 'paper-boat',     // slot 5 — awaiting case-study data
  'electronics-store', // New Multi Electronics (NME)
  'seven-guys',
];

/** The showcase set, resolved in SHOWCASE_ORDER and skipping unknown slugs. */
export function getShowcaseCaseStudies() {
  return SHOWCASE_ORDER.map((slug) => caseStudies.find((c) => c.slug === slug)).filter(
    Boolean,
  );
}

/** Filter pills, narrowed to the types actually present in the showcase. */
export function getShowcaseTypes() {
  const present = new Set(getShowcaseCaseStudies().map((c) => c.type));
  return PROJECT_TYPES.filter(
    (t) => t.id === 'all' || t.id === 'live' || present.has(t.id),
  );
}

export function filterCaseStudies(type) {
  const items = getShowcaseCaseStudies();
  if (!type || type === 'all') return items;
  if (type === 'live') return items.filter((c) => c.isLive && c.liveUrl);
  return items.filter((c) => c.type === type);
}
