/**
 * Nova Router — routing configuration (CONFIG, not logic).
 *
 * The active model is chosen by `NOVA_MODEL`; changing that env var switches
 * models with NO code change. When unset, the default (GLM 5.2) is used.
 *
 * There is intentionally NO automatic routing, scoring, or fallback here — the
 * strategy is 'static' (always the configured model). Those are future work.
 */
import { registryForProvider } from './modelRegistry';

/** Default Nova model id (GLM 5.2). */
export const DEFAULT_MODEL_ID = 'glm-5.2';

/**
 * Default model id per provider. NVIDIA keeps GLM 5.2; Groq defaults to its own
 * fast Llama 3.1 8B variant. Providers not listed fall back to DEFAULT_MODEL_ID.
 */
export const PROVIDER_DEFAULT_MODEL_ID = Object.freeze({
  nvidia: DEFAULT_MODEL_ID,
  groq: 'llama-3.1-8b-instant',
});

/**
 * Resolve the active model id from an env-like object, scoped to the active
 * provider. NVIDIA behavior is byte-identical to before: `NOVA_MODEL` (or the
 * default). For other providers, `NOVA_MODEL` is honored ONLY when it names a
 * model that provider actually serves — otherwise the provider's own default is
 * used, so an NVIDIA-only `NOVA_MODEL` never leaks onto e.g. Groq.
 * @param {Record<string,string|undefined>} [env]
 * @param {string} [providerId]
 * @returns {string}
 */
export function resolveActiveModelId(env = {}, providerId = 'nvidia') {
  // NVIDIA path unchanged (exact original expression).
  if (providerId === 'nvidia') return env.NOVA_MODEL || DEFAULT_MODEL_ID;

  const registry = registryForProvider(providerId);
  const requested = env.NOVA_MODEL;
  if (requested && registry.has(requested)) return requested;
  return PROVIDER_DEFAULT_MODEL_ID[providerId] ?? DEFAULT_MODEL_ID;
}

export const routingConfig = Object.freeze({
  defaultModel: DEFAULT_MODEL_ID,
  /** 'static' = always the configured model. (auto-routing = future work) */
  strategy: 'static',
});
