/**
 * Nova CRM — push a persisted lead (snake_case DB row) to HubSpot as a
 * Contact + associated Deal. Non-fatal: any failure returns { ok:false, error }
 * and never throws, so it can be fired after Supabase persistence without
 * breaking chat / contact-form responses. Not wired into any flow yet (Phase 1).
 */
import { defaultHubspotClient } from './hubspotClient.js';

function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstname: '', lastname: '' };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

function parseAmount(budget) {
  const match = String(budget ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  const n = match ? Number.parseFloat(match[0]) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function truncate(s, n) {
  const t = String(s ?? '').trim();
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function buildDescription(lead) {
  const lines = [
    ['Timeline', lead.timeline],
    ['Budget', lead.budget],
    ['Source', lead.source],
    ['Business type', lead.metadata?.businessType],
  ];
  return lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
}

export async function pushLeadToHubspot(lead, { client } = {}) {
  const c = client || defaultHubspotClient();
  if (!c.configured) return { ok: false, error: 'not_configured', skipped: true };
  if (!lead?.email) return { ok: false, error: 'missing_email' };

  try {
    const { firstname, lastname } = splitName(lead.full_name);
    const contactRes = await c.request('POST', '/crm/v3/objects/contacts/batch/upsert', {
      inputs: [
        {
          idProperty: 'email',
          id: lead.email,
          properties: { email: lead.email, firstname, lastname, phone: lead.phone || '' },
        },
      ],
    });
    const contactId = contactRes.results?.[0]?.id;

    const amount = parseAmount(lead.budget);
    const dealRes = await c.request('POST', '/crm/v3/objects/deals', {
      properties: {
        dealname: `${lead.full_name || lead.email} - ${truncate(lead.project_description, 60)}`,
        description: buildDescription(lead),
        ...(amount != null && { amount }),
      },
    });
    const dealId = dealRes.id;

    await c.request('PUT', `/crm/v4/objects/deals/${dealId}/associations/default/contacts/${contactId}`);

    return { ok: true, contactId, dealId };
  } catch (err) {
    console.error('[HubSpot] push failed (non-fatal)', err?.message);
    return { ok: false, error: err?.message ?? String(err) };
  }
}
