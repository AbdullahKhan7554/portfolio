/**
 * Nova Email — template repository (READ-ONLY here).
 *
 * Resolves rows from the `email_templates` table via Supabase's REST (PostgREST)
 * endpoint using `fetch` — no `@supabase/supabase-js` dependency, consistent
 * with the fetch-based provider adapters and the codebase's DI philosophy. The
 * repository is injectable, so a test can pass a fake or an in-memory store
 * instead of hitting Supabase.
 *
 * NOTE: writes (scheduling rows into `scheduled_emails`) are Phase 2 — this
 * module only reads active templates.
 */

/**
 * Build a Supabase REST-backed template repository.
 * @param {Object} deps
 * @param {string} deps.url        Supabase project URL (NEXT_PUBLIC_SUPABASE_URL)
 * @param {string} deps.apiKey     API key (service role preferred; anon works for
 *                                  the public read policy on email_templates)
 * @param {string} [deps.table]
 * @param {typeof fetch} [deps.fetchImpl]
 */
export function createSupabaseTemplateRepository({ url, apiKey, table = 'email_templates', fetchImpl = fetch } = {}) {
  /**
   * Fetch the active template for a company + key (or null).
   * @param {string} companyId
   * @param {string} templateKey
   * @returns {Promise<null | { id:string, company_id:string, template_key:string,
   *   subject:string, html_body:string, variables:any, is_active:boolean }>}
   */
  async function getTemplate(companyId, templateKey) {
    if (!url || !apiKey) return null;
    const endpoint =
      `${url.replace(/\/$/, '')}/rest/v1/${table}` +
      `?company_id=eq.${encodeURIComponent(companyId)}` +
      `&template_key=eq.${encodeURIComponent(templateKey)}` +
      `&is_active=eq.true&select=*&limit=1`;

    const res = await fetchImpl(endpoint, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  /**
   * Fetch a template by its primary id (used by the cron to render a scheduled
   * row from its `template_id`). Not filtered by is_active — a schedule that was
   * already committed still renders even if the template is later deactivated.
   * @param {string} id
   */
  async function getTemplateById(id) {
    if (!url || !apiKey || !id) return null;
    const endpoint =
      `${url.replace(/\/$/, '')}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`;
    const res = await fetchImpl(endpoint, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  return { getTemplate, getTemplateById };
}

/**
 * Default template repository wired from the environment (server-side). Prefers
 * the service-role key; falls back to the anon key (which is sufficient given
 * the public read policy on `email_templates`).
 * @param {Record<string,string|undefined>} [env]
 */
export function defaultTemplateRepository(env = {}) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || '';
  const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createSupabaseTemplateRepository({ url, apiKey });
}
