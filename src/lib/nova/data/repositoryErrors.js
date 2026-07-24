/**
 * Nova Data — typed error hierarchy + normalization (self-contained).
 *
 * `normalizeError` maps any thrown value (including a Supabase `{ message, code,
 * details, hint }` error) into a RepositoryError, so callers never see raw
 * vendor error shapes (provider-agnostic error normalization).
 */

export class RepositoryError extends Error {
  /** @param {string} message @param {string} [code] @param {{details?:any, cause?:any}} [meta] */
  constructor(message, code = 'REPOSITORY_ERROR', meta = {}) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.details = meta.details;
    if (meta.cause) this.cause = meta.cause;
  }
}

/** The adapter has no usable connection/client. */
export class ConnectionError extends RepositoryError {
  constructor(message = 'Repository adapter is not connected.', meta = {}) {
    super(message, 'REPOSITORY_CONNECTION', meta);
    this.name = 'ConnectionError';
  }
}

/** A read query failed. */
export class QueryError extends RepositoryError {
  constructor(message, meta = {}) {
    super(message, 'REPOSITORY_QUERY', meta);
    this.name = 'QueryError';
  }
}

/** A required row was not found. */
export class NotFoundError extends RepositoryError {
  /** @param {string} entity @param {{details?:any}} [meta] */
  constructor(entity, meta = {}) {
    super(`${entity} not found.`, 'REPOSITORY_NOT_FOUND', meta);
    this.name = 'NotFoundError';
    this.entity = entity;
  }
}

/**
 * Normalize an unknown error (or a Supabase error object) into a RepositoryError.
 * @param {unknown} err
 * @returns {RepositoryError}
 */
export function normalizeError(err) {
  if (err instanceof RepositoryError) return err;
  if (err && typeof err === 'object') {
    const message = err.message || err.error || 'Query failed.';
    return new QueryError(message, { details: err.details ?? err.hint ?? err.code, cause: err });
  }
  return new QueryError(String(err));
}
