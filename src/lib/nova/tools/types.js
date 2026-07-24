/**
 * Nova Tools — ToolResult interface + factories.
 *
 * The normalized, provider-agnostic result every tool call resolves to. Pure
 * data helpers; no business logic.
 */

/**
 * @typedef {Object} ToolResult
 * @property {boolean} ok          true on success
 * @property {string} toolName     the tool that produced this result
 * @property {any} data            result payload on success (null on failure)
 * @property {string|null} error   error message on failure (null on success)
 * @property {Object} metadata     free-form (timing, source, validation issues…)
 */

/**
 * Build a success ToolResult.
 * @param {string} toolName
 * @param {any} data
 * @param {Object} [metadata]
 * @returns {ToolResult}
 */
export function toolSuccess(toolName, data, metadata = {}) {
  return { ok: true, toolName, data, error: null, metadata };
}

/**
 * Build a failure ToolResult.
 * @param {string} toolName
 * @param {unknown} error          Error or message
 * @param {Object} [metadata]
 * @returns {ToolResult}
 */
export function toolFailure(toolName, error, metadata = {}) {
  const message = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
  return { ok: false, toolName, data: null, error: message, metadata };
}

/** Type guard: is a value already a ToolResult? */
export function isToolResult(value) {
  return Boolean(value) && typeof value.ok === 'boolean' && typeof value.toolName === 'string';
}
