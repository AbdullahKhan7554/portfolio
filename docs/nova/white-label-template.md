# Nova — White-Label Template (Config-Driven Reusability)

Context: Nova currently has "Avenix Studio" hardcoded/defaulted across the codebase (company_id, branding, knowledge base content, WhatsApp number, email sender, HubSpot config, Cal.com link). Goal: make Nova a clean, reusable template — every client-specific value lives in ONE config file/set of env vars, so cloning the codebase for a new client + updating config + new Supabase project is all that's needed to launch a new instance. NOT building shared multi-tenancy — each client gets their own independent deployment.

Token discipline in code: minimal comments, no explanatory prose in code. Investigation and verification stay thorough.

---

## Phase 1 — Audit + Report (no code changes)

1. Find every place client-specific values are hardcoded or defaulted across the codebase: company name/branding (siteConfig), `company_id: 'avenix'` defaults, WhatsApp numbers (business number + owner alert number), email sender/notification addresses, HubSpot-specific text, Cal.com booking link, Nova's persona/name in system prompts, color tokens/logo references, domain references.
2. Classify each: (a) already env-var-driven (good, no change needed), (b) hardcoded string that needs to become a config value, (c) hardcoded logic/behavior that's Avenix-specific (e.g. pricing guardrail wording, specific service names in prompts) and needs to become data-driven via the Knowledge Base CMS rather than code.
3. Report a proposed single `client.config.js` (or `.env.example` + a typed config loader) shape covering everything found — this becomes the "fill this in for a new client" checklist.
4. Report what's NOT reasonably template-able without real per-client engineering (e.g. custom integrations a specific client wants that others won't) — be honest about the boundary between "generic template" and "custom work," don't overpromise.
5. STOP for direction before Phase 2.

---

## Phase 2 — Centralize Config

1. Build the confirmed `client.config.js`/env-var structure from Phase 1. All hardcoded Avenix-specific values get replaced with references to this config.
2. Nova's system prompts/persona: parameterize the business name and tone descriptors; keep the actual service/pricing content flowing through the Knowledge Base CMS (already client-editable, per the prior feature) rather than hardcoding it — the template's job is to ship EMPTY/example KB content for a new client to fill in, not Avenix's content.
3. Verify Avenix's own live instance still works identically after this refactor — zero behavior change for the current production site, only the source of the values changes.

STOP after Phase 2 for review — confirm nothing broke for Avenix.

---

## Phase 3 — "New Client" Setup Guide

1. Write a clear, step-by-step `docs/new-client-setup.md`: create Supabase project → run migrations → set env vars → seed starter Knowledge Base content (generic placeholders, clearly marked as such) → configure WhatsApp/HubSpot/Cal.com/Resend for the new client → deploy.
2. This should be genuinely usable by future-you (or someone else) six months from now without re-deriving the process.

STOP after Phase 3 for review.

---

## Phase 4 — Dry-Run Validation

1. Where feasible without spinning up real paid third-party accounts, validate the setup guide's logic (e.g. confirm migrations run cleanly against a fresh/empty Supabase project, confirm the app doesn't crash with placeholder config values, confirm there's no remaining spot that silently falls back to "avenix").
2. Report anywhere the guide would likely break in practice for a real second client, so it can be fixed before it's needed live.

STOP after Phase 4 — this closes out the white-label template work.

---

## Not in scope
- No shared multi-tenant database/deployment — this is strictly per-client independent deployments.
- No automated provisioning/CLI tool for spinning up new clients (that's a future enhancement once the manual process is proven).
- No changes to Nova's core conversational logic, lead capture flow, dashboard features, or integrations — this phase is purely about making existing functionality client-agnostic/reusable.
