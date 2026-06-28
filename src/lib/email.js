import 'server-only';
import { Resend } from 'resend';
import { serverEnv, isEmailConfigured } from '@/lib/env';

let client = null;
function getClient() {
  if (!isEmailConfigured) return null;
  if (!client) client = new Resend(serverEnv.resendApiKey);
  return client;
}

/**
 * Send a transactional email via Resend.
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function sendEmail({ subject, html, replyTo }) {
  const resend = getClient();
  if (!resend) return { ok: false, reason: 'email_not_configured' };
  try {
    const { error } = await resend.emails.send({
      from: serverEnv.contactFromEmail,
      to: serverEnv.contactToEmail,
      subject,
      html,
      replyTo,
    });
    if (error) return { ok: false, reason: 'send_failed' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'send_failed' };
  }
}

/** Minimal HTML escaping for user-provided values. */
export function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
