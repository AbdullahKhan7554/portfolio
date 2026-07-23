/**
 * Nova Router — routing configuration (CONFIG, not logic).
 *
 * The active model is chosen by `NOVA_MODEL`; changing that env var switches
 * models with NO code change. When unset, the default (GLM 5.2) is used.
 *
 * There is intentionally NO automatic routing, scoring, or fallback here — the
 * strategy is 'static' (always the configured model). Those are future work.
 */

/** Default Nova model id (GLM 5.2). */
export const DEFAULT_MODEL_ID = 'glm-5.2';

/**
 * Resolve the active model id from an env-like object.
 * @param {Record<string,string|undefined>} [env]
 * @returns {string}
 */
export function resolveActiveModelId(env = {}) {
  return env.NOVA_MODEL || DEFAULT_MODEL_ID;
}

export const routingConfig = Object.freeze({
  defaultModel: DEFAULT_MODEL_ID,
  /** 'static' = always the configured model. (auto-routing = future work) */
  strategy: 'static',
});
