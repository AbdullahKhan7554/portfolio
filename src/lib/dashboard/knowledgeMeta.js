/** KB CMS constants. doc_type values re-exported from the canonical KMS taxonomy
 *  (minus `faq`, which lives in its own table). */
import { KNOWLEDGE_DOCUMENTS } from '@/lib/nova/knowledge/constants';

export const KNOWLEDGE_DOC_TYPES = Object.values(KNOWLEDGE_DOCUMENTS).filter((t) => t !== 'faq');
export const KNOWLEDGE_KINDS = ['document', 'faq'];
