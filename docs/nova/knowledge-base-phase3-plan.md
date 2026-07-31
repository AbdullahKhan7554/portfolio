# Nova Knowledge Base — Phase 3 Plan (CRUD Write Layer + Dashboard CMS)

Scope: let Abdullah edit Nova's knowledge from the dashboard with **zero deploy**. Build the
write layer, the `/dashboard/knowledge` CMS, the nav item, and the retrieval hint in the form —
adjusted for the **two-table** reality (`knowledge_documents` + `faqs`), reusing the leads
dashboard patterns exactly.

**Status: plan only. No code written yet.**

## Context

Phases 1–2 established: Nova reads knowledge from Supabase (`knowledge_documents`, `faqs`),
grounding is wired and confirmed, but the data layer is **read-only** and there is **no editor**.
Editing today means hand-writing SQL. Phase 3 closes that: a service-role write module + a
dashboard CMS mirroring the existing Leads screens. Single tenant — `companyId` comes from
`novaConfig.companyId` (`'avenix'`, `src/config/nova.config.js`).

## Design decisions

- **Two tabs, not a merged list** (decided). `/dashboard/knowledge` shows **Documents | FAQs** tabs
  (via `?tab=documents|faqs`, default `documents`). Documents tab columns: Type · Title · Active ·
  Updated. FAQs tab columns: Question · Active · Updated. Each tab lists one table with its own
  fields — no normalization/merge needed.
- **Routing carries the kind** so lookups are unambiguous (a UUID only lives in one table):
  - `/dashboard/knowledge` — list + filters
  - `/dashboard/knowledge/new?kind=document|faq` — create
  - `/dashboard/knowledge/[kind]/[id]` — edit (`kind` ∈ `document|faq`; `notFound()` otherwise)
- **Auth is already handled** by `src/app/dashboard/layout.jsx` (redirects unauthenticated users);
  new routes inherit it. Every page gets `export const dynamic = 'force-dynamic'`.
- **Styling/patterns are copied** from the leads screens — same CSS vars (`--surface`, `--border`,
  `--accent`, `--radius-md`, etc.), same table-on-desktop / cards-on-mobile, same GET filter form,
  same Server-Action + `revalidatePath` mutation flow.
- **Toggle = soft (`is_active`), Delete = hard.** Inactive rows stay editable/reactivatable.

## Files

### New

**`src/lib/supabase/knowledgeBase.js`** — server-only, service-role via `createAdminClient()`
(mirrors `src/lib/supabase/leads.js`). All functions return `{ ...data, error }` or `{ ok, error }`.
Company-scoped, defaulting to `novaConfig.companyId`. Sets `updated_at` explicitly on writes (as
`leads.js` does). Functions:
- `listDocuments({ docType, search, activeOnly })` and `listFaqs({ search, activeOnly })` →
  rows sorted by `updated_at` desc. One per tab; no merge.
- Documents: `getDocument(id)`, `createDocument({ docType, title, content, isActive })`,
  `updateDocument(id, {...})`, `deleteDocument(id)`, `setDocumentActive(id, isActive)`.
- FAQs: `getFaq(id)`, `createFaq({ question, answer, isActive })`, `updateFaq(id, {...})`,
  `deleteFaq(id)`, `setFaqActive(id, isActive)`.
- Validation helpers (title/question required, content/answer required, length caps, `doc_type`
  ∈ allowed set); invalid input returns `{ ok:false, error }` — never throws.

**`src/lib/dashboard/knowledgeMeta.js`** — CMS constants, re-exported from the canonical source to
avoid drift: `KNOWLEDGE_DOC_TYPES = ['company','services','pricing','portfolio','process','technologies']`
(the six non-FAQ values of `KNOWLEDGE_DOCUMENTS` in `src/lib/nova/knowledge/constants.js`) and
`KNOWLEDGE_KINDS = ['document','faq']`.

**`src/app/dashboard/knowledge/page.jsx`** — list (server component). Reads `?tab` (documents|faqs,
default documents) + filter params; a small tab switcher (two `<Link>`s carrying `?tab`). Documents
tab table: Type · Title · Active · Updated; FAQs tab table: Question · Active · Updated (label links
to edit). Per-tab filters (GET form): doc_type (documents only), active/inactive, text search —
mirrors the leads filter form. Mobile cards + empty/error states copied from leads. Header button:
**Add document** on the Documents tab, **Add FAQ** on the FAQs tab.

