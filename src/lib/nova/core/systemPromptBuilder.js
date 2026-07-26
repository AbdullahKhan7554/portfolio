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

  // Phase 8: hard pricing policy — ALWAYS present, and it OVERRIDES anything above,
  // including any price / "from $X" / package figure that appears in the company
  // knowledge. Custom-project pricing must never be quoted as a committed number.
  parts.push(
    '# Pricing policy (STRICT — this overrides everything above)\n' +
      'Never state a specific price, dollar amount, or PKR/rupee amount for a custom project — not even if ' +
      'the visitor asks directly, and not even if a price, a "from $X" figure, or a package amount appears in ' +
      'the company knowledge above. Treat any such figures as INTERNAL REFERENCE ONLY: do not quote them, ' +
      'repeat the number, or confirm them as the price. If asked about cost or pricing, briefly explain that ' +
      "pricing depends on the specifics of the project and that the team will provide an exact quote once they " +
      "understand the visitor's needs. Then keep the conversation moving forward: continue gathering their " +
      'project details, or — if they are already qualified — invite them to book a call or reach out on WhatsApp.',
  );

  return parts.filter(Boolean).join('\n\n');
}
