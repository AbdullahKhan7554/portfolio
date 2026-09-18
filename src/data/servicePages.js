/**
 * ============================================================================
 * Service detail pages — content source of truth for the four dedicated
 * service routes under /services/<slug>.
 * ----------------------------------------------------------------------------
 * The four page.js files are thin: they read an entry from here and hand it to
 * <ServiceDetail />. Editing copy is therefore a change to THIS file only, and
 * the four routes can never drift apart structurally.
 *
 * INTEGRITY RULES THIS FILE IS HELD TO
 *  - No prices. `policy.quotePricesAllowed` is false and pricing is a reserved
 *    slot site-wide, so cost questions answer with the process (scope → fixed
 *    quote), never a figure.
 *  - No metrics, no client counts, no "X% faster", no ranking promises. Nothing
 *    here states a number that is not already documented in caseStudies.js.
 *  - `caseStudies.slugs` are REAL slugs from src/content/caseStudies.js. Two of
 *    the four services have no published case study of their own; those pages
 *    carry a `note` saying so plainly and link the closest real platform work,
 *    rather than implying work that does not exist.
 *  - Stack items come from src/content/techStack.js and the `chips` in
 *    src/data/services.js — no tool is claimed that the studio has not listed.
 *
 * `metaTitle` is consumed as `absoluteTitle` (verbatim, bypassing the
 * `%s — Avenix Studio` template) because these titles must lead with the
 * service and the market, not the brand.
 * ============================================================================
 */

/** Shared closing CTA copy — identical intent on all four pages, one definition. */
export const SERVICE_CTA = {
  title: 'Tell us what you are building.',
  body: 'Send us the problem in a sentence or two. You will get a scoped proposal with a fixed quote and a timeline before any work starts — not a sales sequence.',
};

