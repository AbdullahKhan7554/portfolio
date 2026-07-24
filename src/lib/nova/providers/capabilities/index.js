/**
 * Nova Providers — capability layer (Milestone 19) public API.
 *
 * Informational, provider-agnostic capability metadata + a DI registry the
 * runtime can READ to query provider features. Never changes provider behavior.
 *
 * @example
 *   import { createProviderCapabilityRegistry } from '@/lib/nova/providers/capabilities';
 *   const caps = createProviderCapabilityRegistry().get('nvidia');
 *   caps.supportsStreaming; // true
 */
export { DEFAULT_CAPABILITIES, PROVIDER_CAPABILITIES } from './capabilityProfiles';
export {
  ProviderCapabilityRegistry,
  createProviderCapabilityRegistry,
  getProviderCapabilities,
} from './capabilityRegistry';
