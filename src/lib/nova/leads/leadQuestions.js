/**
 * Nova Leads — question selection. Pure read helpers that turn state + config
 * into "what to ask next". All prompt copy comes from leadConfig — nothing is
 * hardcoded here. One question at a time; never the whole form.
 */
import { LEAD_FIELDS } from './leadConfig';
import { currentField } from './leadState';

/**
 * The single next question to ask for the current state, or null when done.
 * @param {import('./leadState').LeadState} state
 * @returns {{ field:string, prompt:string, required:boolean, validate:string } | null}
 */
export function nextQuestion(state) {
  const key = currentField(state);
  if (!key) return null;
  const def = LEAD_FIELDS[key];
  return {
    field: key,
    prompt: def?.prompt || `Please provide ${key}.`,
    required: Boolean(def?.required),
    validate: def?.validate || 'text',
  };
}

/** Prompt string for a specific field (config-driven). */
export function promptFor(fieldKey) {
  return LEAD_FIELDS[fieldKey]?.prompt || `Please provide ${fieldKey}.`;
}
