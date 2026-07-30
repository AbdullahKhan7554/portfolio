# Nova — WhatsApp Automation (Meta Cloud API)

Context: Next.js 15 project. Leads persist via `src/lib/nova/data/leadWriter.js` (both chatbot + contact-form sources). Existing non-fatal integration patterns to mirror: internal email notification (`conversationRuntime.js`), HubSpot sync (`pushLeadToHubspot.js`). WhatsApp Cloud API test number is currently in use (`WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_CLOUD_API_TOKEN` — permanent System User token). Production number migration is a separate, later decision — not part of this build.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

Scope (3 sub-features, built in order):
1. New-lead WhatsApp alert to the business owner (alongside existing email notification).
2. Automated welcome/follow-up WhatsApp message to the lead.
3. Stale-lead reminder to the owner (lead uncontacted after N hours).

---

## Phase 0 — Prerequisite (manual, not code)

1. Confirm `WHATSAPP_CLOUD_API_TOKEN` (permanent, System User–generated, never-expiring) is in `.env.local` and Vercel, along with `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_BUSINESS_ACCOUNT_ID`.
2. In Meta → WhatsApp → Message Templates, create and submit for approval:
   - `nova_owner_lead_alert` (utility category) — variables: lead name, service/project, budget, timeline, source.
   - `nova_lead_welcome` (utility category) — variables: lead first name, brief next-step text.
   - `nova_owner_stale_reminder` (utility category) — variables: lead name, hours since capture.
   Utility-category templates approve faster than marketing ones. STOP — do not proceed to Phase 2 or 3 until each relevant template is Meta-approved (Phase 1 doesn't need approval yet, it's just the client).

---

## Phase 1 — WhatsApp Cloud API Client (standalone)

1. Create `src/lib/nova/whatsappCloud/whatsappCloudClient.js` — `fetch`-based wrapper (no new SDK dependency) posting to `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages` with Bearer token. Export `sendTemplateMessage(to, templateName, languageCode, components)`.
2. Recipient `to` must be E.164 digits-only (reuse/adapt the digit-normalization logic already used for the "Open WhatsApp" dashboard link if suitable).
3. Non-fatal by contract: never throws to the caller — returns `{ ok: true, messageId }` or `{ ok: false, error }`. Missing env vars → `{ ok: false, error: 'not_configured', skipped: true }`, same pattern as `pushLeadToHubspot`.
4. No wiring into any flow yet.

STOP after Phase 1 for review — verify with a manual test script sending `nova_owner_lead_alert` (once approved) or Meta's default "hello_world" template (if testing before approval) to your own test-recipient number.

---

## Phase 2 — Owner New-Lead Alert

1. In the same lead-completion point where the internal email notification and HubSpot sync are triggered, also call `sendTemplateMessage` with `nova_owner_lead_alert`, sending to the owner's WhatsApp number (env var `OWNER_WHATSAPP_NUMBER` — add this, distinct from the business-facing `siteConfig.contact.whatsappNumber` used for visitor handoff, since owner may want alerts on a different number; default to the same number if unset).
2. Fully non-fatal — failure never blocks lead save, email, or HubSpot sync.

STOP after Phase 2 for review — complete a real lead, confirm owner receives the WhatsApp alert.

---

## Phase 3 — Automated Lead Welcome Message

1. After successful lead persistence, if the lead has a valid phone number, send `nova_lead_welcome` via `sendTemplateMessage` to the lead's own number.
2. Skip silently (no error surfaced to the chat) if phone is missing/invalid or template send fails.
3. Consider: should this send immediately, or only if the lead didn't decline phone capture? (Doc default: only if a real phone number was captured — decline/skip means no WhatsApp message, obviously.)

STOP after Phase 3 for review — complete a real lead with a phone number, confirm the lead's WhatsApp receives the welcome message.

---

## Phase 4 — Stale-Lead Reminder (scheduled)

1. Create `/api/nova/whatsapp-stale-check` route (mirror the existing `/api/nova/email-cron` pattern: `Authorization: Bearer CRON_SECRET` check).
2. Query `leads` where `status = 'new'` and `created_at` older than `STALE_LEAD_HOURS` (env var, default 24) AND no reminder already sent for this lead (add a `stale_reminder_sent_at` timestamp column, nullable — set it after sending so the same lead isn't reminded repeatedly).
3. For each match, send `nova_owner_stale_reminder` to `OWNER_WHATSAPP_NUMBER`, then set `stale_reminder_sent_at`.
4. Register this route with cron-job.org (same free scheduler already used for the email cron) — note the exact URL + header for the user to configure, don't assume it's automatic.

STOP after Phase 4 for review — manually trigger the route, confirm a stale test lead gets flagged and the owner receives the reminder, and confirm a second run does NOT re-send for the same lead.

---

## Not in scope
- No two-way WhatsApp conversation handling (replies from leads/owner aren't processed — send-only).
- No production number migration (test number stays in use for this build).
- No changes to the existing wa.me visitor-handoff link/button (untouched, separate system).
