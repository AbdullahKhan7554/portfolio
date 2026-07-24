/**
 * Nova Email — BaseEmailProvider: the adapter contract every email provider MUST
 * implement. This is the direct analogue of src/lib/nova/providers/BaseProvider
 * (Strategy/Adapter + DI): concrete adapters translate Nova's normalized email
 * request into a vendor API call. This base performs NO network I/O and sends
 * NOTHING — unimplemented methods throw so no adapter silently pretends to send.
 */
import { NotImplementedError } from './emailErrors';

/**
 * @typedef {Object} EmailMessage
 * @property {string|string[]} to        Recipient address(es).
 * @property {string} subject
 * @property {string} html               Rendered HTML body.
 * @property {string} [from]             Sender ("Name <addr>" or bare address).
 * @property {string} [replyTo]          Reply-To address.
 *
 * @typedef {Object} EmailSendResult
 * @property {boolean} ok
 * @property {string|null} id            Vendor message id (e.g. Resend message id).
 * @property {string} providerId
 * @property {object} [raw]              Raw vendor response (for debugging).
 */

export class BaseEmailProvider {
  /** @param {Object} [config] provider config: { apiKey, from } injected server-side. */
  constructor(config = {}) {
    if (new.target === BaseEmailProvider) {
      throw new TypeError('BaseEmailProvider is abstract; extend it with a concrete adapter.');
    }
    /** @type {Object} */
    this.config = config;
  }

  /** Stable adapter id, e.g. 'resend'. Concrete adapters must override. */
  get id() {
    throw new NotImplementedError(`${this.constructor.name} must define get id().`);
  }

  /** Human-readable label. Defaults to the id. @returns {string} */
  get label() {
    return this.id;
  }

  /**
   * Validate provider config (does the adapter have what it needs to send?).
   * @returns {{ ok:boolean, missing:string[] }}
   */
  validateConfig() {
    return { ok: true, missing: [] };
  }

  /**
   * Send one email. Implemented by concrete adapters.
   * @param {EmailMessage} _message
   * @returns {Promise<EmailSendResult>}
   */
  // eslint-disable-next-line no-unused-vars
  async send(_message) {
    throw new NotImplementedError(`${this.constructor.name}.send() is not implemented.`);
  }
}
