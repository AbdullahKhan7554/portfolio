/**
 * Nova Memory — typed errors + normalization (self-contained). `normalizeError`
 * maps any thrown value (including a Supabase error) into a MemoryError so the
 * service never leaks vendor error shapes and never crashes the runtime.
 */

export class MemoryError extends Error {
  constructor(message, code = 'MEMORY_ERROR', meta = {}) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.details = meta.details;
    if (meta.cause) this.cause = meta.cause;
  }
}

/** The adapter has no usable connection/client. */
export class MemoryConnectionError extends MemoryError {
  constructor(message = 'Memory adapter is not connected.', meta = {}) {
    super(message, 'MEMORY_CONNECTION', meta);
    this.name = 'MemoryConnectionError';
  }
}

/** A conversation was not found. */
export class MemoryNotFoundError extends MemoryError {
  constructor(conversationId, meta = {}) {
    super(`Conversation "${conversationId}" not found.`, 'MEMORY_NOT_FOUND', meta);
    this.name = 'MemoryNotFoundError';
    this.conversationId = conversationId;
  }
}

/** A backend/adapter operation failed. */
export class MemoryAdapterError extends MemoryError {
  constructor(message, meta = {}) {
    super(message, 'MEMORY_ADAPTER', meta);
    this.name = 'MemoryAdapterError';
  }
}

/**
 * Normalize any error into a MemoryError.
 * @param {unknown} err
 * @returns {MemoryError}
 */
export function normalizeError(err) {
  if (err instanceof MemoryError) return err;
  if (err && typeof err === 'object') {
    const message = err.message || err.error || 'Memory operation failed.';
    return new MemoryAdapterError(message, { details: err.details ?? err.hint ?? err.code, cause: err });
  }
  return new MemoryAdapterError(String(err));
}
