/**
 * Nova Sales — service catalog + intent vocabulary (CONFIG, not logic).
 *
 * Everything the engine reasons over lives here: the supported intents, the
 * keyword cues that map language → intent, and per-service qualification
 * questions. Add/edit a company's sales behavior by editing this config only —
 * no engine code changes. No pricing, no persistence.
 */

/** Canonical intents the engine can detect. */
export const INTENT = Object.freeze({
  WEBSITE: 'website',
  ECOMMERCE: 'ecommerce',
  AUTOMATION: 'automation',
  BRANDING: 'branding',
  SEO: 'seo',
  CONSULTATION: 'consultation',
  PRICING: 'pricing',
  SUPPORT: 'support',
  GENERAL: 'general',
});

/** Conversation stages (linear, in-memory). */
export const STAGE = Object.freeze({
  DISCOVERY: 'discovery',
  QUALIFYING: 'qualifying',
  RECOMMENDING: 'recommending',
  COMPLETE: 'complete',
});

/**
 * Keyword cues per intent. Order-independent; scored by match count.
 * @type {Record<string, string[]>}
 */
export const INTENT_KEYWORDS = Object.freeze({
  [INTENT.WEBSITE]: ['website', 'web app', 'landing', 'site', 'portfolio', 'nextjs', 'react'],
  [INTENT.ECOMMERCE]: ['ecommerce', 'e-commerce', 'store', 'shop', 'cart', 'checkout', 'products', 'payments'],
  [INTENT.AUTOMATION]: ['automation', 'automate', 'workflow', 'integration', 'api', 'crm', 'zapier', 'bot'],
  [INTENT.BRANDING]: ['branding', 'brand', 'logo', 'identity', 'design system', 'rebrand'],
  [INTENT.SEO]: ['seo', 'search', 'ranking', 'traffic', 'google', 'keywords', 'organic'],
  [INTENT.CONSULTATION]: ['consultation', 'consult', 'advice', 'strategy', 'call', 'meeting', 'talk'],
  [INTENT.PRICING]: ['price', 'pricing', 'cost', 'quote', 'budget', 'how much', 'rates'],
  [INTENT.SUPPORT]: ['support', 'help', 'issue', 'bug', 'broken', 'fix', 'maintenance', 'error'],
});

/**
 * Service definitions with configurable qualification questions and the intents
 * each service satisfies. `questions[].key` is the state key; `weight` feeds the
 * qualification score.
 */
export const SERVICES = Object.freeze([
  {
    id: 'website',
    name: 'Business Website',
    intents: [INTENT.WEBSITE, INTENT.BRANDING],
    questions: [
      { key: 'goal', weight: 2, prompt: 'What is the main goal of the website?' },
      { key: 'pages', weight: 1, prompt: 'Roughly how many pages do you need?' },
      { key: 'timeline', weight: 1, prompt: 'When would you like it live?' },
      { key: 'budget', weight: 2, prompt: 'Do you have a budget range in mind?' },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    intents: [INTENT.ECOMMERCE],
    questions: [
      { key: 'products', weight: 2, prompt: 'How many products will you sell?' },
      { key: 'payments', weight: 1, prompt: 'Which payment methods do you need?' },
      { key: 'timeline', weight: 1, prompt: 'What is your target launch date?' },
      { key: 'budget', weight: 2, prompt: 'What budget are you working with?' },
    ],
  },
  {
    id: 'automation',
    name: 'Automation & Integrations',
    intents: [INTENT.AUTOMATION],
    questions: [
      { key: 'process', weight: 2, prompt: 'Which process would you like to automate?' },
      { key: 'tools', weight: 2, prompt: 'What tools or systems must it connect to?' },
      { key: 'volume', weight: 1, prompt: 'What volume are you handling today?' },
    ],
  },
  {
    id: 'seo',
    name: 'SEO & Growth',
    intents: [INTENT.SEO],
    questions: [
      { key: 'site', weight: 2, prompt: 'Do you have a site already? What is the URL?' },
      { key: 'goal', weight: 2, prompt: 'What outcome do you want from SEO?' },
      { key: 'timeline', weight: 1, prompt: 'What is your timeframe?' },
    ],
  },
  {
    id: 'consultation',
    name: 'Strategy Consultation',
    intents: [INTENT.CONSULTATION, INTENT.GENERAL, INTENT.PRICING, INTENT.SUPPORT],
    questions: [
      { key: 'topic', weight: 2, prompt: 'What would you like to discuss?' },
      { key: 'timeline', weight: 1, prompt: 'How soon do you want to start?' },
    ],
  },
]);
