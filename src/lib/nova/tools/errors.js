/**
 * Nova Tools — typed error hierarchy (self-contained; framework only).
 */

/** Base class for every tool-framework error. */
export class ToolError extends Error {
  /** @param {string} message @param {string} [code] */
  constructor(message, code = 'TOOL_ERROR') {
    super(message);
    this.name = 'ToolError';
    this.code = code;
  }
}

/** A seam an abstract member must implement. */
export class ToolNotImplementedError extends ToolError {
  constructor(message = 'Not implemented.') {
    super(message, 'TOOL_NOT_IMPLEMENTED');
    this.name = 'ToolNotImplementedError';
  }
}

/** The requested tool is not registered. */
export class ToolNotFoundError extends ToolError {
  /** @param {string} name @param {string[]} [available] */
  constructor(name, available = []) {
    super(`Unknown tool "${name}". Registered: ${available.join(', ') || 'none'}.`, 'TOOL_NOT_FOUND');
    this.name = 'ToolNotFoundError';
    this.toolName = name;
    this.available = available;
  }
}

/** Tool input failed validation. */
export class ToolValidationError extends ToolError {
  /** @param {string} name @param {Array<object>} [issues] */
  constructor(name, issues = []) {
    super(`Invalid input for tool "${name}".`, 'TOOL_VALIDATION');
    this.name = 'ToolValidationError';
    this.toolName = name;
    this.issues = issues;
  }
}
