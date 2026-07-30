/**
 * Nova WhatsApp — non-fatal template send. Mirrors pushLeadToHubspot: any failure
 * returns { ok:false, error } and never throws, so it can be fired after lead
 * persistence without breaking chat / contact-form responses. Not wired into any
 * flow yet (Phase 1).
 */
import { defaultWhatsappClient } from './whatsappCloudClient.js';

export async function sendWhatsappTemplate(
  { to, templateName, languageCode = 'en_US', components } = {},
  { client } = {},
) {
  const c = client || defaultWhatsappClient();
  if (!c.configured) return { ok: false, error: 'not_configured', skipped: true };
  if (!to) return { ok: false, error: 'missing_recipient' };

  try {
    const res = await c.sendTemplateMessage(to, templateName, languageCode, components);
    const messageId = res?.messages?.[0]?.id;
    return { ok: true, messageId };
  } catch (err) {
    console.error('[WhatsApp] send failed (non-fatal)', err?.message);
    return { ok: false, error: err?.message ?? String(err) };
  }
}
