/**
 * Nova Lead Capture Engine — public API (Milestone 5B).
 *
 * Reusable, config-driven, in-memory lead capture: one question at a time,
 * validated fields, derived progress, and a clean summary. No persistence, no
 * CRM/email/booking, no UI/API coupling.
 *
 * @example
 *   import { leadCaptureEngine as leads } from '@/lib/nova/leads';
 *   let s = leads.start('website');
 *   const q = leads.nextQuestion(s);          // ask one field
 *   const r = leads.submit(s, 'Abdullah', q.field);
 *   s = r.state;                              // advance only if r.ok
 *   const summary = leads.summary(s);
 */

// Config
export {
  LEAD_FIELD,
  LEAD_FIELDS,
  LEAD_FLOWS,
  TIMELINE_OPTIONS,
  getFlowFields,
} from './leadConfig';

// Validation
export {
  VALIDATORS,
  validateField,
  validateText,
  validateName,
  validateEmail,
  validatePhone,
  validateBudget,
  validateTimeline,
} from './leadValidators';

// State + questions + summary
export {
  createLeadState,
  setValue,
  currentField,
  remainingFields,
  remainingRequired,
  isComplete,
  completionPercentage,
} from './leadState';
export { nextQuestion, promptFor } from './leadQuestions';
export { buildLeadSummary } from './leadSummary';

// Composition root
export { createLeadCaptureEngine, leadCaptureEngine } from './leadCaptureEngine';
