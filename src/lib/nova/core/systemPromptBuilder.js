/**
 * Nova — system prompt builder. Composes the final system prompt from the base,
 * sales, and FAQ fragments, injecting brand/assistant identity from config and
 * toggling sections per `aiConfig.prompts`. Pure string assembly; no AI calls.
 */
import { systemPrompt } from '../prompts/systemPrompt';
import { salesPrompt } from '../prompts/salesPrompt';
import { faqPrompt } from '../prompts/faqPrompt';

/**
 * @param {Object} [input]
 * @param {Object} [input.identity]   { assistantName, brandName, role, tone }
 * @param {{ sales?:boolean, faq?:boolean }} [input.sections]
 * @param {boolean} [input.hasKnowledge]
 * @returns {string}
 */
export function buildSystemPrompt({ identity = {}, sections = {}, hasKnowledge = true } = {}) {
  const { sales = true, faq = true } = sections;

  const parts = [systemPrompt(identity)];
  if (sales) parts.push(salesPrompt(identity));
  if (faq) parts.push(faqPrompt({ ...identity, hasKnowledge }));

  return parts.filter(Boolean).join('\n\n');
}
