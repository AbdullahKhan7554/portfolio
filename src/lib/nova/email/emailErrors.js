/**
 * Nova Email — typed error hierarchy for the email module. Reuses the shared
 * NovaError base (src/lib/nova/types/errors) so email failures are catchable
 * alongside the rest of Nova, while keeping the email-specific error types local
 * to this standalone module.
 */
import { NovaError, NotImplementedError } from '../types/errors';

export { NotImplementedError };

/** Email provider config is missing required (secret) fields, e.g. the API key. */
export class EmailConfigError extends NovaError {
  /** @param {string} message @param {string[]} [missing] */
  constructor(message, missing = []) {
    super(message, 'EMAIL_CONFIG');
    this.name = 'EmailConfigError';
    this.missing = missing;
  }
}

/** The requested email provider id is not registered in the factory. */
export class EmailProviderNotFoundError extends NovaError {
  /** @param {string} id @param {string[]} [available] */
  constructor(id, available = []) {
    super(
      `Unknown email provider "${id}". Registered: ${available.join(', ') || 'none'}.`,
      'EMAIL_PROVIDER_NOT_FOUND',
    );
    this.name = 'EmailProviderNotFoundError';
    this.providerId = id;
    this.available = available;
  }
}

/** An upstream email send failed (network, non-2xx from the vendor API). */
export class EmailSendError extends NovaError {
  /** @param {string} providerId @param {string} message @param {{status?:number, detail?:string, cause?:any}} [meta] */
  constructor(providerId, message, meta = {}) {
    super(message, 'EMAIL_SEND');
    this.name = 'EmailSendError';
    this.providerId = providerId;
    this.status = meta.status;
    this.detail = meta.detail;
    if (meta.cause) this.cause = meta.cause;
  }
}

/** No active template matched the given company + template key. */
export class TemplateNotFoundError extends NovaError {
  /** @param {string} companyId @param {string} templateKey */
  constructor(companyId, templateKey) {
    super(
      `No active email template "${templateKey}" for company "${companyId}".`,
      'EMAIL_TEMPLATE_NOT_FOUND',
    );
    this.name = 'TemplateNotFoundError';
    this.companyId = companyId;
    this.templateKey = templateKey;
  }
}
