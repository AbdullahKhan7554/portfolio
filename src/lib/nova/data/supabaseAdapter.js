/**
 * Nova Data — Supabase adapter. Wraps an INJECTED supabase-js-style client and
 * exposes normalized, READ-ONLY query helpers (SOLID: this is the only file
 * that knows Supabase's query shape). No inserts/updates/deletes — this layer
 * is read-only by design. The client is provided via DI, so a different backend
 * can implement the same helper surface (provider-agnostic).
 */
import { ConnectionError, normalizeError } from './repositoryErrors';
import { repoSuccess, repoFailure } from './repositoryTypes';

export class SupabaseAdapter {
  /**
   * @param {Object} [deps]
   * @param {{ from: Function }} [deps.client]  supabase-js client (injected)
   */
  constructor({ client } = {}) {
    /** @type {{ from: Function } | null} */
    this.client = client ?? null;
  }

  /** Connection validation: the injected client must expose `.from`. */
  validateConnection() {
    const ok = Boolean(this.client) && typeof this.client.from === 'function';
    return { ok, missing: ok ? [] : ['client'] };
  }

  /** @private */
  _requireClient() {
    if (!this.validateConnection().ok) throw new ConnectionError();
    return this.client;
  }

  /**
   * Shared query helper — build a filtered SELECT. @private
   * @param {{ table:string, columns?:string, filters?:object, limit?:number,
   *          offset?:number, orderBy?:{column:string, ascending?:boolean} }} spec
   */
  _buildSelect({ table, columns = '*', filters = {}, limit, offset, orderBy }) {
    let query = this._requireClient().from(table).select(columns, { count: 'exact' });
    for (const [column, value] of Object.entries(filters || {})) {
      query = query.eq(column, value);
    }
    if (orderBy?.column) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending !== false });
    }
    if (typeof limit === 'number') query = query.limit(limit);
    if (typeof offset === 'number' && typeof limit === 'number') {
      query = query.range(offset, offset + limit - 1);
    }
    return query;
  }

  /**
   * Read many rows.
   * @param {{ table:string } & import('./repositoryTypes').QueryOptions} spec
   * @returns {Promise<import('./repositoryTypes').RepositoryResult>}
   */
  async selectMany({ table, columns, filters, limit, offset, orderBy } = {}) {
    try {
      const { data, error, count } = await this._buildSelect({
        table,
        columns,
        filters,
        limit,
        offset,
        orderBy,
      });
      if (error) return repoFailure(normalizeError(error));
      return repoSuccess(data ?? [], { count: count ?? null });
    } catch (e) {
      return repoFailure(normalizeError(e));
    }
  }

  /**
   * Read a single row matching `match` (first row, or null).
   * @param {{ table:string, match?:object, columns?:string }} spec
   * @returns {Promise<import('./repositoryTypes').RepositoryResult>}
   */
  async selectOne({ table, match = {}, columns } = {}) {
    try {
      const { data, error } = await this._buildSelect({ table, columns, filters: match, limit: 1 });
      if (error) return repoFailure(normalizeError(error));
      const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
      return repoSuccess(row);
    } catch (e) {
      return repoFailure(normalizeError(e));
    }
  }

  /**
   * Count rows matching `filters`.
   * @param {{ table:string, filters?:object }} spec
   * @returns {Promise<import('./repositoryTypes').RepositoryResult>}
   */
  async count({ table, filters = {} } = {}) {
    try {
      let query = this._requireClient().from(table).select('*', { count: 'exact', head: true });
      for (const [column, value] of Object.entries(filters || {})) {
        query = query.eq(column, value);
      }
      const { count, error } = await query;
      if (error) return repoFailure(normalizeError(error));
      return repoSuccess(count ?? 0, { count: count ?? 0 });
    } catch (e) {
      return repoFailure(normalizeError(e));
    }
  }
}

/** DI factory. */
export function createSupabaseAdapter({ client } = {}) {
  return new SupabaseAdapter({ client });
}
