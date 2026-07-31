# Nova Knowledge Base — Phase 1 Findings

Investigation only. No code changed. Companion to `docs/knowledge-base.md` (the brief),
which was written before Milestones 8 and 12 and is partly out of date; this report
records what the code and live database actually do today.

## Summary

Nova's knowledge is **not hardcoded** and **not file-based at runtime** — it is designed
to load from a **Supabase repository layer** and inject **relevant** snippets per turn via
**keyword search** (RAG-lite, no vectors). The retrieval stack the brief proposes to build
already exists. The real gap is the **write side**: the tables don't exist, there is no
write layer, and there is no dashboard editor — so Nova is currently running **ungrounded**.

## 1. Where knowledge lives today

| Layer | Location | Runtime role |
|---|---|---|
| Supabase repo rows (intended source) | tables `knowledge_documents`, `faqs`, `companies`, `products` (`src/lib/nova/data/repositoryTypes.js`) | **The live data source** via `loadKnowledgeFromRepositories()`. |
| Markdown files (legacy seed) | `src/knowledge/avenix/*.md` | **No longer read at runtime.** `knowledge/loader.js` is still exported from `knowledge/index.js` but is off the chat path. Now effectively seed/reference content. |
| Hardcoded prompts | `src/lib/nova/prompts/{systemPrompt,salesPrompt,faqPrompt}.js`, `src/lib/nova/sales/*Config.js` | Persona/behavior — not factual KB. |

`knowledgeService.js`: *"Milestone 8: the DATA SOURCE is now the Supabase repository layer,
not the file/markdown loader."*

## 2. How knowledge reaches the LLM per turn

1. `chat/chatService.createChatStream()` → `kms.getKnowledge(companyId)` loads config + parsed
   documents from Supabase repos (cached 60s).
2. Per user message, `chat/contextInjection.buildGroundingContext()` runs
   `knowledgeService.search()` (keyword search over a cached, per-section index) and injects
   **only relevant** snippets, ranked by score, capped to **40%** of the context token budget
   (`GROUNDING_BUDGET_RATIO = 0.4`).
3. `core/systemPromptBuilder.buildSystemPrompt()` wraps it in a `# Company knowledge` block.
4. A hardcoded **STRICT pricing policy** is always appended and **overrides** any price in the
   KB — Nova must never quote a figure (`systemPromptBuilder.js`). Answers the brief's Phase 5
   pricing-guardrail concern: already enforced at the prompt level, independent of KB content.
5. Every failure path (no company, empty KB, Supabase down, search error) degrades to an
   **empty grounding string** — chat continues ungrounded, never crashes.

## 3. What changing knowledge involves today

- Editing content = updating Supabase rows → **no code deploy** needed for content.
- **But there is no write path and no editor:** the Nova data layer is **read-only**
  (`knowledgeService.js`: *"no writes (read-only)"*), the dashboard has only Leads + Analytics
  (`src/app/dashboard/DashboardNav.jsx`), and there is no `src/lib/supabase/knowledgeBase.js`.
- Changing persona/behavior/pricing policy → still a code deploy (hardcoded prompts).

## 4. Retrieval approach — already decided in code

- **No vector DB. Confirmed.** Keyword search only (`knowledge/search.js`; `docs/nova/knowledge.md`).
- The brief's option **(b) keyword/tag lookup is already implemented** — relevance-ranked,
  token-budgeted, per-section injection.
- Recommendation: **stay on (b)** for the current small KB (~34 entries). Clean migration path
  to (c) pgvector via Supabase exists if the KB grows past a few dozen entries; not needed now.

## 5. Live database verification (Supabase MCP, read-only)

Nova project ref: **`csrhsedckygohpnekcio`** (confirmed by the user as `NEXT_PUBLIC_SUPABASE_URL`;
holds the real `leads`=11, `conversations`, `conversation_messages`, `email_templates`,
`scheduled_emails`).

| Table the repo layer reads | Exists? |
|---|---|
| `knowledge_documents` | **No** |
| `faqs` | **No** |
| `companies` | **No** |
| `products` | **No** |
| `leads` | Yes (11 rows) |
| `conversations` | Yes |

**Consequence (confirmed):** the knowledge/faq tables do not exist, so every knowledge read
fails on a missing table, `documents` resolves to `{}`, and company config falls back to the
`avenix` registry entry. **Nova is answering ungrounded today** — persona prompts + pricing
guardrail + raw model knowledge, with none of the `src/knowledge/avenix/*.md` facts injected.

RLS pattern to mirror: `leads`/`conversations` have **RLS enabled with zero policies**; all
access is via the **service-role** admin client (`src/lib/supabase/admin.js`), which bypasses RLS.

## 6. Schema mismatch in the brief

The brief (Phase 2) proposes a single `knowledge_base_entries` table (`category`/`tags`/`is_active`).
The shipped read layer (M8, `knowledge/supabaseKnowledgeSource.js`) instead reads **two** shapes:

- `knowledge_documents` → `company_id`, `doc_type` (company/services/pricing/portfolio/process/technologies), `title`, `content`
- `faqs` → `company_id`, `question`, `answer`

To keep the read/retrieval stack untouched, the new tables + write layer + CMS must target
`knowledge_documents` + `faqs` with those columns — **not** `knowledge_base_entries`.
`docs/knowledge-base.md` Phase 2 has been corrected accordingly.

## 7. Decisions taken (for Phase 2+)

- Scope: **write-path + dashboard CMS only**; read/retrieval stack untouched.
- **`is_active`:** add an `is_active: true` filter to both `findMany` calls in
  `supabaseKnowledgeSource.js` so the dashboard's active/inactive toggle actually affects what
  Nova retrieves. This is the single, deliberate exception to "read path unchanged."

## 8. What's left to build

1. Create + seed `knowledge_documents` + `faqs` (prerequisite — without it the CMS writes to
   nothing and Nova stays ungrounded). Seed from `src/knowledge/avenix/*.md`.
2. `src/lib/supabase/knowledgeBase.js` — CRUD, mirroring `src/lib/supabase/leads.js`.
3. `/dashboard/knowledge` CMS + "Knowledge" nav item.
4. Read/retrieval path: unchanged except the `is_active` filter above.
