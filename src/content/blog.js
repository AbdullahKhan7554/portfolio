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
 * shipped before it existed. The ten long-tail posts added for search have no
 * cover yet — art is a follow-up, and referencing a file that does not exist
 * would render a broken image rather than the clean cover-less header.
 *
 * ---------------------------------------------------------------------------
 * THREE OPTIONAL FIELDS ADDED FOR THE SEARCH POSTS
 *
 * `faqs: [{ question, answer }]`
 *   Rendered as native <details> and emitted as FAQPage JSON-LD by
 *   app/blog/[slug]/page.js. Both read this same array, so the visible answer
 *   and the structured one cannot disagree. Omitting the field emits no schema
 *   and renders no section — the three original posts are untouched.
 *
 * `service: '<slug>'`
 *   Which /services/<slug> page the post is written to feed. Documentation for
 *   the author, not read at runtime: the actual link is the `p-link` block, and
 *   the two are kept pointing at the same place by hand.
 *
 * `{ type: 'p-link', before, href, anchor, after }`
 *   A paragraph containing exactly one internal <Link>. Every value is a plain
 *   string — no markup is ever parsed or injected. ONE per post: the anchor
 *   text is the signal, and repeating it is how a helpful link becomes spam.
 *
 * ON NUMBERS IN THESE POSTS
 * Two of them answer cost questions. This repo holds no verified Pakistani
 * price data and `policy.quotePricesAllowed` is false, so they explain what
 * DRIVES cost — scope, integrations, platform count, maintenance — and how to
 * read a quote. No figure is stated as fact. That is deliberate.
 * ---------------------------------------------------------------------------
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
  {
    slug: 'mobile-app-development-cost-pakistan',
    title: 'How much does it cost to build a mobile app in Pakistan?',
    excerpt:
      'App quotes in Pakistan vary hugely because "an app" covers everything from a catalogue to a payment platform. What drives the cost, and how to read a quote.',
    category: 'Mobile Apps',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'mobile-app-development',
    content: [
      {
        type: 'p',
        text: 'There is no single price for a mobile app in Pakistan, and any studio quoting one before asking what the app does is guessing. Cost is driven almost entirely by scope — how many screens, how much custom backend, whether payments are involved, and how much has to be maintained after launch — which is why two quotes for "an app" can differ by a factor of ten and both be honest.',
      },
      {
        type: 'p',
        text: 'This post explains what actually moves the number so you can read a quote properly, ask better questions, and tell a serious proposal from a cheap one that will cost more later. We deliberately do not publish a price list, for reasons covered at the end.',
      },
      { type: 'h2', text: 'The five things that actually drive app cost' },
      {
        type: 'ul',
        items: [
          'Number of distinct screens and flows. A catalogue app with eight screens and a contact button is a different build from one with onboarding, search, a cart, a profile and an order history. Screens are the crudest proxy for scope, but it is the one most clients can estimate themselves.',
          'Whether it needs a custom backend. An app that only displays content can often run on a hosted service. An app with accounts, roles, orders or inventory needs a real API and database designed for it — frequently a larger job than the app itself.',
          'Payments and third-party integrations. Every integration is a separate contract with someone else’s system: their rules, their edge cases, their failure modes. Payments in particular bring compliance, testing and error handling that a display-only app never touches.',
          'One platform or two. Cross-platform frameworks mean one codebase serves iOS and Android, so the second platform is far from a second full build — but it is not free either. Store review, device testing and platform-specific behaviour still cost real time.',
          'What happens after launch. An app is not a one-off purchase. Operating systems update annually, stores change their requirements, and libraries need patching. A quote with no maintenance line is not cheaper; it is incomplete.',
        ],
      },
      { type: 'h2', text: 'Four scope tiers, described rather than priced' },
      {
        type: 'p',
        text: 'Most projects land in one of four bands. Thinking in bands is more useful than thinking in figures, because it tells you which conversation you are actually in.',
      },
      {
        type: 'ul',
        items: [
          'Informational app. Content, a directory or a catalogue, no accounts. Closest to a mobile website in a native shell. The cheapest real option, and often the wrong one — if this is all you need, a fast mobile site may serve you better for less.',
          'Transactional app. Accounts, a database, some workflow: bookings, orders, memberships, submissions. This is where most small-business apps genuinely sit, and where a custom backend becomes unavoidable.',
          'Platform app. Multiple user roles, payments, notifications, an admin panel, possibly a web counterpart sharing the same API. Cost steps up sharply here because you are commissioning a system, not a screen set.',
          'Ongoing product. A team, a roadmap, continuous releases. Priced as sustained capacity rather than as a project, because that is what it is.',
        ],
      },
      { type: 'h2', text: 'Why two quotes for the same brief differ so much' },
      {
        type: 'p',
        text: 'When quotes diverge wildly, it is rarely because one studio is greedy. Usually they have read the brief differently, and the gap tells you what each has assumed.',
      },
      {
        type: 'ul',
        items: [
          'Design included or not. A quote assuming you supply finished designs is smaller than one that includes designing the app. Both are valid; only one matches what you have.',
          'Backend included or not. The single most common reason a quote looks suspiciously low. Ask directly whether the API and database are in scope.',
          'Testing depth. Testing on two real devices is not testing on twenty. Neither is wrong, but they are not the same product.',
          'Store submission. Preparing listing assets, writing metadata and surviving review is genuine work. Some quotes include it; many do not mention it until afterwards.',
          'Revisions. Structured rounds at agreed milestones cost less than open-ended changes, because open-ended changes have no end.',
        ],
      },
      { type: 'h2', text: 'The costs people forget to budget for' },
      {
        type: 'ul',
        items: [
          'Developer accounts. Apple and Google both charge to publish, one annually. Small, but it surprises people.',
          'Backend hosting and database. Ongoing, and it scales with usage rather than staying flat.',
          'Third-party services. Payment processing, SMS, push notifications and mapping all bill per use.',
          'Maintenance. Budget for it deliberately rather than discovering it when an OS update breaks something.',
          'Content. Someone has to write the copy and produce the images. It is almost always the client, and it is almost always the thing that delays launch.',
        ],
      },
      { type: 'h2', text: 'How to get a quote you can actually trust' },
      {
        type: 'p',
        text: 'Write down the three things the app must let a user do. Not ten — three. Then ask each studio to quote that, listing explicitly what is in and out of scope, what the maintenance arrangement is, and who owns the code and the store accounts at the end. A studio that responds with questions before a number is a better sign than one that responds with a number immediately.',
      },
      {
        type: 'p',
        text: 'Be wary of a quote that is dramatically below the others. It usually means the backend is excluded, the testing is nominal, or the relationship ends at handover — and an app you cannot maintain is an expense, not an asset.',
      },
      { type: 'h2', text: 'Why we do not publish an app price list' },
      {
        type: 'p',
        text: 'A published figure would be either meaninglessly wide or quietly wrong for your project, and it would push the conversation toward hitting a number instead of scoping the right build. We quote per project after understanding what the app has to do, and the figure is fixed in writing before work starts — it does not move unless the scope does.',
      },
      {
        type: 'p-link',
        before: 'If you are weighing up a build and want the scope pinned down before anyone talks money, our ',
        href: '/services/mobile-app-development',
        anchor: 'mobile app development service',
        after: ' page sets out how we take a project from a defined version one through to a store listing, and which framework we would recommend for which situation.',
      },
    ],
    faqs: [
      {
        question: 'Is it cheaper to build an app in Pakistan than abroad?',
        answer:
          'Generally yes — rates in Pakistan are lower than in North America, Western Europe or Australia, which is why many international clients build here. But rate is only half the equation. A cheaper team that needs twice the hours, or that delivers something needing a rebuild, is not cheaper. Compare total delivered cost and what happens after launch, not the hourly figure.',
      },
      {
        question: 'Does building for both iOS and Android double the cost?',
        answer:
          'No. With a cross-platform framework such as React Native or Flutter, a single codebase serves both, so the second platform adds a fraction rather than a multiple. That fraction is not zero — device testing, store review and platform-specific behaviour still take time — but doubling is the wrong mental model unless you are commissioning two separate native builds.',
      },
      {
        question: 'Should I build an app or a mobile website first?',
        answer:
          'If what you need is for people to find you, read about you and get in touch, a fast mobile website is almost always the better first investment: it is cheaper, it appears in search results, and nobody has to install anything. An app earns its cost when you need repeat usage, offline access, push notifications or device features — in other words, when people come back regularly.',
      },
      {
        question: 'What ongoing costs should I expect after the app launches?',
        answer:
          'Plan for four: developer account fees for Apple and Google, backend hosting and database, any per-use third-party services such as payments or SMS, and maintenance to keep the app working as operating systems and store requirements change. Maintenance is the one most often left out of a budget and the one most likely to matter.',
      },
      {
        question: 'Do I own the app and the source code?',
        answer:
          'You should, and you should confirm it in writing before starting. At Avenix Studio you own the code, the content and the accounts, and the store listings are registered in your name. If a studio will not commit to that, you are renting your own product.',
      },
    ],
  },
  {
    slug: 'react-native-vs-flutter',
    title: 'React Native vs Flutter: which should you choose in 2026?',
    excerpt:
      'Both ship one codebase to iOS and Android and both are production-ready. The decision comes down to your existing stack and who maintains the app afterwards.',
    category: 'Mobile Apps',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'mobile-app-development',
    content: [
      {
        type: 'p',
        text: 'Choose React Native if your team or codebase is already JavaScript, or if you want to share logic with a React or Next.js web app. Choose Flutter if the interface is highly custom and has to look pixel-identical on both platforms, or if you want the most consistent rendering across older devices.',
      },
      {
        type: 'p',
        text: 'Both are mature, both are used by large companies in production, and for most business apps either will work. Anyone telling you one is objectively dead or objectively superior is arguing about tools rather than about your project. What follows is the honest comparison, and the small number of cases where the decision is genuinely clear-cut.',
      },
      { type: 'h2', text: 'What they actually are' },
      {
        type: 'p',
        text: 'React Native is Meta’s framework. You write JavaScript or TypeScript using React, and it renders real native platform components. Flutter is Google’s framework. You write Dart, and it paints every pixel itself with its own rendering engine rather than delegating to native controls.',
      },
      {
        type: 'p',
        text: 'That single architectural difference explains almost every trade-off between them. React Native inherits the platform’s look and behaviour by default. Flutter inherits nothing and controls everything.',
      },
      { type: 'h2', text: 'Where React Native wins' },
      {
        type: 'ul',
        items: [
          'You already have JavaScript or React in the business. Shared language, shared tooling, shared mental model, and developers who can move between the web app and the mobile app. This is by far the most common deciding factor.',
          'You want to share real code with a web product. Validation rules, API clients, formatting and business logic can live in one place rather than being reimplemented in Dart.',
          'Hiring. There are simply more JavaScript developers than Dart developers, in Pakistan and everywhere else. That matters for the day we are no longer the ones maintaining it.',
          'The app should feel like the platform. Because it uses native components, standard controls behave the way users expect on each OS without extra work.',
        ],
      },
      { type: 'h2', text: 'Where Flutter wins' },
      {
        type: 'ul',
        items: [
          'The design is heavily custom. If the brief is an interface that looks like nothing else and must be identical on both platforms, Flutter’s own rendering is an advantage rather than something to fight.',
          'Animation-heavy interfaces. Rich, continuous motion tends to be smoother to build and to run, because the framework controls the whole rendering pipeline.',
          'Consistency on older devices. Painting its own widgets means fewer surprises from platform version differences — useful in markets where a wide spread of older Android handsets is normal.',
          'You want one toolkit for more surfaces. Flutter also targets desktop and embedded, which occasionally matters.',
        ],
      },
      { type: 'h2', text: 'The differences that are usually overstated' },
      {
        type: 'ul',
        items: [
          'Performance. For the overwhelming majority of business apps — lists, forms, media, navigation — both are fast enough that users cannot tell. Performance problems in real apps are almost always caused by unoptimised images, chatty network calls and bad list rendering, not by the framework.',
          'App size. Flutter binaries have historically been larger, but the gap is smaller than it was and rarely decides anything.',
          'Maturity. Both have been production-ready for years. This argument is out of date.',
          'Which is more popular. They are both large, well-funded ecosystems. Neither is going away on a timeline that should affect your decision.',
        ],
      },
      { type: 'h2', text: 'Ecosystem, libraries and the long tail' },
      {
        type: 'p',
        text: 'Both frameworks cover the common requirements well — navigation, storage, camera, maps, push notifications, payments. The difference shows up at the edges, and the edge you hit depends on what you are integrating.',
      },
      {
        type: 'p',
        text: 'React Native draws on the npm ecosystem, which is enormous. If you need to talk to an obscure third-party service, the odds that a JavaScript client already exists are high. The trade-off is variance in quality: npm contains both excellent, actively maintained packages and abandoned ones that still appear in search results. Vetting dependencies is real work.',
      },
      {
        type: 'p',
        text: 'Flutter’s package ecosystem is smaller but noticeably more curated, and a larger share of the critical packages are maintained by Google or by the core community. You are less likely to find a ready-made client for something niche, and more likely to trust the one you do find. Neither situation is strictly better; they fail in different directions.',
      },
      {
        type: 'p',
        text: 'One practical note for either choice: every native dependency you add is a thing that can break when the platforms release their annual updates. A build with forty dependencies is not twice the maintenance of one with twenty — it is worse than that, because they interact. Keeping the dependency list deliberately short is one of the few decisions that pays back every single year.',
      },
      { type: 'h2', text: 'The questions that actually decide it' },
      {
        type: 'p',
        text: 'Skip the feature comparison tables. Four questions settle it in practice.',
      },
      {
        type: 'ul',
        items: [
          'What does your existing codebase use? If there is React or Next.js in the business, React Native starts ahead and the burden of proof is on Flutter.',
          'Who maintains this in two years? If that is an in-house team, pick the language they can actually hire for and already know.',
          'How custom is the interface? Standard platform patterns favour React Native. A bespoke, brand-led, animation-rich design favours Flutter.',
          'Does anything need to be shared with the web? If yes, a shared language is worth real money over the product’s life.',
        ],
      },
      { type: 'h2', text: 'When neither is the right answer' },
      {
        type: 'p',
        text: 'Two honest exceptions. If your app’s core value depends on the newest platform-specific hardware or OS features the day they ship, fully native development is still the safer route. And if what you actually need is for people to find you, read about you and contact you, a fast mobile website will serve you better than either framework — it costs less, it appears in search results, and nobody has to install anything.',
      },
      {
        type: 'p',
        text: 'The framework question only becomes worth arguing about once you have established that an app is genuinely the right product.',
      },
      {
        type: 'p-link',
        before: 'We build in both and pick per project rather than by habit, which is why the recommendation comes during scoping with the trade-off explained rather than as a house preference. Our ',
        href: '/services/mobile-app-development',
        anchor: 'mobile app development service',
        after: ' covers how that decision gets made alongside the rest of the build.',
      },
    ],
    faqs: [
      {
        question: 'Is React Native or Flutter faster?',
        answer:
          'For typical business apps the difference is not perceptible to users. Flutter can have an edge in animation-heavy interfaces because it controls the entire rendering pipeline, but real-world slowness is almost always caused by unoptimised images, inefficient network calls or poorly built lists — problems that occur identically in both frameworks and are fixed the same way.',
      },
      {
        question: 'Which is cheaper to build with?',
        answer:
          'Neither framework is inherently cheaper. Cost follows scope and the team’s familiarity. The genuine saving is choosing the one your existing codebase and future maintainers already know, because that removes ramp-up time and makes hiring easier later.',
      },
      {
        question: 'Can I switch from one to the other later?',
        answer:
          'Not cheaply. The application code does not transfer — a switch is effectively a rewrite of the front end. Your backend, API and database are unaffected, which is one good reason to keep business logic on the server rather than embedded in the app. Treat the choice as a multi-year commitment.',
      },
      {
        question: 'Do both publish to the App Store and Google Play?',
        answer:
          'Yes. Both produce genuine native binaries that are submitted through the normal store processes, and both are subject to the same review requirements. Store submission is not a differentiator between them.',
      },
    ],
  },
  {
    slug: 'custom-software-cost-pakistan',
    title: 'How much does custom software cost for a business in Pakistan?',
    excerpt:
      'Custom software is priced by scope, not from a menu. The factors that move a quote, the tiers most projects fall into, and how to compare proposals fairly.',
    category: 'Software Development',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'software-development',
    content: [
      {
        type: 'p',
        text: 'Custom software is priced by scope, not from a price list, because "custom software" covers everything from a single internal form that replaces a spreadsheet to a multi-role platform handling payments and inventory. The honest answer to what it costs is that it depends on four things: how many distinct workflows it supports, how many systems it has to talk to, how many types of user it serves, and how long it needs to keep running.',
      },
      {
        type: 'p',
        text: 'This post explains each of those, describes the tiers most business projects fall into, and gives you a way to compare proposals that does not reduce to picking the smallest number. We do not publish figures, and the last section explains why.',
      },
      { type: 'h2', text: 'The four factors that move the number' },
      {
        type: 'ul',
        items: [
          'Number of distinct workflows. Not features — workflows. "Staff submit a leave request, a manager approves it, payroll sees the result" is one workflow with three steps. Counting workflows rather than features is the fastest way to size a project honestly, because features multiply while workflows stay countable.',
          'Integrations. Every external system — accounting software, a payment gateway, a courier API, WhatsApp, an existing database — is a separate contract with someone else’s rules and failure modes. Integrations are consistently the most underestimated line in any quote.',
          'User roles and permissions. One kind of user is straightforward. Admin, manager, staff and customer, each seeing different data with different rights, is a different class of problem. Permissions touch every screen and every query.',
          'Expected lifespan. Software meant to run for five years is built differently from a tool for one campaign: more tests, clearer structure, better documentation. Both are legitimate; they cost different amounts and you should say which you want.',
        ],
      },
      { type: 'h2', text: 'The tiers most business projects fall into' },
      {
        type: 'ul',
        items: [
          'Internal tool. One team, one workflow, replacing a spreadsheet or a manual process. Small scope and often the highest return per rupee spent, because it removes work someone is currently doing by hand every day.',
          'Business system. Several connected workflows, a few user roles, an admin view and reporting. Inventory, bookings, job tracking, client management. This is where most small and mid-sized business projects genuinely sit.',
          'Customer-facing platform. Your customers use it directly. Accounts, payments, notifications, support for people who did not read a manual and never will. The step up in cost is mostly about the edge cases and the polish that external users require.',
          'Multi-tenant product. You are selling the software itself to multiple organisations. A different business model, and effectively product development rather than a project.',
        ],
      },
      { type: 'h2', text: 'Why proposals for the same brief vary so widely' },
      {
        type: 'p',
        text: 'A wide spread between quotes is usually a spread in assumptions, not in greed. The gaps are almost always in the same five places.',
      },
      {
        type: 'ul',
        items: [
          'Discovery. Some quotes include mapping the workflow properly before building. Some assume your brief is already the specification. The second is cheaper right up until the first change request.',
          'Data migration. Getting years of existing records out of spreadsheets or an old system, cleaned and imported, is frequently as much work as a feature. It is often missing entirely from a low quote.',
          'Testing. Automated tests cost time up front and save it every month thereafter. A quote without them is smaller and more fragile.',
          'Hosting and deployment. Who sets up the server, the database, the backups and the monitoring, and who pays for them ongoing.',
          'Training and handover. Software nobody has been taught to use does not get used. This is a real line item and it belongs in the proposal.',
        ],
      },
      { type: 'h2', text: 'Fixed price or time and materials?' },
      {
        type: 'p',
        text: 'A fixed price transfers risk to the studio, so it includes a buffer and requires the scope to be locked. It suits well-defined projects and clients who need budget certainty. Time and materials is cheaper when scope genuinely cannot be known up front, but it requires trust and active management on your side.',
      },
      {
        type: 'p',
        text: 'For most business software, the sensible arrangement is a paid discovery phase that produces a specification, followed by a fixed quote against that specification. You pay a small amount to remove the uncertainty, then buy the build with a number that can be relied on. We work this way because open-ended budgets tend to end badly for both sides.',
      },
      { type: 'h2', text: 'How to compare two proposals properly' },
      {
        type: 'ul',
        items: [
          'Ask each to list what is explicitly out of scope. The answer is more informative than the feature list.',
          'Ask who owns the code, the data and the hosting accounts at the end. If the answer is not "you", the price is not the price.',
          'Ask what happens after launch, and what it costs. Support arrangements vary more than build prices do.',
          'Ask what they would cut if the budget were 30% lower. A good answer shows they understand which parts carry the value.',
          'Ask to see something comparable they have built and, ideally, to speak to that client.',
        ],
      },
      { type: 'h2', text: 'Why we do not publish a price list' },
      {
        type: 'p',
        text: 'Any figure broad enough to be true for every project would be too broad to help you budget, and a narrower one would simply be wrong for most readers. Worse, a published number steers the conversation toward fitting a build to a price rather than scoping the software the business actually needs. We quote per project after understanding the workflows, and the figure is fixed in writing before work begins.',
      },
      {
        type: 'p-link',
        before: 'If you are trying to work out whether your problem warrants custom software at all, our ',
        href: '/services/software-development',
        anchor: 'software development service',
        after: ' sets out how we scope a build, what the architecture stage produces, and what you receive at handover.',
      },
    ],
    faqs: [
      {
        question: 'Is custom software cheaper than a monthly SaaS subscription?',
        answer:
          'Not initially — custom software is a capital cost where SaaS is an operating cost. It becomes cheaper over time when subscription fees scale with your headcount or usage, or when the tool nearly fits but forces expensive manual workarounds. The crossover often arrives sooner than people expect once per-seat pricing grows, but it depends entirely on your numbers.',
      },
      {
        question: 'How long does a custom software project take?',
        answer:
          'A focused internal tool is usually a matter of weeks. A business system with several workflows and roles runs longer and should be broken into milestones so something usable ships early rather than everything arriving at the end. Any credible proposal commits to a milestone timeline before work begins.',
      },
      {
        question: 'What is a discovery phase and do I have to pay for it?',
        answer:
          'Discovery is the work of mapping your actual workflows, data and integrations, and turning them into a specification that can be quoted accurately. It is normally paid, because it is real work that produces a real deliverable — and the specification is yours to take to other studios if you want competing quotes against it.',
      },
      {
        question: 'What if my requirements change halfway through?',
        answer:
          'They usually do, and a good process expects it. Changes within the agreed scope are absorbed; changes that add scope are quoted as a variation before they are built, so you decide whether each one is worth its cost. What you should avoid is any arrangement where changes are silently absorbed, because that cost reappears as rushed work or a missed deadline.',
      },
      {
        question: 'Who owns the software when it is finished?',
        answer:
          'You should own the source code, the data and the hosting accounts outright, and it should say so in the contract before work starts. At Avenix Studio the repository, accounts and documentation are handed over at the end of every project, with nothing locked to a proprietary platform or to us.',
      },
    ],
  },
  {
    slug: 'custom-software-vs-off-the-shelf',
    title: 'Custom software vs off-the-shelf: how to decide',
    excerpt:
      'Off-the-shelf wins by default. Custom earns its cost only when the process is genuinely yours, or the workarounds already cost more than a build would.',
    category: 'Software Development',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'software-development',
    content: [
      {
        type: 'p',
        text: 'Start with off-the-shelf, and only build custom when you can name the specific thing it cannot do. Existing software is cheaper, available immediately, maintained by someone else and improved without you paying for it — which means the burden of proof sits with the custom option, every time.',
      },
      {
        type: 'p',
        text: 'That said, "just use a SaaS tool" becomes bad advice at a predictable point: when the workarounds stop being minor, when per-seat pricing outgrows the value, or when the process the software is bending is the thing your business actually competes on. This post is about recognising that point rather than guessing at it.',
      },
      { type: 'h2', text: 'What off-the-shelf actually gives you' },
      {
        type: 'ul',
        items: [
          'It exists today. You can trial it this afternoon rather than waiting for a build.',
          'Someone else carries maintenance, security patching and compatibility with everything it integrates with.',
          'The cost is predictable and spread out, which is easier on cash flow than a capital project.',
          'It improves without you commissioning anything, because the vendor is selling to thousands of businesses with overlapping needs.',
          'Other people know how to use it, so hiring someone already familiar with it is possible.',
        ],
      },
      {
        type: 'p',
        text: 'None of that is trivial. A great many custom builds exist because nobody seriously evaluated the alternatives first, and they are a permanent tax on the business that commissioned them.',
      },
      { type: 'h2', text: 'The five signals that custom is justified' },
      {
        type: 'p',
        text: 'These are the situations where building genuinely beats buying. If none of them applies to you, buy.',
      },
      {
        type: 'ul',
        items: [
          'The process is your differentiator. If how you quote, schedule or fulfil is a real competitive advantage, software that forces you into a generic version of it erodes exactly the thing you are good at.',
          'You are paying for workarounds. Count the hours your team spends exporting, re-keying, reconciling between two systems or maintaining a spreadsheet that shadows the real tool. That is a recurring cost, and it is usually invisible because it is spread across people rather than showing up on an invoice.',
          'Per-seat pricing has outgrown the value. Subscription costs scale with headcount whether or not the extra users need the full product. At a certain team size the arithmetic changes.',
          'You need two systems to talk and they will not. If the integration you need does not exist and the vendors have no interest in building it, you are stuck paying people to be the integration.',
          'You cannot get your data out. A tool that holds your operating history hostage is a strategic risk regardless of how well it works day to day.',
        ],
      },
      { type: 'h2', text: 'The middle option most people miss' },
      {
        type: 'p',
        text: 'The choice is rarely binary. The most cost-effective answer is often to keep the off-the-shelf tools that work — accounting, email, payroll, document storage — and build only the one workflow that is genuinely yours, wiring it into the rest through their APIs.',
      },
      {
        type: 'p',
        text: 'That gives you custom where it matters and vendor-maintained software everywhere it does not. It is a much smaller build than replacing everything, and it avoids the classic failure where a business spends heavily to rebuild solved problems like invoicing.',
      },
      {
        type: 'p',
        text: 'A second middle option worth knowing: automation. Sometimes the real problem is not that your tools are wrong but that moving information between them is manual. Connecting existing systems is far cheaper than replacing them, and it removes the same hours.',
      },
      { type: 'h2', text: 'The question of fit, and the 80% trap' },
      {
        type: 'p',
        text: 'Most evaluations end with a tool that fits about 80% of the workflow, and the decision turns on what the missing 20% actually is. This is where the choice is usually made badly, because 20% sounds small.',
      },
      {
        type: 'p',
        text: 'If the gap is spread thinly — a field you do not use, a report formatted differently, a screen with clutter on it — adapt and move on. Habit is not a requirement, and a great deal of "the tool cannot do it" turns out to mean "the tool does not do it the way we did it before".',
      },
      {
        type: 'p',
        text: 'If the gap is concentrated in one step that runs many times a day, the arithmetic is completely different. A missing capability in a workflow your team performs fifty times a week is not 20% of the problem; it is most of the cost, because every one of those runs now needs a human to bridge it. The question is never what percentage fits. It is how often you touch the part that does not.',
      },
      { type: 'h2', text: 'The honest costs of building' },
      {
        type: 'ul',
        items: [
          'You now own maintenance forever. Dependencies age, platforms change, browsers update. Budget for it deliberately.',
          'No feature arrives unless you pay for it. There is no vendor roadmap quietly adding things.',
          'Bus factor. If one person understands the system and leaves, you have a problem. Documentation and clean handover are not optional extras.',
          'Time to value. Buying is instant; building is not. If the pain is acute right now, a stopgap tool while a build happens is often the right call.',
        ],
      },
      { type: 'h2', text: 'A decision you can actually run' },
      {
        type: 'p',
        text: 'Write down the workflow end to end. Trial the two or three best-known tools against it for a fortnight — properly, with real data. List precisely where each one fails. If the failures are cosmetic or a matter of habit, buy and adapt. If the failures are structural, and you can estimate the hours the workarounds cost every month, you have both the justification for a build and the scope for it.',
      },
      {
        type: 'p',
        text: 'That list of structural failures is the most valuable document in the whole decision. It is also, conveniently, most of a specification.',
      },
      {
        type: 'p-link',
        before: 'If you have reached that point and want the workflow mapped before anyone writes code, our ',
        href: '/services/software-development',
        anchor: 'custom software development service',
        after: ' starts with exactly that scoping step — and it is a step that occasionally ends with us telling you to buy something instead.',
      },
    ],
    faqs: [
      {
        question: 'When is off-the-shelf software definitely the right choice?',
        answer:
          'When the process is standard rather than distinctive. Accounting, payroll, email, document storage, basic CRM and helpdesk are all solved problems with mature products behind them. Building your own version of any of these is almost always a poor use of money, because you will spend heavily to end up behind what you could have subscribed to.',
      },
      {
        question: 'How do I calculate whether custom software is worth it?',
        answer:
          'Estimate the recurring cost of the current situation: hours per week spent on manual workarounds multiplied by a loaded hourly rate, plus subscription fees you would stop paying, plus any revenue lost to the limitation. Compare that annual figure against the build cost plus its ongoing maintenance. If the payback period is under about two years the case is usually strong; beyond three it rarely is.',
      },
      {
        question: 'Can I start with off-the-shelf and move to custom later?',
        answer:
          'Yes, and it is often the smartest sequence. Using an existing tool teaches you what you actually need, which makes a later build far better specified and cheaper. The one thing to check at the outset is data export — confirm you can get your records out in a usable format before you commit years of operating history to any platform.',
      },
      {
        question: 'Is a no-code tool a good middle ground?',
        answer:
          'For internal tools with modest complexity, frequently yes — they are fast to build and easy to change. The limits show up with complex permissions, high data volumes, heavy customisation or per-user pricing at scale. They are an excellent way to prototype a workflow and prove it is worth building properly.',
      },
    ],
  },
  {
    slug: 'what-is-ai-automation-small-business-examples',
    title: 'What is AI automation? Real examples for small businesses',
    excerpt:
      'AI automation means software doing a repeatable task end to end without a person. Here is what that looks like in a real small business, and what it cannot do.',
    category: 'AI Automation',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'ai-automation',
    content: [
      {
        type: 'p',
        text: 'AI automation is software carrying out a repeatable business task from start to finish without a person doing it by hand — reading an enquiry, deciding what it is, putting it in the right place and triggering the next step. It differs from ordinary automation in one respect: the steps that need judgement, like understanding what a customer actually wrote, are handled by an AI model rather than by a rigid rule.',
      },
      {
        type: 'p',
        text: 'That distinction matters because it changes what can be automated. Classic automation needs every input to arrive in a predictable format. AI automation copes with a customer writing "do you open Sunday?" in three different ways, or an invoice arriving as a photograph. The examples below are ordinary small-business work, not futuristic ones.',
      },
      { type: 'h2', text: 'Example one: enquiries that sort themselves' },
      {
        type: 'p',
        text: 'Enquiries arrive through a website form, WhatsApp, Instagram and email. Somebody reads each one, works out whether it is a new lead, an existing customer or a supplier, and forwards it. It happens all day and it is nobody’s actual job.',
      },
      {
        type: 'p',
        text: 'Automated, the system reads each message, classifies it, extracts the useful details — name, service wanted, location, urgency — creates or updates the record in your CRM, and notifies the right person with the context attached. Ambiguous ones are flagged for a human instead of being guessed at. The gain is not only time; it is that nothing sits unread over a weekend.',
      },
      { type: 'h2', text: 'Example two: follow-up that actually happens' },
      {
        type: 'p',
        text: 'Most small businesses lose more revenue to un-chased quotes than to lost pitches. Follow-up is the first thing dropped in a busy week, and the loss is invisible because nobody logs the deal that quietly went cold.',
      },
      {
        type: 'p',
        text: 'A follow-up automation watches for quotes with no reply after an agreed interval, drafts a message referencing the specific job rather than a generic template, and either sends it or queues it for approval. It stops the moment the customer replies. This is frequently the highest-return automation a small business can run, because it recovers revenue that already exists in the pipeline.',
      },
      { type: 'h2', text: 'Example three: paperwork into records' },
      {
        type: 'ul',
        items: [
          'Supplier invoices arriving as PDFs or phone photographs, read and entered into accounting software with the totals and dates extracted.',
          'Delivery notes and receipts matched against purchase orders, with mismatches flagged rather than silently accepted.',
          'Job sheets filled in by hand on site, photographed, and turned into structured records.',
        ],
      },
      {
        type: 'p',
        text: 'This category is unglamorous and consistently worth the most, because the work is high-volume, low-judgement and universally disliked. It is also where a human checkpoint matters: the automation should prepare the entry and flag anything unusual, not post to your accounts unsupervised.',
      },
      { type: 'h2', text: 'Example four: answering the same questions' },
      {
        type: 'p',
        text: 'Opening hours, location, pricing structure, whether you cover a particular area, what to bring to an appointment. The same dozen questions, every day, across every channel. An assistant trained on your own information answers them instantly on the website and on WhatsApp, and hands over to a person the moment the question goes beyond what it knows.',
      },
      {
        type: 'p',
        text: 'Done properly, the handover is the important part. An assistant that fails gracefully and passes the full conversation to a human is useful. One that improvises answers about pricing is a liability.',
      },
      { type: 'h2', text: 'Example five: appointments and no-shows' },
      {
        type: 'p',
        text: 'For any business running a diary — clinics, salons, workshops, consultants — the recurring costs are no-shows and the phone time spent rescheduling. Both are highly automatable because the logic is simple and the volume is high.',
      },
      {
        type: 'p',
        text: 'A reminder sent at a sensible interval on the channel the customer actually reads, with a one-tap way to confirm or move the booking, removes most of the phone calls and a meaningful share of the no-shows. When someone cancels, the freed slot can be offered automatically to anyone on a waiting list. None of this needs a model at all for the reminders themselves; the AI component is useful for reading free-text replies like "can we do Thursday instead, after 4" and turning them into an actual reschedule.',
      },
      { type: 'h2', text: 'What it costs to run' },
      {
        type: 'p',
        text: 'Two costs, and they behave differently. The build is one-off, scoped like any small software project. Running it is ongoing and usage-based: the automation platform, and per-use charges for model calls and any messaging channel. For the volumes a typical small business generates, the running cost is usually modest — but it scales with usage rather than staying flat, so it is worth estimating against your real monthly volume before committing rather than after.',
      },
      { type: 'h2', text: 'What AI automation cannot do' },
      {
        type: 'ul',
        items: [
          'Fix a process nobody has mapped. Automating a confused workflow produces a faster confused workflow. The mapping is most of the work and it cannot be skipped.',
          'Make judgement calls you would not delegate to a new employee. If you would not let someone in their first week decide it unsupervised, it needs a human checkpoint.',
          'Be right every time. Models make mistakes. The design question is not whether errors happen but what happens when they do — which is why anything expensive to get wrong gets an approval step and a log.',
          'Replace the relationship. The parts of your business customers value are rarely the parts worth automating. Automate the retyping, not the conversation.',
        ],
      },
      { type: 'h2', text: 'How to pick your first automation' },
      {
        type: 'p',
        text: 'For one week, have your team note every task they do more than three times that involves moving information between two places. Pick the one with the highest count and the least judgement required. Automate exactly that, measure the hours it returns, and only then look at the next one.',
      },
      {
        type: 'p',
        text: 'Starting narrow matters. Automations that try to handle an entire department at once tend to collapse under their own exceptions, while a single well-chosen workflow pays for itself and builds the confidence to expand.',
      },
      {
        type: 'p-link',
        before: 'If you want help identifying which task is worth automating first rather than buying a tool and hoping, our ',
        href: '/services/ai-automation',
        anchor: 'AI automation service',
        after: ' starts by mapping how the work is done manually today, including the exceptions that usually break automations later.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between AI automation and normal automation?',
        answer:
          'Normal automation follows fixed rules and needs inputs in a predictable format — if this form field says X, do Y. AI automation adds a model that can interpret messy input: free-text messages, scanned documents, varied phrasing. In practice most useful systems combine both, using rules where the logic is certain and a model only where interpretation is genuinely needed.',
      },
      {
        question: 'Is AI automation worth it for a small business?',
        answer:
          'It depends entirely on volume. If a task happens a handful of times a month, automating it will cost more than it saves. If it happens many times a day, the case is usually straightforward. The honest test is counting how often the task actually occurs before committing to anything.',
      },
      {
        question: 'Do I need to replace my current software to use AI automation?',
        answer:
          'No, and you generally should not. Automations connect the tools you already use through their APIs — your CRM, inbox, spreadsheets, accounting software and WhatsApp. Replacing working systems in order to automate is usually a sign the scope has grown beyond the problem.',
      },
      {
        question: 'What happens when the automation makes a mistake?',
        answer:
          'A well-designed system assumes it will. Anywhere an error would be expensive there is a human approval step, every run is logged so a failure can be traced rather than guessed at, and there is a defined fallback — usually routing to a person. Ask about error handling before you ask about capability; it tells you more about how the system was built.',
      },
      {
        question: 'How long does it take to set up an automation?',
        answer:
          'A single well-defined workflow is usually a short engagement rather than a long project, because mapping the process accurately is most of the effort and the building is comparatively quick. Larger agent systems are staged, so the first automation is live and returning time while the next is being built.',
      },
    ],
  },
  {
    slug: 'n8n-vs-make-vs-zapier',
    title: 'n8n vs Make vs Zapier: which should a small business use?',
    excerpt:
      'Zapier for simple connections and speed, Make for complex branching visually, n8n when you need self-hosting or volume without per-task pricing. How to choose.',
    category: 'AI Automation',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'ai-automation',
    content: [
      {
        type: 'p',
        text: 'Pick Zapier if you want the widest app support and the fastest setup and you are automating straightforward A-to-B connections. Pick Make when your workflows branch, loop and transform data and you want to see that logic laid out visually. Pick n8n when you need to self-host for data control, or when your volume makes per-task pricing painful.',
      },
      {
        type: 'p',
        text: 'All three do the same fundamental job: watch for something happening in one system and make something happen in another. They differ in how much complexity they let you express, how they charge, and who holds your data. That last one decides it more often than people expect.',
      },
      { type: 'h2', text: 'Zapier: the default for a reason' },
      {
        type: 'p',
        text: 'Zapier has the largest catalogue of supported applications by a wide margin, and if you are connecting two well-known SaaS tools it almost certainly supports both. Setup is deliberately linear and approachable — most people build a working automation without documentation.',
      },
      {
        type: 'p',
        text: 'The trade-offs are cost and ceiling. Pricing is task-based, so a workflow firing thousands of times a month gets expensive quickly, and every step in a multi-step automation typically counts. Complex branching is possible but awkward; past a certain intricacy you are fighting the interface. It is the right tool when the automation is simple, the volume is low and your time matters more than the subscription.',
      },
      { type: 'h2', text: 'Make: visual logic for complex workflows' },
      {
        type: 'p',
        text: 'Make lays a workflow out as a diagram rather than a list, which sounds cosmetic and is not. When a process branches by condition, loops over a list of line items, retries a failed call and merges paths back together, seeing it as a map is genuinely easier to build and far easier to debug months later.',
      },
      {
        type: 'p',
        text: 'It also tends to be more economical per operation than Zapier at comparable volume, and it handles data transformation more comfortably. The cost is a steeper learning curve and a smaller app catalogue — still large, but you are more likely to hit something unsupported and need a generic HTTP call. Make is the sensible default when the logic is real logic rather than a straight line.',
      },
      { type: 'h2', text: 'n8n: control, and no per-task meter' },
      {
        type: 'p',
        text: 'n8n can be self-hosted on your own server, which changes two things. Your data does not pass through a third party you do not control, which matters for client records, health information or anything under a contractual confidentiality obligation. And you are paying for a server rather than per task, so a high-volume workflow costs roughly the same as a quiet one.',
      },
      {
        type: 'p',
        text: 'It is also the most extensible of the three: you can drop into JavaScript wherever the built-in nodes run out, which means almost nothing is impossible. The honest cost is that self-hosting is real operational work — updates, backups, monitoring, uptime. If nobody owns that, the automation that runs your business is quietly sitting on an unpatched server. There is a managed cloud version that removes this burden, at which point the main remaining advantage is the pricing model and the extensibility.',
      },
      { type: 'h2', text: 'Where all three will disappoint you' },
      {
        type: 'p',
        text: 'Three failure modes are common to every platform, and none of them appears in the marketing.',
      },
      {
        type: 'ul',
        items: [
          'Silent failures. A workflow stops firing because an API token expired or a service changed its response, and nobody notices for a fortnight because nothing errors visibly. Build a notification for failures on day one, not after the first incident.',
          'Rate limits. The service you are calling will throttle you, usually at the worst moment. Retries with sensible backoff are not optional on anything running at volume.',
          'Version drift. Connectors get updated and behaviour shifts underneath a workflow you have not touched in months. Anything business-critical needs to be tested periodically rather than assumed to be running.',
        ],
      },
      {
        type: 'p',
        text: 'This is the honest argument for having someone technical involved in anything load-bearing. Building the happy path takes an afternoon on any of these tools. Making it fail safely, log usefully and recover on its own is the actual engineering, and it is what separates an automation you can depend on from one that quietly stops working.',
      },
      { type: 'h2', text: 'The questions that actually decide it' },
      {
        type: 'ul',
        items: [
          'How sensitive is the data? If client records or confidential information pass through the automation, self-hosted n8n is worth serious consideration and may be required by your obligations.',
          'How many times will this run? Estimate monthly executions honestly, including every step. Per-task pricing is fine at low volume and brutal at high volume.',
          'How complex is the logic? A straight line suits Zapier. Branches, loops and merges suit Make. Anything needing custom code suits n8n.',
          'Who maintains it? If the answer is a non-technical person, Zapier’s simplicity has real value. If it is a developer, n8n’s flexibility does.',
          'Are your apps supported? Check before committing. A missing connector is workable through a generic HTTP request, but only if someone is comfortable doing that.',
        ],
      },
      { type: 'h2', text: 'What most small businesses should actually do' },
      {
        type: 'p',
        text: 'Start on the platform you can build on this week, and prove the workflow is worth having before optimising what it runs on. A working automation on a slightly expensive platform beats a perfect one that never gets built, and migrating a proven workflow later is a known, finite job.',
      },
      {
        type: 'p',
        text: 'The one exception is data sensitivity. If the information genuinely cannot pass through a third-party service, that constraint is not something to revisit later — it decides the platform on day one.',
      },
      {
        type: 'p',
        text: 'And it is worth saying that the platform is the least important decision here. A well-mapped workflow will work on all three. A badly mapped one will fail on all three, having cost the same to build.',
      },
      {
        type: 'p-link',
        before: 'We build on n8n and Make depending on what the workflow and the data actually require, and the reasoning is explained rather than presented as a house preference. Our ',
        href: '/services/ai-automation',
        anchor: 'AI automation service',
        after: ' covers how that choice gets made, and who holds the credentials afterwards.',
      },
    ],
    faqs: [
      {
        question: 'Is n8n free?',
        answer:
          'n8n is fair-code licensed and the self-hosted version can be run without a licence fee, but "free" overstates it — you pay for the server it runs on and for whoever maintains, updates and backs it up. There is also a paid cloud version. Compare total cost including that operational time, not just the licence.',
      },
      {
        question: 'Which is cheapest for high-volume automation?',
        answer:
          'Generally self-hosted n8n, because you pay for server capacity rather than per task, so cost stays roughly flat as volume grows. Make is usually more economical per operation than Zapier. The crossover point depends on your execution count, which is why estimating real monthly volume before choosing is worth the effort.',
      },
      {
        question: 'Can I move my automations between these platforms later?',
        answer:
          'Not automatically — there is no reliable converter, so a migration means rebuilding the workflows. The good news is that the hard part, understanding and mapping the process, transfers completely. Rebuilding a well-documented workflow on a new platform is a much smaller job than designing it was.',
      },
      {
        question: 'Do I need a developer to use these tools?',
        answer:
          'Not for simple automations — all three are designed for non-developers and Zapier especially so. You start needing technical help when workflows involve complex data transformation, error handling that has to be reliable, API authentication beyond the built-in connectors, or self-hosting. The build is often the easy part; making it fail safely is not.',
      },
    ],
  },
  {
    slug: 'do-you-need-an-ai-chatbot',
    title: 'Do you actually need an AI chatbot for your business?',
    excerpt:
      'Probably not, unless you are losing enquiries outside working hours or answering the same questions daily. The honest test, and what a good one must do.',
    category: 'AI Automation',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'ai-automation',
    content: [
      {
        type: 'p',
        text: 'Most businesses do not need an AI chatbot. You need one if you are losing enquiries because nobody answers outside working hours, or if your team spends a meaningful part of every day typing the same dozen answers — and if neither is true, a clear contact page and a visible phone number will serve you better.',
      },
      {
        type: 'p',
        text: 'Chatbots became fashionable, which means a lot of them were installed for no reason and now sit on websites annoying visitors who wanted a phone number. This post is about telling the two situations apart honestly.',
      },
      { type: 'h2', text: 'When a chatbot genuinely earns its place' },
      {
        type: 'ul',
        items: [
          'Enquiries arrive outside your hours. If a serious share of your traffic comes in the evening or at weekends and those people leave without a reply, you are losing leads to silence. Capturing and qualifying them is worth real money.',
          'The same questions, every day. Opening hours, location, coverage area, what to bring, whether you handle a particular case. High volume, low judgement, identical answers — exactly what a bot handles well.',
          'Qualification takes time. If your team spends the first five minutes of every conversation establishing basics before knowing whether the enquiry is even relevant, collecting that up front is a genuine saving.',
          'You have real documentation. Service pages, an FAQ, a price structure, policies. A bot is only as good as what it can draw on, and a business with thin content has nothing to build one from.',
        ],
      },
      { type: 'h2', text: 'When it is the wrong solution' },
      {
        type: 'ul',
        items: [
          'Low enquiry volume. If you get a few enquiries a week, answer them personally. A bot adds friction and costs money to solve a problem you do not have.',
          'High-value, complex sales. If each customer is worth a great deal and the sale depends on a relationship, putting software between you and them is a loss, not a gain.',
          'Your actual problem is response time during hours. That is a staffing or notification problem. A bot is an expensive way to avoid fixing it.',
          'You want it because competitors have one. Not a reason. Several of theirs are probably making things worse for their visitors too.',
        ],
      },
      { type: 'h2', text: 'The test worth running before you decide' },
      {
        type: 'p',
        text: 'For two weeks, log every enquiry: when it arrived, what was asked, how long the reply took, and whether it converted. Two numbers fall out. The share arriving outside hours, and the share whose questions were answerable from information already on your website.',
      },
      {
        type: 'p',
        text: 'If both numbers are small, you have your answer and you have saved yourself a project. If either is large, you now know exactly what the bot needs to handle — which is also the specification for building one properly.',
      },
      { type: 'h2', text: 'What separates a useful bot from an irritating one' },
      {
        type: 'p',
        text: 'The difference is almost never the model. It is four design decisions.',
      },
      {
        type: 'ul',
        items: [
          'It answers from your information, not from general knowledge. A bot that invents an answer about your pricing or your coverage area is worse than no bot, because a confident wrong answer costs you a customer and your credibility.',
          'It hands over cleanly. The moment a question exceeds what it knows, it should pass to a human with the full conversation attached — not loop, not apologise repeatedly, not pretend.',
          'It is escapable. A visitor who wants a phone number should be able to get one in one click. Trapping people in a chat window is the fastest way to lose them.',
          'It knows what it must not discuss. Firm quotes, contractual commitments, medical or legal specifics. Those get routed to a person, deliberately, by design.',
        ],
      },
      { type: 'h2', text: 'What it should collect, and what it should not' },
      {
        type: 'p',
        text: 'A chatbot that only answers questions is a help page with extra steps. The value is in what it captures on the way through — but there is a line, and crossing it costs you the conversation.',
      },
      {
        type: 'p',
        text: 'Collect the minimum that lets a human pick the conversation up properly: a name, a way to reply, and what the person actually wants. Ask for it once the visitor has had something useful from the exchange, not as a gate before they are allowed to ask anything. A form demanding an email address before it will tell you your own opening hours is the single most reliable way to make someone leave.',
      },
      {
        type: 'p',
        text: 'What it should not collect is anything sensitive that you are not equipped to hold properly — identification numbers, payment details, medical specifics. If a conversation is heading there, that is the signal to hand over to a person on a secure channel, not to keep typing. The same applies to anything you would be uncomfortable seeing quoted back to you later, because a chat transcript is a record.',
      },
      { type: 'h2', text: 'The channel question' },
      {
        type: 'p',
        text: 'A website widget is the obvious placement and often not the best one. In Pakistan, and in most markets where messaging is the default, customers are far more comfortable on WhatsApp than in a chat box on a site they are visiting for the first time. The same assistant answering on WhatsApp usually gets more use, and it leaves you holding a contactable phone number instead of an anonymous session.',
      },
      {
        type: 'p',
        text: 'If you are going to do this at all, consider putting it where your customers already are rather than where it is easiest to install.',
      },
      { type: 'h2', text: 'What it costs to run' },
      {
        type: 'p',
        text: 'Two costs. Setting it up — connecting your content, defining the handover rules, testing against real questions — and running it, which is usage-based across model calls and any messaging channel. For typical small-business volumes the running cost is modest, but it scales with conversations, so estimate against real numbers rather than hoping.',
      },
      {
        type: 'p',
        text: 'Budget for the third cost people forget: maintenance. Your services change, your prices change, your policies change. A bot working from last year’s information is actively misleading customers, and somebody has to own keeping it current.',
      },
      {
        type: 'p-link',
        before: 'If the two-week log suggests a bot would actually earn its place, our ',
        href: '/services/ai-automation',
        anchor: 'AI chatbot and automation service',
        after: ' covers assistants for websites and WhatsApp that answer from your own information and hand off to your team with the conversation attached.',
      },
    ],
    faqs: [
      {
        question: 'Will an AI chatbot annoy my customers?',
        answer:
          'It will if it is hard to escape, loops without answering, or hides your phone number. It will not if it answers the common questions instantly, hands over to a person the moment it cannot help, and leaves a direct contact option visible throughout. The irritation people associate with chatbots comes from design decisions, not from the technology.',
      },
      {
        question: 'Can a chatbot give wrong information about my business?',
        answer:
          'Yes, if it is built to answer from general knowledge rather than from your own documented content. A properly built one is restricted to your material and is explicitly instructed to route anything outside it to a person. Ask any provider how the bot behaves when it does not know something — the answer tells you whether it was built responsibly.',
      },
      {
        question: 'Should I put the chatbot on my website or on WhatsApp?',
        answer:
          'Often WhatsApp, particularly in markets where messaging is the default way people contact businesses. Customers are already there, it needs no new app, and you end up with a real phone number rather than an anonymous browser session. A website widget still helps for visitors who want an immediate answer without leaving the page — the two work well together.',
      },
      {
        question: 'How much content do I need before a chatbot is worth building?',
        answer:
          'Enough to answer the questions you actually get. In practice that means clear service pages, an FAQ covering your dozen most common questions, and documented policies on scheduling, coverage and process. If that material does not exist, write it first — it improves your search visibility regardless, and without it a bot has nothing reliable to draw on.',
      },
    ],
  },
  {
    slug: 'how-to-hire-a-software-house-in-lahore',
    title: 'How to hire a software house in Lahore: a checklist',
    excerpt:
      'Ask for a named team, a written scope, code ownership in the contract and a reference you can call. The questions that separate a studio from a sales pitch.',
    category: 'Software Development',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'software-development',
    content: [
      {
        type: 'p',
        text: 'Hire on four things: a written scope that says what is explicitly excluded, the names of the people who will actually build it, a contract stating you own the code and accounts, and at least one past client you can speak to directly. A studio that supplies all four is in a different category from one that supplies a portfolio and a price.',
      },
      {
        type: 'p',
        text: 'Lahore has a deep pool of genuinely good engineering talent and, like any large market, a long tail of outfits that sell well and deliver poorly. The difficulty for a non-technical buyer is that both look identical on a website. This checklist is about the questions that separate them before you have paid anything.',
      },
      { type: 'h2', text: 'Before you contact anyone' },
      {
        type: 'p',
        text: 'Write down the three things the software must let someone do, and the one business outcome it exists to produce. Not a feature list — three actions and one outcome. This single page is what makes quotes comparable, and it is the thing most buyers skip.',
      },
      {
        type: 'p',
        text: 'Without it, every studio scopes something slightly different, you receive four quotes for four different projects, and the cheapest wins by having understood the least.',
      },
      { type: 'h2', text: 'What to ask in the first conversation' },
      {
        type: 'ul',
        items: [
          'Who exactly will work on this, and what else are they on? You want names and a rough allocation. The pattern to watch for is a senior person in the meeting and juniors on the actual build — not automatically wrong, but you should know.',
          'What would you cut if my budget were 30% lower? A strong answer shows they understand which parts carry the value. A weak one proposes cutting testing.',
          'What has gone wrong on a recent project and how did you handle it? Everyone has one. A studio claiming otherwise is either new or not being straight with you.',
          'What do you need from me, and when? Projects stall on client-side content and approvals far more often than on engineering. A studio that names this up front has run real projects.',
          'What happens after launch, and what does it cost? Support terms vary more than build prices and are where the unpleasant surprises live.',
        ],
      },
      { type: 'h2', text: 'What the proposal must contain' },
      {
        type: 'ul',
        items: [
          'An explicit out-of-scope list. More informative than the feature list, and its absence is the single most common cause of disputes later.',
          'Milestones with payment tied to delivery, not to dates. You should be paying for things that exist.',
          'A named revision policy. Structured rounds at agreed points, not a vague promise of flexibility that becomes a fight.',
          'Ownership. The code, the data, the domain and the hosting accounts are yours. In writing, before work begins.',
          'Who pays for third-party services, and whose accounts they sit in. Hosting, email, payment gateways, any paid libraries.',
        ],
      },
      { type: 'h2', text: 'Verification that costs you nothing' },
      {
        type: 'p',
        text: 'Portfolios are the easiest thing to exaggerate. Three cheap checks change what you are looking at.',
      },
      {
        type: 'ul',
        items: [
          'Open their portfolio sites and check they are live and functioning. Sites that are down, parked or obviously rebuilt by someone else are a signal.',
          'Ask for one reference in a comparable industry and actually call them. Ask what went wrong and how it was handled — not whether they were happy.',
          'Ask to see code, or a repository, or a technical walkthrough of something they built. You do not need to read it. You are checking that a real one exists and that they are comfortable showing it.',
        ],
      },
      { type: 'h2', text: 'The warning signs' },
      {
        type: 'ul',
        items: [
          'A fixed price quoted before anyone has asked what the software does. That number is a guess, and it will be defended later by reducing what you get.',
          'Reluctance to name the team, or a portfolio that cannot be attributed to identifiable people.',
          'No written scope — "we will work it out as we go" — which reliably means you will pay for that discovery twice.',
          'Pressure to sign quickly, or a discount that expires. Engineering capacity does not work that way.',
          'Refusing to confirm code ownership. This is disqualifying on its own, whatever else is on offer.',
          'A quote far below every other. Usually the backend, the testing or the post-launch relationship has quietly been excluded.',
        ],
      },
      { type: 'h2', text: 'On price, and on rates' },
      {
        type: 'p',
        text: 'Rates in Lahore are lower than in North America, Western Europe or Australia, which is exactly why a lot of international clients build here. But a rate is not a cost. A cheaper team needing twice the hours, or delivering something that needs rebuilding, is more expensive than the quote it beat.',
      },
      {
        type: 'p',
        text: 'Compare total delivered cost, including what happens after launch, and treat any quote dramatically below the rest as a question rather than a bargain. Ask what it excludes; there is always an answer.',
      },
      { type: 'h2', text: 'Judging communication before you commit' },
      {
        type: 'p',
        text: 'Most failed projects are not failures of engineering. They are failures of communication that were visible in the first fortnight and ignored because the proposal looked good.',
      },
      {
        type: 'p',
        text: 'Pay attention to how they behave before you are a client. Do they reply within a working day? Do they ask questions about your business, or only about features? When you describe something ambiguous, do they flag the ambiguity or quietly assume an interpretation? Do they tell you when an idea of yours is a bad one? A studio that agrees with everything during the sales conversation will agree with everything during the build, and you will discover the disagreements at the end.',
      },
      {
        type: 'p',
        text: 'Ask directly who your point of contact will be and how often you will hear from them. "You will deal with the team building it" is a better answer than an account manager relaying messages, because every layer between you and the work is a layer where detail gets lost.',
      },
      { type: 'h2', text: 'How to structure the engagement' },
      {
        type: 'p',
        text: 'The lowest-risk arrangement is a small paid discovery phase that produces a written specification, followed by a fixed quote against that specification. Discovery is cheap relative to a build, it tells you how the studio thinks and communicates before you are committed, and the specification belongs to you — you can take it to someone else if the working relationship does not convince you.',
      },
      {
        type: 'p-link',
        before: 'If you want to see how one studio answers these questions before you ask them, our ',
        href: '/services/software-development',
        anchor: 'software development service',
        after: ' sets out the scoping and architecture stages, what each produces, and what you receive at handover.',
      },
    ],
    faqs: [
      {
        question: 'How much should I pay a software house in Lahore?',
        answer:
          'There is no single rate — pricing varies widely by team seniority, project complexity and engagement model, and any figure quoted without knowing your scope is a guess. What matters more than the rate is what the quote includes: discovery, design, backend, testing, deployment, training and post-launch support are each a line that can quietly be missing.',
      },
      {
        question: 'Should I hire a software house or freelancers?',
        answer:
          'Freelancers can be excellent value for well-defined, self-contained work, particularly if you can specify and manage it yourself. A studio is worth the premium when the project needs several disciplines working together, when continuity matters over years, or when you need someone accountable if a person leaves mid-project. The real question is who carries the risk when something goes wrong.',
      },
      {
        question: 'How do I check a software house is legitimate?',
        answer:
          'Verify the registered business details, confirm a physical address and a working phone number, check that portfolio sites are genuinely live, and speak to at least one past client directly. Look for named people with traceable professional profiles rather than anonymous team pages. None of this takes more than an afternoon and it filters out most of the risk.',
      },
      {
        question: 'What should be in the contract?',
        answer:
          'Scope with an explicit exclusions list, milestones with payment tied to delivery, a revision policy, a timeline with defined client responsibilities, confidentiality, and unambiguous ownership of code, data, domain and accounts transferring to you. Also specify what happens if either side terminates early — including that you receive the work completed to that point.',
      },
      {
        question: 'Can I work with a Lahore studio from outside Pakistan?',
        answer:
          'Yes, and many do. Practical things to settle early: overlap hours for calls, the payment method and currency, which jurisdiction the contract sits under, and how intellectual property transfers. Ask for a regular written update rather than relying on meetings, since time-zone gaps make asynchronous reporting more valuable than scheduled calls.',
      },
    ],
  },
  {
    slug: 'local-seo-for-pakistani-businesses',
    title: 'Local SEO for Pakistani businesses: a practical guide',
    excerpt:
      'Local SEO starts with a verified Google Business Profile and identical name, address and phone details everywhere. The order to do things in, and what to skip.',
    category: 'SEO',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'seo',
    content: [
      {
        type: 'p',
        text: 'Local SEO is the work that makes your business appear when someone nearby searches for what you do — "dentist near me", "law firm in Lahore", "AC repair Johar Town". For a business serving a specific city or area, it is usually the highest-return search work available, and it starts with one thing: a verified Google Business Profile with your details identical everywhere they appear.',
      },
      {
        type: 'p',
        text: 'Most guides bury that under a list of thirty tactics. In practice the first three items below do most of the work, and a business that does only those will outperform a competitor doing everything else badly.',
      },
      { type: 'h2', text: 'Step one: claim and verify your Google Business Profile' },
      {
        type: 'p',
        text: 'This is the single highest-impact action, and it is free. The map results that appear above the ordinary blue links are drawn from Business Profiles, not from your website. Without a verified profile you are not eligible for the most valuable position on the page, no matter how good your site is.',
      },
      {
        type: 'ul',
        items: [
          'Claim the profile and complete verification. Do not abandon this halfway — an unverified profile does nothing.',
          'Choose the most specific primary category available. "Dental clinic" beats "doctor"; specificity is what matches you to intent.',
          'Fill in hours, service area, services and a real description. Incomplete profiles rank worse than complete ones.',
          'Add genuine photographs of your actual premises, team and work. Stock imagery is obvious and does not help.',
          'Keep it current. Changed hours during Ramadan or public holidays belong on the profile, not only in your head.',
        ],
      },
      { type: 'h2', text: 'Step two: make your NAP identical everywhere' },
      {
        type: 'p',
        text: 'NAP means name, address and phone number. Search engines cross-reference these across your website, your Business Profile and every directory that lists you. When the details disagree, confidence in all of them drops.',
      },
      {
        type: 'p',
        text: 'Identical means identical — the same business name with the same suffix, the same address formatting, the same phone number format. "Avenix Studio" and "Avenix Studios Pvt Ltd" read as two businesses. Decide on one exact form, write it down, and use it everywhere without variation. Put it in your website footer so it appears on every page.',
      },
      { type: 'h2', text: 'Step three: reviews, and how to ask' },
      {
        type: 'p',
        text: 'Reviews influence both ranking and whether anyone clicks. A profile with a handful of reviews loses to one with many, even at a similar rating.',
      },
      {
        type: 'ul',
        items: [
          'Ask every satisfied customer, at the moment the work is done and they are happy. Later is a worse moment.',
          'Send a direct link to the review form rather than instructions. Every extra step loses people.',
          'Reply to all of them, including the negative ones. A measured reply to a complaint reassures the next reader far more than an unbroken wall of five stars.',
          'Never buy reviews. They are detectable, they are removable, and the penalty is worse than the problem you were solving.',
        ],
      },
      { type: 'h2', text: 'Step four: a page per location and per service' },
      {
        type: 'p',
        text: 'If you serve several areas or offer several distinct services, one page listing them all will rank for none of them. Search engines match a query to a page, so the page has to exist.',
      },
      {
        type: 'p',
        text: 'That means a genuine page per major service, and per location if you have multiple branches — each with real, specific content. What it does not mean is generating fifty near-identical pages with the city name swapped. Those are recognisable, they are thin, and they can harm the site. If you cannot write something genuinely useful about serving a particular area, you do not need a page for it.',
      },
      { type: 'h2', text: 'Step five: local citations and directories' },
      {
        type: 'p',
        text: 'Citations are mentions of your NAP on other sites: local directories, industry bodies, chambers of commerce, professional associations. They act as corroboration. Focus on directories a real customer might actually use and on bodies relevant to your industry, rather than on volume — a hundred listings on sites nobody visits is not worth five on ones they do.',
      },
      { type: 'h2', text: 'What matters on your own website' },
      {
        type: 'ul',
        items: [
          'Mobile speed. Most local searches happen on a phone, frequently on mobile data. A slow site loses the visit before it starts.',
          'LocalBusiness structured data, so your details are machine-readable rather than only visible.',
          'Your city and service area written naturally in the copy — in the context of what you actually do, not stuffed into every heading.',
          'A tappable phone number and a WhatsApp link. In Pakistan a large share of local enquiries arrive by message rather than through a form.',
          'Embedded directions or a map on your contact page.',
        ],
      },
      { type: 'h2', text: 'What to skip' },
      {
        type: 'ul',
        items: [
          'Keyword-stuffed page titles like "Best Dentist Lahore | Dentist Lahore | Lahore Dental". They read badly, they suppress clicks, and they do not work any more.',
          'Buying links from directories that exist only to sell links.',
          'Creating multiple Business Profiles for one location to appear in more areas. This is against the rules and risks the profile you have.',
          'Obsessing over ranking position from your own device. Results are personalised and location-dependent — what you see is not what your customers see.',
        ],
      },
      { type: 'h2', text: 'How to know whether it is working' },
      {
        type: 'p',
        text: 'Ignore where you think you rank. Use the numbers instead: Business Profile views, calls and direction requests, and in Search Console the impressions and clicks on non-branded queries — searches for what you do, rather than for your business name. A rise in non-branded impressions is the earliest reliable sign that the work is landing, and it usually appears well before the phone starts ringing.',
      },
      {
        type: 'p-link',
        before: 'If you would rather have this audited and implemented than work through it yourself, our ',
        href: '/services/seo',
        anchor: 'SEO services for businesses in Pakistan',
        after: ' cover technical fixes, local search and the structured data that makes your details readable to search engines and AI assistants.',
      },
    ],
    faqs: [
      {
        question: 'How long does local SEO take to work in Pakistan?',
        answer:
          'A newly verified Google Business Profile can begin appearing within weeks, which makes it the fastest-moving part of the work. Competitive rankings in a large city take considerably longer and depend on your category, how established competitors are, and your review volume. Anyone promising a position by a date is describing something they do not control.',
      },
      {
        question: 'Do I need a website if I have a Google Business Profile?',
        answer:
          'You can rank in map results without one, but you will convert worse and cap your reach. The profile shows your details; the website is where someone decides whether to trust you, sees your work, and understands your services. They also reinforce each other — a profile linking to a fast, relevant site performs better than one linking nowhere.',
      },
      {
        question: 'What is the difference between local SEO and regular SEO?',
        answer:
          'Local SEO targets searches with geographic intent and competes for map results, where the main ranking factors are your Business Profile, proximity to the searcher, NAP consistency and reviews. Regular SEO targets the standard results, where content depth and links matter more. A local business needs both, but the local work usually returns faster.',
      },
      {
        question: 'How do I get more Google reviews without breaking the rules?',
        answer:
          'Ask directly and personally at the moment the customer is happiest, and make it one tap with a direct link. You may ask; you may not incentivise, filter to only happy customers, or buy them. Consistently asking every satisfied customer will, over a few months, put you ahead of nearly every competitor who does it sporadically.',
      },
      {
        question: 'Does my business need a physical address for local SEO?',
        answer:
          'Not necessarily. Service-area businesses that travel to customers — plumbers, electricians, mobile services — can verify a profile and hide the address while specifying the areas covered. What you cannot do is invent an address or use a virtual office you do not operate from; both risk the profile being suspended.',
      },
    ],
  },
  {
    slug: 'impressions-but-no-clicks',
    title: 'Why your website gets impressions but no clicks (and how to fix it)',
    excerpt:
      'Impressions with no clicks usually means one of two things: you are ranking on page two, or your title and description give nobody a reason to choose you.',
    category: 'SEO',
    date: '2026-09-18',
    readingTime: '5 min read',
    service: 'seo',
    content: [
      {
        type: 'p',
        text: 'If Search Console shows impressions but almost no clicks, there are only two real explanations: you are ranking too low to be seen, or you are being seen and your result is not compelling enough to click. Your average position tells you which — below about ten means visibility, and a good position with a poor click rate means your title and description are the problem.',
      },
      {
        type: 'p',
        text: 'The distinction matters because the fixes are completely different, and treating a positioning problem as a copywriting problem wastes months. Here is how to tell them apart and what to do in each case.',
      },
      { type: 'h2', text: 'Diagnose it first' },
      {
        type: 'p',
        text: 'In Search Console, open Performance, enable impressions, clicks, click-through rate and average position, then look at individual pages and queries rather than the site-wide total. The site-wide average hides everything useful.',
      },
      {
        type: 'ul',
        items: [
          'Average position beyond about ten. You are on page two or worse. Almost nobody scrolls there, so a low click rate is expected and the work is ranking, not wording.',
          'Good position, poor click rate. You are visible and being passed over. This is a titles-and-descriptions problem and it is the fastest thing on this list to fix.',
          'Impressions on queries that do not match the page. You are surfacing for the wrong searches, which means the page is not clearly about anything specific.',
          'Impressions concentrated on your business name. You are only found by people who already know you. That is a coverage problem — the pages that would rank for what you sell do not exist yet.',
        ],
      },
      { type: 'h2', text: 'If the problem is your title and description' },
      {
        type: 'p',
        text: 'The title is the single highest-leverage piece of text on any page, and most sites waste it. A title reading "Services" or "Home" gives a searcher nothing to match against. The result gets skipped in favour of one that names what the searcher wanted.',
      },
      {
        type: 'ul',
        items: [
          'Lead with what the page is about, then the brand. "SEO Services in Pakistan | Your Business" beats "Your Business | Home" every time.',
          'Keep titles roughly under sixty characters so they are not truncated mid-phrase.',
          'Write a description that gives a reason to choose you rather than restating the title. It does not directly affect ranking, but it heavily affects whether anyone clicks.',
          'Make every title and description unique. Duplicates across pages mean those pages compete with each other and none of them reads as the definitive answer.',
          'Match the wording of the query where it is honest to do so. A searcher scanning results is pattern-matching against their own words.',
        ],
      },
      {
        type: 'p',
        text: 'Avoid the older habit of stuffing every variation into the title. "Best SEO Lahore | SEO Company Lahore | SEO Services" reads as spam to a human, which suppresses exactly the clicks you were trying to win.',
      },
      { type: 'h2', text: 'If the problem is position' },
      {
        type: 'p',
        text: 'Ranking on page two usually means one of three things, and it is worth working out which before doing any writing.',
      },
      {
        type: 'ul',
        items: [
          'The page is not specifically about the query. One page covering eight services will lose to eight pages each covering one. Search engines match a query to a page, so the page has to exist and has to be about that one thing.',
          'The content is thinner than what is ranking above you. Open the top three results and look honestly at what they cover that you do not. Length is not the point; completeness is.',
          'The site has little authority. This is the slow one. It is earned through genuinely useful content and through other sites referencing you, and there is no shortcut worth taking.',
        ],
      },
      { type: 'h2', text: 'If you only rank for your own name' },
      {
        type: 'p',
        text: 'This is the most common pattern for small business sites and the most misdiagnosed. Branded impressions look like traffic in a dashboard, but they come from people who already knew you existed. The site is not winning new customers; it is confirming details for people who were already coming.',
      },
      {
        type: 'p',
        text: 'The fix is not optimisation, it is coverage. If you sell four things and have one page mentioning all four, you have nothing that can rank for any of them. Build a real page per service, each answering that specific query properly, and link them from your homepage and from your related work. Then the non-branded impressions have somewhere to land.',
      },
      { type: 'h2', text: 'The other thing eating your clicks' },
      {
        type: 'p',
        text: 'Search results pages increasingly answer the question directly, through featured snippets and AI-generated summaries. For genuinely informational queries, a share of impressions will never become clicks because the searcher got what they needed on the results page.',
      },
      {
        type: 'p',
        text: 'You cannot opt out of that, but you can respond to it. Structure content so your answer is the one being quoted — direct question-and-answer formatting, clear headings, valid structured data. And prioritise queries with commercial intent, where someone searching for a service in their city still has to click through to decide who to contact.',
      },
      { type: 'h2', text: 'A realistic order to work in' },
      {
        type: 'ul',
        items: [
          'Fix titles and descriptions on your highest-impression pages first. Fastest change, and the results show within weeks.',
          'Build the missing service pages, so non-branded queries have somewhere to land.',
          'Improve the pages sitting at positions five to fifteen, where small gains move you onto page one.',
          'Then work on authority, which is slow and compounds.',
        ],
      },
      {
        type: 'p',
        text: 'Measure non-branded impressions specifically, by filtering out queries containing your business name. That single filtered number is the honest measure of whether strangers are finding you, and it is the one worth watching month to month.',
      },
      {
        type: 'p-link',
        before: 'If you want the diagnosis done against your own Search Console data rather than guessed at, our ',
        href: '/services/seo',
        anchor: 'SEO services',
        after: ' start with exactly that audit — what is indexed, what is ranking for nothing, and which fixes are worth doing first.',
      },
    ],
    faqs: [
      {
        question: 'What is a good click-through rate from search?',
        answer:
          'It depends heavily on position and query type, so treat any single benchmark with suspicion. The useful comparison is against yourself: look at your own pages at similar positions and find the ones performing notably worse. Those are where a title rewrite will pay off fastest.',
      },
      {
        question: 'How long after changing a title will I see results?',
        answer:
          'The page needs recrawling first, which typically takes days to a few weeks, and you can request indexing in Search Console to speed it up. After that, allow a few weeks of data before judging — comparing a handful of days against the previous period will mostly show noise.',
      },
      {
        question: 'Why does Google show a different title than the one I set?',
        answer:
          'Google rewrites titles when it judges its own version a better match for the query, commonly when your title is truncated, keyword-stuffed, or does not reflect the page content. A clear, accurate, appropriately short title is far less likely to be overridden. If yours is being rewritten consistently, treat it as feedback.',
      },
      {
        question: 'Are impressions without clicks bad for my rankings?',
        answer:
          'A poor click-through rate is not a straightforward penalty, and the relationship is more complicated than the "CTR is a ranking factor" claim suggests. The practical reason to care is simpler: impressions you are not converting into visits are free visibility you are wasting, and that is worth fixing on its own terms.',
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
