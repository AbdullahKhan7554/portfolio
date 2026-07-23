/**
 * Nova Sales — conversation state (in-memory only; no persistence).
 *
 * A plain, serializable object + pure transition helpers. Each helper returns a
 * NEW state (immutable updates) so the engine stays predictable and testable.
 */
import { INTENT, STAGE } from './serviceConfig';

/**
 * @typedef {Object} SalesState
 * @property {string} intent
 * @property {string} stage
 * @property {string[]} completedQuestions   answered question keys
 * @property {Object} answers                { [questionKey]: value }
 * @property {string|null} nextQuestion      key of the next question to ask
 * @property {string|null} recommendation    recommended service id
 * @property {number} qualificationScore     0..100
 */

/** Fresh, empty state. */
export function createSalesState(overrides = {}) {
  return {
    intent: INTENT.GENERAL,
    stage: STAGE.DISCOVERY,
    completedQuestions: [],
    answers: {},
    nextQuestion: null,
    recommendation: null,
    qualificationScore: 0,
    ...overrides,
  };
}

/** Immutable merge. */
export function updateState(state, patch) {
  return { ...state, ...patch };
}

/** Set the detected intent (immutable). */
export function setIntent(state, intent) {
  return updateState(state, { intent });
}

/** Record an answer to a question key (immutable). */
export function recordAnswer(state, questionKey, value) {
  if (!questionKey) return state;
  const completed = state.completedQuestions.includes(questionKey)
    ? state.completedQuestions
    : [...state.completedQuestions, questionKey];
  return updateState(state, {
    answers: { ...state.answers, [questionKey]: value },
    completedQuestions: completed,
  });
}

/** Advance the stage (immutable). */
export function setStage(state, stage) {
  return updateState(state, { stage });
}
