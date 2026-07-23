/**
 * Nova — provider resolution (PURE, provider-agnostic, config-driven).
 *
 * Maps environment variables → the active provider's runtime config. No
 * secrets are hardcoded: it reads them from the `env` object it is given (the
 * server passes `process.env`), so this stays testable and client-safe.
 *
 * Supported providers: Google AI Studio (Gemini) and NVIDIA NIM. Both expose an
 * OpenAI-compatible Chat Completions API, so a single transport serves them.
 */

/** Providers considered when resolving/falling back, in preference order. */
export const SUPPORTED_PROVIDERS = Object.freeze(['gemini', 'nvidia']);

/** Env var names + sane defaults per provider (non-secret defaults only). */
export const PROVIDER_ENV = Object.freeze({
  gemini: {
    keyVar: 'GEMINI_API_KEY',
    modelVar: 'GEMINI_MODEL',
    baseUrlVar: 'GEMINI_BASE_URL',
    // Current supported production default (gemini-1.5-flash is retired / 404s).
    defaultModel: 'gemini-2.0-flash',
    // Official Generative Language API base (native, not OpenAI-compat).
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  nvidia: {
    keyVar: 'NVIDIA_API_KEY',
    modelVar: 'NVIDIA_MODEL',
    baseUrlVar: 'NVIDIA_BASE_URL',
    defaultModel: 'meta/llama-3.1-8b-instruct',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
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
 * Resolve the active provider.
 *  - Honors `preferred` (e.g. NOVA_PROVIDER) first.
 *  - FALLBACK: if the preferred provider has no key, the first other supported
 *    provider that DOES have a key is used.
 *  - If none are configured, returns `ok:false` with the missing env var so the
 *    caller can report a precise root cause (no generic failure).
 *
 * @param {Record<string,string|undefined>} [env]
 * @param {{ preferred?: string }} [options]
 * @returns {{ providerId:string, apiKey:string, model:string, baseUrl:string,
 *            envVar:string, ok:boolean, missing:string[], fallback:boolean }}
 */
export function resolveProviderConfig(env = {}, { preferred } = {}) {
  const usePreferred = preferred && PROVIDER_ENV[preferred];
  const order = usePreferred
    ? [preferred, ...SUPPORTED_PROVIDERS.filter((p) => p !== preferred)]
    : [...SUPPORTED_PROVIDERS];

  for (const id of order) {
    const cfg = readProvider(id, env);
    if (cfg && cfg.apiKey) {
      return { ...cfg, ok: true, missing: [], fallback: usePreferred ? id !== preferred : false };
    }
  }

  const id = usePreferred ? preferred : SUPPORTED_PROVIDERS[0];
  const cfg = readProvider(id, env);
  return { ...cfg, ok: false, missing: [cfg.envVar], fallback: false };
}
