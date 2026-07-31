import 'server-only';
import { createAdminClient } from './admin';
import { novaConfig } from '@/config/nova.config';
import { KNOWLEDGE_DOC_TYPES } from '@/lib/dashboard/knowledgeMeta';

/**
 * Nova KB write layer. Server-only, service-role (bypasses the tables' RLS,
 * mirroring src/lib/supabase/leads.js). Scoped to the active tenant. Reads/writes
 * `knowledge_documents` and `faqs` — the two tables Nova's retrieval already reads.
 */

const COMPANY_ID = novaConfig.companyId;
const DOCS = 'knowledge_documents';
const FAQS = 'faqs';
const DOC_COLUMNS = 'id, doc_type, title, content, is_active, created_at, updated_at';
const FAQ_COLUMNS = 'id, question, answer, is_active, created_at, updated_at';

const clean = (s) => String(s ?? '').trim();

function validateDocument({ docType, title, content }) {
  if (!KNOWLEDGE_DOC_TYPES.includes(docType)) return 'Invalid document type';
  const t = clean(title);
  if (t.length < 1 || t.length > 200) return 'Title is required (max 200 characters)';
  const c = clean(content);
  if (c.length < 1 || c.length > 8000) return 'Content is required (max 8000 characters)';
  return null;
}

function validateFaq({ question, answer }) {
  const q = clean(question);
  if (q.length < 1 || q.length > 300) return 'Question is required (max 300 characters)';
  const a = clean(answer);
  if (a.length < 1 || a.length > 5000) return 'Answer is required (max 5000 characters)';
  return null;
}

function withSearch(query, term, cols) {
  const safe = term.replace(/[%,()]/g, ' ');
  return query.or(cols.map((c) => `${c}.ilike.%${safe}%`).join(','));
}

/** List documents (newest-updated first), optional doc_type / active / search filters. */
export async function listDocuments({ docType = '', search = '', activeOnly = false } = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from(DOCS)
    .select(DOC_COLUMNS)
    .eq('company_id', COMPANY_ID)
    .order('updated_at', { ascending: false });
  if (docType && KNOWLEDGE_DOC_TYPES.includes(docType)) query = query.eq('doc_type', docType);
  if (activeOnly) query = query.eq('is_active', true);
  const term = clean(search);
  if (term) query = withSearch(query, term, ['title', 'content']);
  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

/** List FAQs (newest-updated first), optional active / search filters. */
export async function listFaqs({ search = '', activeOnly = false } = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from(FAQS)
    .select(FAQ_COLUMNS)
    .eq('company_id', COMPANY_ID)
    .order('updated_at', { ascending: false });
  if (activeOnly) query = query.eq('is_active', true);
  const term = clean(search);
  if (term) query = withSearch(query, term, ['question', 'answer']);
  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function getDocument(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(DOCS)
    .select('*')
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .maybeSingle();
  if (error) return { entry: null, error: error.message };
  return { entry: data ?? null, error: null };
}

export async function getFaq(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(FAQS)
    .select('*')
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .maybeSingle();
  if (error) return { entry: null, error: error.message };
  return { entry: data ?? null, error: null };
}

export async function createDocument({ docType, title, content, isActive = true }) {
  const invalid = validateDocument({ docType, title, content });
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(DOCS)
    .insert({
      company_id: COMPANY_ID,
      doc_type: docType,
      title: clean(title),
      content: clean(content),
      is_active: Boolean(isActive),
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null, id: data?.id };
}

export async function updateDocument(id, { docType, title, content, isActive }) {
  const invalid = validateDocument({ docType, title, content });
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(DOCS)
    .update({
      doc_type: docType,
      title: clean(title),
      content: clean(content),
      is_active: Boolean(isActive),
      updated_at: new Date().toISOString(),
    })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}

export async function deleteDocument(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from(DOCS).delete().eq('company_id', COMPANY_ID).eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function setDocumentActive(id, isActive) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(DOCS)
    .update({ is_active: Boolean(isActive), updated_at: new Date().toISOString() })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}

export async function createFaq({ question, answer, isActive = true }) {
  const invalid = validateFaq({ question, answer });
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(FAQS)
    .insert({
      company_id: COMPANY_ID,
      question: clean(question),
      answer: clean(answer),
      is_active: Boolean(isActive),
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null, id: data?.id };
}

export async function updateFaq(id, { question, answer, isActive }) {
  const invalid = validateFaq({ question, answer });
  if (invalid) return { ok: false, error: invalid };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(FAQS)
    .update({
      question: clean(question),
      answer: clean(answer),
      is_active: Boolean(isActive),
      updated_at: new Date().toISOString(),
    })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}

export async function deleteFaq(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from(FAQS).delete().eq('company_id', COMPANY_ID).eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

export async function setFaqActive(id, isActive) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(FAQS)
    .update({ is_active: Boolean(isActive), updated_at: new Date().toISOString() })
    .eq('company_id', COMPANY_ID)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Entry not found' };
  return { ok: true, error: null };
}
