-- Nova — `faqs` table (descriptive migration of existing live schema).
-- Company-scoped KB FAQs (CMS-managed via /dashboard/knowledge). RLS enabled with
-- NO policies: service-role only. Additive/idempotent.

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  company_id  text not null,
  question    text not null,
  answer      text not null default ''::text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists faqs_company_idx on public.faqs (company_id);

alter table public.faqs enable row level security;

comment on table public.faqs is 'Nova KB FAQs (company-scoped).';
