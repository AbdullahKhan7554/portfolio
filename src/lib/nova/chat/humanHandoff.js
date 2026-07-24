/**
 * Nova — human handoff service (Milestone 17).
 *
 * Provides the directive Nova uses when the plan requests a human. This is NOT a
 * CRM integration — it only produces a handoff instruction (and a request hook a
 * future milestone can extend). Injectable via DI; the runtime falls back to the
 * default directive if no/invalid service is provided.
 */

/** Default handoff directive text (single source; also used as the fallback). */
export const DEFAULT_HANDOFF_DIRECTIVE =
  'The visitor is asking to reach a human. Warmly acknowledge the request, reassure them a team member will follow up shortly, and do not keep trying to resolve it yourself.';

/**
 * @param {Object} [options]
 * @param {string} [options.message]  override the handoff directive text
 */
export function createHumanHandoff({ message = DEFAULT_HANDOFF_DIRECTIVE } = {}) {
  return {
    /** The directive for the provider to phrase (context is available for future use). */
    // eslint-disable-next-line no-unused-vars
    directive(_context = {}) {
      return message;
    },
    /** Mark that a handoff is required (no CRM/notification yet). */
    async request(context = {}) {
      return { handoffRequired: true, ...context };
    },
  };
}

/** Default handoff service. Injectable/overridable. */
export const defaultHumanHandoff = createHumanHandoff();
