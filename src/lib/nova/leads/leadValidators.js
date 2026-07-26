/**
 * Nova Leads — field validators. Pure functions; each returns a normalized
 * outcome `{ ok, value?, error? }`. No dependencies, no side effects.
 *
 * The validator "kind" on each field (see leadConfig) maps to one function here
 * via `validateField`, so the engine never hardcodes validation per field.
 */
import { TIMELINE_OPTIONS } from './leadConfig';

const ok = (value) => ({ ok: true, value });
const fail = (error) => ({ ok: false, error });

/** Non-empty text (trimmed). */
export function validateText(input) {
  const value = String(input ?? '').trim();
  return value ? ok(value) : fail('Please enter a value.');
}

/** Human name: at least 2 characters. */
export function validateName(input) {
  const value = String(input ?? '').trim();
  return value.length >= 2 ? ok(value) : fail('Please enter your name.');
}

/** Email format. */
export function validateEmail(input) {
  const value = String(input ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? ok(value)
    : fail('Please enter a valid email address.');
}

/** Phone: 7–15 digits after stripping spaces and common separators. */
export function validatePhone(input) {
  const raw = String(input ?? '').trim();
  const digits = raw.replace(/[\s().-]/g, '').replace(/^\+/, '');
  return /^\d{7,15}$/.test(digits) ? ok(raw) : fail('Please enter a valid phone number.');
}

/**
 * Budget: accepts a currency-ish amount or range (e.g. "$700", "500-1000",
 * "2k"). Must contain at least one digit. Normalizes to the trimmed string.
 */
export function validateBudget(input) {
  const value = String(input ?? '').trim();
  if (!/\d/.test(value)) return fail('Please share an approximate budget (a number or range).');
  return ok(value);
}

/**
 * Normalize free-text timeline input into one of the canonical TIMELINE_OPTIONS.
 * Real people type "in a couple weeks", "no rush", "asap please" — we map those
 * to a bucket instead of rejecting them. Anything we cannot confidently place
 * falls back to 'flexible' (never a hard rejection). Pure + deterministic.
 * @param {string} input
 * @returns {'asap'|'1-3 months'|'3-6 months'|'6+ months'|'flexible'}
 */
export function normalizeTimeline(input) {
  const t = String(input ?? '').trim().toLowerCase();
  if (!t) return 'flexible';

  // Already an exact canonical value.
  const exact = TIMELINE_OPTIONS.find((opt) => opt.toLowerCase() === t);
  if (exact) return exact;

  // No urgency / undecided → flexible.
  if (/(no\s*rush|no\s*hurry|when\s*ever|whenever|flexible|not\s*sure|unsure|no\s*timeline|no\s*deadline|any\s*time|anytime|tbd|don'?t\s*know|no\s*idea|open\s*to)/.test(t)) {
    return 'flexible';
  }
  // Days / weeks / explicit urgency → asap.
  if (/(asap|a\.?s\.?a\.?p|urgent|immediat|right\s*(away|now)|this\s*week|next\s*week|(\d+|a|one|two|couple|few|several)\s*weeks?|(\d+|a|few|couple)\s*days?|quick|in\s*a\s*rush|rush|yesterday)/.test(t)) {
    return 'asap';
  }
  // Long term → 6+ months.
  if (/(6\s*\+|six\s*months|half\s*a?\s*year|next\s*year|end\s*of\s*(the\s*)?year|more\s*than\s*(6|six)|(6|7|8|9|10|11|12)\s*months?|year\s*or\s*(more|so))/.test(t)) {
    return '6+ months';
  }
  // Mid term → 3-6 months.
  if (/(3\s*[-–to ]+\s*6|three\s*to\s*six|quarter|(3|4|5)\s*months?|several\s*months)/.test(t)) {
    return '3-6 months';
  }
  // Near term (a month or two) → 1-3 months.
  if (/(1\s*[-–to ]+\s*3|one\s*to\s*three|1\s*[-–to ]+\s*2|month\s*or\s*two|two\s*months?|couple\s*(of\s*)?months|(a|1|one|2)\s*months?|next\s*month|within\s*a?\s*month|(30|60|90)\s*days)/.test(t)) {
    return '1-3 months';
  }
  return 'flexible';
}

/**
 * Timeline: accept natural free-text and NORMALIZE it to a canonical bucket
 * (see normalizeTimeline) rather than rejecting anything that is not an exact
 * option. Only genuinely empty input is rejected (so the field is re-asked);
 * any real answer is accepted, with 'flexible' as the catch-all bucket.
 */
export function validateTimeline(input) {
  const value = String(input ?? '').trim();
  if (!value) return fail('Could you share a rough timeline — even "flexible" or "asap" works?');
  return ok(normalizeTimeline(value));
}

/** Registry: validator kind → function. Extend without touching the engine. */
export const VALIDATORS = Object.freeze({
  text: validateText,
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  budget: validateBudget,
  timeline: validateTimeline,
});

/**
 * Validate a raw value against a field definition's `validate` kind.
 * @param {{ validate?:string }} fieldDef
 * @param {any} value
 * @returns {{ ok:boolean, value?:any, error?:string }}
 */
export function validateField(fieldDef, value) {
  const fn = VALIDATORS[fieldDef?.validate] || validateText;
  return fn(value);
}
