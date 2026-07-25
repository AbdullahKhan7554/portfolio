import { NextResponse } from 'next/server';
import { createEmailService } from '@/lib/nova/email';

/**
 * Nova Email — cron consumer. Sends every DUE nurture email (status='pending',
 * scheduled_for <= now), claiming each row before send to avoid double-sends.
 *
 * Triggered by an EXTERNAL scheduler (e.g. cron-job.org) — NOT Vercel Cron. The
 * caller must present `Authorization: Bearer <CRON_SECRET>`; the route compares
 * that header against `process.env.CRON_SECRET` and fails CLOSED (401) when the
 * secret is unset or the header does not match. This keeps the endpoint from
 * being publicly triggerable. Both GET and POST are accepted (most external cron
 * services default to GET).
 *
 * Server-side only; secrets stay in the environment.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BATCH_LIMIT = 50;

/** Constant-ish check that the caller presented the shared cron secret. */
function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed: no secret configured → deny all
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${secret}`;
}

async function handle(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  try {
    const email = createEmailService();
    const result = await email.processDueBatch({ limit: BATCH_LIMIT });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.code || 'cron_failed', message: err?.message },
      { status: 500 },
    );
  }
}

// External cron services default to GET; POST is accepted too (same handler).
export async function GET(request) {
  return handle(request);
}
export async function POST(request) {
  return handle(request);
}
