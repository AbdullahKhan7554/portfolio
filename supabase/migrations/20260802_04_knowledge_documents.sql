-- Nova — `knowledge_documents` table (descriptive migration of live schema).
-- Company-scoped KB documents (CMS-managed via /dashboard/knowledge). RLS enabled
-- with NO policies: service-role only. Additive/idempotent.

create table if not exists public.knowledge_documents (
  id          uuid primary key default gen_random_uuid(),
  company_id  text not null,
  doc_type    text not null,
  title       text not null,
  content     text not null default ''::text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists knowledge_documents_company_type_idx
  on public.knowledge_documents (company_id, doc_type);

alter table public.knowledge_documents enable row level security;

comment on table public.knowledge_documents is
  'Nova KB documents (company-scoped). One row per section; doc_type groups sections into a document.';
