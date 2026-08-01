# Nova — New-Client Setup Guide

> **Validated via dry-run on 2026-08-01 — data isolation confirmed clean, no cross-client fallback.**

How to spin up a **new, independent Nova instance** for a new client (e.g. a gym)
from this codebase. Each client is its own deploy + its own Supabase project +
its own filled-in `client.config.js`. There is **no one-command bootstrap script**
— the steps below are manual and must be followed in order.

> Automation status (be honest about what exists):
> - ✅ All eight Nova tables have committed migrations in `supabase/migrations/`
>   (`sales_packages` plus `leads`, `conversations`, `conversation_messages`,
>   `knowledge_documents`, `faqs`, `email_templates`, `scheduled_emails`). See Step 2.
> - ✅ Knowledge base and Sales Packages both have a dashboard CMS — no SQL needed
>   to add content.
> - ❌ There is **no email-template CMS** and no seed script for nurture templates.
>   They are inserted by hand (Step 7).
> - ❌ There is **no CLI** to create the dashboard login user, the Supabase
>   project, or the Vercel project — all done through their web UIs.

---

## Prerequisites

- Accounts: **Supabase**, **Vercel**, **Resend** (email), an **AI provider** key
  (NVIDIA NIM by default, or Groq), and **Cal.com** (booking).
- The client's brand assets: logo, OG image, founder/owner photo, optional CV/PDF.
- Node ≥ 20 (see `package.json` `engines`).

---

## Step 1 — Get a copy of the codebase for the client

Create a per-client copy of the repo (a fork, a new repo, or a long-lived branch).
Everything client-specific lives in **`src/config/client.config.js`** plus the
environment — you do not edit component code per client.

```bash
npm install
```

---

## Step 2 — Create the Supabase project and its schema

1. **Create a new Supabase project** (Supabase dashboard → New project). Note the
   project URL and the `anon` + `service_role` keys — they become env vars in Step 4.

2. **Create the database schema.** A new project starts empty. Run every file in
   `supabase/migrations/` **in filename order** (they are numbered so foreign-key
   targets are created first):

   | Order | Migration file | Table |
   |-------|----------------|-------|
   | 1 | `20260801_sales_packages.sql` | `sales_packages` (CMS) |
   | 2 | `20260802_01_leads.sql` | `leads` |
   | 3 | `20260802_02_conversations.sql` | `conversations` (FK → leads) |
   | 4 | `20260802_03_conversation_messages.sql` | `conversation_messages` (FK → conversations) |
   | 5 | `20260802_04_knowledge_documents.sql` | `knowledge_documents` (CMS) |
   | 6 | `20260802_05_faqs.sql` | `faqs` (CMS) |
   | 7 | `20260802_06_email_templates.sql` | `email_templates` |
   | 8 | `20260802_07_scheduled_emails.sql` | `scheduled_emails` (FK → email_templates) |

   These migrations are **descriptive** — they document the current live schema, are
   idempotent (`create table if not exists`), and are safe to run against an empty
   project. Every Nova table has **RLS enabled with no policies** = service-role-only
   access (the app reaches them via the `service_role` key; see
   `src/lib/supabase/admin.js`). Migration `20260802_08` drops an earlier public read
   policy on `email_templates` so it matches the rest.

3. **Create the dashboard login user.** The dashboard (`/dashboard`) is gated by
   Supabase Auth (`src/app/dashboard/layout.jsx`, `src/middleware.js`). In the new
   project: Supabase dashboard → Authentication → add a user (email + password).
   That user logs in at `/dashboard/login`.

---

## Step 3 — Fill in `client.config.js`

`src/config/client.config.js` is the single source of truth; `config/site.js` and
`config/nova.config.js` read from it. **Change every field below per client.**
Per-deploy values (marked *env*) come from `.env.local` (Step 4), not by editing
this file.

**Must change per client**

- `identity`: `companyId` (tenant key — scopes KB, packages, nurture; pick a short
  slug e.g. `gym`), `brandName`, `shortName`, `legalName`, `wordmark`, `monogram`,
  `founder`, `role`, `descriptor`, `foundingYear`, `tagline`, `shortDescription`.
  `assistantName` may stay `Nova`.
- `urls`: `website`, `logo`, `ogImage`, `founderPhoto`, `cvPath`, `cvUpdated`
  (asset paths under `/public`). `site` is *env* (`NEXT_PUBLIC_SITE_URL`).
