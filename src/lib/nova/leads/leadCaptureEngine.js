/**
 * Nova Leads — capture engine (composition root). Ties config, state,
 * validation, questions, and summary into one façade. Stateless itself: every
 * method takes a state and returns a NEW state (in-memory only, no persistence).
 *
 * Conversation-driven: it exposes exactly ONE next question at a time and only
 * advances when a submitted value passes validation.
 */
import { getFlowFields, LEAD_FIELDS, LEAD_FIELD } from './leadConfig';
import { createLeadState, setValue, isComplete, completionPercentage } from './leadState';
import { validateField, isDecline } from './leadValidators';
import { extractLeadFields } from './leadExtractor';
import { nextQuestion } from './leadQuestions';
import { buildLeadSummary } from './leadSummary';

/** Fields safe to pre-fill from earlier free-text chat (users state these early). */
const BACKFILL_FIELDS = [LEAD_FIELD.BUDGET, LEAD_FIELD.TIMELINE];

const isSet = (st, field) => st.values[field] != null && st.values[field] !== '';
const store = (st, field, value, raw) => {
  const s = setValue(st, field, value);
  // Keep the original text alongside the normalized value (no info lost).
  return { ...s, raw: { ...(s.raw || {}), [field]: String(raw ?? '').trim() } };
};

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

    /**
     * Pre-fill fields from earlier free-text messages (e.g. qualification chat
     * before capture began). Reuses the SAME extractor + validators as `submit`;
     * only whitelisted fields that are still unset are stored — never overwrites.
     * @param {import('./leadState').LeadState} state
     * @param {string[]} messages   prior user-message texts, oldest→newest
     * @param {{ only?: string[] }} [opts]
     */
    backfill(state, messages = [], { only = BACKFILL_FIELDS } = {}) {
      let working = state;
      for (const message of messages) {
        const extracted = extractLeadFields(message);
        for (const field of only) {
          const candidate = extracted[field];
          if (candidate == null) continue;
          if (!fields[field] || isSet(working, field)) continue; // unknown or already captured
          const res = validateField(fields[field], candidate);
          if (res.ok) working = store(working, field, res.value, candidate);
        }
      }
      return working;
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
      // Phase 7b: multi-field PRE-PASS. Pull any clearly-marked fields (email,
      // budget, timeline, name) from ANYWHERE in the message and store each that
      // is still unset AND passes its OWN validator — so one message can answer
      // several fields instead of silently dropping all but the current one.
      // Validation is never bypassed; extraction only decides WHICH text to
      // validate for each field.
      let working = state;
      for (const [field, candidate] of Object.entries(extractLeadFields(rawValue))) {
        if (!fields[field] || isSet(working, field)) continue; // unknown or already captured — never overwrite
        const res = validateField(fields[field], candidate);
        if (res.ok) working = store(working, field, res.value, candidate);
      }

      // Single-field flow for the field the orchestrator was expecting — UNLESS
      // the pre-pass already filled it (then the message was consumed above).
      // nextField is read from the ORIGINAL state (the field that was asked).
      const key = fieldKey || nextQuestion(state)?.field;
      if (!key || isSet(working, key)) {
        return { state: working, ok: true, error: null, done: isComplete(working) };
      }
      const def = fields[key];

      // Phase 9: SKIPPABLE fields (phone) accept a decline ("no" / "skip") — mark
      // the field addressed with a null value and move on, instead of validating
      // the decline as a bad answer and re-asking forever.
      if (def?.skippable && isDecline(rawValue)) {
        const skipped = setValue(working, key, null); // completed; null renders as "Not provided"
        return { state: skipped, ok: true, error: null, done: isComplete(skipped) };
      }

      const result = validateField(def, rawValue);
      if (!result.ok) {
        return { state: working, ok: false, error: result.error, done: false };
      }
      const nextState = store(working, key, result.value, rawValue);
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
