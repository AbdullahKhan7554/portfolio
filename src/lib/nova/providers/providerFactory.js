/**
 * Nova — provider factory (composition point for the adapter pattern).
 *
 * Maps an adapter id to its class and instantiates it with injected config.
 * The registry is injectable (dependency injection), so hosts can register
 * custom providers without editing this file, and tests can pass a fake.
 * No provider imports another — only the factory knows the full set.
 */
import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { GeminiProvider } from './geminiProvider';
import { LocalProvider } from './localProvider';
import { ProviderNotFoundError } from '../types/errors';

/** Default id → adapter registry. */
export const defaultProviderRegistry = Object.freeze({
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  gemini: GeminiProvider,
  local: LocalProvider,
});

/**
 * Instantiate a provider by id.
 * @param {string} id
 * @param {Object} [config]                              non-secret adapter config
 * @param {Record<string, typeof import('./baseProvider').BaseProvider>} [registry]
 * @returns {import('./baseProvider').BaseProvider}
 */
export function createProvider(id, config = {}, registry = defaultProviderRegistry) {
  const ProviderClass = registry[id];
  if (!ProviderClass) {
    throw new ProviderNotFoundError(id, Object.keys(registry));
  }
  return new ProviderClass(config);
}

/**
 * Extend a registry with a custom adapter (returns a new registry; pure).
 * @param {string} id
 * @param {typeof import('./baseProvider').BaseProvider} ProviderClass
 * @param {Record<string, any>} [registry]
 */
export function registerProvider(id, ProviderClass, registry = defaultProviderRegistry) {
  return { ...registry, [id]: ProviderClass };
}

/** List registered adapter ids. @param {Record<string, any>} [registry] */
export function availableProviders(registry = defaultProviderRegistry) {
  return Object.keys(registry);
}
