/**
 * Nova Data — BaseRepository (Repository Pattern, abstract).
 *
 * Depends on an ADAPTER abstraction (DIP), not on Supabase directly, so the
 * data source is swappable. Exposes READ-ONLY operations only — there are no
 * create/update/delete methods in this layer by design. Holds NO business
 * logic; concrete repositories only declare their table.
 */
import { RepositoryError } from './repositoryErrors';

export class BaseRepository {
  /**
   * @param {Object} deps
   * @param {import('./supabaseAdapter').SupabaseAdapter} deps.adapter  injected adapter
   * @param {string} [deps.table]   table name (concrete repos provide a default)
   * @param {string} [deps.name]    repository name
   */
  constructor({ adapter, table, name } = {}) {
    if (new.target === BaseRepository) {
      throw new TypeError('BaseRepository is abstract; extend it with a concrete repository.');
    }
    if (!adapter) {
      throw new RepositoryError('BaseRepository requires an adapter (dependency injection).');
    }
    this.adapter = adapter;
    this._table = table;
    this._name = name;
  }

  /** Repository name (e.g. 'company'). */
  get name() {
    return this._name;
  }

  /** Table this repository reads from. */
  get table() {
    if (!this._table) {
      throw new RepositoryError(`${this.constructor.name} must define a table.`);
    }
    return this._table;
  }

  /** Connection validation (delegates to the adapter). */
  validate() {
    return this.adapter.validateConnection();
  }

  // ---- READ-ONLY operations (no writes in this layer) --------------------

  /** Find one row by id (default column `id`). */
  findById(id, { column = 'id', columns } = {}) {
    return this.adapter.selectOne({ table: this.table, match: { [column]: id }, columns });
  }

  /** Find the first row matching an equality `match`. */
  findOne(match = {}, { columns } = {}) {
    return this.adapter.selectOne({ table: this.table, match, columns });
  }

  /** Find many rows. */
  findMany({ filters, columns, limit, offset, orderBy } = {}) {
    return this.adapter.selectMany({ table: this.table, filters, columns, limit, offset, orderBy });
  }

  /** Count rows matching `filters`. */
  count(filters = {}) {
    return this.adapter.count({ table: this.table, filters });
  }
}
