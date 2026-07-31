/**
 * Nova Email — nurture sequence config (CONFIG data, not logic).
 *
 * The active client's lead-nurture sequence is resolved from `client.config.js`
 * (`nurture.sequenceKey` + `nurture.sequence`), keyed by the active `companyId`,
 * so a new client changes only that file — no code edit. Template CONTENT stays
 * as company-scoped rows in Supabase `email_templates`. The `nova-test` sequence
 * remains a dev fixture with short delays for verifying the cron end to end.
 */
import { clientConfig } from '@/config/client.config';

/** Default sequence name used when a caller does not specify one. */
export const DEFAULT_SEQUENCE_KEY = 'default_lead_nurture';

const activeCompanyId = clientConfig.identity.companyId;
const activeSequenceKey = clientConfig.nurture?.sequenceKey || DEFAULT_SEQUENCE_KEY;

export const NURTURE_SEQUENCES = Object.freeze({
  'nova-test': {
    default_lead_nurture: [
      { templateKey: 'welcome_test', delayMinutes: 1 },
      { templateKey: 'nurture_followup', delayMinutes: 3 },
    ],
  },
  [activeCompanyId]: {
    [activeSequenceKey]: clientConfig.nurture?.sequence || [],
  },
});

/**
 * Which named sequence is the LEAD-capture nurture sequence, per company.
 * Companies not listed fall back to DEFAULT_SEQUENCE_KEY.
 */
export const LEAD_NURTURE_SEQUENCE_KEY = Object.freeze({
  'nova-test': 'default_lead_nurture',
  [activeCompanyId]: activeSequenceKey,
});

/** The lead-nurture sequence key for a company (falls back to the default). */
export const leadNurtureSequenceKey = (companyId) =>
  LEAD_NURTURE_SEQUENCE_KEY[companyId] || DEFAULT_SEQUENCE_KEY;

/**
 * Resolve an ordered list of steps for a company + sequence, or null when the
 * company has no such sequence configured (callers skip silently on null).
 * @param {string} companyId
 * @param {string} [sequenceKey]
 * @returns {Array<{templateKey:string, delayMinutes:number}> | null}
 */
export function getSequence(companyId, sequenceKey = DEFAULT_SEQUENCE_KEY) {
  const steps = NURTURE_SEQUENCES[companyId]?.[sequenceKey];
  return Array.isArray(steps) && steps.length > 0 ? steps : null;
}
