/**
 * Nova Tools — public API (Milestone 6, framework only).
 *
 * A reusable, provider-agnostic tool-calling framework: an abstract BaseTool,
 * validation, a registry, a factory (DI), a router, and a normalized ToolResult.
 * NO real tools and NO business logic are included — concrete tools (Pricing,
 * Calculator, Calendar, CRM, Supabase, Email, WhatsApp, Orders, Inventory, …)
 * are added later. The framework is standalone and does not touch the runtime.
 *
 * @example  Defining a future tool (illustrative — not shipped here):
 *   import { z } from 'zod';
 *   import { BaseTool, toolSuccess } from '@/lib/nova/tools';
 *
 *   class CalculatorTool extends BaseTool {
 *     get name() { return 'calculator'; }
 *     get description() { return 'Evaluate a basic arithmetic expression.'; }
 *     get schema() { return z.object({ expression: z.string() }); }
 *     get parameters() {
 *       return { type: 'object', properties: { expression: { type: 'string' } }, required: ['expression'] };
 *     }
 *     async execute(input, context) {
 *       // ...tool logic uses this.deps (injected) and context...
 *       return toolSuccess(this.name, { result: 42 });
 *     }
 *   }
 *
 * @example  Wiring + calling:
 *   import { buildToolRegistry, createToolRouter } from '@/lib/nova/tools';
 *   const registry = buildToolRegistry([{ ToolClass: CalculatorTool, deps: {} }]);
 *   const tools = createToolRouter({ registry });
 *   const result = await tools.call('calculator', { expression: '40+2' }, { companyId: 'avenix' });
 */

// ToolResult + guards
export { toolSuccess, toolFailure, isToolResult } from './types';

// Contract
export { BaseTool } from './baseTool';

// Validation
export { validateInput, assertValidInput } from './toolValidation';

// Registry / factory / router
export { ToolRegistry, createToolRegistry } from './toolRegistry';
export { createTool, buildToolRegistry } from './toolFactory';
export { ToolRouter, createToolRouter } from './toolRouter';

// Errors
export {
  ToolError,
  ToolNotImplementedError,
  ToolNotFoundError,
  ToolValidationError,
} from './errors';
