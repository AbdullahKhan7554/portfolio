# Contact Form — Phase 2 Implementation Plan

## Context

The static marketing contact form (`ContactForm.jsx` → `POST /api/contact`) currently
only sends an email via the simple `@/lib/email` Resend sender and **stores nothing** —
submissions are invisible to the dashboard and lost entirely when Resend is unconfigured.
Meanwhile the Nova chatbot already has a proven backend: it persists leads to the Supabase
`leads` table (service-role, RLS-locked) and sends internal notifications through
`emailService.sendNow()` + Supabase `email_templates`.

Phase 2 rewires the contact form onto that Nova backend so contact submissions are
**persisted as leads** (distinguishable by `source`) and **notified through the single Nova
email path**, retiring the second email path for this route. Decisions confirmed by the user:

1. **Storage** — insert into existing `leads` table with `source: 'contact_form'` (no new
   table). Add a `source` column + filter to the dashboard so contact-form and chatbot leads
   are distinguishable.
2. **Email** — switch the internal notification to Nova's `sendNow()` + `email_templates`
   (reuse `internal_lead_notification`). No submitter confirmation email for now.
3. **Field mapping** — `message → project_description`; `businessType → metadata` JSON;
   `budget` / `timeline` left `null`.

Token discipline (per spec): minimal comments, no explanatory prose in code, no extra logging
beyond the non-fatal notification catch that already exists in the Nova pattern.

---

## Changes

### 1. Generalize the lead writer to accept a `source` — `src/lib/nova/data/leadWriter.js`

`toRow()` currently hardcodes `source: 'chatbot'` (line 93). `persist()` already skips dedup
when no `conversationId` is passed, so it works for the form as-is except for `source`.

- Add `source` to the `persist(lead, context)` context (default `'chatbot'` to preserve
  chatbot behavior) and thread it into `toRow` → `source: source ?? 'chatbot'`.
- No other changes; `businessType` already lands in `metadata` via `toRow` (line 81), which
  satisfies the field-mapping decision.

### 2. Rewire the route — `src/app/api/contact/route.js`

Keep the front half unchanged (rate limit → parse → `contactSchema` validate → honeypot).
Replace the `@/lib/email` `sendEmail(...)` block (lines 3, 38–62) with **persist-then-notify**:

- Import `createLeadWriter` from `@/lib/nova/data/leadWriter`, `createEmailService` from
  `@/lib/nova/email/emailService`, and `novaConfig` from `@/config/nova.config`.
- **Persist first** (primary success signal):
  ```
  const writer = createLeadWriter();
  const saved = await writer.persist(
    { fullName: data.name, email: data.email, projectDescription: data.message, businessType: data.businessType },
    { companyId: novaConfig.companyId, source: 'contact_form' },
  );
  ```
  Also stash `package` into metadata (pass through `toRow` — see note in Open items).
  - If persist fails / store not configured (`saved.ok === false`) → return **503**
    `{ ok:false, delivered:false, reason:'not_configured' }`. The form already maps 503 to the
    WhatsApp fallback (`ContactForm.jsx:47`), so no lead is silently lost.
- **Notify second** (non-fatal, mirror `notifyOwnerOfLead` in `conversationRuntime.js:69–89`):
  ```
  try {
    const owner = process.env.LEAD_NOTIFICATION_EMAIL;
    if (owner) {
      await createEmailService().sendNow(novaConfig.companyId, 'internal_lead_notification', owner, {
        name: data.name, email: data.email, phone: 'Not provided',
        company: '—', businessType: data.businessType || '—',
        service: 'Contact form enquiry', projectDescription: data.message,
        budget: '—', timeline: '—',
      });
    }
  } catch (err) { console.error('[Contact] notification failed (non-fatal)', err?.message); }
  ```
  Uses the existing `internal_lead_notification` template's variable set so no new template row
  is needed.
- Return `{ ok:true, delivered:true }` on successful persist.

**Behavior change to note:** success is now gated on the DB write, not on email. A submission
saves (and returns success) even if Resend/`LEAD_NOTIFICATION_EMAIL` is unset. WhatsApp fallback
now triggers only when persistence itself can't happen. This is the intended, more-robust
semantics but differs from today.

### 3. Dashboard: surface + filter `source`

- **`src/lib/dashboard/leadSource.js`** (new): `export const LEAD_SOURCES = ['chatbot', 'contact_form'];`
- **`src/lib/supabase/leads.js`**:
  - Add `source` to `COLUMNS` (line 7–8).
  - `listLeads({ search, status, source })`: when `source` is a valid `LEAD_SOURCES` value, add
    `query = query.eq('source', source)` (mirror the existing `status` filter, lines 19–21).
- **`src/app/dashboard/page.jsx`**:
  - Read `params.source` alongside `q`/`status` (line 27–28) and pass to `listLeads`.
  - Add a **Source** `<select>` to the filter form (mirror the status select, lines 56–67)
    with an "All sources" default.
  - Add a **Source** `<th>`/`<td>` column to the table (header ~line 91, cell ~line 120).

Detail page (`dashboard/leads/[id]/page.jsx`) already selects `*`, so `source` is available
there if we later want to show it — out of scope for now.

---

## Not in scope / untouched
- `src/lib/email.js` and the `contactFromEmail`/`contactToEmail` env vars stay (still used by
  `/api/lead`). This route just stops importing them.
- No changes to `ContactForm.jsx` — its success/`503`-fallback/`422`-error states already cover
  the new response contract. No visible field changes.
- No changes to Nova's own chat lead-capture flow (its `persist` default `source` stays `'chatbot'`).
- No submitter confirmation email; no new `email_templates` rows.

## Open items to confirm during build
- **`package` field**: decision covered message/businessType/budget/timeline but not `package`.
  Plan puts it into `metadata` (harmless, preserves the info the old email showed). Confirm or
  drop.
- **Template prerequisite**: an `internal_lead_notification` row must exist in `email_templates`
  for `company_id = 'avenix'` (Nova already relies on it). If missing, `sendNow` throws
  `TemplateNotFoundError` — caught as non-fatal, so persistence still succeeds but no email goes
  out. Verify the row exists.
- **DB `source` values**: confirm no `leads` CHECK constraint restricts `source` to `'chatbot'`
  (the table DDL is not in-repo). If a constraint exists, it must be widened to allow
  `'contact_form'`.

---

## Verification (end-to-end)
1. `npm run dev`; open `/contact` (and the homepage `#contact` section).
2. Submit a valid enquiry → expect the in-form "Message sent." success state.
3. In Supabase, confirm a new `leads` row: `source = 'contact_form'`, `full_name`/`email` set,
   `project_description` = the message, `metadata.businessType` (and `metadata.package`) present,
   `budget`/`timeline` null, `status = 'new'`.
4. Open `/dashboard` → the submission appears; the new **Source** column shows `contact_form`;
   the Source filter narrows to `contact_form` / `chatbot` correctly.
5. With `LEAD_NOTIFICATION_EMAIL` + Resend configured, confirm the internal notification email
   arrives (rendered from `internal_lead_notification`).
6. **Degradation:** unset `SUPABASE_SERVICE_ROLE_KEY` → submit → expect 503 + WhatsApp fallback
   (no silent loss). Restore, then unset only `LEAD_NOTIFICATION_EMAIL` → submit → expect success
   + saved lead + a non-fatal "notification failed/skipped" log, no user-facing error.
7. Regression: run the Nova chatbot lead flow → still saves with `source = 'chatbot'`.
