-- Nova white-label — Unit 2: sales-packages CMS.
-- Company-scoped catalog table backing the sales package registry. Mirrors the
-- `knowledge_documents` security model: RLS enabled with NO policies, so only the
-- service-role key (dashboard admin client) can read/write it.

create table if not exists public.sales_packages (
  id                uuid primary key default gen_random_uuid(),
  company_id        text not null,
  package_id        text not null,
  name              text not null,
  short_description text not null default '',
  target_audience   text not null default '',
  recommended_for   text[] not null default '{}',
  features          text[] not null default '{}',
  starting_price    numeric,
  currency          text not null default 'USD',
  cta               text not null default 'Learn more',
  display_order     integer not null default 0,
  industry          text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (company_id, package_id)
);

create index if not exists sales_packages_company_order_idx
  on public.sales_packages (company_id, display_order);

alter table public.sales_packages enable row level security;
