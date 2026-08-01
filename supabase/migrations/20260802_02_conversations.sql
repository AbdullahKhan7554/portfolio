-- Nova — `conversations` table (descriptive migration of existing live schema).
-- One row per chat session. FK to leads (set null on lead delete). RLS enabled
-- with NO policies: service-role access only. Depends on: leads.

create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete set null,
  session_id  text not null unique,
  company_id  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.conversations enable row level security;