**`src/app/dashboard/knowledge/new/page.jsx`** — reads `?kind`, renders `<KnowledgeForm kind=…>`
in create mode.

**`src/app/dashboard/knowledge/[kind]/[id]/page.jsx`** — validates `kind`, fetches the entry,
renders `<KnowledgeForm>` in edit mode with a Delete control. `notFound()` on bad kind/missing row.

**`src/app/dashboard/knowledge/actions.js`** — `'use server'` actions mirroring
`leads/[id]/actions.js`: `createEntryAction`, `updateEntryAction`, `deleteEntryAction`,
`toggleActiveAction`. Each dispatches by `kind` to `knowledgeBase.js`, then
`revalidatePath('/dashboard/knowledge')` (and the edit path). Return `{ ok, error }`.

**`src/app/dashboard/knowledge/KnowledgeForm.jsx`** — `'use client'` shared create/edit form.
Fields by kind — Document: doc_type `<select>`, title `<input>`, content `<textarea>`; FAQ:
question `<input>`, answer `<textarea>`; plus an `is_active` checkbox. Submits to the actions,
shows inline error/success, redirects to the list on success. **Includes the retrieval hint below.**

**`src/app/dashboard/knowledge/RowActions.jsx`** — `'use client'` per-row active toggle + delete
(delete uses a `window.confirm`), calling `toggleActiveAction` / `deleteEntryAction`.

### Edited

**`src/app/dashboard/DashboardNav.jsx`** — add `{ href: '/dashboard/knowledge', label: 'Knowledge' }`
to `items`, and extend `isActive` so `/dashboard/knowledge` + subroutes highlight (same shape as the
existing `/dashboard/leads` special-case).

**`src/lib/nova/knowledge/supabaseKnowledgeSource.js`** — the single read-path change decided in
Phase 1: add `is_active: true` to the `filters` of the `knowledgeRepo.findMany` and
`faqRepo.findMany` calls, so entries the CMS deactivates are excluded from Nova's retrieval.
Without this the toggle has no effect on Nova.

## The retrieval hint (your explicit ask)

Directly under the **content** (Document) and **answer** (FAQ) textareas in `KnowledgeForm.jsx`,
a muted helper line — styled like the existing `text-[var(--text-muted)]` captions:

> **Tip:** Nova's search injects roughly the **first sentence (~180 characters)** of a matching
> entry, not the whole thing. **Front-load the key facts** — names, numbers, the direct answer —
> into your opening sentence. Put lists and detail after that.

Rationale recorded in Phase 2: `search.js makeSnippet()` returns only the first matching line/
sentence, capped ~180 chars. This was the exact cause of the services hallucination until the
overview entry's names were moved into its first sentence. The hint makes that constraint visible
to whoever authors entries. (A deeper fix — full-section injection or pgvector — stays out of scope;
see Phase 4 notes.)

## Verification (end of Phase 3)

1. `npm run lint` + `npm run build` clean.
2. Dashboard manual pass (behind login): list loads both docs + FAQs; **add** a document and a FAQ;
   **edit** one; **toggle** one inactive (row dims, stays editable); **delete** a throwaway entry.
3. Filters: kind / doc_type / active-only / search each narrow the list correctly.
4. End-to-end grounding proof (the real test): edit a KB value to something distinctive (e.g. change
   a process step), wait ≤60s (KMS cache TTL), and confirm Nova's next reply reflects the edit.
   Then deactivate an entry and confirm Nova stops using it — proving the `is_active` filter.
5. Pricing guardrail still holds with CMS-authored content present.

## Out of scope (→ later)

- Public-facing KB browse page; multi-language entries; file/document upload (per the brief).
- Multi-tenant company management UI (single `avenix` tenant for now).
- Retrieval/snippet engine changes beyond the `is_active` filter (full-section injection, pgvector).
- Cache-busting on save — rely on the 60s KMS TTL; note the ≤60s propagation delay in the UI if
  desired, but no cross-module cache invalidation this phase.

## Decisions (resolved)

1. **List UX:** two tabs — **Documents | FAQs** (`?tab=`), each its own table. Not merged.
2. **Delete confirmation:** in-app `window.confirm`.
3. **`is_active` filter:** applied in **Phase 3**, alongside the toggle, so deactivating an entry
   immediately stops it reaching Nova.
