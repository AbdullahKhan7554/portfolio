/**
 * Nova — BaseProvider: the adapter contract every AI provider MUST implement.
 *
 * This is the seam that makes providers swappable (Strategy/Adapter pattern).
 * Concrete adapters translate Nova's normalized request shape into a vendor SDK
 * call in a LATER milestone. This base performs NO network calls and returns NO
 * responses — unimplemented methods throw so nothing silently mocks an answer.
 */
import { NotImplementedError } from '../types/errors';

/**
 * @typedef {Object} ProviderMessage
 * @property {'system'|'user'|'assistant'} role
 * @property {string} content
 *
 * @typedef {Object} GenerateParams
 * @property {ProviderMessage[]} messages   Normalized, provider-agnostic messages.
 * @property {string} [system]              System prompt text.
 * @property {number} [temperature]
 * @property {number} [maxTokens]
 * @property {AbortSignal} [signal]         Cancellation.
 *
 * @typedef {Object} ProviderCompletion
 * @property {string} content
 * @property {string} finishReason
 * @property {string} providerId
 * @property {{ promptTokens?:number, completionTokens?:number }} [usage]
 *
 * @typedef {Object} ProviderCapabilities
 * @property {boolean} streaming
 * @property {boolean} tools
 * @property {boolean} vision
 */

export class BaseProvider {
  /** @param {Object} [config] non-secret config (model, sampling, baseUrl). */
  constructor(config = {}) {
    if (new.target === BaseProvider) {
      throw new TypeError('BaseProvider is abstract; extend it with a concrete adapter.');
    }
    /** @type {Object} */
    this.config = config;
  }

  /** Stable adapter id, e.g. 'openai'. Concrete adapters must override. */
  get id() {
    throw new NotImplementedError(`${this.constructor.name} must define get id().`);
  }

  /** Human-readable label. Defaults to the id. @returns {string} */
  get label() {
    return this.id;
  }

  /**
   * Feature flags so the engine can adapt behavior per provider.
   * @returns {ProviderCapabilities}
   */
  capabilities() {
    return { streaming: false, tools: false, vision: false };
  }

  /**
   * Validate NON-SECRET config only (secrets are injected server-side later).
   * @returns {{ ok:boolean, missing:string[] }}
   */
  validateConfig() {
    return { ok: true, missing: [] };
  }

  /**
   * Single-shot completion. Implemented by adapters in a later milestone.
   * @param {GenerateParams} _params
   * @returns {Promise<ProviderCompletion>}
   */
  // eslint-disable-next-line no-unused-vars
  async generate(_params) {
    throw new NotImplementedError(
      `${this.constructor.name}.generate() is not implemented yet (Milestone 3).`,
    );
  }

  /**
   * Streaming completion — yields text deltas. Optional per `capabilities()`.
   * @param {GenerateParams} _params
   * @returns {AsyncGenerator<string>}
   */
  // eslint-disable-next-line no-unused-vars, require-yield
  async *stream(_params) {
    throw new NotImplementedError(
      `${this.constructor.name}.stream() is not implemented yet (Milestone 3).`,
    );
  }
}
