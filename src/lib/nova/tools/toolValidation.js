/**
 * Nova Tools — input validation. Pure; supports a zod schema (`safeParse`) or a
 * plain predicate function on the tool, or none. No dependency is required from
 * the tool — validation is opt-in per tool.
 */
import { ToolValidationError } from './errors';

/**
 * Validate raw input against a tool's `schema`.
 * @param {{ name?:string, schema?:any }} tool
 * @param {any} input
 * @returns {{ ok:boolean, data:any, issues:Array<object> }}
 */
export function validateInput(tool, input) {
  const schema = tool?.schema;
  if (!schema) return { ok: true, data: input, issues: [] };

  // zod-like schema
  if (typeof schema.safeParse === 'function') {
    const result = schema.safeParse(input);
    return result.success
      ? { ok: true, data: result.data, issues: [] }
      : { ok: false, data: null, issues: result.error.issues };
  }

  // predicate function
  if (typeof schema === 'function') {
    try {
      return schema(input)
        ? { ok: true, data: input, issues: [] }
        : { ok: false, data: null, issues: [{ message: 'Validation failed.' }] };
    } catch (e) {
      return { ok: false, data: null, issues: [{ message: e?.message || 'Validation error.' }] };
    }
  }

  return { ok: true, data: input, issues: [] };
}

/**
 * Validate and return the parsed input, or throw ToolValidationError.
 * @param {{ name?:string, schema?:any }} tool
 * @param {any} input
 */
export function assertValidInput(tool, input) {
  const result = validateInput(tool, input);
  if (!result.ok) throw new ToolValidationError(tool?.name ?? 'unknown', result.issues);
  return result.data;
}
