# Nova Conversation History — Phase 2 Plan (Persist Transcripts)

## Context

Phase 1 confirmed Nova's chat transcript is **ephemeral**: the client round-trips the full
visible history each turn, the server merges it into a **volatile in-memory** store
(`strategy:'in-memory'`), and nothing reaches Supabase. Only completed **leads** persist. A
server-generated `conversationId` (`conv_<uuidv4>`, `conversationRuntime.js:466/201`) already keys
memory and is stored at lead-completion in `leads.metadata.conversationId`
(`leadWriter.js:93`).

**Decision (Option B):** build a normalized two-table design (`conversations` +
`conversation_messages`), independent of the dormant `SupabaseMemoryAdapter` (left untouched).
Use the existing `conversationId` as `conversations.session_id`, and set `conversations.lead_id`
when `leadWriter.persist()` succeeds. **Link mechanism — chosen: explicit `lead_id` FK** (set at
persist time), not a `metadata->>conversationId` JSON join — it's indexed, simpler for the Phase 3
dashboard query, and matches the doc's schema. Write path is **non-fatal**, mirroring the
HubSpot/WhatsApp pattern.

Token discipline: minimal comments, non-fatal writes only, no extra logging beyond the single
swallowed `console.error`.

## Schema (new migration, service-role/RLS-locked like `leads`)

```sql
create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete set null,
  session_id  text not null unique,          -- the conv_<uuid> conversationId
  company_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create table public.conversation_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  seq             bigint generated always as identity,   -- deterministic ordering
  role            text not null check (role in ('user','assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);
create index on public.conversation_messages (conversation_id, seq);
alter table public.conversations         enable row level security;
alter table public.conversation_messages enable row level security;
-- no policies → service-role only (bypasses RLS), exactly like `leads`
```

**Flags on the schema:**
- `session_id` is **UNIQUE** so the writer can upsert-by-session (PostgREST `merge-duplicates`).
- **`seq` (identity) added** beyond the doc's columns: a single multi-row INSERT gives every row
  the same `now()`, so `created_at` alone can't order user-before-assistant. `seq` guarantees it.
- **`company_id` added** (nullable) — cheap, consistent with other tables, and useful for the
  optional Phase 3 `/dashboard/conversations` drop-off list. Drop it if you'd rather stay minimal.

## New file — `src/lib/nova/data/conversationWriter.js`

Mirror `leadWriter.js` exactly: dependency-free PostgREST via `fetch` + **service-role** key
(`NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`), injectable `fetchImpl`, **no
`server-only`/`@/lib/env`**. Every method is internally try/caught and returns `{ ok, ... }` —
never throws (non-fatal contract).

- `createConversationWriter({ url, apiKey, fetchImpl = fetch })` → `{ configured, ensureConversation, appendMessages, recordTurn, linkLead }`:
  - `ensureConversation(sessionId, companyId, { leadId } = {})` — POST `/rest/v1/conversations` with `Prefer: resolution=merge-duplicates,return=representation`, body `{ session_id, company_id, updated_at: now, ...(leadId && { lead_id: leadId }) }`. On conflict merges only the present columns (so omitting `lead_id` never nulls a previously-set link). Returns `{ ok, id }` (the conversations.id).
  - `appendMessages(conversationId, msgs)` — one POST inserting `msgs.map(m => ({ conversation_id, role: m.role, content: m.content }))` (batch = one round-trip, ordered by `seq`).
  - `recordTurn({ sessionId, companyId, userText, assistantText })` — `ensureConversation` then `appendMessages` with the user + assistant turn (skips empties). This is what the runtime calls per turn.
  - `linkLead({ sessionId, companyId, leadId })` — `ensureConversation(sessionId, companyId, { leadId })`. Order-independent with `recordTurn` thanks to merge-duplicates.
- `getDefaultConversationWriter()` — lazy singleton from `process.env`, mirroring `getDefaultLeadWriter`.

**Why only this turn's two messages (not `merged`):** the DB accumulates one `user` + one
`assistant` row per request across turns; we never re-append prior turns, so no duplication. Tool
messages are intentionally NOT recorded (doc scope = user/assistant only).

## Wiring into `conversationRuntime.js` (non-fatal, post-response)

1. **Signature default** (~`:455`): add `conversationWriter = getDefaultConversationWriter()`.
2. **Lead link** — at `:587`, immediately after `if (result?.ok) { leadSaved = true; … }`, add a
   swallowed `await conversationWriter.linkLead({ sessionId: conversationId, companyId, leadId: result.data?.id })`. (`leadWriter.persist` returns the inserted/deduped row, so `result.data.id` is the `leads.id`.)
3. **Message recording** — pass `conversationWriter` and `userText` into `persistOnComplete` at
   the `:655` call site, and inside its `if (completed && !signal?.aborted)` block (after the
   assistant `safeAppend` at `:280`) call:
   `await conversationWriter.recordTurn({ sessionId: conversationId, companyId, userText, assistantText })`.
   This runs **after** tokens have already streamed to the client, so it never adds user-visible
   latency; the generator's lifetime keeps the request alive server-side until it completes.

All three calls rely on the writer's internal swallow; the runtime treats a failed/omitted write
as a no-op — chat, memory, lead save, HubSpot, and WhatsApp are all unaffected.

## Not in scope (this phase)
- No dashboard UI (Phase 3).
- No touching the `SupabaseMemoryAdapter`, the in-memory strategy, or Nova's conversational logic.
- No recording of `tool` messages; no editing/export.

## Verification (end-to-end)
1. Apply the migration (Supabase MCP `apply_migration`); confirm both tables + RLS via `list_tables`.
2. `npm run build` + `npx eslint src/lib/nova/data/conversationWriter.js src/lib/nova/chat/conversationRuntime.js`.
3. Start the dev server, have a **multi-turn** Nova chat (via the widget or a scripted POST to `/api/nova/chat`, round-tripping `X-Nova-State`). Then query Supabase:
   - `conversations` has one row with `session_id = conv_<uuid>`; `conversation_messages` has the
     turns in order (`order by seq`), roles alternating user/assistant, no tool rows.
   - Complete the lead flow → confirm `conversations.lead_id` now equals the new `leads.id`, and
     `leads.metadata->>conversationId` equals `conversations.session_id`.
4. **Abandon** a conversation (don't complete a lead) → transcript still stored, `lead_id` NULL
   (proves the drop-off case Phase 3's optional list would use).
5. **Non-fatal check:** temporarily point the writer at a bad table/URL → chat still responds
   normally, a single `[Conversation] …` error is logged, no 500.
6. Clean up test rows after (`delete from conversations where session_id like 'conv_%test%'` etc.).
