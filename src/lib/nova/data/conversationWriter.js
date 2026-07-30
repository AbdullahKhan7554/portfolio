/**
 * Nova Data — conversation transcript persistence (Phase 2).
 *
 * Writes chat transcripts to the `conversations` + `conversation_messages` tables
 * via Supabase REST (PostgREST) using `fetch` and the SERVICE-ROLE key — the same
 * dependency-free approach as leadWriter. Both tables are RLS-locked to the service
 * role. Every method is internally try/caught and returns a `{ ok, ... }` result;
 * nothing throws, so a write failure never breaks the chat response (non-fatal,
 * mirroring the HubSpot/WhatsApp pattern).
 */
const CONVERSATIONS_TABLE = 'conversations';
const MESSAGES_TABLE = 'conversation_messages';

export function createConversationWriter({ url, apiKey, fetchImpl = fetch } = {}) {
  const base = `${(url || '').replace(/\/$/, '')}/rest/v1`;
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const configured = Boolean(url && apiKey);

  /** Upsert a conversation by session_id; merges only the columns provided. Returns its id. */
  async function ensureConversation(sessionId, companyId, { leadId } = {}) {
    if (!configured || !sessionId) return { ok: false };
    try {
      const row = {
        session_id: sessionId,
        company_id: companyId ?? null,
        updated_at: new Date().toISOString(),
        ...(leadId && { lead_id: leadId }),
      };
      const res = await fetchImpl(
        `${base}/${CONVERSATIONS_TABLE}?on_conflict=session_id`,
        {
          method: 'POST',
          headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify([row]),
        },
      );
      if (!res.ok) return { ok: false };
      const rows = await res.json().catch(() => []);
      const id = Array.isArray(rows) ? rows[0]?.id : rows?.id;
      return id ? { ok: true, id } : { ok: false };
    } catch {
      return { ok: false };
    }
  }

  /** Append messages to a conversation. `msgs` = [{ role, content }]. */
  async function appendMessages(conversationId, msgs = []) {
    if (!configured || !conversationId) return { ok: false };
    const rows = msgs
      .filter((m) => m && m.content)
      .map((m) => ({ conversation_id: conversationId, role: m.role, content: m.content }));
    if (rows.length === 0) return { ok: true };
    try {
      const res = await fetchImpl(`${base}/${MESSAGES_TABLE}`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(rows),
      });
      return { ok: res.ok };
    } catch {
      return { ok: false };
    }
  }

  /** Record one turn: ensure the conversation exists, then append user + assistant. */
  async function recordTurn({ sessionId, companyId, userText, assistantText } = {}) {
    const conv = await ensureConversation(sessionId, companyId);
    if (!conv.ok) return { ok: false };
    return appendMessages(conv.id, [
      { role: 'user', content: userText },
      { role: 'assistant', content: assistantText },
    ]);
  }

  /** Link a completed lead to its conversation (order-independent via upsert). */
  async function linkLead({ sessionId, companyId, leadId } = {}) {
    if (!leadId) return { ok: false };
    return ensureConversation(sessionId, companyId, { leadId });
  }

  return { configured, ensureConversation, appendMessages, recordTurn, linkLead };
}

/** Default conversation writer wired from env (server-side; service-role only). */
export function defaultConversationWriter(env = process.env) {
  return createConversationWriter({
    url: env.NEXT_PUBLIC_SUPABASE_URL || '',
    apiKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
  });
}
