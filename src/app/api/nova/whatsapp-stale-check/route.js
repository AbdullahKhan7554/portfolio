import { NextResponse } from 'next/server';
import { createStaleLeadReminder } from '@/lib/nova/whatsapp/staleLeadCheck';
import { novaConfig } from '@/config/nova.config';

/**
 * Nova WhatsApp — stale-lead reminder cron consumer. Sends the owner a
 * `nova_owner_stale_reminder` for each `status='new'` lead older than
 * STALE_LEAD_HOURS (default 24) that has not already been reminded. Idempotent via
 * `leads.stale_reminder_sent_at`.
 *
 * Triggered by an EXTERNAL scheduler (cron-job.org) — NOT Vercel Cron. Same auth as
 * /api/nova/email-cron: `Authorization: Bearer <CRON_SECRET>`, fails CLOSED (401)
 * when the secret is unset or the header does not match. GET and POST both work.
 * Optional `?hours=<n>` overrides the threshold for a manual test call only.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'WHATSAPP_CLOUD_API_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
];

function missingRequiredEnv() {
  return REQUIRED_ENV.filter((name) => {
    const v = process.env[name];
    return v === undefined || String(v).trim() === '';
  });
}

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed
  return (request.headers.get('authorization') || '') === `Bearer ${secret}`;
}

async function handle(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const missing = missingRequiredEnv();
  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'stale_check_misconfigured',
        message: `Stale-lead check is missing required environment variable(s): ${missing.join(', ')}.`,
        missing,
      },
      { status: 500 },
    );
  }

  try {
    // Optional ?hours= override for manual testing; else STALE_LEAD_HOURS (default 24).
    const hoursParam = Number.parseInt(new URL(request.url).searchParams.get('hours') ?? '', 10);
    const thresholdHours = Number.isFinite(hoursParam) && hoursParam > 0 ? hoursParam : undefined;

    const check = createStaleLeadReminder({ companyId: novaConfig.companyId, thresholdHours });
    const result = await check.processDue();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Nova WhatsApp stale-check] failed', { message: err?.message, stack: err?.stack });
    return NextResponse.json(
      { ok: false, error: 'stale_check_failed', message: err?.message },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  return handle(request);
}
export async function POST(request) {
  return handle(request);
}
