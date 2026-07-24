/**
 * Nova Data — lead persistence coordinator (Milestone 16).
 *
 * Persists a COMPLETED lead using the EXISTING Lead Repository (Milestone 7):
 * the dedup read goes through `leadRepository.findOne`, and the write reuses the
 * repository's OWN adapter connection (`leadRepository.adapter.client`) — so no
 * new/separate Supabase access is introduced and no Repository Layer file is
 * modified. Errors are normalized (reusing M7 helpers) and never thrown, so
 * chat continues even when persistence fails or Supabase is unavailable.
 *
 * This module is NOT wired to write on its own — the runtime coordinates WHEN to
 * call it (only when the Lead Engine reports the lead complete, saved once).
 */
import { buildRepositoryRegistry } from './repositoryFactory';
import { createSupabaseAdapter } from './supabaseAdapter';
import { REPOSITORY, DEFAULT_TABLES, repoSuccess, repoFailure } from './repositoryTypes';
import { normalizeError } from './repositoryErrors';

/** A disconnected default Lead Repository (writes are graceful no-ops until a client is injected). */
function defaultLeadRepository() {
  return buildRepositoryRegistry({ adapter: createSupabaseAdapter({}) }).require(REPOSITORY.LEAD);
}

/** Map a lead summary object → a table row. */
function toRow(lead = {}, { id, companyId, conversationId }) {
  return {
    id,
    company_id: companyId ?? null,
    conversation_id: conversationId ?? null,
    full_name: lead.fullName ?? null,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    company_name: lead.companyName ?? null,
    business_type: lead.businessType ?? null,
    budget: lead.budget ?? null,
    timeline: lead.timeline ?? null,
    project_description: lead.projectDescription ?? null,
    status: 'complete',
    updated_at: new Date().toISOString(),
  };
}

/**
 * @param {Object} [deps]
 * @param {object} [deps.leadRepository]  existing M7 Lead Repository (DI)
 * @param {string} [deps.table]
 */
export function createLeadWriter({ leadRepository = defaultLeadRepository(), table = DEFAULT_TABLES[REPOSITORY.LEAD] } = {}) {
  /**
   * Persist a completed lead (idempotent). Returns a normalized RepositoryResult.
   * @param {object} lead                    lead summary fields
   * @param {{ companyId?:string, conversationId?:string }} [context]
   */
  async function persist(lead, { companyId, conversationId } = {}) {
    try {
      // Write reuses the repository's own connection (no separate Supabase access).
      const client = leadRepository?.adapter?.client;
      if (!client || typeof client.from !== 'function') {
        return repoFailure('Lead repository is not connected.', { metadata: { skipped: true } });
      }

      // Dedup via the EXISTING repository read — save once per conversation.
      if (conversationId) {
        const existing = await leadRepository.findOne({ conversation_id: conversationId });
        if (existing?.ok && existing.data) {
          return repoSuccess(existing.data, { metadata: { deduped: true } });
        }
      }

      const id = lead?.id || (conversationId ? `lead_${conversationId}` : undefined);
      const { data, error } = await client.from(table).upsert(toRow(lead, { id, companyId, conversationId })).select();
      if (error) return repoFailure(normalizeError(error));

      const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
      return repoSuccess(row ?? { id }, { metadata: { saved: true } });
    } catch (e) {
      return repoFailure(normalizeError(e));
    }
  }

  return { persist };
}
