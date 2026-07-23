/**
 * Nova Leads — capture engine (composition root). Ties config, state,
 * validation, questions, and summary into one façade. Stateless itself: every
 * method takes a state and returns a NEW state (in-memory only, no persistence).
 *
 * Conversation-driven: it exposes exactly ONE next question at a time and only
 * advances when a submitted value passes validation.
 */
import { getFlowFields, LEAD_FIELDS } from './leadConfig';
import { createLeadState, setValue, isComplete, completionPercentage } from './leadState';
import { validateField } from './leadValidators';
import { nextQuestion } from './leadQuestions';
import { buildLeadSummary } from './leadSummary';

/**
 * @param {Object} [deps]
 * @param {Record<string,object>} [deps.fields]   field definitions (DI/testing)
 * @param {(flow:string)=>string[]} [deps.resolveFlow]  flow → ordered keys
 */
export function createLeadCaptureEngine({ fields = LEAD_FIELDS, resolveFlow = getFlowFields } = {}) {
  return {
    /** Begin capture for a flow (e.g. 'website', 'seo'); defaults to 'default'. */
    start(flow = 'default') {
      const state = createLeadState(flow);
      // Honor an injected flow resolver if provided.
      state.fields = [...resolveFlow(flow)];
      return state;
    },

    /** The single next question, or null when required fields are complete. */
    nextQuestion(state) {
      return nextQuestion(state);
    },

    /**
     * Submit an answer for the current (or an explicit) field. Validates first;
     * on failure returns the unchanged state plus the error (no advance).
     * @returns {{ state:import('./leadState').LeadState, ok:boolean, error?:string, done:boolean }}
     */
    submit(state, rawValue, fieldKey) {
      const key = fieldKey || nextQuestion(state)?.field;
      if (!key) return { state, ok: true, error: null, done: true };

      const def = fields[key];
      const result = validateField(def, rawValue);
      if (!result.ok) {
        return { state, ok: false, error: result.error, done: false };
      }

      const nextState = setValue(state, key, result.value);
      return { state: nextState, ok: true, error: null, done: isComplete(nextState) };
    },

    /** Progress snapshot. */
    progress(state) {
      const q = nextQuestion(state);
      return {
        currentField: q ? q.field : null,
        completedFields: [...state.completedFields],
        remainingFields: state.fields.filter((k) => !state.completedFields.includes(k)),
        completionPercentage: completionPercentage(state),
        isComplete: isComplete(state),
      };
    },

    /** True when all required fields are captured. */
    isComplete(state) {
      return isComplete(state);
    },

    /** Clean summary object (optionally enriched with 5A qualification/recommendation). */
    summary(state, context) {
      return buildLeadSummary(state, context);
    },
  };
}

/** Default engine bound to the bundled config. */
export const leadCaptureEngine = createLeadCaptureEngine();
