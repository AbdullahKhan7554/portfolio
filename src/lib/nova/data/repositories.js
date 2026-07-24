/**
 * Nova Data — concrete repositories. Each declares ONLY its repository name and
 * default table (no business logic); all read behavior is inherited from
 * BaseRepository. The table is overridable via the `table` dep (per-tenant).
 */
import { BaseRepository } from './baseRepository';
import { REPOSITORY, DEFAULT_TABLES } from './repositoryTypes';

export class CompanyRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({ adapter, name: REPOSITORY.COMPANY, table: table ?? DEFAULT_TABLES[REPOSITORY.COMPANY] });
  }
}

export class ProductRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({ adapter, name: REPOSITORY.PRODUCT, table: table ?? DEFAULT_TABLES[REPOSITORY.PRODUCT] });
  }
}

export class FAQRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({ adapter, name: REPOSITORY.FAQ, table: table ?? DEFAULT_TABLES[REPOSITORY.FAQ] });
  }
}

export class KnowledgeRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({ adapter, name: REPOSITORY.KNOWLEDGE, table: table ?? DEFAULT_TABLES[REPOSITORY.KNOWLEDGE] });
  }
}

export class LeadRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({ adapter, name: REPOSITORY.LEAD, table: table ?? DEFAULT_TABLES[REPOSITORY.LEAD] });
  }
}

export class ConversationRepository extends BaseRepository {
  constructor({ adapter, table } = {}) {
    super({
      adapter,
      name: REPOSITORY.CONVERSATION,
      table: table ?? DEFAULT_TABLES[REPOSITORY.CONVERSATION],
    });
  }
}

/** name → concrete repository class (used by the factory). */
export const REPOSITORY_CLASSES = Object.freeze({
  [REPOSITORY.COMPANY]: CompanyRepository,
  [REPOSITORY.PRODUCT]: ProductRepository,
  [REPOSITORY.FAQ]: FAQRepository,
  [REPOSITORY.KNOWLEDGE]: KnowledgeRepository,
  [REPOSITORY.LEAD]: LeadRepository,
  [REPOSITORY.CONVERSATION]: ConversationRepository,
});
