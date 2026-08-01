/**
 * Nova WhatsApp — stale-lead reminder (owner alert for uncontacted leads).
 *
 * A cron-triggered check (mirrors the email cron): finds leads still `status='new'`
 * older than a threshold that have NOT already been reminded, and sends the owner
 * `nova_owner_stale_reminder` (2 params: lead name, hours waited). Idempotent via
 * the `stale_reminder_sent_at` column — a lead is stamped only after a successful
 * send, so it is never re-alerted, while a failed send retries next run. Per-lead
 * non-fatal: one failed send never blocks the rest of the batch.
 *
 * Free of `server-only`/`@/lib/env` so a bare-Node script can import it (same as
 * whatsappCloudClient). Uses Supabase REST + the SERVICE-ROLE key (leads is RLS-locked).
 */
import { sendWhatsappTemplate } from './sendWhatsappTemplate.js';

const STALE_REMINDER_TEMPLATE = 'nova_owner_stale_reminder';
const DEFAULT_STALE_HOURS = 24;
const HOUR_MS = 3_600_000;

function resolveThresholdHours(env) {
  const n = Number.parseInt(env.STALE_LEAD_HOURS ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_STALE_HOURS;
}

/** WhatsApp body params must be non-empty and free of newlines/tabs/long spaces. */
function waText(value, fallback = 'a lead') {
  const s = String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
  return s || fallback;
}

export function createStaleLeadReminder({
  url = process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  ownerNumber = process.env.OWNER_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  companyId,
  thresholdHours,
  fetchImpl = fetch,
  sendTemplate = sendWhatsappTemplate,
  now = () => Date.now(),
} = {}) {
  const base = `${(url || '').replace(/\/$/, '')}/rest/v1/leads`;
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const hours = thresholdHours ?? resolveThresholdHours(process.env);
  const configured = Boolean(url && apiKey);

  /** Stale = status 'new', not yet reminded, created before the cutoff. */
  async function findStale(cutoffIso) {
    const params = new URLSearchParams();
    params.set('status', 'eq.new');
    params.set('stale_reminder_sent_at', 'is.null');
    params.set('created_at', `lt.${cutoffIso}`);
    if (companyId) params.set('company_id', `eq.${companyId}`);
    params.set('select', 'id,full_name,created_at');
    params.set('order', 'created_at.asc');
    const res = await fetchImpl(`${base}?${params.toString()}`, { headers });
    if (!res.ok) {
      throw new Error(`stale leads query failed (${res.status}): ${await res.text().catch(() => '')}`);
    }
    return (await res.json().catch(() => [])) || [];
  }

  async function markReminded(id, iso) {
    await fetchImpl(`${base}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ stale_reminder_sent_at: iso }),
    });
  }

  async function processDue() {
    if (!configured) return { ok: false, error: 'not_configured', processed: 0, sent: [], failed: [] };
    if (!ownerNumber) return { ok: false, error: 'missing_owner_number', processed: 0, sent: [], failed: [] };

    const nowMs = now();
    const cutoffIso = new Date(nowMs - hours * HOUR_MS).toISOString();
    const leads = await findStale(cutoffIso);

    const sent = [];
    const failed = [];
    for (const lead of leads) {
      const hoursWaited = Math.max(1, Math.round((nowMs - new Date(lead.created_at).getTime()) / HOUR_MS));
      const res = await sendTemplate({
        to: ownerNumber,
        templateName: STALE_REMINDER_TEMPLATE,
        languageCode: 'en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: waText(lead.full_name) },
              { type: 'text', text: String(hoursWaited) },
            ],
          },
        ],
      });
      if (res.ok) {
        // Stamp only after a successful send → idempotent, and a failed send retries.
        await markReminded(lead.id, new Date(now()).toISOString());
        sent.push({ id: lead.id, messageId: res.messageId, hoursWaited });
      } else {
        failed.push({ id: lead.id, error: res.error });
      }
    }
    return { ok: true, processed: leads.length, sent, failed, thresholdHours: hours };
  }

  return { processDue, thresholdHours: hours, configured };
}
