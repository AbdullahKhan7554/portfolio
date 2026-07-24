/**
 * Nova Planner — intent classifier + action planner (PURE).
 *
 * Decides WHAT Nova should do before the provider is called — it only
 * classifies and returns a plan; it NEVER executes anything (no provider, no
 * AI, no DB, no tools). Lightweight rule-based classification that reuses the
 * user message, the orchestrator's decided action, the company config, the
 * directive, and runtime state. Injectable via `createIntentPlanner` (DI).
 */
import { INTENT, INTENT_KEYWORDS, ESCALATION_KEYWORDS, createExecutionPlan } from './intents';

/** Specific intents, in tie-break priority order (first wins on equal score). */
const SPECIFIC_INTENTS = [
  INTENT.PRICING_QUESTION,
  INTENT.PRODUCT_QUESTION,
  INTENT.FAQ_QUESTION,
  INTENT.COMPANY_QUESTION,
  INTENT.SALES_QUESTION,
  INTENT.LEAD_CAPTURE,
  INTENT.TOOL_REQUEST,
];

const countHits = (text, cues = []) => cues.reduce((n, cue) => (text.includes(cue) ? n + 1 : n), 0);
const detectEscalation = (text) => ESCALATION_KEYWORDS.some((k) => text.includes(k));

/**
 * @param {Object} [deps]
 * @param {Record<string,string[]>} [deps.keywords]  intent keyword rules (DI/testing)
 */
export function createIntentPlanner({ keywords = INTENT_KEYWORDS } = {}) {
  /**
   * Classify the request into an intent + confidence. Pure.
   * @param {{ message?:string, assistantAction?:object, config?:object, directive?:string, state?:object }} [input]
   * @returns {{ intent:string, confidence:number, signals:string[] }}
   */
  function classify({ message = '', assistantAction } = {}) {
    // Strong signals from the orchestrator's already-decided action.
    if (assistantAction?.type === 'ask' && assistantAction?.source === 'lead') {
      return { intent: INTENT.LEAD_CAPTURE, confidence: 0.95, signals: ['orchestrator:lead-ask'] };
    }
    if (assistantAction?.type === 'ask' && assistantAction?.source === 'sales') {
      return { intent: INTENT.SALES_QUESTION, confidence: 0.9, signals: ['orchestrator:sales-ask'] };
    }
    if (assistantAction?.type === 'recommend') {
      return { intent: INTENT.SALES_QUESTION, confidence: 0.9, signals: ['orchestrator:recommend'] };
    }

    const text = String(message).toLowerCase().trim();
    if (!text) return { intent: INTENT.UNKNOWN, confidence: 0.2, signals: [] };

    // Rule-based keyword scoring over the specific intents.
    let best = null;
    let bestScore = 0;
    for (const intent of SPECIFIC_INTENTS) {
      const score = countHits(text, keywords[intent]);
      if (score > bestScore) {
        best = intent;
        bestScore = score;
      }
    }
    if (bestScore > 0) {
      return { intent: best, confidence: Math.min(0.65 + 0.14 * bestScore, 0.98), signals: [`keywords:${bestScore}`] };
    }

    // Greeting / smalltalk → general chat.
    if (countHits(text, keywords[INTENT.GENERAL_CHAT]) > 0) {
      return { intent: INTENT.GENERAL_CHAT, confidence: 0.6, signals: ['greeting'] };
    }
    // Non-empty but no signal → default conversational.
    return { intent: INTENT.GENERAL_CHAT, confidence: 0.4, signals: ['default'] };
  }

  /**
   * Produce a normalized execution plan for the request (no side effects).
   * @param {Object} [input]  { message, assistantAction, config, directive, state }
   * @returns {object} execution plan
   */
  function plan(input = {}) {
    const { intent, confidence, signals } = classify(input);
    const requiresHuman = detectEscalation(String(input.message ?? '').toLowerCase());
    return createExecutionPlan({
      intent,
      confidence,
      overrides: requiresHuman ? { requiresHuman: true } : {},
      metadata: { companyId: input.config?.companyId ?? null, signals },
    });
  }

  return { classify, plan };
}

/** Default planner bound to the bundled rules. Injectable/overridable. */
export const defaultIntentPlanner = createIntentPlanner();
