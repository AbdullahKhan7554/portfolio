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

  /** Stream tokens from the active model. Same params as the provider. */
  stream(params) {
    return this._provider().stream(params);
  }

  /** Single-shot completion from the active model. */
  generate(params) {
    return this._provider().generate(params);
  }
}
