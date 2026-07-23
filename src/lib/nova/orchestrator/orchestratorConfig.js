/**
 * Nova Orchestrator — configuration (CONFIG, not logic).
 *
 * Everything the orchestrator says or decides thresholds on lives here, so
 * behavior is tunable per tenant without touching engine code. No conversation
 * copy is hardcoded in the modules.
 */
import { STAGE } from './conversationStages';

/** Assistant action TYPES the orchestrator can emit (UI-agnostic). */
export const ACTION = Object.freeze({
  SAY: 'say', // show a message
  ASK: 'ask', // ask a specific question (sales or lead field)
  RECOMMEND: 'recommend', // present a recommendation
  COMPLETE: 'complete', // conversation finished
});

/**
 * Default, fully-overridable config.
 *  - `messages`   : static copy per stage (SAY actions)
 *  - `intentToFlow`: maps a detected sales intent → lead-capture flow id
 *  - `startLeadCaptureAtScore`: qualification score that unlocks lead capture
 */
export const defaultOrchestratorConfig = Object.freeze({
  messages: Object.freeze({
    [STAGE.GREETING]:
      "Hi! I'm here to help you find the right fit. What are you looking to do?",
    [STAGE.RECOMMENDATION]: 'Based on what you shared, here is what I would suggest:',
    [STAGE.LEAD_CAPTURE]:
      'Great — let me grab a few details so the team can follow up.',
    [STAGE.COMPLETED]:
      "Thank you! That's everything I need — the team will be in touch shortly.",
  }),

  /** Sales intent → lead flow (falls back to 'default' when unmapped). */
  intentToFlow: Object.freeze({
    website: 'website',
    ecommerce: 'ecommerce',
    automation: 'automation',
    seo: 'seo',
    branding: 'branding',
    consultation: 'default',
    pricing: 'default',
    support: 'default',
    general: 'default',
  }),

  /** Minimum qualification score (0..100) before offering a recommendation. */
  recommendAtScore: 100,
});

/** Merge a partial override onto the defaults (shallow, with nested guards). */
export function resolveConfig(override = {}) {
  return {
    ...defaultOrchestratorConfig,
    ...override,
    messages: { ...defaultOrchestratorConfig.messages, ...(override.messages || {}) },
    intentToFlow: {
      ...defaultOrchestratorConfig.intentToFlow,
      ...(override.intentToFlow || {}),
    },
  };
}
