# Nova — Knowledge Base CMS

Context: Next.js 15 project. Nova currently answers questions about Avenix Studio's services, pricing posture, process, etc. — likely from hardcoded prompt content/config, not an editable source. Goal: a proper Knowledge Base that (1) Abdullah can edit from the dashboard without touching code, (2) Nova's AI reliably draws from when answering, and (3) is testable/versioned enough to trust in production. This is a bigger feature — build it thoroughly, no shortcuts.

Token discipline in code: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified. (This instruction is about code verbosity, not about skipping investigation or verification rigor — those must stay thorough.)

---

## Phase 1 — Investigate + Report (no code changes)

1. Find every place Nova's "knowledge" currently lives: system prompt strings, config files (`aiConfig.js`, capability profiles, etc.), hardcoded service/pricing/FAQ text, anything injected into the LLM context today.
2. Report exactly how that content reaches the LLM per turn — static system prompt, dynamic injection, RAG/embedding lookup, or none (pure model knowledge).
3. Report what's technically involved in changing today: does editing require a code deploy, or is any of it already data-driven?
4. Assess retrieval approach options given the codebase (no vector DB currently in use, per earlier findings — confirm): 
   - (a) Full-content injection (all KB entries stuffed into system prompt — simplest, fine at small KB size, degrades as KB grows/costs tokens),
   - (b) Keyword/tag-based lookup (match user message against KB entry tags, inject only matches),
   - (c) Real vector search (pgvector via Supabase, embeddings per entry — most scalable, most new infrastructure).
   Recommend one given current KB will likely start small (services, pricing posture, process, FAQ — a few dozen entries at most), but flag the migration path to (c) if it grows.
5. STOP for direction before Phase 2 — this decision drives the whole feature.

---

## Phase 2 — Schema + Data Layer

> Schema corrected after Phase 1. The shipped read layer (Milestone 8,
> `knowledge/supabaseKnowledgeSource.js`) already reads **two** tables with fixed column names —
> NOT a single `knowledge_base_entries` table. To keep the read/retrieval stack untouched, the
> write side must target these exact shapes. See `docs/nova/knowledge-base-phase1-findings.md`
> and `docs/nova/knowledge-base-phase2-plan.md`.

1. Create the two tables the read layer expects, RLS-enabled/service-role (mirroring `leads`):
   - `knowledge_documents`: `id`, `company_id`, `doc_type` (`company`/`services`/`pricing`/`portfolio`/`process`/`technologies`), `title`, `content`, `is_active` (boolean, default true — inactive excluded from retrieval once the findMany filter is added), `created_at`, `updated_at`. Seeded one row per `##` section to preserve per-section keyword-search granularity.
   - `faqs`: `id`, `company_id`, `question`, `answer`, `is_active`, `created_at`, `updated_at`.
2. Create `src/lib/supabase/knowledgeBase.js` — full CRUD over both tables, service-role, mirroring the `leads.js`/`analytics.js` pattern exactly.
3. Seed with Abdullah's real current content extracted from `src/knowledge/avenix/*.md` (the orphaned legacy source Phase 1 found) — 28 `knowledge_documents` rows + 6 `faqs` rows, verbatim, so nothing is lost. Do NOT fabricate placeholder content; if something is ambiguous, ask rather than guess.

> Retrieval `is_active` note: the current read source filters only on `company_id`. To make the
> Phase 3 active/inactive toggle actually affect Nova, add an `is_active: true` filter to both
> `findMany` calls in `supabaseKnowledgeSource.js` (decided in Phase 1). This is the only
> read-path change the feature needs.

STOP after Phase 2 for review.

---

## Phase 3 — Dashboard CMS

1. `/dashboard/knowledge` — list view (title, category, active/inactive toggle, last updated), filter by category, search.
2. Add/Edit/Delete via Server Actions, mirroring the leads-status-update and changelog patterns already established. Rich-enough editing (textarea is fine; no need for a WYSIWYG unless content is heavily formatted).
3. Add "Knowledge" to the shared dashboard nav (`DashboardNav.jsx`) alongside Leads/Analytics.
4. Inactive entries visually distinct (dimmed row) but still editable/reactivatable, not hard-deleted by the toggle.

STOP after Phase 3 for review — full test: add an entry, edit it, deactivate it, delete a throwaway one.

---

## Phase 4 — Wire Into Nova's Retrieval

1. Implement the Phase 1–decided retrieval approach (full-injection or keyword/tag matching) in the chat request path — pull active KB entries relevant to the current turn and inject into the LLM context, following whatever pattern `aiConfig.js`/the provider layer already uses for system-prompt construction.
2. Must be non-fatal: a KB fetch failure should degrade to Nova's existing baseline behavior (no crash, no empty response), not break the chat.
3. Critical accuracy check: verify Nova actually uses injected KB content over stale/hardcoded knowledge when they'd conflict — test by editing a KB entry to a deliberately different value (e.g. change a stated turnaround time) and confirming Nova's next response reflects the edit, not the old hardcoded value.

STOP after Phase 4 for review — this is the real proof the feature works end-to-end: edit content in the dashboard with zero deploy, verify it changes what Nova says within one conversation turn.

---

## Phase 5 — Guardrails + Polish

1. Basic input validation on the dashboard form (title/content required, reasonable length limits).
2. If using keyword/tag matching (Phase 1 option b), sanity-check retrieval quality across a handful of realistic test questions — report any misses/false-positives found, don't just assume it works.
3. Confirm existing behaviors are untouched: pricing guardrail (never quotes exact prices) still holds even with KB content present; deterministic lead-capture question flow unaffected.

STOP after Phase 5 — final full regression pass before calling this done.

---

## Not in scope
- No public-facing KB browsing page (this is Nova's internal reference + dashboard-editable, not a help-center site) unless explicitly requested later.
- No multi-language KB content (ties into the separate Multilingual roadmap item).
- No file/document upload into the KB (text entries only for now).
