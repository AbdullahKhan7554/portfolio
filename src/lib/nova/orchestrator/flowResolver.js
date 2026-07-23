/**
 * Nova Orchestrator — flow resolver. Pure mapping from a detected sales intent
 * to the lead-capture flow id (5B). Config-driven; no logic duplicated from the
 * engines. Single responsibility: intent → flow.
 */

/**
 * @param {string} intent                 sales intent (5A)
 * @param {{ intentToFlow?:Record<string,string> }} config
 * @returns {string}                       lead flow id (defaults to 'default')
 */
export function resolveLeadFlow(intent, config = {}) {
  const map = config.intentToFlow || {};
  return map[intent] || 'default';
}
