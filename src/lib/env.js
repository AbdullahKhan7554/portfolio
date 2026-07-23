/**
 * Server-only environment access. Import this ONLY from server code
 * (Route Handlers, Server Actions, server components) — never from a
 * "use client" module, or the secrets could be bundled to the browser.
 *
 * Validated lazily so a missing secret degrades gracefully (the contact form
 * falls back to WhatsApp) instead of crashing the build.
 */
import 'server-only';
import { resolveProviderConfig } from '@/lib/nova/providers/providerResolver';

export const serverEnv = {
  resendApiKey: process.env.RESEND_API_KEY || '',
  contactFromEmail:
    process.env.CONTACT_FROM_EMAIL || 'Avenix Studio <onboarding@resend.dev>',
  contactToEmail: process.env.CONTACT_TO_EMAIL || 'abdullahqayyum1041@gmail.com',
};

/** True when transactional email is fully configured. */
export const isEmailConfigured = Boolean(serverEnv.resendApiKey);

/**
 * Resolve the ACTIVE Nova AI provider from the environment (server-only, so
 * keys never reach the client). NVIDIA NIM is the only active provider — there
 * is no provider selection and no fallback. Returns `{ ok, providerId, apiKey,
 * model, baseUrl, missing, fallback }`.
 */
export function resolveActiveProvider() {
  return resolveProviderConfig(process.env);
}

/** True when the active provider has its required key configured. */
export function isProviderConfigured() {
  return resolveActiveProvider().ok;
}
