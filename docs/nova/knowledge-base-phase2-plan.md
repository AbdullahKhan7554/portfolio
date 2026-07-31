# Nova Knowledge Base — Phase 2 Plan (Schema + Seed)

Scope of this phase: **create the two Supabase tables the read layer already expects and seed
them from `src/knowledge/avenix/*.md`.** This is the prerequisite that switches Nova from
ungrounded to grounded. Write layer (`knowledgeBase.js`) and dashboard CMS are Phase 3.

**Status: awaiting review. No code written, no migration applied yet.**

## Why this phase first

Per Phase 1: the tables don't exist, so Nova runs ungrounded. Creating + seeding these tables
activates grounding immediately (read/retrieval stack already works; 60s cache TTL), with **zero
changes to the chat path** — a clean, low-risk first step that's independently verifiable.

## 1. Tables (DDL) — applied via `apply_migration`

Column names are dictated by `knowledge/supabaseKnowledgeSource.js` (`doc_type`, `title`,
`content`; `question`, `answer`) and the repo filter (`company_id`). Mirror the `leads` security
model: RLS enabled, no public policies, service-role only.

```sql
-- knowledge_documents
create table public.knowledge_documents (
  id          uuid primary key default gen_random_uuid(),
  company_id  text not null,
  doc_type    text not null,          -- company|services|pricing|portfolio|process|technologies
  title       text not null,
  content     text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index knowledge_documents_company_type_idx
  on public.knowledge_documents (company_id, doc_type);
alter table public.knowledge_documents enable row level security;
comment on table public.knowledge_documents is
  'Nova KB documents (company-scoped). One row per section; doc_type groups sections into a document.';

-- faqs
create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  company_id  text not null,
  question    text not null,
  answer      text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index faqs_company_idx on public.faqs (company_id);
alter table public.faqs enable row level security;
comment on table public.faqs is 'Nova KB FAQs (company-scoped).';
```

Notes:
- No policies added → matches `leads`/`conversations` (service-role bypasses RLS).
- `is_active` is included now so Phase 3's toggle and the planned retrieval filter have a column
  to target. The read layer ignores it until the `is_active` filter is added (Phase 3/4).
- `updated_at` auto-update trigger is deferred to Phase 3 (the write layer sets it explicitly,
  exactly as `leads.js updateLeadStatus` sets `updated_at` in code).

## 2. Seed — one row per `##` section (preserves retrieval granularity)

The search index is built **per section** (`knowledge/search.js buildSearchIndex` iterates
`doc.sections`). Seeding one row per `##` heading — `title`/`question` = heading text,
`content`/`answer` = section body — reproduces the current file structure exactly after
`supabaseKnowledgeSource` re-wraps rows as `## title\ncontent` and the parser re-splits them.

Exact rows extracted from `src/knowledge/avenix/*.md` (all `company_id = 'avenix'`, `is_active = true`):

**`knowledge_documents` — 28 rows**

| doc_type | titles (one row each) | rows |
|---|---|---|
| company | Overview; Mission; Who We Help; Location & Availability; Contact | 5 |
| services | Launch; Business Website; Web Application; Ongoing Support | 4 |
| pricing | How Pricing Works; Indicative Starting Points; What Affects Price; Payment Terms | 4 |
| process | 1. Discover; 2. Design; 3. Build; 4. Harden; 5. Launch | 5 |
| portfolio | Voila — Luxury Skincare; Builtu Gym; Scissors VIP Salon; Smile Heaven Dental; Xtreme Fitness; More Work | 6 |
| technologies | Frontend; Backend; Infrastructure & Tooling; Specialties | 4 |

**`faqs` — 6 rows**: How long does a project take? / How much does a website cost? / Do you
offer revisions? / What do you need from us? / Do you work with international clients? / How do
we get started?

`content`/`answer` values are copied **verbatim** from the markdown (bullet lists preserved as
`-` lines — the parser's `extractListItems` handles them). No content invented or edited.

Pricing note: `pricing` rows and the "How much does a website cost?" FAQ contain dollar figures
("from $300", "from $700"). This is intentional internal-reference content; the hardcoded pricing
guardrail (`systemPromptBuilder.js`) already prevents Nova from quoting them.

Seed method: a single idempotent SQL insert via `apply_migration` (or `execute_sql`), guarded so
re-running doesn't duplicate (e.g. `delete from ... where company_id='avenix'` before insert, or
`on conflict` — decide at execution; simplest is delete-then-insert scoped to `company_id='avenix'`).

## 3. Verification (end of Phase 2)

1. `list_tables` → `knowledge_documents` (28 rows) and `faqs` (6 rows) present.
2. `execute_sql` row counts per `doc_type` match the table above.
3. Grounding smoke test (no deploy): in a Nova chat, ask "What services do you offer?" and
   "How long does a project take?" — responses should now reflect the seeded Launch/Business
   Website/Web App services and the 2–4 week timeline, i.e. grounded, not generic.
4. Confirm the pricing guardrail still holds: ask "How much for a website?" → Nova must **not**
   quote $300/$700, but explain fixed-quote-after-scoping.

## 4. Out of scope for Phase 2 (→ Phase 3/4)

- `src/lib/supabase/knowledgeBase.js` CRUD write layer.
- `/dashboard/knowledge` CMS + nav item.
- The `is_active: true` filter in `supabaseKnowledgeSource.js` findMany calls (decided; applied
  when the toggle exists so inactive rows are excluded from retrieval).
- `updated_at` trigger / any read-path changes beyond the above.

## Open question before execution

Seed idempotency: OK to use **delete-then-insert scoped to `company_id='avenix'`** for the seed
(safe, repeatable, only touches Avenix rows)? If you'd prefer a non-destructive `on conflict`
upsert, that needs a natural unique key (e.g. `unique(company_id, doc_type, title)`) added to the DDL.