export const servicePages = [
  // ==========================================================================
  {
    slug: 'software-development',
    metaTitle: 'Software Development Company in Pakistan | Avenix Studio',
    metaDescription:
      'Custom software development company in Lahore, Pakistan — web applications, internal tools and commerce platforms built on Next.js, React and Node.js.',
    keywords: [
      'software development company in Pakistan',
      'custom software development',
      'software house in Lahore',
      'web application development',
      'Next.js development company',
    ],
    serviceType: [
      'Software Development',
      'Custom Software Development',
      'Web Application Development',
    ],
    eyebrow: 'Software Development',
    h1: 'Software Development Company in Pakistan',
    intro:
      'We build custom software for businesses that have outgrown off-the-shelf tools — web applications, commerce platforms and internal systems, engineered to be maintained rather than rewritten.',
    /**
     * ANSWER-FIRST PARAGRAPH (AEO). Leads with the direct answer to "what is
     * this and who is it for", in one self-contained block that can be quoted
     * without the surrounding page.
     */
    lede: 'Avenix Studio is a software development company based in Lahore, Pakistan, building custom web applications and platforms for clients in Pakistan and internationally. We take a product from scope through architecture, build, testing and launch, and hand over code the client fully owns.',
    offerings: [
      {
        title: 'Custom web applications',
        description:
          'Dashboards, booking systems, portals and internal tools built around how your business actually runs — not bent to fit a template.',
      },
      {
        title: 'Commerce and ordering platforms',
        description:
          'Storefronts, checkout and order-routing flows backed by a real API and database, built to handle catalogue and fulfilment logic rather than a plugin stack.',
      },
      {
        title: 'Business websites on a real framework',
        description:
          'Marketing sites engineered on Next.js and React — fast, accessible, and structured so search engines and AI assistants can read them.',
      },
      {
        title: 'APIs and integrations',
        description:
          'REST APIs and third-party integrations that connect the software to the tools your team already runs, with the data model documented.',
      },
      {
        title: 'Rebuilds and rescues',
        description:
          'Taking over a slow, fragile or abandoned codebase — auditing what exists, then rebuilding what has to change without stopping the business.',
      },
    ],
    process: [
      {
        title: 'Scope',
        description:
          'We map the workflow the software has to support and agree what is in and out of version one, so the quote is fixed rather than open-ended.',
      },
      {
        title: 'Architecture',
        description:
          'Data model, integrations and hosting decided up front and written down — the decisions that are expensive to reverse are made before any code is written.',
      },
      {
        title: 'Build',
        description:
          'Component-driven development on Next.js and React with milestone reviews, so you see working software as it comes together, not at the end.',
      },
      {
        title: 'Test and launch',
        description:
          'Cross-device and accessibility checks, then deployment with SSL, analytics and search fundamentals live from day one.',
      },
      {
        title: 'Handover',
        description:
          'You receive the repository, the accounts and the documentation. Every project is handed over clean — nothing is locked to us.',
      },
    ],
    stack: [
      { label: 'Application', items: ['Next.js', 'React', 'JavaScript', 'Tailwind'] },
      { label: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs'] },
      { label: 'Data', items: ['Supabase', 'PostgreSQL', 'MongoDB', 'Redis'] },
      { label: 'Delivery', items: ['Vercel', 'Docker', 'GitHub', 'CI/CD'] },
    ],
    caseStudies: {
      note: 'Recent builds where the engineering, not the page count, was the work.',
      slugs: ['electronics-store', 'seven-guys', 'builtu-gym'],
    },
    faqs: [
      {
        question: 'What does a software development company actually do?',
        answer:
          'A software development company designs, builds, tests and maintains custom software for a client. At Avenix Studio that means scoping the workflow the software has to support, choosing the architecture, building the application, testing it across devices, deploying it, and handing over the code and accounts to the client.',
      },
      {
        question: 'How much does custom software cost in Pakistan?',
        answer:
          'Cost depends on scope, so we quote per project rather than from a price list. A focused internal tool, a commerce platform and a multi-role web application are very different builds. You get a fixed, written quote and a timeline before any work begins, and the figure does not move unless the scope does.',
      },
      {
        question: 'How long does a custom software project take?',
        answer:
          'A focused application typically runs in weeks rather than months, and larger platforms are broken into milestones so something usable ships early. We commit to a milestone timeline in the proposal, before the project starts.',
      },
      {
        question: 'Do we own the source code?',
        answer:
          'Yes. You own one hundred per cent of the code, the content and the accounts. Everything is handed over at the end of the project and nothing is locked to a proprietary platform or to us as a vendor.',
      },
      {
        question: 'Do you work with clients outside Pakistan?',
        answer:
          'Yes. The studio is based in Lahore and works with clients in Pakistan and internationally, remotely. Communication is over email and WhatsApp with a single point of contact, and calls are scheduled around the client time zone.',
      },
      {
        question: 'Can you take over an existing codebase?',
        answer:
          'Yes. We start with an audit of what already exists, report what is worth keeping and what has to be rebuilt, then work in stages so the business keeps running while the software is repaired or replaced.',
      },
    ],
    related: ['ai-automation', 'mobile-app-development', 'seo'],
  },

  // ==========================================================================
  {
    slug: 'ai-automation',
    metaTitle: 'AI Automation Services & AI Agents | Avenix Studio',
    metaDescription:
      'AI automation services for growing businesses — workflow automation, AI agents and chatbots wired into the tools you already run. Avenix Studio, Lahore.',
    keywords: [
      'AI automation services',
      'AI automation agency',
      'AI agents for business',
      'workflow automation',
      'AI chatbot development',
    ],
    serviceType: [
      'AI Automation',
      'AI Agents',
      'Workflow Automation',
      'AI Chatbot Development',
    ],
    eyebrow: 'AI Automation',
    h1: 'AI Automation Services',
    intro:
      'We automate the repetitive work that quietly eats your team’s week — lead routing, follow-up, data entry and hand-offs — using AI agents wired into the tools you already run.',
    lede: 'AI automation is the use of AI models and workflow tools to carry out repeatable business tasks without a person doing them by hand. Avenix Studio builds these systems for businesses in Pakistan and internationally: we map the workflow, connect the tools, build and test the automation, then hand over a system the client controls.',
    offerings: [
      {
        title: 'Workflow automation',
        description:
          'The repeatable steps between your tools — a form becoming a CRM record, a message becoming a task — connected so nobody retypes anything.',
      },
      {
        title: 'AI agents',
        description:
          'Multi-step agents that read, decide and act across your systems, with the decision points and fallbacks defined so behaviour stays predictable.',
      },
      {
        title: 'AI chatbots',
        description:
          'Assistants for your website and WhatsApp that answer real questions, qualify the enquiry, and pass it on with the full conversation attached.',
      },
      {
        title: 'Lead routing and follow-up',
        description:
          'Enquiries captured, qualified and routed to the right person, with follow-up that runs on its own instead of depending on somebody remembering.',
      },
      {
        title: 'Integrations',
        description:
          'Connecting the tools you already pay for — CRM, inbox, sheets, WhatsApp Business API — rather than adding another system for your team to learn.',
      },
    ],
    process: [
      {
        title: 'Map the workflow',
        description:
          'We watch how the task is done manually today and write down every step, including the exceptions. Automating a process nobody has mapped is how automation fails.',
      },
      {
        title: 'Pick the smallest useful win',
        description:
          'We start with the step that costs the most hours and is the least ambiguous, so the first automation proves itself before scope grows.',
      },
      {
        title: 'Build and connect',
        description:
          'The automation is built and wired into your existing tools, with credentials held in your accounts — not ours.',
      },
      {
        title: 'Test against real cases',
        description:
          'Run against real historical inputs, including the awkward ones, with a human checkpoint anywhere a wrong decision would be expensive.',
      },
      {
        title: 'Hand over and monitor',
        description:
          'You get the documented workflow and the access. We stay on to watch the first live cycles and adjust what reality disagrees with.',
      },
    ],
    stack: [
      { label: 'Models', items: ['OpenAI', 'Gemini', 'Claude'] },
      { label: 'Automation', items: ['n8n', 'Make'] },
      { label: 'Patterns', items: ['AI Agents', 'RAG'] },
      { label: 'Channels', items: ['WhatsApp Business API', 'REST APIs', 'Supabase'] },
    ],
    caseStudies: {
      /**
       * HONEST DISCLOSURE, NOT A HEDGE. There is no AI-automation case study in
       * caseStudies.js, so none is implied. The linked builds are real platform
       * work by the same team, labelled as exactly that.
       */
      note: 'We have not published an AI automation case study yet. These are recent platform builds by the same team — the kind of systems these automations get wired into.',
      slugs: ['seven-guys', 'electronics-store'],
    },
    faqs: [
      {
        question: 'What is AI automation?',
        answer:
          'AI automation is using AI models together with workflow tools to complete repeatable business tasks without a person doing them manually. Typical examples are routing and replying to enquiries, extracting information from documents or messages, updating records across systems, and triggering follow-up at the right moment.',
      },
      {
        question: 'What can realistically be automated in my business?',
        answer:
          'The best candidates are tasks that happen often, follow a rule, and do not need judgement — enquiry routing, data entry between tools, first-line question answering, appointment and follow-up reminders, and report assembly. Anything needing real judgement is better designed as an agent that prepares the work and a person who approves it.',
      },
      {
        question: 'Will AI automation replace my staff?',
        answer:
          'That is not how we scope it. The work we automate is the repetitive portion of a role — the retyping, the chasing, the copying between tabs — so the people doing it spend their time on the parts that need a person. We design the hand-off points deliberately, including where a human has to approve.',
      },
      {
        question: 'Do you use our existing tools or replace them?',
        answer:
          'We build on the tools you already pay for wherever possible. Automations connect to your CRM, inbox, spreadsheets and WhatsApp rather than asking your team to adopt another system, and credentials stay in your accounts.',
      },
      {
        question: 'How long does an automation take to build?',
        answer:
          'A single well-defined workflow is usually a short engagement rather than a long project, because the mapping is most of the work. Larger agent systems are staged, so the first automation is live and earning time back while the next is being built.',
      },
      {
        question: 'What happens when the automation gets something wrong?',
        answer:
          'We design for it up front. Anywhere a wrong decision would be expensive there is a human checkpoint, and every run is logged so a failure can be traced rather than guessed at. After launch we watch the first live cycles and adjust the rules against what actually comes through.',
      },
    ],
    related: ['software-development', 'mobile-app-development', 'seo'],
  },

  // ==========================================================================
  {
    slug: 'mobile-app-development',
    metaTitle: 'Mobile App Development Company in Pakistan | Avenix Studio',
    metaDescription:
      'Mobile app development in Lahore, Pakistan. Cross-platform iOS and Android apps in React Native and Flutter — one codebase, concept to store listing.',
    keywords: [
      'mobile app development company in Pakistan',
      'mobile app development Lahore',
      'React Native app development',
      'Flutter app development',
      'cross-platform app development',
    ],
    serviceType: [
      'Mobile App Development',
      'Cross-Platform App Development',
      'iOS App Development',
      'Android App Development',
    ],
    eyebrow: 'Mobile Apps',
    h1: 'Mobile App Development in Pakistan',
    intro:
      'Cross-platform apps taken from concept through to store listing — one codebase that feels native on both iOS and Android, built by the team that will still be there after launch.',
    lede: 'Avenix Studio builds cross-platform mobile applications from its base in Lahore, Pakistan, for clients locally and internationally. We use React Native and Flutter so a single codebase serves both iOS and Android, and we handle the work through to submission on the App Store and Google Play.',
    offerings: [
      {
        title: 'Cross-platform apps',
        description:
          'One codebase running on both iOS and Android, chosen per project between React Native and Flutter rather than fixed in advance.',
      },
      {
        title: 'App and API together',
        description:
          'The app and the backend it depends on built by the same team, so the data model and the interface are designed against each other.',
      },
      {
        title: 'Store submission',
        description:
          'Listing assets, store metadata and the submission process handled through to approval on the App Store and Google Play.',
      },
      {
        title: 'Companion apps for existing platforms',
        description:
          'A mobile front end for a business that already runs on the web, sharing the same API rather than forking the logic.',
      },
      {
        title: 'Post-launch iteration',
        description:
          'Releases after version one — the fixes and additions that only become obvious once real users are in the app.',
      },
    ],
    process: [
      {
        title: 'Define version one',
        description:
          'We agree the smallest app worth shipping and what deliberately waits for version two, because a first release that tries to do everything ships late and learns nothing.',
      },
      {
        title: 'Choose the framework',
        description:
          'React Native or Flutter, decided against your requirements — existing codebase, device features needed, and who will maintain it — not by habit.',
      },
      {
        title: 'Design for the device',
        description:
          'Screens designed mobile-first against real platform conventions, so the app reads as native on each platform rather than as a website in a frame.',
      },
      {
        title: 'Build and test on hardware',
        description:
          'Development with milestone builds you can install and use, tested on real devices on both platforms rather than only in a simulator.',
      },
      {
        title: 'Submit and support',
        description:
          'We prepare the listing, submit to both stores, and stay on through review and the first release window.',
      },
    ],
    stack: [
      { label: 'Cross-platform', items: ['React Native', 'Expo', 'Flutter'] },
      { label: 'Backend services', items: ['Firebase', 'Supabase', 'Node.js'] },
      { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'REST APIs'] },
      { label: 'Design', items: ['Figma', 'Lottie'] },
    ],
    caseStudies: {
      /** Same disclosure rule as AI automation — see the note there. */
      note: 'Our published case studies are web platforms; we have not published a mobile app case study yet. These are the closest recent builds — the same team, the same product engineering behind the interface.',
      slugs: ['seven-guys', 'electronics-store'],
    },
    faqs: [
      {
        question: 'Should I build one cross-platform app or two native apps?',
        answer:
          'For most businesses a single cross-platform codebase is the better call: one team, one set of features to keep in sync, and both platforms released together. Separate native apps are worth the extra cost when the product depends heavily on platform-specific hardware or on the very latest operating-system features.',
      },
      {
        question: 'React Native or Flutter — which do you use?',
        answer:
          'We work in both and choose per project. React Native tends to win when there is already a React or Next.js codebase and shared logic, and when the team maintaining it knows JavaScript. Flutter tends to win when the interface is highly custom and needs to look identical on both platforms. We make the recommendation during scoping and explain the trade-off.',
      },
      {
        question: 'How much does it cost to build an app in Pakistan?',
        answer:
          'We quote per project rather than from a price list, because the range is wide: a focused single-purpose app and a multi-role app with payments and a custom backend are different builds. You receive a fixed written quote and a milestone timeline before any work starts.',
      },
      {
        question: 'Do you handle publishing to the App Store and Google Play?',
        answer:
          'Yes. Store listing assets, metadata and the submission itself are part of the engagement, and we stay on through the review process. Developer accounts are registered in your name so you own the listings.',
      },
      {
        question: 'Can you build the backend as well as the app?',
        answer:
          'Yes, and we prefer to. When the same team builds the API and the app, the data model is designed against the screens that consume it, which removes a whole category of integration problems later.',
      },
      {
        question: 'What happens after the app is launched?',
        answer:
          'There is a support window after go-live for anything that surfaces in real usage. Beyond that, ongoing releases and feature work are available on request — apps need maintenance as the platforms themselves update.',
      },
    ],
    related: ['software-development', 'ai-automation', 'seo'],
  },

  // ==========================================================================
  {
    slug: 'seo',
    metaTitle: 'SEO Services in Pakistan | Avenix Studio',
    metaDescription:
      'SEO services from Avenix Studio, Lahore — technical SEO, on-page structure, local search and AEO, so your business is found by people already searching for it.',
    keywords: [
      'SEO services in Pakistan',
      'SEO agency Lahore',
      'technical SEO services',
      'local SEO Pakistan',
      'AEO and GEO optimisation',
    ],
    serviceType: [
      'Search Engine Optimization',
      'Technical SEO',
      'Local SEO',
      'Answer Engine Optimization',
    ],
    eyebrow: 'SEO',
    h1: 'SEO Services in Pakistan',
    intro:
      'Get found by the people already searching for what you do — technical foundations, on-page structure, local search, and the answer-engine work that decides whether AI assistants can quote you.',
    lede: 'SEO is the work of making a website findable and understandable to search engines and, increasingly, to AI assistants. Avenix Studio provides technical SEO, on-page optimisation, local SEO and answer-engine optimisation from Lahore, Pakistan. We are engineers first, so technical fixes are implemented in the codebase rather than handed over as a list.',
    offerings: [
      {
        title: 'Technical SEO',
        description:
          'Crawlability, indexing, site architecture, canonicals, structured data and Core Web Vitals — the foundations everything else depends on.',
      },
      {
        title: 'On-page optimisation',
        description:
          'Titles, descriptions, heading structure and internal linking mapped to real search intent, page by page, with no duplicate or placeholder metadata left behind.',
      },
      {
        title: 'Local SEO',
        description:
          'The work that makes a business findable in its own city — consistent name, address and phone details, local business structured data, and location-relevant pages.',
      },
      {
        title: 'AEO and GEO',
        description:
          'Structuring content so answer engines and AI assistants can quote it — direct question-and-answer formatting, clean entity information and valid schema.',
      },
      {
        title: 'Content and keyword mapping',
        description:
          'Deciding which page targets which intent, so your pages compete with the market instead of with each other.',
      },
      {
        title: 'Measurement',
        description:
          'Search Console and analytics configured and read properly, so decisions come from your own data rather than a generic dashboard.',
      },
    ],
    process: [
      {
        title: 'Audit',
        description:
          'A full technical and on-page audit against your live site and your own Search Console data — what is indexed, what is not, and what is ranking for nothing.',
      },
      {
        title: 'Map intent to pages',
        description:
          'Every target query is assigned to one page. Where no page deserves to rank for a query, that is a page to build, not a keyword to insert.',
      },
      {
        title: 'Fix the foundations',
        description:
          'Technical issues implemented in the codebase — metadata, structured data, internal links, performance — rather than delivered as recommendations for someone else to action.',
      },
      {
        title: 'Build and structure content',
        description:
          'Pages written to answer the query directly, formatted so both a reader and an answer engine can extract the answer.',
      },
      {
        title: 'Measure and iterate',
        description:
          'We track impressions, positions and clicks in Search Console and adjust against what the data shows. Search work compounds; it is reviewed on a cycle, not declared finished.',
      },
    ],
    stack: [
      { label: 'Technical', items: ['Next.js', 'Structured Data', 'Core Web Vitals'] },
      { label: 'Measurement', items: ['Google Search Console', 'GA4', 'Microsoft Clarity'] },
      { label: 'Scope', items: ['Technical SEO', 'On-Page', 'Off-Page', 'AEO / GEO'] },
    ],
    caseStudies: {
      note: 'Builds where search visibility was part of the brief, not an afterthought.',
      slugs: ['smile-heaven-dental', 'voila-luxury-skincare'],
    },
    faqs: [
      {
        question: 'How long does SEO take to show results?',
        answer:
          'Technical fixes can be reflected within weeks, because they change how a site is crawled and indexed. Competitive rankings take longer and depend on the market, the site’s existing authority and how much content work is needed. Nobody can honestly guarantee a position or a date, and we do not.',
      },
      {
        question: 'What is the difference between SEO, AEO and GEO?',
        answer:
          'SEO optimises for ranking in a list of search results. AEO, answer engine optimisation, structures content so an engine can lift a direct answer out of it — for featured snippets and voice results. GEO, generative engine optimisation, aims at being cited by AI assistants such as ChatGPT and Google AI Overviews. They overlap heavily: clean structure, valid schema and directly answered questions serve all three.',
      },
      {
        question: 'Can you guarantee a number one ranking?',
        answer:
          'No, and any agency that does is describing something it cannot control. Rankings are decided by search engines against competitors who are also working. What we commit to is the work itself: the technical foundations, the page structure, the content and the measurement, reported honestly against your own Search Console data.',
      },
      {
        question: 'What is local SEO and does my business need it?',
        answer:
          'Local SEO is the work that makes a business findable in searches tied to a place — "near me" queries, city-name queries and map results. It matters if you serve customers in a specific city or region. The core of it is a verified Google Business Profile, consistent name, address and phone details everywhere they appear, and local business structured data on your site.',
      },
      {
        question: 'Do I need to rebuild my website to do SEO properly?',
        answer:
          'Usually not. Most sites can be fixed in place, and we start with an audit that says plainly what can be repaired and what cannot. A rebuild is only worth recommending when the platform itself blocks the fundamentals — for example if pages cannot be server-rendered or metadata cannot be set per page.',
      },
      {
        question: 'Do you do the technical work or only advise?',
        answer:
          'We implement. The studio builds software, so technical SEO findings are fixed in the codebase as part of the engagement rather than written into a report and handed to someone else. Where a site is on a platform we do not control, we supply exact, actionable changes.',
      },
    ],
    related: ['software-development', 'ai-automation', 'mobile-app-development'],
  },
];

/** Safe lookup by slug. */
export function getServicePage(slug) {
  return servicePages.find((s) => s.slug === slug);
}

/** All service route paths — consumed by app/sitemap.js so the two cannot drift. */
export function getServicePagePaths() {
  return servicePages.map((s) => `/services/${s.slug}`);
}

/** Hub-card shape for /services and the homepage link row. */
export function getServiceSummaries() {
  return servicePages.map((s) => ({
    slug: s.slug,
    href: `/services/${s.slug}`,
    title: s.h1,
    eyebrow: s.eyebrow,
    intro: s.intro,
  }));
}
