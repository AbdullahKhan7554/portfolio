/**
 * Nova KMS — public API (Milestone 3, knowledge architecture only).
 *
 * Reusable, config-driven, multi-tenant knowledge layer. No AI, no embeddings,
 * no vector DB, no API routes. Loader/service are server/build-time modules
 * (they read the filesystem); the rest are pure.
 *
 * @example
 *   import { createKnowledgeService } from '@/lib/nova/knowledge';
 *   const kms = createKnowledgeService();
 *   const { documents, validation } = await kms.getKnowledge('avenix');
 *   const hits = await kms.search('avenix', 'how much does a website cost');
 */

// Constants & schema
export {
  KNOWLEDGE_DOCUMENTS,
  KNOWLEDGE_FILES,
  REQUIRED_DOCUMENTS,
  TEMPLATE_FOLDER,
} from './constants';
export {
  companyConfigSchema,
  createCompanyConfig,
  validateCompanyConfig,
} from './companySchema';

// Reusable modules
export { createKnowledgeLoader } from './loader';
export { parseMarkdown, parseDocument, parseDocuments } from './parser';
export { validateCompanyKnowledge, validateDocumentSections } from './validator';
export { KnowledgeRegistry, createKnowledgeRegistry } from './registry';
export { buildSearchIndex, search } from './search';

// Bundled companies + composition root
export { avenixCompany, knowledgeRegistry } from './companies';
export { createKnowledgeService } from './knowledgeService';
