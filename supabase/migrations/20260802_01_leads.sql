-- Nova — `leads` table (descriptive migration of existing live schema).
-- Company-scoped captured leads (PII). RLS enabled with NO policies: reachable
-- only via the service-role key (see src/lib/supabase/admin.js / leadWriter.js).
-- This migration documents schema already present in production; it is additive
-- and idempotent (safe to run against an empty project).

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  company_id          text not null,
  full_name           text,
  email               text,
  phone               text,
  project_description text,
  budget              text,
  timeline            text,
  status              text not null default 'new'
                        check (status in ('new', 'contacted', 'won', 'lost')),
  source              text not null default 'chatbot',
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  hubspot_synced      boolean not null default false,
  status_changed_at   timestamptz
);

create index if not exists leads_company_created_idx
  on public.leads (company_id, created_at);

alter table public.leads enable row level security;

comment on table public.leads is
  'Nova captured leads (company-scoped, PII). metadata holds extra captured fields (e.g. conversationId, companyName).';
