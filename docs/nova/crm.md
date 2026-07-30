# Nova — CRM Integration (HubSpot)

Context: Next.js 15 project. Leads are captured via Nova chatbot + contact form, persisted to Supabase `leads` table (`src/lib/nova/data/leadWriter.js`, `source: 'chatbot'|'contact_form'`). Goal: push each completed lead to HubSpot (free CRM tier) as a Contact + Deal, in addition to existing Supabase storage — Supabase remains the source of truth for the dashboard.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 0 — Prerequisite (manual, not code)

1. Create a free HubSpot account (if not already) at hubspot.com.
2. Generate a Private App access token: HubSpot → Settings → Integrations → Private Apps → Create → enable scopes `crm.objects.contacts.write`, `crm.objects.contacts.read`, `crm.objects.deals.write`, `crm.objects.deals.read`.
3. Add `HUBSPOT_ACCESS_TOKEN=...` to `.env.local` and Vercel.

STOP — confirm this is done before Phase 1.

---

## Phase 1 — HubSpot Client + Push Utility (standalone, not wired in)

1. Create `src/lib/nova/crm/hubspotClient.js` — thin wrapper around HubSpot's REST API (`https://api.hubapi.com`) using `fetch` + Bearer token from `process.env.HUBSPOT_ACCESS_TOKEN`. No SDK dependency needed (avoid adding a heavy package for a few REST calls) unless `@hubspot/api-client` is trivially simpler — decide and note which you chose.
2. Create `src/lib/nova/crm/pushLeadToHubspot.js` — exports `pushLeadToHubspot(lead)`:
   - Upsert a Contact by email (`firstname`/`lastname` split from `full_name` best-effort, `email`, `phone`).
   - Create a Deal (`dealname`: `"{full_name} - {project_description truncated}"`, `amount`: parsed numeric from `budget` if extractable else omitted, custom or standard property for `timeline` if a suitable one exists else skip rather than force a mismatched field) associated with that Contact.
   - Wrap all HubSpot calls in try/catch — HubSpot failures must NEVER break lead saving or the chat/contact-form response. Log the error, return `{ ok: false, error }`, and the caller ignores/continues.
3. Do not wire into any flow yet — this phase is the utility only.

STOP after Phase 1 for review — verify with a manual test call (real API, real free account) that a Contact + Deal are created correctly in HubSpot.

---

## Phase 2 — Wire Into Lead Completion (both sources)

1. In `leadWriter.js`'s `persist()` (or the calling site right after successful Supabase persistence — decide and flag which, based on where `source` is already available), call `pushLeadToHubspot(lead)` non-blocking/non-fatal (fire-and-forget or awaited-but-swallowed-on-error — match the existing pattern used for the internal notification email, which is also non-fatal).
2. This must apply to both Nova chatbot leads and contact-form leads (both already flow through the same `leadWriter.persist()`).
3. Add a `hubspot_synced` boolean column to `leads` (default `false`), set `true` on successful push — so the dashboard can later show sync status (not required to build that UI now, just the column + write).

STOP after Phase 2 for review — full test: complete a chatbot lead flow, confirm it appears in HubSpot within seconds and `leads.hubspot_synced = true`; submit the contact form, confirm the same.

---

## Not in scope
- No two-way sync (HubSpot → Supabase updates).
- No HubSpot workflow/automation setup (that's configured in HubSpot's own UI, not code).
- No UI changes to the dashboard for sync status display (future phase).
