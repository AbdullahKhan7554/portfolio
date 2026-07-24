/**
 * Nova Router — model router.
 *
 * Selects the active NIM model and delegates to the underlying NVIDIA provider.
 * Callers (the conversation runtime) only ever call `router.stream(...)` — they
 * never know which model runs. The provider interface is UNCHANGED: the router
 * sets the resolved NIM model on the provider config (`config.model`).
 *
 * Model selection is intentionally trivial for now: it returns the configured
 * active model id (NO scoring, NO auto-routing, NO fallback). The seam for a
 * future routing strategy is `selectModel()`.
 */
import { createProvider as defaultCreateProvider } from '../providers/providerFactory';
import { modelRegistry as defaultRegistry } from './modelRegistry';
import { ProviderError } from '../types/errors';

/**
 * Automatic failover priority for NVIDIA quota/server errors. NOVA_MODEL still
 * determines the FIRST model; on a retryable status the router advances through
 * this list (one attempt per model, never repeated).
 */
const FAILOVER_PRIORITY = [
  'glm-5.2',
  'minimax-m3',
  'deepseek-v4-flash',
  'deepseek-v4-pro',
  'kimi-2.6',
  'nemotron-ultra',
  'qwen-3.6',
];

/** NVIDIA quota/server statuses that trigger failover (auth/config errors do not). */
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export class ModelRouter {
  /**
   * @param {Object} deps
   * @param {(id:string, config:object)=>object} [deps.createProvider]  provider factory (DI)
   * @param {string} [deps.providerId]                                  underlying provider (NVIDIA NIM)
   * @param {object} [deps.providerConfig]                              { apiKey, baseUrl } (model is set by the router)
   * @param {import('./modelRegistry').ModelRegistry} [deps.registry]
   * @param {string} deps.activeModelId                                 resolved from NOVA_MODEL
   */
  constructor({
    createProvider = defaultCreateProvider,
    providerId = 'nvidia',
    providerConfig = {},
    registry = defaultRegistry,
    activeModelId,
  }) {
    this.createProvider = createProvider;
    this.providerId = providerId;
    this.providerConfig = providerConfig;
    this.registry = registry;
    this.activeModelId = activeModelId;
  }

  /** Select the active model id. No routing/scoring — returns the configured id. */
  selectModel() {
    return this.activeModelId;
  }

  /** The resolved registry entry for the active model (or null). */
  getActiveModel() {
    return this.registry.get(this.selectModel());
  }

  /** @private Build an NVIDIA provider configured with the selected NIM model. */
  _provider() {
    const entry = this.getActiveModel();
    if (!entry) {
      throw new ProviderError(
        this.providerId,
        `Unknown model "${this.selectModel()}" — set NOVA_MODEL to a registered model.`,
      );
    }
    // Provider interface unchanged: the model is passed via config.model.
    return this.createProvider(this.providerId, {
      ...this.providerConfig,
      model: entry.nimModel,
    });
  }

  /** Validate readiness (unknown model or missing provider config → not ok). */
  validate() {
    const entry = this.getActiveModel();
    if (!entry) return { ok: false, missing: [`model:${this.selectModel()}`] };
    return this._provider().validateConfig();
  }

  /**
   * @private Ordered model ids to try: the active model first, then the
   * failover priority order (deduped — max one attempt per model).
   */
  _attemptOrder() {
    const order = [this.activeModelId];
    for (const id of FAILOVER_PRIORITY) {
      if (!order.includes(id)) order.push(id);
    }
    return order;
  }

  /**
   * Stream tokens from the active model. Same params as the provider.
   * On an NVIDIA quota/server error (429/500/502/503/504) BEFORE the first
   * token, transparently fails over to the next model in the priority list.
   * Once streaming has started it cannot fail over, so mid-stream errors throw.
   */
  async *stream(params) {
    const order = this._attemptOrder();
    let lastError;
    for (let i = 0; i < order.length; i += 1) {
      const id = order[i];
      const entry = this.registry.get(id);
      if (!entry) continue;
      if (i === 0) console.log(`[Nova Router]\nTrying: ${id}`);
      // Provider interface unchanged: the model is passed via config.model.
      const provider = this.createProvider(this.providerId, {
        ...this.providerConfig,
        model: entry.nimModel,
      });
      let started = false;
      try {
        for await (const chunk of provider.stream(params)) {
          if (!started) {
            started = true;
            console.log(`[Nova Router]\nSuccess using ${id}`);
          }
          yield chunk;
        }
        return;
      } catch (err) {
        // Already streaming → cannot fail over; propagate.
        if (started) throw err;
        if (err instanceof ProviderError && RETRYABLE_STATUS.has(err.status)) {
          lastError = err;
          const next = order[i + 1];
          if (next) console.log(`[Nova Router]\n${err.status} received.\nSwitching to ${next}`);
          continue;
        }
        // Non-retryable (400/401/403/404, network, abort) → throw the original error.
        throw err;
      }
    }
    console.log('[Nova Router]\nAll NVIDIA models exhausted.');
    throw lastError;
  }

  /**
   * Single-shot completion from the active model. Applies the SAME failover as
   * `stream()` — retryable NVIDIA errors advance to the next priority model.
   */
  async generate(params) {
    const order = this._attemptOrder();
    let lastError;
    for (let i = 0; i < order.length; i += 1) {
      const id = order[i];
      const entry = this.registry.get(id);
      if (!entry) continue;
      if (i === 0) console.log(`[Nova Router]\nTrying: ${id}`);
      const provider = this.createProvider(this.providerId, {
        ...this.providerConfig,
        model: entry.nimModel,
      });
      try {
        const result = await provider.generate(params);
        console.log(`[Nova Router]\nSuccess using ${id}`);
        return result;
      } catch (err) {
        if (err instanceof ProviderError && RETRYABLE_STATUS.has(err.status)) {
          lastError = err;
          const next = order[i + 1];
          if (next) console.log(`[Nova Router]\n${err.status} received.\nSwitching to ${next}`);
          continue;
        }
        throw err;
      }
    }
    console.log('[Nova Router]\nAll NVIDIA models exhausted.');
    throw lastError;
  }
}
