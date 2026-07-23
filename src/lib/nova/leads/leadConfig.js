/**
 * Nova Leads — capture configuration (CONFIG, not logic).
 *
 * Defines the lead fields, their per-field question prompts + validation kind,
 * and which fields each flow collects. Different services can run different
 * lead flows — all conversation copy lives here, never in the engine.
 *
 * In-memory only: no persistence, no CRM, no email.
 */

/** Canonical lead fields the engine can collect. */
export const LEAD_FIELD = Object.freeze({
  FULL_NAME: 'fullName',
  EMAIL: 'email',
  PHONE: 'phone',
  COMPANY_NAME: 'companyName',
  BUSINESS_TYPE: 'businessType',
  BUDGET: 'budget',
  TIMELINE: 'timeline',
  PROJECT_DESCRIPTION: 'projectDescription',
});

/** Allowed timeline options (validated against this set, case-insensitive). */
export const TIMELINE_OPTIONS = Object.freeze([
  'asap',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'flexible',
]);

/**
 * Field definitions: prompt (question copy), validator kind, and whether the
 * field is required. `required` fields drive completion; optional ones are
 * asked only if included in a flow and skippable.
 */
export const LEAD_FIELDS = Object.freeze({
  [LEAD_FIELD.FULL_NAME]: {
    key: LEAD_FIELD.FULL_NAME,
    prompt: 'What is your name?',
    validate: 'name',
    required: true,
  },
  [LEAD_FIELD.EMAIL]: {
    key: LEAD_FIELD.EMAIL,
    prompt: 'What is the best email to reach you?',
    validate: 'email',
    required: true,
  },
  [LEAD_FIELD.PHONE]: {
    key: LEAD_FIELD.PHONE,
    prompt: 'What phone or WhatsApp number should we use?',
    validate: 'phone',
    required: false,
  },
  [LEAD_FIELD.COMPANY_NAME]: {
    key: LEAD_FIELD.COMPANY_NAME,
    prompt: 'What is your company or brand name?',
    validate: 'text',
    required: false,
  },
  [LEAD_FIELD.BUSINESS_TYPE]: {
    key: LEAD_FIELD.BUSINESS_TYPE,
    prompt: 'What type of business is this?',
    validate: 'text',
    required: false,
  },
  [LEAD_FIELD.BUDGET]: {
    key: LEAD_FIELD.BUDGET,
    prompt: 'Do you have a budget range in mind?',
    validate: 'budget',
    required: true,
  },
  [LEAD_FIELD.TIMELINE]: {
    key: LEAD_FIELD.TIMELINE,
    prompt: `What is your timeline? (${TIMELINE_OPTIONS.join(', ')})`,
    validate: 'timeline',
    required: true,
  },
  [LEAD_FIELD.PROJECT_DESCRIPTION]: {
    key: LEAD_FIELD.PROJECT_DESCRIPTION,
    prompt: 'Briefly, what are you looking to build or achieve?',
    validate: 'text',
    required: true,
  },
});

const F = LEAD_FIELD;

/**
 * Per-flow field order. Config-driven: swap/extend to change what each service
 * collects and in what order. `default` is the fallback flow.
 */
export const LEAD_FLOWS = Object.freeze({
  default: [F.FULL_NAME, F.EMAIL, F.PHONE, F.PROJECT_DESCRIPTION, F.BUDGET, F.TIMELINE],
  website: [F.FULL_NAME, F.EMAIL, F.COMPANY_NAME, F.PROJECT_DESCRIPTION, F.BUDGET, F.TIMELINE],
  automation: [F.FULL_NAME, F.EMAIL, F.COMPANY_NAME, F.BUSINESS_TYPE, F.PROJECT_DESCRIPTION, F.TIMELINE],
  seo: [F.FULL_NAME, F.EMAIL, F.COMPANY_NAME, F.PROJECT_DESCRIPTION, F.TIMELINE],
  branding: [F.FULL_NAME, F.EMAIL, F.COMPANY_NAME, F.PROJECT_DESCRIPTION, F.BUDGET, F.TIMELINE],
  ecommerce: [F.FULL_NAME, F.EMAIL, F.COMPANY_NAME, F.PROJECT_DESCRIPTION, F.BUDGET, F.TIMELINE],
});

/** Resolve a flow's ordered field list, falling back to `default`. */
export function getFlowFields(flow = 'default') {
  return LEAD_FLOWS[flow] || LEAD_FLOWS.default;
}
