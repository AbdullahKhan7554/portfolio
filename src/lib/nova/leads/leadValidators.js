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

/** Timeline: must match a configured option (case-insensitive). */
export function validateTimeline(input) {
  const value = String(input ?? '').trim().toLowerCase();
  const match = TIMELINE_OPTIONS.find((opt) => opt.toLowerCase() === value);
  return match ? ok(match) : fail(`Please choose one of: ${TIMELINE_OPTIONS.join(', ')}.`);
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
