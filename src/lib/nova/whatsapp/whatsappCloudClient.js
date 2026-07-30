/**
 * Nova WhatsApp — Cloud API client (dependency-free, fetch-based).
 *
 * Thin wrapper over https://graph.facebook.com/<version>/<phoneNumberId>/messages
 * with a Bearer token from WHATSAPP_CLOUD_API_TOKEN + WHATSAPP_PHONE_NUMBER_ID.
 * Mirrors hubspotClient: `fetchImpl` is injectable for tests; non-2xx throws and
 * the error carries Meta's JSON body. Never logs the token. Must stay free of
 * `server-only`/`@/lib/env` so a bare-Node script can import it.
 */
import { normalizePhone } from './normalizePhone.js';

const GRAPH_BASE = 'https://graph.facebook.com';
const GRAPH_VERSION = 'v21.0';

export function resolveWhatsappConfig(env = process.env) {
  const token = env.WHATSAPP_CLOUD_API_TOKEN || '';
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID || '';
  const missing = [];
  if (!token) missing.push('WHATSAPP_CLOUD_API_TOKEN');
  if (!phoneNumberId) missing.push('WHATSAPP_PHONE_NUMBER_ID');
  return { ok: missing.length === 0, token, phoneNumberId, missing };
}

export function createWhatsappClient({
  token,
  phoneNumberId,
  fetchImpl = fetch,
  version = GRAPH_VERSION,
} = {}) {
  const configured = Boolean(token && phoneNumberId);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const messagesUrl = `${GRAPH_BASE}/${version}/${phoneNumberId}/messages`;

  async function request(body) {
    let res;
    try {
      res = await fetchImpl(messagesUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(`WhatsApp POST /messages request failed (network): ${err?.message ?? err}`);
    }
    const parsed = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed);
      throw new Error(`WhatsApp POST /messages failed (${res.status}): ${detail}`);
    }
    return parsed;
  }

  async function sendTemplateMessage(to, templateName, languageCode = 'en_US', components) {
    const recipient = normalizePhone(to);
    if (!recipient) throw new Error('WhatsApp sendTemplateMessage: missing/invalid recipient');
    const template = { name: templateName, language: { code: languageCode } };
    if (components && components.length) template.components = components;
    return request({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template,
    });
  }

  return { configured, request, sendTemplateMessage };
}

export function defaultWhatsappClient(env = process.env) {
  const { token, phoneNumberId } = resolveWhatsappConfig(env);
  return createWhatsappClient({ token, phoneNumberId });
}
