-- Nova — `conversation_messages` table (descriptive migration of live schema).
-- Ordered messages per conversation (seq assigned by the app, not the DB). FK to
-- conversations (cascade delete). RLS enabled with NO policies: service-role only.
-- Depends on: conversations.

create table if not exists public.conversation_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  seq             bigint not null,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

create index if not exists conversation_messages_conversation_id_seq_idx
  on public.conversation_messages (conversation_id, seq);

alter table public.conversation_messages enable row level security;
