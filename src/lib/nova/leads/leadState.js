/**
 * Nova Leads — capture state (in-memory only; no persistence).
 *
 * A serializable object + pure, immutable transition helpers. Progress
 * (current/completed/remaining/percentage/isComplete) is DERIVED from the
 * active flow so state never drifts out of sync.
 */
import { getFlowFields, LEAD_FIELDS } from './leadConfig';

/**
 * @typedef {Object} LeadState
 * @property {string} flow                  active flow id (e.g. 'website')
 * @property {string[]} fields              ordered field keys for this flow
 * @property {Object} values                { [fieldKey]: value }
 * @property {string[]} completedFields     answered field keys
 */

/** Fresh state for a flow. */
export function createLeadState(flow = 'default') {
  return {
    flow,
    fields: [...getFlowFields(flow)],
    values: {},
    completedFields: [],
  };
}

/** Immutable merge. */
export function updateLeadState(state, patch) {
  return { ...state, ...patch };
}

/** Record a validated value for a field (immutable). */
export function setValue(state, fieldKey, value) {
  if (!fieldKey) return state;
  const completed = state.completedFields.includes(fieldKey)
    ? state.completedFields
    : [...state.completedFields, fieldKey];
  return updateLeadState(state, {
    values: { ...state.values, [fieldKey]: value },
    completedFields: completed,
  });
}

/** Required field keys still missing, in flow order. */
export function remainingRequired(state) {
  return state.fields.filter(
    (key) => LEAD_FIELDS[key]?.required && !state.completedFields.includes(key),
  );
}

/** All field keys still unanswered, in flow order. */
export function remainingFields(state) {
  return state.fields.filter((key) => !state.completedFields.includes(key));
}

/** The next field key to ask (required first, then optional), or null. */
export function currentField(state) {
  return remainingRequired(state)[0] || remainingFields(state)[0] || null;
}

/** True when every required field in the flow is answered. */
export function isComplete(state) {
  return remainingRequired(state).length === 0;
}

/** Completion % based on REQUIRED fields in the flow. */
export function completionPercentage(state) {
  const required = state.fields.filter((key) => LEAD_FIELDS[key]?.required);
  if (required.length === 0) return 100;
  const done = required.filter((key) => state.completedFields.includes(key)).length;
  return Math.round((done / required.length) * 100);
}
