/**
 * Nova Data — repository registry. Holds repository instances keyed by name.
 * Single responsibility: registration/lookup. No I/O, no queries.
 */
export class RepositoryRegistry {
  constructor() {
    /** @type {Map<string, import('./baseRepository').BaseRepository>} */
    this._repos = new Map();
  }

  register(repo) {
    if (!repo?.name) throw new Error('RepositoryRegistry.register: repository requires a name.');
    if (this._repos.has(repo.name)) {
      throw new Error(`Repository "${repo.name}" is already registered.`);
    }
    this._repos.set(repo.name, repo);
    return repo;
  }

  get(name) {
    return this._repos.get(name) ?? null;
  }

  has(name) {
    return this._repos.has(name);
  }

  require(name) {
    const repo = this.get(name);
    if (!repo) throw new Error(`Unknown repository "${name}". Registered: ${this.names().join(', ') || 'none'}.`);
    return repo;
  }

  list() {
    return [...this._repos.values()];
  }

  names() {
    return [...this._repos.keys()];
  }

  /** Aggregate connection validation across all repositories. */
  validateAll() {
    return this.list().map((repo) => ({ name: repo.name, ...repo.validate() }));
  }
}

/** DI factory: build a registry seeded with repository instances. */
export function createRepositoryRegistry(repos = []) {
  const registry = new RepositoryRegistry();
  for (const repo of repos) registry.register(repo);
  return registry;
}
