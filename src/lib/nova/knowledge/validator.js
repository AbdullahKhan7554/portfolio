/**
 * Nova KMS — validator. Confirms a company's parsed knowledge is complete:
 * required documents present and non-empty. The required set is INJECTABLE
 * (OCP) so different tenants/verticals can demand different documents.
 * Pure; no I/O.
 */
import { REQUIRED_DOCUMENTS } from './constants';

/**
 * @param {Record<string, {text?:string}>} parsedDocs   { docId: parsedDocument }
 * @param {Object} [options]
 * @param {string[]} [options.required]                  defaults to REQUIRED_DOCUMENTS
 * @returns {{ ok:boolean, present:string[], missing:string[], empty:string[] }}
 */
export function validateCompanyKnowledge(parsedDocs = {}, { required = REQUIRED_DOCUMENTS } = {}) {
  const present = Object.keys(parsedDocs);
  const missing = required.filter((id) => !present.includes(id));
  const empty = present.filter((id) => !parsedDocs[id]?.text?.trim());

  return {
    ok: missing.length === 0 && empty.length === 0,
    present,
    missing,
    empty,
  };
}

/**
 * Validate that a single parsed document contains a set of expected headings.
 * @param {{sections?:Array<{heading:string}>}} parsedDoc
 * @param {string[]} requiredHeadings
 * @returns {{ ok:boolean, missing:string[] }}
 */
export function validateDocumentSections(parsedDoc, requiredHeadings = []) {
  const headings = (parsedDoc?.sections || []).map((s) => s.heading.toLowerCase());
  const missing = requiredHeadings.filter(
    (h) => !headings.includes(String(h).toLowerCase()),
  );
  return { ok: missing.length === 0, missing };
}
