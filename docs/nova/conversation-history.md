# Nova — Conversation History

Context: Next.js 15 project. Nova's conversation state currently lives in `conversationRuntime.js` per session — need to confirm whether/how it's persisted vs ephemeral. Goal: store full chat transcripts, link them to their `leads` row, and view them in the dashboard.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 1 — Investigate + Report (no code changes)

1. Trace how conversation state currently flows: is the message history (`merged`, per earlier findings in this project) persisted anywhere (Supabase, cookie, in-memory only), or does it only exist for the duration of a request/session?
2. If there's an existing `conversations` or `messages` table, report its schema. If not, confirm none exists.
3. Report how a conversation currently links (or could link) to a `leads` row — is there a session/conversation ID already generated and available at lead-completion time?
4. Report findings only — do NOT write code. STOP for direction before Phase 2.

---

## Phase 2 — Persist Transcripts (scope depends on Phase 1 findings)

Likely shape (confirm/adjust per Phase 1 findings before building):
1. New `conversations` table: `id` (uuid pk), `lead_id` (nullable fk to `leads.id` — nullable because a conversation may never complete into a lead), `session_id` (text, the existing session identifier if one exists), `created_at`, `updated_at`.
2. New `conversation_messages` table: `id`, `conversation_id` (fk), `role` (`user`/`assistant`), `content` (text), `created_at`.
3. Both RLS-locked to service-role, mirroring `leads`.
4. Write path: append each user/assistant turn to `conversation_messages` from within the existing chat route handler (`/api/nova/chat`) or `conversationRuntime.js` — non-blocking/non-fatal, must never break the chat response if the write fails (mirror the HubSpot/WhatsApp non-fatal pattern).
5. When a lead completes (`leadSaved=true`), set `conversations.lead_id` to link the transcript to the lead.

STOP after Phase 2 for review.

---

## Phase 3 — Dashboard View

1. On the lead detail page (`/dashboard/leads/[id]`), add a "Conversation" section showing the full transcript (chat-bubble style, user vs assistant, chronological) if one is linked.
2. If no linked conversation exists (e.g. old leads from before this feature), show nothing / a simple "No transcript available" note — no error.
3. Optional: a standalone `/dashboard/conversations` list for transcripts that never became leads (drop-offs) — flag this as an addition beyond the core scope, build only if Phase 1/2 findings make it easy.

STOP after Phase 3 for review — full test: have a real Nova conversation (complete or abandon it), confirm the transcript is stored and viewable in the dashboard.

---

## Not in scope
- No editing/redacting of stored transcripts from the UI.
- No transcript export (PDF/CSV) — future phase if needed.
- No changes to Nova's actual conversational logic — this is read/write persistence only.
