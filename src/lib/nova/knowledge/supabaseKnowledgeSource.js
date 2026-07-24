/**
 * Nova KMS — Supabase-backed knowledge source (Milestone 8).
 *
 * Adapts the READ-ONLY repository layer (Milestone 7) into the exact
 * `{ config, documents }` shape the Knowledge Service already produces. It maps
 * repository rows into markdown and runs them through the EXISTING parser, so
 * every parsed document has the identical shape as the previous (file-backed)
 * implementation. No direct Supabase queries here — only repositories. No
 * business logic; pure data mapping + graceful degradation.
 */
import { parseDocument } from './parser';
import { createCompanyConfig } from './companySchema';
import { REPOSITORY } from '../data/repositoryTypes';

/** Standard knowledge document types sourced from the KnowledgeRepository. */
const KNOWLEDGE_DOC_TYPES = ['company', 'services', 'pricing', 'portfolio', 'process', 'technologies'];

/** First non-empty value among candidate keys. */
function pick(row, keys, fallback = '') {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && value !== '') return value;
  }
  return fallback;
}

function groupBy(rows, keyFn) {
  const out = {};
  for (const row of rows) {
    const key = keyFn(row);
    (out[key] ||= []).push(row);
  }
  return out;
}

function titleCase(id) {
  return String(id).charAt(0).toUpperCase() + String(id).slice(1);
}

/** Map a company row into the Knowledge Service config shape (registry fallback). */
function mapCompanyConfig(companyId, row, registry) {
  if (row) {
    const mapped = {
      companyId: pick(row, ['company_id', 'companyId', 'id', 'slug'], companyId),
      brandName: pick(row, ['brand_name', 'brandName', 'name'], companyId),
      assistantName: pick(row, ['assistant_name', 'assistantName'], 'Assistant'),
      website: pick(row, ['website', 'url'], ''),
      logo: pick(row, ['logo', 'logo_url'], ''),
      primaryColor: pick(row, ['primary_color', 'primaryColor'], ''),
    };
    // Reuse the existing config factory for an identical shape when it validates.
    try {
      return createCompanyConfig(mapped);
    } catch {
      return { knowledgeFolder: mapped.companyId, ...mapped };
    }
  }
  // Resilience: fall back to the configured company registry (keeps the runtime
  // working when Supabase is unavailable).
  return registry?.get?.(companyId) ?? null;
}

/** Build a parsed knowledge document from KnowledgeRepository rows of one type. */
function knowledgeDoc(docType, rows) {
  const parts = rows
    .map((r) => {
      const title = pick(r, ['title', 'name'], '');
      const content = pick(r, ['content', 'body', 'text', 'markdown'], '');
      return title ? `## ${title}\n${content}` : content;
    })
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parseDocument(docType, `# ${titleCase(docType)}\n\n${parts.join('\n\n')}`);
}

/** Build the FAQ document from FAQRepository rows. */
function faqDoc(rows) {
  const parts = rows
    .map((r) => {
      const q = pick(r, ['question', 'q', 'title'], '');
      const a = pick(r, ['answer', 'a', 'content', 'body'], '');
      return q ? `## ${q}\n${a}` : '';
    })
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parseDocument('faq', `# FAQ\n\n${parts.join('\n\n')}`);
}

/** Build the Products document from ProductRepository rows. */
function productsDoc(rows) {
  const parts = rows
    .map((r) => {
      const name = pick(r, ['name', 'title'], '');
      const desc = pick(r, ['description', 'desc', 'content'], '');
      const price = pick(r, ['price', 'starting_price', 'startingPrice'], '');
      return name ? `## ${name}\n${desc}${price ? `\n- Price: ${price}` : ''}` : '';
    })
    .filter(Boolean);
  if (parts.length === 0) return null;
  return parseDocument('products', `# Products\n\n${parts.join('\n\n')}`);
}

/**
 * Load a company's knowledge from the repository layer.
 * @param {Object} deps
 * @param {import('../data/repositoryRegistry').RepositoryRegistry} deps.repositories
 * @param {Object} [deps.registry]            company config registry (fallback)
 * @param {string} deps.companyId
 * @param {boolean} [deps.includeProducts]
 * @returns {Promise<{ config:object|null, documents:Record<string, object> }>}
 */
export async function loadKnowledgeFromRepositories({
  repositories,
  registry,
  companyId,
  includeProducts = true,
}) {
  const companyRepo = repositories.get(REPOSITORY.COMPANY);
  const knowledgeRepo = repositories.get(REPOSITORY.KNOWLEDGE);
  const faqRepo = repositories.get(REPOSITORY.FAQ);
  const productRepo = repositories.get(REPOSITORY.PRODUCT);

  // --- Company (repository first; registry fallback for resilience) ---------
  const companyRes = companyRepo ? await companyRepo.findById(companyId) : null;
  const config = mapCompanyConfig(companyId, companyRes?.ok ? companyRes.data : null, registry);

  const documents = {};

  // --- Knowledge documents --------------------------------------------------
  const knowledgeRes = knowledgeRepo
    ? await knowledgeRepo.findMany({ filters: { company_id: companyId } })
    : null;
  if (knowledgeRes?.ok && Array.isArray(knowledgeRes.data)) {
    const byType = groupBy(knowledgeRes.data, (r) => pick(r, ['doc_type', 'type', 'kind'], 'company'));
    for (const type of KNOWLEDGE_DOC_TYPES) {
      const rows = byType[type];
      if (rows?.length) {
        const doc = knowledgeDoc(type, rows);
        if (doc) documents[type] = doc;
      }
    }
    // Any non-standard doc types a tenant provides are included too.
    for (const [type, rows] of Object.entries(byType)) {
      if (!documents[type] && !KNOWLEDGE_DOC_TYPES.includes(type)) {
        const doc = knowledgeDoc(type, rows);
        if (doc) documents[type] = doc;
      }
    }
  }

  // --- FAQs -----------------------------------------------------------------
  const faqRes = faqRepo ? await faqRepo.findMany({ filters: { company_id: companyId } }) : null;
  if (faqRes?.ok) {
    const doc = faqDoc(faqRes.data || []);
    if (doc) documents.faq = doc;
  }

  // --- Products (if enabled) ------------------------------------------------
  if (includeProducts && productRepo) {
    const productRes = await productRepo.findMany({ filters: { company_id: companyId } });
    if (productRes?.ok) {
      const doc = productsDoc(productRes.data || []);
      if (doc) documents.products = doc;
    }
  }

  return { config, documents };
}
