/**
 * Nova — provider resolution (PURE, config-driven).
 *
 * NVIDIA NIM is the ONLY active provider. Gemini remains in the codebase (its
 * adapter file + the config entry below are retained for future use) but is
 * intentionally NOT selectable and is never resolved, loaded, or initialized.
 * There is deliberately NO fallback to another provider.
 *
 * No secrets are hardcoded: keys are read from the `env` object passed in (the
 * server passes `process.env`), so this stays testable and client-safe.
 */

/** The single active provider. */
export const ACTIVE_PROVIDER = 'nvidia';

/** Providers considered by resolution — only the active one. */
export const SUPPORTED_PROVIDERS = Object.freeze([ACTIVE_PROVIDER]);

/**
 * Env var names + non-secret defaults per provider.
 * NOTE: `gemini` is retained for future use only — it is NOT active. Re-enable
 * it by adding it back to SUPPORTED_PROVIDERS and re-registering its adapter.
 */
export const PROVIDER_ENV = Object.freeze({
  nvidia: {
    keyVar: 'NVIDIA_API_KEY',
    modelVar: 'NVIDIA_MODEL',
    baseUrlVar: 'NVIDIA_BASE_URL',
    defaultModel: 'meta/llama-3.1-8b-instruct',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
  },
  // ── Retained for future use — INACTIVE (not selectable) ──────────────────
  gemini: {
    keyVar: 'GEMINI_API_KEY',
    modelVar: 'GEMINI_MODEL',
    baseUrlVar: 'GEMINI_BASE_URL',
    defaultModel: 'gemini-2.0-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
});

/** Read one provider's config from an env-like object. */
function readProvider(id, env) {
  const meta = PROVIDER_ENV[id];
  if (!meta) return null;
  return {
    providerId: id,
    apiKey: env[meta.keyVar] || '',
    model: env[meta.modelVar] || meta.defaultModel,
    baseUrl: env[meta.baseUrlVar] || meta.defaultBaseUrl,
    envVar: meta.keyVar,
  };
}

/**
 * Resolve the active provider — always NVIDIA. No preference override, no
 * fallback to any other provider. If NVIDIA's key is missing, returns
 * `ok:false` with the missing env var so the caller can respond gracefully.
 *
 * @param {Record<string,string|undefined>} [env]
 * @returns {{ providerId:string, apiKey:string, model:string, baseUrl:string,
 *            envVar:string, ok:boolean, missing:string[], fallback:boolean }}
 */
export function resolveProviderConfig(env = {}) {
  const cfg = readProvider(ACTIVE_PROVIDER, env);
  return cfg.apiKey
    ? { ...cfg, ok: true, missing: [], fallback: false }
    : { ...cfg, ok: false, missing: [cfg.envVar], fallback: false };
}
