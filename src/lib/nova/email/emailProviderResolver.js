/**
 * Nova Email — provider resolution (PURE, config-driven).
 *
 * Analogue of src/lib/nova/providers/providerResolver.js. The active email
 * provider is selected by the `EMAIL_PROVIDER` env var and defaults to Resend
 * when unset/unknown. No secrets are hardcoded: the API key + sender are read
 * from the `env` object passed in (the server passes `process.env`).
 */

/** The default active email provider when `EMAIL_PROVIDER` is unset/unknown. */
export const DEFAULT_EMAIL_PROVIDER = 'resend';

/** Providers selectable via `EMAIL_PROVIDER`. */
export const SUPPORTED_EMAIL_PROVIDERS = Object.freeze(['resend']);

/** Env var names + non-secret defaults per email provider. */
export const EMAIL_PROVIDER_ENV = Object.freeze({
  resend: {
    keyVar: 'RESEND_API_KEY',
    fromVar: 'EMAIL_FROM',
    defaultFrom: 'onboarding@resend.dev',
  },
});

/**
 * Select the active email provider id from the environment.
 * @param {Record<string,string|undefined>} [env]
 * @returns {string}
 */
export function resolveActiveEmailProviderId(env = {}) {
  const requested = String(env.EMAIL_PROVIDER || '').trim().toLowerCase();
  return SUPPORTED_EMAIL_PROVIDERS.includes(requested) ? requested : DEFAULT_EMAIL_PROVIDER;
}

/**
 * Resolve the active email provider's config from an env-like object. If the
 * provider's API key is missing, returns `ok:false` with the missing env var so
 * the caller can respond gracefully.
 *
 * @param {Record<string,string|undefined>} [env]
 * @returns {{ providerId:string, apiKey:string, from:string, envVar:string,
 *            ok:boolean, missing:string[] }}
 */
export function resolveEmailProviderConfig(env = {}) {
  const providerId = resolveActiveEmailProviderId(env);
  const meta = EMAIL_PROVIDER_ENV[providerId];
  const apiKey = env[meta.keyVar] || '';
  const from = env[meta.fromVar] || meta.defaultFrom;
  return {
    providerId,
    apiKey,
    from,
    envVar: meta.keyVar,
    ok: Boolean(apiKey),
    missing: apiKey ? [] : [meta.keyVar],
  };
}
