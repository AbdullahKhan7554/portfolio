/**
 * Nova — tool runtime integration (Milestone 11).
 *
 * Wires the existing Tool Framework (M6) into the Conversation Runtime. Reuses
 * `BaseTool`, `buildToolRegistry`, and `ToolRouter` exactly as built — nothing
 * is rebuilt or duplicated. Provider-agnostic: tool calls are detected from the
 * assistant's text via a neutral convention (so no provider/streaming change is
 * required), and executed through the ToolRouter, which already normalizes
 * unknown-tool / validation / execution failures into ToolResults.
 */
import { z } from 'zod';
import { BaseTool, buildToolRegistry, createToolRouter } from '../tools';

/**
 * The ONE demo tool for this milestone — proves runtime integration only.
 * Input: { text: string } → Output data: { echoed: string }.
 */
export class EchoTool extends BaseTool {
  get name() {
    return 'echo';
  }

  get description() {
    return 'Echo the provided text. Demo tool that proves tool-calling runtime integration.';
  }

  get schema() {
    return z.object({ text: z.string() });
  }

  get parameters() {
    return { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] };
  }

  async execute(input) {
    return { echoed: input.text };
  }
}

/**
 * Default ToolRouter (lazy singleton) with the demo tool registered. Injection
 * overrides it (DI). Future tools (internal / Supabase / HTTP / CRM / Email) are
 * added by registering them here or by injecting a custom ToolRouter — no
 * runtime change required.
 */
let defaultToolRouter = null;
export function getDefaultToolRouter() {
  if (!defaultToolRouter) {
    const registry = buildToolRegistry([{ ToolClass: EchoTool }]);
    defaultToolRouter = createToolRouter({ registry });
  }
  return defaultToolRouter;
}

/** @private Parse one tool-call JSON (`{ "tool": name, "input": {...} }`). */
function safeParseCall(raw) {
  try {
    const obj = JSON.parse(String(raw).trim());
    if (obj && typeof obj.tool === 'string') return { name: obj.tool, input: obj.input ?? {} };
  } catch {
    /* not a tool call */
  }
  return null;
}

/**
 * Detect provider-agnostic tool calls in assistant text: one or more
 * ```tool ...``` fenced JSON blocks, or a bare `{ "tool": ... }` object. Pure;
 * returns [] when there are none (normal chat is untouched).
 * @param {string} text
 * @returns {Array<{ name:string, input:object }>}
 */
export function parseToolCalls(text = '') {
  const calls = [];
  const fence = /```tool\s*([\s\S]*?)```/g;
  let match;
  let fenced = false;
  while ((match = fence.exec(text)) !== null) {
    fenced = true;
    const call = safeParseCall(match[1]);
    if (call) calls.push(call);
  }
  if (!fenced) {
    const call = safeParseCall(text);
    if (call) calls.push(call);
  }
  return calls;
}

/**
 * Execute tool calls via the injected ToolRouter. The ToolRouter never throws —
 * unknown tool, validation failure, and execution failure all resolve to a
 * normalized failure ToolResult, so the conversation always continues.
 * @param {{ call: Function }} toolRouter
 * @param {Array<{ name:string, input:object }>} calls
 * @param {Object} [context]
 * @returns {Promise<Array<import('../tools/types').ToolResult>>}
 */
export async function runToolCalls(toolRouter, calls = [], context = {}) {
  const results = [];
  for (const call of calls) {
    results.push(await toolRouter.call(call.name, call.input, context));
  }
  return results;
}
