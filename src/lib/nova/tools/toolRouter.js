/**
 * Nova Tools — router. Routes a tool call to the right tool: resolve → validate
 * → execute → normalized ToolResult. The registry is INJECTED (DI). Tool errors
 * never throw out of `call()` — they resolve to a failure ToolResult so callers
 * get a uniform shape. No business logic, provider-agnostic.
 */
import { validateInput } from './toolValidation';
import { toolSuccess, toolFailure, isToolResult } from './types';
import { ToolNotFoundError } from './errors';

export class ToolRouter {
  /**
   * @param {Object} deps
   * @param {import('./toolRegistry').ToolRegistry} deps.registry  injected registry
   */
  constructor({ registry } = {}) {
    if (!registry) throw new Error('ToolRouter requires a registry.');
    this.registry = registry;
  }

  /** Provider-agnostic definitions of all available tools. */
  definitions() {
    return this.registry.definitions();
  }

  has(name) {
    return this.registry.has(name);
  }

  /**
   * Execute a tool call.
   * @param {string} name
   * @param {any} [input]        raw input (validated against the tool's schema)
   * @param {Object} [context]   per-call context (e.g. companyId, conversation)
   * @returns {Promise<import('./types').ToolResult>}
   */
  async call(name, input = {}, context = {}) {
    const tool = this.registry.get(name);
    if (!tool) {
      return toolFailure(name, new ToolNotFoundError(name, this.registry.names()));
    }

    const validation = validateInput(tool, input);
    if (!validation.ok) {
      return toolFailure(name, 'Invalid input.', { issues: validation.issues });
    }

    try {
      const result = await tool.execute(validation.data, context);
      // A tool may return a ToolResult itself; otherwise wrap its raw output.
      return isToolResult(result) ? result : toolSuccess(name, result);
    } catch (err) {
      return toolFailure(name, err);
    }
  }
}

/** DI factory. */
export function createToolRouter({ registry } = {}) {
  return new ToolRouter({ registry });
}
