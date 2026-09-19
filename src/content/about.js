/**
 * About page content — company-level, per the Phase 3 architecture.
 *
 * CONTENT RULES (enforced, not aspirational):
 * Nothing here states team size, revenue, awards, testimonials, client names,
 * outcome percentages, or years of experience. The only quantitative claims on
 * the page are the two corroborated in-repo — 16+ projects (16 entries in
 * content/caseStudies.js) and 7+ live clients (9 entries in data/clients.js) —
 * plus the performance targets in content/whyMe.js, which are presented as
 * standards Avenix holds itself to, NOT as results clients achieved.
 *
 * "100% Client Satisfaction" is deliberately absent: it stays on the homepage,
 * but an unauditable percentage undercuts a page whose whole job is earning
 * trust through substance.
 *
 * Voice: Avenix, never "I". The founder is named in the founder section as a
 * subject, not a narrator.
 */

/**
 * 02 — Who We Are. Rendered as running prose, NOT five icon cards; the clause
 * per discipline is deliberately short enough to read as one continuous
 * sentence when the eye skims the amber terms.
 */
export const disciplines = [
  {
    id: 'strategy',
    name: 'Strategy',
    clause: 'Deciding what is worth building, before anything gets built.',
  },
  {
    id: 'design',
    name: 'Design',
    clause: 'Making the decision legible through hierarchy, rhythm and restraint.',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    clause: 'Code that survives real traffic and the next developer to open it.',
  },
  {
    id: 'ai',
    name: 'AI',
    clause: 'Applied where it removes work, not where it makes a headline.',
  },
  {
    id: 'growth',
    name: 'Growth',
    clause: 'The work after launch is where the value actually shows up.',
  },
];

/** 05 / 06 — Mission and Vision. Present tense vs. future tense, deliberately. */
export const missionVision = {
  mission: {
    label: 'Today',
    title: 'Build technology people actually use.',
    body: 'Useful outlasts impressive. Every project starts from what the business needs to happen and ends with something its customers can move through without thinking about it. That takes design with a reason behind it, engineering that holds up, and AI used only where it earns its place.',
  },
  vision: {
    label: 'Tomorrow',
    title: 'Business, design, engineering and AI as one system.',
    body: 'Most teams still treat these as four separate hand-offs, and the seams are where products lose their edge. Avenix is building toward a studio where they operate as a single practice, so what we deliver becomes durable infrastructure for a business instead of another redesign in two years.',
  },
};

/**
 * 07 — How We Work With Clients. Terminology anchored to the existing
 * engagementSteps in content/process.js so About and the homepage stay coherent
 * without duplicating the homepage's delivery UI. This is the PHILOSOPHY of the
 * relationship; the deliverables live on /services.
 */
export const clientPhilosophy = [
  {
    id: 'understand',
    title: 'Understand',
    description:
      'We start with the business, not the brief: what the goal is, who it serves, what genuinely constrains it. The awkward questions belong at the start, while they are still cheap to answer.',
  },
  {
    id: 'align',
    title: 'Align',
    description:
      'Scope, priorities and trade-offs agreed before a line is written. A surprise late in a project is almost always a planning failure earlier in it.',
  },
  {
    id: 'build',
    title: 'Build',
    description:
      'Design and engineering move together instead of as a relay, with milestones you can see and respond to while there is still time to change direction.',
  },
  {
    id: 'communicate',
    title: 'Communicate',
    description:
      'Progress, decisions, and the reasoning behind them, including what we chose not to build and why. You should never have to ask where a project stands.',
  },
  {
    id: 'improve',
    title: 'Improve',
    description:
      'Launch is a checkpoint, not a finish line. What the first real users reveal is the most valuable information a product ever gets.',
  },
];

/** 08 — Principles. Six, each one sentence. Company values, not workflow. */
export const principles = [
  {
    id: 'purpose',
    title: 'Purpose Over Noise',
    description:
      'Every element earns its place or it leaves. Restraint is a decision, not an absence of ideas.',
  },
  {
    id: 'strategy',
    title: 'Strategy Before Execution',
    description:
      'Understand the problem properly and the build becomes the straightforward part.',
  },
  {
    id: 'craft',
    title: 'Craft Compounds',
    description:
      'The details nobody can name are the ones everybody feels. They accumulate into trust.',
  },
  {
    id: 'technology',
    title: 'Technology With Purpose',
    description:
      'The right tool solves the problem in front of it. Sounding advanced is not a requirement.',
  },
  {
    id: 'judgment',
    title: 'Human Judgment',
    description:
      'Tooling accelerates the work. Deciding what is right, and answering for it, stays with people.',
  },
  {
    id: 'longterm',
    title: 'Long-Term Thinking',
    description:
      'The business signing off today will not be the business in three years. We build for that one too.',
  },
];

/**
 * 09 — Trust. Only the two corroborated counts. Framed as scope of work to
 * date, never as outcomes produced for clients.
 */
export const trackRecord = [
  { id: 'projects', value: '16+', label: 'Projects shipped' },
  { id: 'clients', value: '7+', label: 'Live clients' },
];

/** 04 — Founder. Philosophy behind the studio; no biography, no CV. */
export const founderParagraphs = [
  'Avenix Studio was founded in 2023 on a straightforward objection: the industry keeps asking businesses to choose between work that looks considered and work that is built properly. Those are not opposing skills. Treating them as one practice is the entire premise of the studio.',
  'Every technical decision here starts somewhere non-technical: what the business actually needs to happen, who it serves, and what it can realistically maintain once we are gone. Pick a stack before you know that and you are guessing.',
  'AI has made execution dramatically faster, and Avenix uses it throughout. What it has not changed is who is accountable. Judgment about what should be built, and responsibility for the result once it ships, stays human. The tools did not change that, and they were never going to.',
];
