# Avenix Studio — Contact Form Automation

Context: Next.js 15 project (avenixstudios.com). Nova's email module already exists at `src/lib/nova/email/` (Resend provider, `emailService.js`, `sendNow`, templates in Supabase `email_templates` table) and `EMAIL_FROM` is now on a verified domain. Goal: reuse this system for the site's static contact form (if one exists separately from the Nova chatbot).

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 1 — Investigate + Report (no code changes)

1. Search the codebase for an existing static contact form (separate from the Nova chat widget) — check for a `/contact` page, a `ContactForm` component, any existing form `action`/API route handling name/email/message submission.
2. Report back:
   - Does a static contact form exist? Where (file paths)?
   - Does it currently submit anywhere (API route, third-party service, nothing/non-functional)?
   - What fields does it collect?
3. Do NOT write any code in this phase — findings only, then STOP for direction.

---

## Phase 2 — Wire Submission → Storage + Notification (scope depends on Phase 1 findings)

Once Phase 1 findings are reviewed, this phase will:
1. If no backend exists: create an API route (e.g. `/api/contact`) that validates input server-side and stores the submission (new `contact_submissions` table in Supabase, RLS locked to service-role — mirror the `leads` table pattern) OR inserts into the existing `leads` table with a `source: 'contact_form'` marker (decide based on whether dashboard should show these alongside chatbot leads — flag this choice for review, don't assume).
2. On successful submission: send an internal notification email to `LEAD_NOTIFICATION_EMAIL` (reuse `emailService.sendNow`, same pattern as Nova's lead notification) with the submitted details.
3. Optionally send a confirmation email to the submitter ("thanks, we'll be in touch") — reuse existing template pattern in `email_templates`. Flag for review before adding new templates.
4. Frontend form: show success/error state, disable submit while pending, basic client-side validation (required fields, email format) in addition to server-side.

STOP after Phase 2 for review — no code before Phase 1 findings are discussed.

---

## Not in scope
- No changes to Nova chatbot's own lead capture flow.
- No new design/redesign of the existing contact form UI unless it's currently broken.
