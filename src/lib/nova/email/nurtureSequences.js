/**
 * Nova Email — nurture sequence config (CONFIG data, not logic).
 *
 * Per company_id, one or more NAMED sequences. A sequence is an ordered list of
 * steps: { templateKey, delayMinutes } — the delay is measured from the moment
 * the sequence is scheduled (i.e. from lead capture). Adjust a sequence here with
 * NO code change; the EmailService reads this to lay down `scheduled_emails` rows.
 *
 * The `nova-test` sequence uses deliberately SHORT delays so the cron can be
 * verified end to end in minutes rather than hours.
 */

/** Default sequence name used when a caller does not specify one. */
export const DEFAULT_SEQUENCE_KEY = 'default_lead_nurture';

export const NURTURE_SEQUENCES = Object.freeze({
  'nova-test': {
    default_lead_nurture: [
      { templateKey: 'welcome_test', delayMinutes: 1 },
      { templateKey: 'nurture_followup', delayMinutes: 3 },
    ],
  },
});

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
