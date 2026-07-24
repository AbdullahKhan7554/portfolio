/**
 * Nova Router — factory (composition root, DI).
 *
 * Builds a ModelRouter bound to the NVIDIA provider factory and the model
 * registry, with the active model resolved from the environment (NOVA_MODEL).
 * Everything is overridable for tests.
 */
import { createProvider as defaultCreateProvider } from '../providers/providerFactory';
import { ModelRouter } from './modelRouter';
import { registryForProvider } from './modelRegistry';
import { resolveActiveModelId } from './routingConfig';

/**
 * @param {Object} [options]
 * @param {(id:string, config:object)=>object} [options.createProvider]
 * @param {string} [options.providerId]           underlying provider (default 'nvidia')
 * @param {object} [options.providerConfig]        { apiKey, baseUrl }
 * @param {import('./modelRegistry').ModelRegistry} [options.registry]
 * @param {string} [options.activeModelId]         override; else from NOVA_MODEL
 * @returns {ModelRouter}
 */
export function createModelRouter({
  createProvider = defaultCreateProvider,
  providerId = 'nvidia',
  providerConfig = {},
  registry,
  activeModelId,
} = {}) {
  return new ModelRouter({
    createProvider,
    providerId,
    providerConfig,
    // Registry + active model are scoped to the active provider. NVIDIA resolves
    // to the NIM registry/model exactly as before; Groq resolves to its own.
    registry: registry ?? registryForProvider(providerId),
    activeModelId: activeModelId ?? resolveActiveModelId(process.env, providerId),
  });
}
