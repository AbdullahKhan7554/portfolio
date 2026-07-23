/**
 * Nova Sales — engine (composition root). Ties intent detection, state,
 * qualification, and recommendation into one façade. Stateless itself: every
 * method takes a state and returns a NEW state (in-memory only, no persistence).
 * Config is injectable (DI) so any tenant/catalog can drive it.
 */
import { SERVICES, STAGE } from './serviceConfig';
import { detectIntent } from './intentDetector';
import {
  createSalesState,
  setIntent,
  recordAnswer,
  setStage,
  updateState,
} from './conversationState';
import {
  selectService,
  nextQuestion,
  qualificationScore,
  isQualified,
} from './qualificationEngine';
import { recommendService } from './recommendationEngine';

export function createSalesEngine({ services = SERVICES } = {}) {
  /** Recompute derived fields (nextQuestion, score, recommendation, stage). */
  function reconcile(state) {
    const service = selectService(state.intent, services);
    const next = nextQuestion(service, state.completedQuestions);
    const score = qualificationScore(service, state.completedQuestions);
    const qualified = isQualified(service, state.completedQuestions);
    const recommendation = qualified ? recommendService(state, services) : null;

    let stage = STAGE.DISCOVERY;
    if (qualified) stage = STAGE.COMPLETE;
    else if (state.completedQuestions.length > 0) stage = STAGE.QUALIFYING;
    else if (state.intent && state.intent !== 'general') stage = STAGE.QUALIFYING;

    return updateState(state, {
      nextQuestion: next ? next.key : null,
      qualificationScore: score,
      recommendation: recommendation ? recommendation.serviceId : null,
      stage,
    });
  }

  return {
    /** New conversation. */
    start(overrides) {
      return reconcile(createSalesState(overrides));
    },

    /** Process an inbound user message: detect intent, then reconcile. */
    ingestMessage(state, text) {
      const { intent, score } = detectIntent(text);
      // Keep an existing specific intent unless a stronger signal arrives.
      const nextIntent = score > 0 ? intent : state.intent;
      return reconcile(setIntent(state, nextIntent));
    },

    /** Record an answer to the current/next question, then reconcile. */
    answer(state, questionKey, value) {
      return reconcile(recordAnswer(state, questionKey, value));
    },

    /** Explicitly set intent (e.g. from a quick-reply chip). */
    setIntent(state, intent) {
      return reconcile(setIntent(state, intent));
    },

    /** Force a stage transition (rarely needed; reconcile owns staging). */
    setStage(state, stage) {
      return setStage(state, stage);
    },

    /** Read-only helpers. */
    getNextQuestion(state) {
      const service = selectService(state.intent, services);
      return nextQuestion(service, state.completedQuestions);
    },
    getRecommendation(state) {
      return recommendService(state, services);
    },
    getService(state) {
      return selectService(state.intent, services);
    },
  };
}

/** Default engine bound to the bundled service config. */
export const salesEngine = createSalesEngine();