- `contact`: `whatsappMessage`, `location`, `timezone`, `address`,
  `availabilityLabel`, `availabilityOpen`. `email`, `phone`, `whatsappNumber` are
  *env*.
- `email.fromName` — transactional "from" name.
- `social`: `github`, `linkedin`, `instagram`, `facebook`, `twitterHandle`.
- `seo`: `defaultTitle`, `titleTemplate`, `description`, `keywords`, `ogImageAlt`.
- `widget`: `tagline`, `welcomeMessage`, `inputPlaceholder`, `errorMessage`,
  `quickReplies`, and the `theme` color palettes (dark/light).
- `policy.quotePricesAllowed` — `false` (default) = Nova never quotes a specific
  price; set `true` only if this client wants Nova to state prices.
- `nurture.sequenceKey` and each `sequence[].templateKey` — rename off the
  `avenix_*` keys to this client's keys (e.g. `gym_lead_nurture`, `gym_welcome`,
  `gym_followup`). These keys **must match** the `email_templates` rows you seed in
  Step 7. `delayMinutes` is the send offset per step.

**Stays generic (usually no change)**

- `widget.launcher` (positioning/aria), `analytics` block (*env*), and structural
  defaults. AI behavior knobs live in `src/lib/nova/config/aiConfig.js`, not here.

---

## Step 3b — Manual brand-copy updates required

Some brand text lives directly in marketing/UI components and page metadata — it is
**intentionally NOT config-driven** (Phase 2 decision: marketing copy is bespoke per
client, not templated). A new client must **find-and-replace** the literal brand
strings in these files. This is a one-line-each manual edit — no logic changes, and
the dry-run confirmed none of these affect data isolation.

| File | ~Line | What to change |
|------|-------|----------------|
| `src/components/sections/Hero.jsx` | ~80 | Brand-name literal in the hero sentence ("Avenix Studio is the digital atelier of …") |
| `src/components/sections/WhyMe.jsx` | ~45 | Section eyebrow text ("04 — Why Avenix") |
| `src/app/about/page.js` | metadata | `description` copy |
| `src/app/contact/page.js` | metadata | `description` copy |
| `src/app/services/page.js` | metadata | `description` copy |
| `src/app/work/page.js` | metadata | `description` copy |
| `src/app/blog/page.js` | metadata | `description` copy |
| `src/app/free-audit/page.js` | metadata | `description` copy |

> Tip: grep the codebase for the old brand name to catch every occurrence. Leave
> cosmetic CSS identifiers (`avenix-word`, `avenix-shimmer`) as-is — renaming them is
> churn with no template value. Long-form marketing content (e.g.
> `src/content/websiteDevPakistan.js`) and the residual file-based KB under
> `src/knowledge/` are bespoke/legacy and are out of scope for this checklist.

---

## Step 4 — Environment variables (`.env.local`)

Actual variable names read by the codebase. Set the same set in Vercel (Step 8).

**Supabase (required)**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; powers the dashboard, KB/Packages CMS,
  leads, and email. Never expose to the client.

**Site (required)**
- `NEXT_PUBLIC_SITE_URL` — canonical deploy URL (drives OG image + canonical tags).

**AI provider (required for Nova to answer)**
- `AI_PROVIDER` — optional; `nvidia` (default) or `groq`.
- `NVIDIA_API_KEY` — required when provider is `nvidia`. Optional overrides:
  `NVIDIA_MODEL`, `NVIDIA_BASE_URL`.
- `GROQ_API_KEY` — required when `AI_PROVIDER=groq`. Optional: `GROQ_MODEL`,
  `GROQ_BASE_URL`.
- `FALLBACK_PROVIDER` — optional opt-in cross-provider fallback.
- (`GEMINI_*` exist in code but Gemini is **not selectable** — ignore.)

**Contact / integrations (public)**
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — international digits, no `+`; required for the
  WhatsApp handoff.
- `NEXT_PUBLIC_CAL_LINK` — Cal.com `username/event-slug`; required for booking.
- `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID` — optional analytics.

**Email (nurture + owner notifications)**
- `RESEND_API_KEY` — required for any email to send.
- `EMAIL_FROM` — optional; cron sender address (defaults to Resend's sandbox sender
  if unset).
- `CONTACT_FROM_EMAIL` — optional; falls back to `client.config` `email.fromName`
  via `onboarding@resend.dev`.
