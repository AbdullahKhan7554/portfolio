/**
 * Server-only environment access. Import this ONLY from server code
 * (Route Handlers, Server Actions, server components) — never from a
 * "use client" module, or the secrets could be bundled to the browser.
 *
 * Validated lazily so a missing secret degrades gracefully (the contact form
 * falls back to WhatsApp) instead of crashing the build.
 */
import 'server-only';

export const serverEnv = {
  resendApiKey: process.env.RESEND_API_KEY || '',
  contactFromEmail:
    process.env.CONTACT_FROM_EMAIL || 'Avenix Studio <onboarding@resend.dev>',
  contactToEmail: process.env.CONTACT_TO_EMAIL || 'abdullahqayyum1041@gmail.com',

  // --- Nova AI (server-only; never exposed to the client) ------------------
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
};

/** True when transactional email is fully configured. */
export const isEmailConfigured = Boolean(serverEnv.resendApiKey);

/** True when the OpenAI provider has a key and can serve Nova responses. */
export const isOpenAIConfigured = Boolean(serverEnv.openaiApiKey);
