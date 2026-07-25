/**
 * Nova Email — nurture sequence config (CONFIG data, not logic).
 *
 * Per company_id, one or more NAMED sequences. A sequence is an ordered list of
 * steps: { templateKey, delayMinutes } — the delay is measured from the moment
 * the sequence is scheduled (i.e. from lead capture). Adjust a sequence here with
 * NO code change; the EmailService reads this to lay down `scheduled_emails` rows.
 *
 * The `nova-test` sequence uses deliberately SHORT delays so the cron can be
 * verified end to end in minutes rather than hours. The `avenix` sequence is the
 * REAL production nurture for avenixstudios.com (immediate welcome + a 3-day
 * follow-up).
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
  avenix: {
    avenix_lead_nurture: [
      { templateKey: 'avenix_welcome', delayMinutes: 0 }, // immediate on lead capture
      { templateKey: 'avenix_followup', delayMinutes: 4320 }, // +3 days
    ],
  },
});

/**
 * Which named sequence is the LEAD-capture nurture sequence, per company. This
 * keeps the generic lead-save hook config-driven: it resolves the right sequence
 * key for each company instead of hardcoding one, so adding a new company is a
 * config-only change. Companies not listed fall back to DEFAULT_SEQUENCE_KEY.
 */
export const LEAD_NURTURE_SEQUENCE_KEY = Object.freeze({
  'nova-test': 'default_lead_nurture',
  avenix: 'avenix_lead_nurture',
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
