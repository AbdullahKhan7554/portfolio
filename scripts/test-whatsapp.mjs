import { defaultWhatsappClient } from '../src/lib/nova/whatsapp/whatsappCloudClient.js';

// hello_world takes no body params. Recipient must be a test/allowed number that
// has opted in (or your own WhatsApp number in dev). Falls back to the public
// business number if OWNER_WHATSAPP_NUMBER is unset.
const to = process.env.OWNER_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

const client = defaultWhatsappClient();

if (!client.configured) {
  console.log({ ok: false, error: 'not_configured', skipped: true });
} else if (!to) {
  console.log({ ok: false, error: 'missing_recipient' });
} else {
  try {
    const res = await client.sendTemplateMessage(to, 'hello_world', 'en_US');
    console.log({ ok: true, messageId: res?.messages?.[0]?.id, res });
  } catch (err) {
    console.log({ ok: false, error: err?.message ?? String(err) });
  }
}
