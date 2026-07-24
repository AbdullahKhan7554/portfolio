/**
 * Nova Email — scheduled_emails repository (READ + WRITE).
 *
 * Unlike the template repository (public read, anon-friendly), `scheduled_emails`
 * holds recipient PII and is RLS-locked to the SERVICE ROLE only. This repository
 * therefore requires the service-role key and is used server-side exclusively:
 * the EmailService writes sequence rows here, and the cron claims/sends/updates
 * them. Built on Supabase REST (PostgREST) via `fetch` — no supabase-js dep.
 */
import { EmailConfigError, EmailSendError } from './emailErrors';

export function createScheduledEmailRepository({
  url,
  apiKey,
  table = 'scheduled_emails',
  fetchImpl = fetch,
} = {}) {
  const base = `${(url || '').replace(/\/$/, '')}/rest/v1/${table}`;
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const configured = Boolean(url && apiKey);

  function requireConfigured() {
    if (!configured) {
      throw new EmailConfigError(
        'scheduled_emails requires the Supabase service-role key (RLS-locked).',
        ['SUPABASE_SERVICE_ROLE_KEY'],
      );
    }
  }

  /** Insert one or many rows; returns the inserted representation. */
  async function insert(rows) {
    requireConfigured();
    const res = await fetchImpl(base, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new EmailSendError('supabase', `scheduled_emails insert failed (${res.status}).`, {
        status: res.status,
        detail,
      });
    }
    return res.json();
  }

  /** Due rows: status='pending' AND scheduled_for <= now, oldest first. */
  async function findDue({ limit = 50, now = new Date().toISOString() } = {}) {
    requireConfigured();
    const q =
      `${base}?status=eq.pending&scheduled_for=lte.${encodeURIComponent(now)}` +
      `&select=*&order=scheduled_for.asc&limit=${limit}`;
    const res = await fetchImpl(q, { headers });
    if (!res.ok) return [];
    return res.json().catch(() => []);
  }

  /**
   * Atomically CLAIM a due row for sending: pending -> processing, conditional on
   * the row still being 'pending'. Returns the claimed row, or null if another
   * worker already claimed it (the conditional UPDATE matched 0 rows). This is
   * the anti-double-send guard — a crash after claiming leaves the row in
   * 'processing', never re-picked by findDue().
   */
  async function claim(id) {
    requireConfigured();
    const q = `${base}?id=eq.${encodeURIComponent(id)}&status=eq.pending`;
    const res = await fetchImpl(q, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ status: 'processing' }),
    });
    if (!res.ok) return null;
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  }

  /** Mark a claimed row as sent. */
  async function markSent(id) {
    requireConfigured();
    const q = `${base}?id=eq.${encodeURIComponent(id)}`;
    await fetchImpl(q, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'sent', sent_at: new Date().toISOString(), error_message: null }),
    });
  }

  /** Mark a claimed row as failed, recording a truncated error message. */
  async function markFailed(id, message) {
    requireConfigured();
    const q = `${base}?id=eq.${encodeURIComponent(id)}`;
    await fetchImpl(q, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'failed', error_message: String(message ?? 'send failed').slice(0, 500) }),
    });
  }

  return { insert, findDue, claim, markSent, markFailed, configured };
}

/** Default repository wired from env (server-side; service-role only). */
export function defaultScheduledEmailRepository(env = {}) {
  return createScheduledEmailRepository({
    url: env.NEXT_PUBLIC_SUPABASE_URL || '',
    apiKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
  });
}
