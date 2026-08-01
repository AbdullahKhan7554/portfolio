-- Nova — `email_templates` table (descriptive migration of existing live schema).
-- Company-scoped nurture/transactional templates. Depends on: none.
--
-- NOTE (RLS history): this file mirrors the original live state, in which the
-- table carried a public read policy `email_templates_read` (anon + authenticated
-- SELECT of active rows) — a divergence from every other Nova table. That policy is
-- DROPPED by the follow-up security fix `20260802_08_fix_email_templates_rls.sql`,
-- which runs after this file. Net result on a fresh project: RLS enabled with NO
-- policies = service-role-only, like the rest. The `create policy` below is retained
-- only to reproduce the original state before 08 removes it.

create table if not exists public.email_templates (
  id           uuid primary key default gen_random_uuid(),
  company_id   text not null,
  template_key text not null,
  subject      text not null,
  html_body    text not null,
  variables    jsonb not null default '[]'::jsonb,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (company_id, template_key)
);

alter table public.email_templates enable row level security;

create policy email_templates_read on public.email_templates
  for select
  to authenticated, anon
  using (is_active = true);

comment on table public.email_templates is
  'Nova email templates (company-scoped). variables = list of expected placeholder names.';
