/**
 * Nova Planner — intent taxonomy, keyword rules, and intent→plan mapping.
 *
 * CONFIG + pure factory only. No provider code, no AI, no I/O. Lightweight
 * rule-based classification (no LLM, no embeddings). Edit the keyword cues or
 * the plan mapping to tune behavior without touching the planner logic.
 */

/** Intent categories the planner can classify. */
export const INTENT = Object.freeze({
  GENERAL_CHAT: 'general_chat',
  COMPANY_QUESTION: 'company_question',
  PRODUCT_QUESTION: 'product_question',
  FAQ_QUESTION: 'faq_question',
  PRICING_QUESTION: 'pricing_question',
  SALES_QUESTION: 'sales_question',
  LEAD_CAPTURE: 'lead_capture',
  TOOL_REQUEST: 'tool_request',
  UNKNOWN: 'unknown',
});

/** Keyword cues per intent (case-insensitive substring match). */
export const INTENT_KEYWORDS = Object.freeze({
  [INTENT.PRICING_QUESTION]: [
    'price', 'pricing', 'cost', 'how much', 'quote', 'budget', 'rate', 'fee', 'charge', 'afford', 'expensive', 'cheap',
  ],
  [INTENT.PRODUCT_QUESTION]: [
    'product', 'item', 'catalog', 'buy', 'purchase', 'stock', 'inventory', 'shop', 'store', 'in stock', 'availability',
  ],
  [INTENT.FAQ_QUESTION]: [
    'how do', 'how does', 'how long', 'do you', 'can you', 'what is', 'refund', 'warranty', 'policy', 'return', 'hours', 'shipping', 'delivery',
  ],
  [INTENT.COMPANY_QUESTION]: [
    'about you', 'who are you', 'your company', 'the team', 'founder', 'located', 'based in', 'your address', 'your mission', 'contact you', 'where are you',
  ],
  [INTENT.SALES_QUESTION]: [
    'interested', 'proposal', 'hire', 'work with', 'get started', 'your services', 'package', 'offer', 'engage', 'build for me', 'need a website', 'need a site',
  ],
  [INTENT.LEAD_CAPTURE]: [
    'my name is', 'my email', 'email is', 'phone is', 'contact me', 'call me', 'reach me', 'book a call', 'schedule a call', 'get in touch', 'sign me up', 'here is my',
  ],
  [INTENT.TOOL_REQUEST]: [
    'calculate', 'calculator', 'calendar', 'book a', 'run the', 'use the tool', 'echo', 'tool:', '```tool',
  ],
  [INTENT.GENERAL_CHAT]: [
    'hi', 'hello', 'hey', 'thanks', 'thank you', 'good morning', 'good afternoon', 'good evening', 'how are you', 'nice', 'cool', 'okay', 'great',
  ],
});

/** Keywords that request a human handoff (sets requiresHuman). */
export const ESCALATION_KEYWORDS = Object.freeze([
  'human', 'agent', 'representative', 'real person', 'speak to someone', 'talk to a person', 'customer service', 'someone real',
]);

/** Baseline plan (all off except memory). */
const BASE_PLAN = Object.freeze({
  useKnowledge: false,
  useMemory: true,
  useTools: false,
  captureLead: false,
  salesMode: false,
  requiresHuman: false,
});

/** Per-intent plan overrides merged onto BASE_PLAN. */
export const INTENT_PLAN = Object.freeze({
  [INTENT.GENERAL_CHAT]: { useKnowledge: false },
  [INTENT.COMPANY_QUESTION]: { useKnowledge: true },
  [INTENT.PRODUCT_QUESTION]: { useKnowledge: true },
  [INTENT.FAQ_QUESTION]: { useKnowledge: true },
  [INTENT.PRICING_QUESTION]: { useKnowledge: true, salesMode: true },
  [INTENT.SALES_QUESTION]: { useKnowledge: true, salesMode: true },
  [INTENT.LEAD_CAPTURE]: { useKnowledge: false, captureLead: true, salesMode: true },
  [INTENT.TOOL_REQUEST]: { useTools: true },
  [INTENT.UNKNOWN]: { useKnowledge: true },
});

/**
 * Build a normalized execution plan (never executes anything).
 * @param {{ intent:string, confidence:number, overrides?:object, metadata?:object }} input
 */
export function createExecutionPlan({ intent, confidence, overrides = {}, metadata = {} }) {
  const perIntent = INTENT_PLAN[intent] || {};
  return { intent, confidence, ...BASE_PLAN, ...perIntent, ...overrides, metadata };
}
