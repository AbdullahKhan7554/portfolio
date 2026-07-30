import 'server-only';
import { createAdminClient } from './admin';
import { LEAD_STATUSES } from '@/lib/dashboard/leadStatus';
import { LEAD_SOURCES } from '@/lib/dashboard/leadSource';

export { LEAD_STATUSES };
export { LEAD_SOURCES };

const COLUMNS =
  'id, created_at, full_name, email, phone, project_description, budget, timeline, status, source';

/**
 * List leads newest-first, with optional text search (name/email), status, and
 * source filters. Server-only (service-role).
 * @param {{ search?: string, status?: string, source?: string }} [opts]
 */
export async function listLeads({ search = '', status = '', source = '' } = {}) {
  const supabase = createAdminClient();
  let query = supabase.from('leads').select(COLUMNS).order('created_at', { ascending: false });

  if (status && LEAD_STATUSES.includes(status)) {
    query = query.eq('status', status);
  }
  if (source && LEAD_SOURCES.includes(source)) {
    query = query.eq('source', source);
  }
  const term = search.trim();
  if (term) {
    const safe = term.replace(/[%,()]/g, ' ');
    query = query.or(`full_name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

/** Fetch a single lead by id (all fields). Server-only (service-role). */
export async function getLead(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (error) return { lead: null, error: error.message };
  return { lead: data ?? null, error: null };
}

/** Update a lead's status. Server-only (service-role). */
export async function updateLeadStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) return { ok: false, error: 'Invalid status' };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('status')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Lead not found' };
  return { ok: true, error: null, status: data.status };
}
