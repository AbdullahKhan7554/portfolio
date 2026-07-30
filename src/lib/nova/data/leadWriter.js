/**
 * Nova Data — lead persistence coordinator (Milestone 16; Phase 3c rewire).
 *
 * Persists a COMPLETED lead to the `leads` table. Historically this depended on
 * an injected supabase-js client that was never wired (writes were silent
 * no-ops). It now writes via Supabase REST (PostgREST) using `fetch` and the
 * SERVICE-ROLE key — the SAME dependency-free approach proven in the email
 * module (templateRepository / scheduledEmailRepository). The `leads` table is
 * RLS-locked to the service role (PII).
 *
 * The PUBLIC API is unchanged: `createLeadWriter()` → `{ persist }`, and
 * `persist(lead, { companyId, conversationId })` still returns a normalized
 * RepositoryResult (repoSuccess/repoFailure). Errors are normalized and never
 * thrown, so chat continues even when persistence fails or Supabase is down.
 */
import { DEFAULT_TABLES, REPOSITORY, repoSuccess, repoFailure } from './repositoryTypes';
import { normalizeError } from './repositoryErrors';

const LEADS_TABLE = DEFAULT_TABLES[REPOSITORY.LEAD]; // 'leads'

/**
 * PostgREST-backed lead store (service-role; the leads table is RLS-locked).
 * Injectable + fetch-based so tests can pass a fake `fetchImpl`.
 */
export function createSupabaseLeadStore({ url, apiKey, table = LEADS_TABLE, fetchImpl = fetch } = {}) {
  const base = `${(url || '').replace(/\/$/, '')}/rest/v1/${table}`;
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const configured = Boolean(url && apiKey);

  /** Dedup lookup by the conversation id stored in metadata (or null). */
  async function findByConversation(conversationId) {
    if (!configured || !conversationId) return null;
    const q =
      `${base}?metadata->>conversationId=eq.${encodeURIComponent(conversationId)}` +
      `&select=*&limit=1`;
    const res = await fetchImpl(q, { headers });
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  /** Insert one row, returning its representation. Throws on non-2xx. */
  async function insert(row) {
    const res = await fetchImpl(base, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify([row]),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`leads insert failed (${res.status}): ${detail}`);
    }
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) ? rows[0] ?? null : rows;
  }

  return { configured, findByConversation, insert };
}

/** Default lead store wired from env (server-side; service-role only). */
export function defaultLeadStore(env = process.env) {
  return createSupabaseLeadStore({
    url: env.NEXT_PUBLIC_SUPABASE_URL || '',
    apiKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
  });
}

/**
 * Map the captured lead summary → a `leads` table row. Known columns map
 * directly; anything else captured (conversationId, companyName, businessType)
 * is preserved in `metadata`. `status` starts at 'new'; `source` is 'chatbot'.
 */
function toRow(lead = {}, { companyId, conversationId, rawTimeline, source }) {
  const metadata = {};
  if (conversationId) metadata.conversationId = conversationId;
  if (lead.companyName) metadata.companyName = lead.companyName;
  if (lead.businessType) metadata.businessType = lead.businessType;
  if (lead.package) metadata.package = lead.package;
  if (rawTimeline) metadata.raw_timeline = rawTimeline;

  return {
    company_id: companyId ?? null,
    full_name: lead.fullName ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    project_description: lead.projectDescription ?? null,
    budget: lead.budget ?? null,
    timeline: lead.timeline ?? null,
    status: 'new',
    source: source ?? 'chatbot',
    metadata,
  };
}

/**
 * @param {Object} [deps]
 * @param {object} [deps.leadStore]  injectable lead store (DI/testing)
 * @param {string} [deps.table]
 */
export function createLeadWriter({ leadStore, table = LEADS_TABLE } = {}) {
  const store = leadStore || createSupabaseLeadStore({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    table,
  });

  /**
   * Persist a completed lead (idempotent per conversation). Returns a normalized
   * RepositoryResult — same shape as before.
   * @param {object} lead                    lead summary fields
   * @param {{ companyId?:string, conversationId?:string, rawTimeline?:string, source?:string }} [context]
   */
  async function persist(lead, { companyId, conversationId, rawTimeline, source } = {}) {
    try {
      if (!store.configured) {
        return repoFailure('Lead repository is not connected.', { metadata: { skipped: true } });
      }

      // Dedup — save once per conversation.
      if (conversationId) {
        const existing = await store.findByConversation(conversationId);
        if (existing) return repoSuccess(existing, { metadata: { deduped: true } });
      }

      const row = await store.insert(toRow(lead, { companyId, conversationId, rawTimeline, source }));
      return repoSuccess(row ?? {}, { metadata: { saved: true } });
    } catch (e) {
      return repoFailure(normalizeError(e));
    }
  }

  return { persist };
}
