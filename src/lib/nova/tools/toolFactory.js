/**
 * Nova Tools — factory. Instantiates tools with injected dependencies (DI) and
 * (optionally) registers them. Keeps construction/wiring separate from the
 * registry and router (SOLID).
 */
import { createToolRegistry } from './toolRegistry';

/**
 * Instantiate a tool class with injected deps.
 * @param {new (config:{deps:object})=>import('./baseTool').BaseTool} ToolClass
 * @param {Object} [deps]   injected dependencies for this tool
 * @returns {import('./baseTool').BaseTool}
 */
export function createTool(ToolClass, deps = {}) {
  return new ToolClass({ deps });
}

/**
 * Build a registry from a list of tool entries. Each entry is either a tool
 * instance, or `{ ToolClass, deps }` to be constructed via DI.
 * @param {Array<import('./baseTool').BaseTool | { ToolClass:Function, deps?:object }>} [entries]
 * @returns {import('./toolRegistry').ToolRegistry}
 */
export function buildToolRegistry(entries = []) {
  const registry = createToolRegistry();
  for (const entry of entries) {
    const tool = entry && entry.ToolClass ? createTool(entry.ToolClass, entry.deps || {}) : entry;
    registry.register(tool);
  }
  return registry;
}
