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
 * @param {string} [input.knowledge]  optional grounding block (from the KMS)
 * @returns {string}
 */
export function buildSystemPrompt({
  identity = {},
  sections = {},
  hasKnowledge = true,
  knowledge = '',
} = {}) {
  const { sales = true, faq = true } = sections;
  const grounded = hasKnowledge && Boolean(knowledge);

  const parts = [systemPrompt(identity)];
  if (sales) parts.push(salesPrompt(identity));
  if (faq) parts.push(faqPrompt({ ...identity, hasKnowledge: grounded }));

  if (knowledge) {
    parts.push(
      '# Company knowledge\n' +
        `Answer using ONLY the verified information below about ${identity.brandName || 'the company'}. ` +
        'If a question is not covered here, say you are not certain and offer to connect the visitor with a human.\n\n' +
        knowledge,
    );
  }

  return parts.filter(Boolean).join('\n\n');
}
