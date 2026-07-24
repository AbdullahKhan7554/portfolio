/**
 * Nova Tools — BaseTool: the abstract contract every tool implements.
 *
 * Provider-agnostic (Adapter/Strategy pattern): a tool exposes a neutral
 * `definition()` ({ name, description, parameters }) that a future adapter can
 * translate into any vendor's tool-calling schema. Dependencies are INJECTED
 * via the constructor (`deps`) — the base holds NO business logic.
 *
 * Concrete tools (Pricing, Calculator, Calendar, CRM, Supabase, Email,
 * WhatsApp, Orders, Inventory, …) are added LATER; this milestone ships only
 * the framework.
 */
import { ToolError, ToolNotImplementedError } from './errors';

export class BaseTool {
  /**
   * @param {Object} [config]
   * @param {Object} [config.deps]   injected dependencies (DI container)
   */
  constructor({ deps = {} } = {}) {
    if (new.target === BaseTool) {
      throw new TypeError('BaseTool is abstract; extend it with a concrete tool.');
    }
    /** @type {Object} injected dependencies (never global state) */
    this.deps = deps;
  }

  /** Unique tool name (e.g. 'pricing'). Concrete tools MUST override. */
  get name() {
    throw new ToolError(`${this.constructor.name} must define get name().`, 'TOOL_NO_NAME');
  }

  /** Human/LLM-facing description. */
  get description() {
    return '';
  }

  /**
   * Provider-agnostic parameter contract (JSON-Schema-shaped). Used to build a
   * vendor tool definition later. Override to declare inputs.
   * @returns {object}
   */
  get parameters() {
    return { type: 'object', properties: {}, additionalProperties: true };
  }

  /**
   * Optional runtime validation schema for inputs. Return a zod schema (has
   * `safeParse`) or a `(input) => boolean` function, or null for no validation.
   * @returns {import('zod').ZodTypeAny | ((input:any)=>boolean) | null}
   */
  get schema() {
    return null;
  }

  /** The neutral definition consumed by a future provider adapter. */
  definition() {
    return { name: this.name, description: this.description, parameters: this.parameters };
  }

  /**
   * Execute the tool. Concrete tools MUST implement this. Receives VALIDATED
   * input plus a per-call `context` (e.g. companyId, conversation info). Should
   * return a ToolResult (or raw data — the router normalizes it).
   * @param {any} _input
   * @param {Object} [_context]
   * @returns {Promise<import('./types').ToolResult | any>}
   */
  // eslint-disable-next-line no-unused-vars
  async execute(_input, _context) {
    throw new ToolNotImplementedError(`${this.constructor.name}.execute() is not implemented.`);
  }
}
