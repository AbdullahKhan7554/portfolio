/**
 * Nova Tools — registry. Holds registered tool INSTANCES keyed by name.
 * Single responsibility: registration/lookup. No execution, no I/O.
 */
import { ToolNotFoundError } from './errors';

export class ToolRegistry {
  constructor() {
    /** @type {Map<string, import('./baseTool').BaseTool>} */
    this._tools = new Map();
  }

  /** Register a tool. Throws on duplicate name. */
  register(tool) {
    if (!tool?.name) throw new Error('ToolRegistry.register: tool requires a name.');
    if (this._tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" is already registered.`);
    }
    this._tools.set(tool.name, tool);
    return tool;
  }

  /** Register or replace (idempotent). */
  upsert(tool) {
    if (!tool?.name) throw new Error('ToolRegistry.upsert: tool requires a name.');
    this._tools.set(tool.name, tool);
    return tool;
  }

  get(name) {
    return this._tools.get(name) ?? null;
  }

  has(name) {
    return this._tools.has(name);
  }

  /** Get or throw ToolNotFoundError. */
  require(name) {
    const tool = this.get(name);
    if (!tool) throw new ToolNotFoundError(name, this.names());
    return tool;
  }

  unregister(name) {
    return this._tools.delete(name);
  }

  list() {
    return [...this._tools.values()];
  }

  names() {
    return [...this._tools.keys()];
  }

  /** Provider-agnostic definitions for all registered tools. */
  definitions() {
    return this.list().map((tool) => tool.definition());
  }
}

/** DI factory: build a registry seeded with tool instances. */
export function createToolRegistry(tools = []) {
  const registry = new ToolRegistry();
  for (const tool of tools) registry.register(tool);
  return registry;
}
