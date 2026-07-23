/**
 * Nova KMS — constants. The document taxonomy every company folder follows.
 * Generic and company-agnostic; no tenant-specific values here.
 */

/** Canonical knowledge document types (one markdown file each). */
export const KNOWLEDGE_DOCUMENTS = Object.freeze({
  COMPANY: 'company',
  SERVICES: 'services',
  PRICING: 'pricing',
  PORTFOLIO: 'portfolio',
  FAQ: 'faq',
  PROCESS: 'process',
  TECHNOLOGIES: 'technologies',
});

/** Map of document id → expected filename, e.g. { company: 'company.md' }. */
export const KNOWLEDGE_FILES = Object.freeze(
  Object.fromEntries(Object.values(KNOWLEDGE_DOCUMENTS).map((id) => [id, `${id}.md`])),
);

/** Documents a company MUST provide to be considered complete. */
export const REQUIRED_DOCUMENTS = Object.freeze(Object.values(KNOWLEDGE_DOCUMENTS));

/** Folder (under the knowledge root) holding the copy-me starter template. */
export const TEMPLATE_FOLDER = '_template';

/** Default knowledge root, relative to the project cwd. */
export const DEFAULT_KNOWLEDGE_ROOT = ['src', 'knowledge'];
