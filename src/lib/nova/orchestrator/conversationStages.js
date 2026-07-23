/**
 * Nova Orchestrator — conversation stages (constants + ordering).
 *
 * The lifecycle the orchestrator walks. Pure data: no logic, no side effects.
 * Transition rules live in stateTransitions.js; copy lives in orchestratorConfig.
 */

export const STAGE = Object.freeze({
  GREETING: 'greeting',
  INTENT: 'intent',
  QUALIFICATION: 'qualification',
  RECOMMENDATION: 'recommendation',
  LEAD_CAPTURE: 'lead_capture',
  COMPLETED: 'completed',
});

/** Canonical linear order (used for progress + as a default fallback path). */
export const STAGE_ORDER = Object.freeze([
  STAGE.GREETING,
  STAGE.INTENT,
  STAGE.QUALIFICATION,
  STAGE.RECOMMENDATION,
  STAGE.LEAD_CAPTURE,
  STAGE.COMPLETED,
]);

/** Index of a stage in the canonical order (or -1). */
export function stageIndex(stage) {
  return STAGE_ORDER.indexOf(stage);
}

/** True when a stage is the terminal stage. */
export function isTerminal(stage) {
  return stage === STAGE.COMPLETED;
}
