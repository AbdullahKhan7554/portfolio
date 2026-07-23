/**
 * Nova chat — turns parsed KMS documents (Milestone 3) into a single, ordered
 * knowledge block for the system prompt. Pure; company-agnostic. The order and
 * labels are generic — no tenant is hardcoded.
 */
import { KNOWLEDGE_DOCUMENTS } from '../knowledge/constants';

const { COMPANY, SERVICES, PRICING, PORTFOLIO, PROCESS, TECHNOLOGIES, FAQ } =
  KNOWLEDGE_DOCUMENTS;

/** Preferred narrative order when composing the prompt. */
const DEFAULT_ORDER = [COMPANY, SERVICES, PRICING, PORTFOLIO, PROCESS, TECHNOLOGIES, FAQ];

const LABELS = {
  [COMPANY]: 'About',
  [SERVICES]: 'Services',
  [PRICING]: 'Pricing',
  [PORTFOLIO]: 'Portfolio',
  [PROCESS]: 'Process',
  [TECHNOLOGIES]: 'Technologies',
  [FAQ]: 'FAQ',
};

/**
 * @param {Record<string, {text?:string}>} documents  parsed KMS documents
 * @param {{ order?: string[] }} [options]
 * @returns {string}
 */
export function buildKnowledgePrompt(documents = {}, { order = DEFAULT_ORDER } = {}) {
  const seen = new Set();
  const blocks = [];

  const add = (id) => {
    const doc = documents[id];
    if (!doc?.text || seen.has(id)) return;
    seen.add(id);
    blocks.push(`## ${LABELS[id] || id}\n${doc.text}`);
  };

  order.forEach(add);
  // Include any additional documents a tenant provides beyond the standard set.
  Object.keys(documents).forEach(add);

  return blocks.join('\n\n');
}
