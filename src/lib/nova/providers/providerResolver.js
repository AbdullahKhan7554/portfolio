/**
 * Nova — provider resolution (PURE, config-driven).
 *
 * The active provider is selected by the `AI_PROVIDER` env var and defaults to
 * NVIDIA NIM when unset or set to an unknown value (so NVIDIA remains the safe
 * default/fallback). Currently selectable: `nvidia` (default) and `groq`.
 * Gemini remains in the codebase (its env entry below is retained for future
 * use) but is intentionally NOT selectable.
 *
 * No secrets are hardcoded: keys are read from the `env` object passed in (the
 * server passes `process.env`), so this stays testable and client-safe.
 */

/** The default active provider when `AI_PROVIDER` is unset/unknown. */
export const DEFAULT_PROVIDER = 'nvidia';

/** Back-compat alias — the default active provider. */
export const ACTIVE_PROVIDER = DEFAULT_PROVIDER;

/** Providers selectable via `AI_PROVIDER`. NVIDIA stays the default/fallback. */
export const SUPPORTED_PROVIDERS = Object.freeze(['nvidia', 'groq']);

/**
 * Env var names + non-secret defaults per provider.
 * NOTE: `gemini` is retained for future use only — it is NOT selectable.
 */
export const PROVIDER_ENV = Object.freeze({
  nvidia: {
    keyVar: 'NVIDIA_API_KEY',
    modelVar: 'NVIDIA_MODEL',
    baseUrlVar: 'NVIDIA_BASE_URL',
    defaultModel: 'meta/llama-3.1-8b-instruct',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
  },
  groq: {
    keyVar: 'GROQ_API_KEY',
    modelVar: 'GROQ_MODEL',
    baseUrlVar: 'GROQ_BASE_URL',
    defaultModel: 'llama-3.1-8b-instant',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
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

/**
 * Select the active provider id from the environment. Reads `AI_PROVIDER`,
 * normalizes it, and falls back to NVIDIA when unset or unknown.
 * @param {Record<string,string|undefined>} [env]
 * @returns {string}
 */
export function resolveActiveProviderId(env = {}) {
  const requested = String(env.AI_PROVIDER || '').trim().toLowerCase();
  return SUPPORTED_PROVIDERS.includes(requested) ? requested : DEFAULT_PROVIDER;
}

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
 * Resolve the active provider selected by `AI_PROVIDER` (defaulting to NVIDIA).
 * If the selected provider's key is missing, returns `ok:false` with the missing
 * env var so the caller can respond gracefully. Selecting the provider does NOT
 * change how it executes — it only chooses which config to read.
 *
 * @param {Record<string,string|undefined>} [env]
 * @returns {{ providerId:string, apiKey:string, model:string, baseUrl:string,
 *            envVar:string, ok:boolean, missing:string[], fallback:boolean }}
 */
export function resolveProviderConfig(env = {}) {
  const cfg = readProvider(resolveActiveProviderId(env), env);
  return cfg.apiKey
    ? { ...cfg, ok: true, missing: [], fallback: false }
    : { ...cfg, ok: false, missing: [cfg.envVar], fallback: false };
}
