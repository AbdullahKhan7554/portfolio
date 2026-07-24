/**
 * Nova Email — provider factory (composition point for the adapter pattern).
 *
 * Direct analogue of src/lib/nova/providers/providerFactory.js. Maps an adapter
 * id to its class and instantiates it with injected config. The registry is
 * injectable (DI), so hosts can register a second provider (e.g. 'sendgrid')
 * WITHOUT editing this file, and tests can pass a fake. No provider imports
 * another — only the factory knows the full set.
 */
import { ResendProvider } from './resendProvider';
import { EmailProviderNotFoundError } from './emailErrors';

/**
 * Default id → adapter registry. Resend is the only ACTIVE email provider.
 * To add SendGrid later: create sendgridProvider.js implementing
 * BaseEmailProvider, then add a `sendgrid` entry here (or register it at runtime
 * via `registerEmailProvider`) — nothing else in this file changes.
 */
export const defaultEmailProviderRegistry = Object.freeze({
  resend: ResendProvider,
});

/**
 * Instantiate an email provider by id.
 * @param {string} id
 * @param {Object} [config]  injected adapter config ({ apiKey, from })
 * @param {Record<string, typeof import('./baseEmailProvider').BaseEmailProvider>} [registry]
 * @returns {import('./baseEmailProvider').BaseEmailProvider}
 */
export function createEmailProvider(id, config = {}, registry = defaultEmailProviderRegistry) {
  const ProviderClass = registry[id];
  if (!ProviderClass) {
    throw new EmailProviderNotFoundError(id, Object.keys(registry));
  }
  return new ProviderClass(config);
}

/**
 * Extend a registry with a custom adapter (returns a NEW registry; pure).
 * @param {string} id
 * @param {typeof import('./baseEmailProvider').BaseEmailProvider} ProviderClass
 * @param {Record<string, any>} [registry]
 */
export function registerEmailProvider(id, ProviderClass, registry = defaultEmailProviderRegistry) {
  return { ...registry, [id]: ProviderClass };
}

/** List registered adapter ids. @param {Record<string, any>} [registry] */
export function availableEmailProviders(registry = defaultEmailProviderRegistry) {
  return Object.keys(registry);
}
