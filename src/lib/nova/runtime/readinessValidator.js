/**
 * Nova Runtime — production readiness validator (Milestone 20).
 *
 * Validates that the runtime's collaborators are wired BEFORE a conversation.
 * INFORMATIONAL ONLY: it never throws, never mutates, never changes behavior,
 * and never blocks streaming — it returns a health snapshot the runtime exposes
 * as metadata. Provider-agnostic (duck-typed; NO provider/router imports),
 * DI-first, and gracefully degrading.
 *
 * Severity policy mirrors the runtime's own guarding: a collaborator whose
 * absence the runtime already tolerates (memory, knowledge, tool router,
 * provider defaults) is a WARNING (chat continues); one the runtime uses
 * unguarded (planner, analytics, capability registry) is an unrecoverable ERROR.
 */

/** Small duck-type helper: does `o` expose a callable method `name`? */
const isFn = (o, name) => Boolean(o) && typeof o[name] === 'function';

/**
 * @typedef {Object} ReadinessResult
 * @property {boolean} ok          true when there are no unrecoverable errors
 * @property {string[]} warnings   recoverable/degraded conditions (chat continues)
 * @property {string[]} errors     unrecoverable configuration problems
 * @property {Object} metadata     per-check booleans + summary counts
 */

/**
 * Validate the resolved runtime services. Never throws.
 * @param {Object} [services]
 * @param {string} [services.providerId]
 * @param {Object} [services.providerConfig]
 * @param {Object} [services.capabilityRegistry]
 * @param {Object} [services.knowledgeService]
 * @param {Object} [services.memory]
 * @param {Object} [services.analytics]
 * @param {Object} [services.planner]
 * @param {Object} [services.toolRouter]
 * @returns {ReadinessResult}
 */
export function validateRuntimeReadiness(services = {}) {
  const {
    providerId,
    providerConfig,
    capabilityRegistry,
    knowledgeService,
    memory,
    analytics,
    planner,
    toolRouter,
  } = services;

  const warnings = [];
  const errors = [];
  const checks = {};

  try {
    // Provider configured — a default is resolved downstream, so absence degrades.
    checks.providerConfigured = Boolean(providerId || providerConfig);
    if (!checks.providerConfigured) {
      warnings.push('provider not explicitly configured; runtime default will be used');
    }

    // Provider exists — known to the capability registry (informational).
    checks.providerExists = !providerId || (isFn(capabilityRegistry, 'has') && capabilityRegistry.has(providerId));
    if (!checks.providerExists) {
      warnings.push(`provider "${providerId}" has no capability profile; defaults will apply`);
    }

    // Provider capabilities available — the runtime reads these unguarded.
    checks.providerCapabilities = isFn(capabilityRegistry, 'get');
    if (!checks.providerCapabilities) errors.push('provider capability registry is unavailable');

    // Knowledge service available — grounding degrades gracefully downstream.
    checks.knowledgeService = isFn(knowledgeService, 'search');
    if (!checks.knowledgeService) {
      warnings.push('knowledge service unavailable; responses will not be grounded');
    }

    // Memory service available — history persistence degrades gracefully downstream.
    checks.memoryService = isFn(memory, 'loadConversation') && isFn(memory, 'appendMessage');
    if (!checks.memoryService) {
      warnings.push('memory service unavailable; conversation history will not persist');
    }

    // Analytics service available — the runtime records events unguarded.
    checks.analyticsService = isFn(analytics, 'track');
    if (!checks.analyticsService) errors.push('analytics service is unavailable');

    // Planner available — the runtime calls plan() unguarded.
    checks.planner = isFn(planner, 'plan');
    if (!checks.planner) errors.push('intent planner is unavailable');

    // Tool router available — tool execution is guarded downstream (skippable).
    checks.toolRouter = Boolean(toolRouter);
    if (!checks.toolRouter) {
      warnings.push('tool router unavailable; tool calls will be skipped');
    }
  } catch (e) {
    // Validation itself must never throw — degrade to a reported error.
    errors.push(`readiness validation error: ${e?.message || String(e)}`);
  }

  return {
    ok: errors.length === 0,
    warnings,
    errors,
    metadata: {
      checks,
      checkedAt: Date.now(),
      warningCount: warnings.length,
      errorCount: errors.length,
    },
  };
}

/**
 * DI factory: a validator bound to an (optionally overridden) validate fn.
 * Kept for symmetry with the runtime's other DI seams. No globals, no imports.
 * @param {Object} [deps]
 * @param {(services?:Object)=>ReadinessResult} [deps.validate]
 */
export function createRuntimeValidator({ validate = validateRuntimeReadiness } = {}) {
  return { validate };
}