- `CONTACT_TO_EMAIL` — optional; falls back to the contact email.
- `LEAD_NOTIFICATION_EMAIL` — where new-lead notifications are sent.
- `CRON_SECRET` — required to enable the email cron endpoint; the route **fails
  closed (401)** if unset (see `src/app/api/nova/email-cron/route.js`).

---

## Step 5 — Sales packages (start empty, add via dashboard)

A new client starts with **zero packages**. **Do not run**
`supabase/seed/sales_packages_avenix.sql` — that seed is Avenix-only.

1. Confirm the `sales_packages` migration ran (Step 2).
2. Log into `/dashboard` → **Packages** tab → **Add package**.
3. Add each of the client's packages. Rows are automatically scoped to this
   tenant's `companyId` (from `client.config.js`), so no SQL is required. Fields:
   Package ID (stable slug), Name, Short description, Target audience, Recommended
   for (comma tokens the recommender scores against — never the package name),
   Features (one per line), Starting price, Currency, CTA, Display order, Active.

---

## Step 6 — Knowledge base (start empty, add via dashboard)

Also starts empty. Populate via `/dashboard` → **Knowledge**:
- **Documents** tab — facts about the business (services, hours, location, policies).
- **FAQs** tab — question/answer pairs.

Entries are tenant-scoped by `companyId`; Nova retrieves only this client's active
rows. Front-load the key fact into the opening sentence of each entry (the in-app
form hint explains why).

---

## Step 7 — Email templates + nurture (manual, no CMS)

There is **no dashboard CMS and no seed script** for email templates — insert rows
by hand into `email_templates` in the new Supabase project (SQL editor).

- One row per `templateKey` referenced in `client.config.js` `nurture.sequence`
  (e.g. `gym_welcome`, `gym_followup`), each with `company_id` = this client's
  `companyId`, plus `subject`, `html_body`, and the `variables` list. Match the
  reference project's `email_templates` columns.
- Placeholders use `{{ variable }}` syntax (see `renderTemplate` in
  `src/lib/nova/email/emailService.js`).
- The nurture sequence is resolved from `client.config.js` at runtime
  (`src/lib/nova/email/nurtureSequences.js`) — keys must match exactly or the step
  is silently skipped.

The `scheduled_emails` queue is drained by the cron endpoint (Step 8).

---

## Step 8 — Deploy to Vercel

1. Import the client's repo/branch into a **new Vercel project**.
2. Add **all** env vars from Step 4 (Production, Preview as needed).
3. Deploy. Set `NEXT_PUBLIC_SITE_URL` to the final production URL and redeploy if it
   changed.
4. **Email cron is NOT Vercel Cron** (there is no `vercel.json`). Configure an
   **external scheduler** (e.g. cron-job.org) to call:
   ```
   GET https://<site>/api/nova/email-cron
   Header:  Authorization: Bearer <CRON_SECRET>
   ```
   Without this, nurture emails are queued but never sent. GET and POST both work.

---

## Before going live — verification checklist

Run these against the deployed instance:

- [ ] **Grounding test** — open the Nova widget, ask "What services do you offer?"
      Answers should reflect only this client's seeded KB/packages — no Avenix or
      invented content. (If empty, revisit Steps 5–6.)
- [ ] **Pricing guardrail** — ask "How much for a website / membership?" With
      `policy.quotePricesAllowed = false`, Nova must **not** state a specific price.
      Flip to `true` only if the client wants quoted prices, then re-test.
- [ ] **WhatsApp handoff** — trigger the WhatsApp CTA; it must open `wa.me` with the
      configured `NEXT_PUBLIC_WHATSAPP_NUMBER` and the `contact.whatsappMessage`.
- [ ] **Calendar booking** — open the booking embed; it must load the client's
      `NEXT_PUBLIC_CAL_LINK` event.
- [ ] **Packages CMS** — add/toggle a package in `/dashboard` → Packages; confirm it
      appears in the list and the recommender can surface it.
- [ ] **Lead flow + email** (if email configured) — submit a test lead; confirm the
      owner notification (`LEAD_NOTIFICATION_EMAIL`) and that nurture rows land in
      `scheduled_emails`, then that the cron endpoint sends them.
- [ ] **Dashboard auth** — confirm the login user works and `/dashboard` is not
      reachable while logged out.

---

_Grounded in the repo as of this writing. If a step here drifts from the code
(`client.config.js`, `supabase/migrations/`, the dashboard routes, or the env-var
readers), the code is the source of truth — update this guide._
