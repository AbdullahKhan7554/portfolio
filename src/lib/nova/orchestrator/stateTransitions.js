/**
 * Nova Orchestrator — stage transition rules. PURE decision functions: given
 * the current stage + the coordinated sub-engine snapshots, decide the next
 * stage. No engine internals are re-implemented here — it only reads the values
 * the engines already expose (sales score/recommendation, lead completeness).
 */
import { STAGE } from './conversationStages';

/**
 * Compute the next stage from a read-only view of the world.
 * @param {Object} view
 * @param {string} view.stage                     current stage
 * @param {string} view.intent                    detected sales intent
 * @param {number} view.qualificationScore        0..100 (from 5A)
 * @param {boolean} view.hasRecommendation        recommendation available (5A)
 * @param {boolean} view.leadComplete             all required lead fields done (5B)
 * @param {Object} config
 * @param {number} config.recommendAtScore
 * @returns {string} next stage
 */
export function nextStage(view, config = {}) {
  const {
    stage,
    intent,
    qualificationScore = 0,
    hasRecommendation = false,
    leadComplete = false,
  } = view;
  const threshold = config.recommendAtScore ?? 100;

  switch (stage) {
    case STAGE.GREETING:
      return STAGE.INTENT;

    case STAGE.INTENT:
      // Advance once a concrete intent is known.
      return intent && intent !== 'general' ? STAGE.QUALIFICATION : STAGE.INTENT;

    case STAGE.QUALIFICATION:
      return qualificationScore >= threshold ? STAGE.RECOMMENDATION : STAGE.QUALIFICATION;

    case STAGE.RECOMMENDATION:
      // Once a recommendation exists, move on to collecting contact details.
      return hasRecommendation ? STAGE.LEAD_CAPTURE : STAGE.RECOMMENDATION;

    case STAGE.LEAD_CAPTURE:
      return leadComplete ? STAGE.COMPLETED : STAGE.LEAD_CAPTURE;

    case STAGE.COMPLETED:
    default:
      return STAGE.COMPLETED;
  }
}
