/**
 * Nova Leads — summary builder. Produces a clean, serializable summary object
 * from captured state, optionally enriched with qualification + recommendation
 * data passed in by the caller. Pure; builds nothing it isn't given (no AI, no
 * persistence, no pricing).
 */
import { LEAD_FIELD } from './leadConfig';
import {
  completionPercentage,
  isComplete,
  remainingFields,
  currentField,
} from './leadState';

/** Shape the captured values into a normalized lead object (known fields only). */
function toLead(values = {}) {
  return {
    fullName: values[LEAD_FIELD.FULL_NAME] ?? null,
    email: values[LEAD_FIELD.EMAIL] ?? null,
    phone: values[LEAD_FIELD.PHONE] ?? null,
    companyName: values[LEAD_FIELD.COMPANY_NAME] ?? null,
    businessType: values[LEAD_FIELD.BUSINESS_TYPE] ?? null,
    budget: values[LEAD_FIELD.BUDGET] ?? null,
    timeline: values[LEAD_FIELD.TIMELINE] ?? null,
    projectDescription: values[LEAD_FIELD.PROJECT_DESCRIPTION] ?? null,
  };
}

/**
 * Build the summary.
 * @param {import('./leadState').LeadState} state
 * @param {Object} [context]
 * @param {Object} [context.qualification]   e.g. from the sales engine (5A)
 * @param {Object} [context.recommendation]  e.g. a recommended package/service
 * @returns {{ lead:object, progress:object, qualification:object|null, recommendation:object|null }}
 */
export function buildLeadSummary(state, { qualification = null, recommendation = null } = {}) {
  return {
    lead: toLead(state.values),
    progress: {
      flow: state.flow,
      currentField: currentField(state),
      completedFields: [...state.completedFields],
      remainingFields: remainingFields(state),
      completionPercentage: completionPercentage(state),
      isComplete: isComplete(state),
    },
    qualification,
    recommendation,
  };
}
