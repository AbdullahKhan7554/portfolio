/**
 * Nova Providers — capability registry (Milestone 19).
 *
 * A read-only lookup so the runtime can QUERY provider features instead of
 * hardcoding assumptions. Provider-agnostic and injectable (DI): the profile
 * table and defaults can be overridden. Reads never throw — an unknown provider
 * or a missing field resolves to `DEFAULT_CAPABILITIES`. No globals, no
 * behavior: this registry only describes providers, it never executes them.
 */
import { PROVIDER_CAPABILITIES, DEFAULT_CAPABILITIES } from './capabilityProfiles';

export class ProviderCapabilityRegistry {
  /**
   * @param {Object} [options]
   * @param {Record<string, object>} [options.profiles]  id → capability metadata (DI)
   * @param {object} [options.defaults]                  baseline for unknown/missing (DI)
   */
  constructor({ profiles = PROVIDER_CAPABILITIES, defaults = DEFAULT_CAPABILITIES } = {}) {
    this._profiles = profiles || {};
    this._defaults = defaults || {};
  }

  /** True if the registry has an explicit profile for this provider id. */
  has(providerId) {
    return Boolean(providerId && this._profiles[providerId]);
  }

  /**
   * Full capabilities for a provider, merged over the defaults. Graceful:
   * unknown provider → defaults; a profile that omits fields → defaults fill them.
   * @param {string} providerId
   * @returns {Readonly<object>}
   */
  get(providerId) {
    const profile = (providerId && this._profiles[providerId]) || {};
    return Object.freeze({ ...this._defaults, ...profile });
  }

  /**
   * A single capability with graceful fallback to the default value.
   * @param {string} providerId
   * @param {string} name
   */
  capability(providerId, name) {
    const caps = this.get(providerId);
    return name in caps ? caps[name] : this._defaults[name];
  }

  /** Ids with an explicit profile. */
  providers() {
    return Object.keys(this._profiles);
  }
}

/** Build a capability registry (DI-friendly). */
export function createProviderCapabilityRegistry(options = {}) {
  return new ProviderCapabilityRegistry(options);
}

/**
 * Convenience read via a fresh (or injected) registry.
 * @param {string} providerId
 * @param {Object} [deps]
 * @param {ProviderCapabilityRegistry} [deps.registry]
 */
export function getProviderCapabilities(providerId, { registry = createProviderCapabilityRegistry() } = {}) {
  return registry.get(providerId);
}
