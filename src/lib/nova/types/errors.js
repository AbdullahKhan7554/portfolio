/**
 * Nova — typed error hierarchy. Cross-cutting; imported anywhere a failure must
 * be distinguishable (unimplemented seam vs. bad config vs. validation).
 * No side effects.
 */

/** Base class for every Nova-thrown error. Carries a machine-readable `code`. */
export class NovaError extends Error {
  /** @param {string} message @param {string} [code] */
  constructor(message, code = 'NOVA_ERROR') {
    super(message);
    this.name = 'NovaError';
    this.code = code;
  }
}

/** A seam that a later milestone fills (e.g. provider generation). */
export class NotImplementedError extends NovaError {
  constructor(message = 'Not implemented yet.') {
    super(message, 'NOT_IMPLEMENTED');
    this.name = 'NotImplementedError';
  }
}

/** The requested provider id is not registered in the factory. */
export class ProviderNotFoundError extends NovaError {
  /** @param {string} id @param {string[]} [available] */
  constructor(id, available = []) {
    super(
      `Unknown provider "${id}". Registered: ${available.join(', ') || 'none'}.`,
      'PROVIDER_NOT_FOUND',
    );
    this.name = 'ProviderNotFoundError';
    this.providerId = id;
    this.available = available;
  }
}

/** Provider config is missing required (non-secret) fields. */
export class ProviderConfigError extends NovaError {
  /** @param {string} message @param {string[]} [missing] */
  constructor(message, missing = []) {
    super(message, 'PROVIDER_CONFIG');
    this.name = 'ProviderConfigError';
    this.missing = missing;
  }
}

/** An upstream provider request failed (network, non-2xx, interrupted stream). */
export class ProviderError extends NovaError {
  /** @param {string} providerId @param {string} message @param {{status?:number, detail?:string, cause?:any}} [meta] */
  constructor(providerId, message, meta = {}) {
    super(message, 'PROVIDER_ERROR');
    this.name = 'ProviderError';
    this.providerId = providerId;
    this.status = meta.status;
    this.detail = meta.detail;
    if (meta.cause) this.cause = meta.cause;
  }
}

/** A domain object failed schema validation. */
export class ValidationError extends NovaError {
  /** @param {string} message @param {Array<object>} [issues] */
  constructor(message, issues = []) {
    super(message, 'VALIDATION');
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
