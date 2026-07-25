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

/**
 * Env vars this route REQUIRES to do any work. EMAIL_FROM is intentionally NOT
 * here — it is optional and defaults to Resend's sandbox sender. CRON_SECRET is
 * enforced separately by isAuthorized() (401 before we get this far).
 */
const REQUIRED_ENV = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY'];

/** Names of required env vars that are missing or empty (never logs values). */
function missingRequiredEnv() {
  return REQUIRED_ENV.filter((name) => {
    const v = process.env[name];
    return v === undefined || String(v).trim() === '';
  });
}

/** Constant-ish check that the caller presented the shared cron secret. */
function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed: no secret configured → deny all
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${secret}`;
}

async function handle(request) {
  if (!isAuthorized(request)) {
    // Helps distinguish "secret not configured" from "wrong/absent header" in
    // logs, WITHOUT ever printing the secret itself.
    // eslint-disable-next-line no-console
    console.warn('[Nova Email cron] 401 unauthorized', {
      cronSecretConfigured: Boolean(process.env.CRON_SECRET),
      authorizationHeaderPresent: Boolean(request.headers.get('authorization')),
    });
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Fail fast with a DESCRIPTIVE 500 (not a downstream crash) when required
  // configuration is absent — and log exactly which vars are missing so it is
  // visible in Vercel's function logs. Values are never logged.
  const missing = missingRequiredEnv();
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[Nova Email cron] missing required env vars', {
      missing,
      // presence-only snapshot to speed up diagnosis (booleans, no secrets):
      present: {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
        EMAIL_FROM: Boolean(process.env.EMAIL_FROM), // optional (defaults if unset)
        CRON_SECRET: Boolean(process.env.CRON_SECRET),
      },
    });
    return NextResponse.json(
      {
        ok: false,
        error: 'email_cron_misconfigured',
        message: `Email cron is missing required environment variable(s): ${missing.join(', ')}.`,
        missing,
      },
      { status: 500 },
    );
  }

  try {
    const email = createEmailService();
    const result = await email.processDueBatch({ limit: BATCH_LIMIT });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    // Log the FULL error (message + stack + any typed fields) so Vercel's
    // function logs show the real root cause instead of an empty 500.
    // eslint-disable-next-line no-console
    console.error('[Nova Email cron] processDueBatch failed', {
      name: err?.name,
      code: err?.code,
      status: err?.status,
      detail: err?.detail,
      message: err?.message,
      stack: err?.stack,
    });
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
