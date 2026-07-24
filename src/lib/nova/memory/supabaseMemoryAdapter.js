/**
 * Nova Memory — Supabase adapter. The ONLY place that knows Supabase's query
 * shape (Read / Insert / Update / Delete). A conversation is one row
 * (`id, company_id, messages(json), created_at, updated_at`).
 *
 * READS use the Repository pattern when an (injected) repository is available
 * (e.g. Milestone 7's ConversationRepository), otherwise the injected client.
 * WRITES (upsert/delete) go through the injected client here — never outside
 * this adapter. All errors are normalized.
 */
import { BaseMemoryAdapter } from './baseMemoryAdapter';
import { MemoryConnectionError, normalizeError } from './memoryErrors';
import { createConversation } from './memoryTypes';

const toMs = (value) => {
  if (value == null) return Date.now();
  if (typeof value === 'number') return value;
  const t = Date.parse(value);
  return Number.isNaN(t) ? Date.now() : t;
};

const parseMessages = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export class SupabaseMemoryAdapter extends BaseMemoryAdapter {
  /**
   * @param {Object} [options]
   * @param {{ from:Function }} [options.client]  supabase-js client (DI; required for writes)
   * @param {{ findById:Function, findMany:Function }} [options.repository]  read repository (DI, optional)
   * @param {string} [options.table]
   */
  constructor({ client, repository, table = 'conversations' } = {}) {
    super({ deps: {} });
    this.client = client ?? null;
    this.repository = repository ?? null;
    this.table = table;
  }

  get name() {
    return 'supabase';
  }

  /** @private synchronous connection check (shared by validateConnection). */
  _isConnected() {
    return Boolean(this.client) && typeof this.client.from === 'function';
  }

  async validateConnection() {
    const ok = this._isConnected();
    return { ok, missing: ok ? [] : ['client'] };
  }

  /** @private */
  _requireClient() {
    if (!this._isConnected()) throw new MemoryConnectionError();
    return this.client;
  }

  /** @private row → Conversation */
  _toConversation(row) {
    if (!row) return null;
    return createConversation({
      id: row.id ?? row.conversation_id,
      companyId: row.company_id ?? row.companyId ?? null,
      messages: parseMessages(row.messages),
      createdAt: toMs(row.created_at ?? row.createdAt),
      updatedAt: toMs(row.updated_at ?? row.updatedAt),
    });
  }

  /** @private Conversation → row */
  _toRow(conversation) {
    return {
      id: conversation.id,
      company_id: conversation.companyId,
      messages: conversation.messages,
      created_at: new Date(conversation.createdAt).toISOString(),
      updated_at: new Date(conversation.updatedAt).toISOString(),
    };
  }

  async load(id) {
    try {
      // Repository pattern for reads when available.
      if (this.repository) {
        const res = await this.repository.findById(id);
        if (!res.ok) throw normalizeError(res.error);
        return this._toConversation(res.data);
      }
      const { data, error } = await this._requireClient()
        .from(this.table)
        .select('*')
        .eq('id', id)
        .limit(1);
      if (error) throw normalizeError(error);
      const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
      return this._toConversation(row);
    } catch (e) {
      throw normalizeError(e);
    }
  }

  async save(conversation) {
    try {
      const { data, error } = await this._requireClient()
        .from(this.table)
        .upsert(this._toRow(conversation))
        .select();
      if (error) throw normalizeError(error);
      const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
      return this._toConversation(row) ?? conversation;
    } catch (e) {
      throw normalizeError(e);
    }
  }

  async delete(id) {
    try {
      const { error } = await this._requireClient().from(this.table).delete().eq('id', id);
      if (error) throw normalizeError(error);
      return true;
    } catch (e) {
      throw normalizeError(e);
    }
  }

  async list(companyId) {
    try {
      if (this.repository) {
        const res = await this.repository.findMany({ filters: companyId ? { company_id: companyId } : {} });
        if (!res.ok) throw normalizeError(res.error);
        return (res.data || []).map((row) => this._toConversation(row));
      }
      let query = this._requireClient().from(this.table).select('*');
      if (companyId) query = query.eq('company_id', companyId);
      const { data, error } = await query;
      if (error) throw normalizeError(error);
      return (data || []).map((row) => this._toConversation(row));
    } catch (e) {
      throw normalizeError(e);
    }
  }
}
