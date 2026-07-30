import 'server-only';
import { createAdminClient } from './admin';

/**
 * Fetch the transcript linked to a lead (or null if none). Returns the
 * conversation row plus its messages ordered by `seq`. Server-only (service-role).
 * @param {string} leadId
 */
export async function getConversationByLeadId(leadId) {
  const supabase = createAdminClient();
  const { data: conversation, error: convErr } = await supabase
    .from('conversations')
    .select('id, session_id, created_at')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (convErr) return { conversation: null, messages: [], error: convErr.message };
  if (!conversation) return { conversation: null, messages: [], error: null };

  const { data: messages, error: msgErr } = await supabase
    .from('conversation_messages')
    .select('id, seq, role, content, created_at')
    .eq('conversation_id', conversation.id)
    .order('seq', { ascending: true });
  if (msgErr) return { conversation, messages: [], error: msgErr.message };
  return { conversation, messages: messages ?? [], error: null };
}
