# Avenix Studio — Internal Leads Dashboard

Context: Next.js 15 project. Nova already writes to `leads` table in Supabase (RLS locked to service-role). Goal: an internal dashboard to view/manage leads without opening Supabase directly. Built with future resale/multi-tenant potential in mind — proper auth from day one, not a shortcut.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 0 — Prerequisite (manual, not code)

Confirm Supabase project has Auth enabled (Email provider). Create one admin user manually via Supabase Dashboard → Authentication → Users → Add user (Abdullah's email + password). Note the project's `NEXT_PUBLIC_SUPABASE_ANON_KEY` is already present (used for client-side auth calls; separate from the service-role key used server-side for leads writes). STOP — confirm this is done before Phase 1.

---

## Phase 1 — Auth Setup

1. Install `@supabase/ssr` if not already present (check `package.json` first — do not reinstall if present).
2. Create `src/lib/supabase/client.js` (browser client) and `src/lib/supabase/server.js` (server client for Server Components/Route Handlers), following `@supabase/ssr` current recommended pattern.
3. Create `middleware.js` (or extend existing one if present — check first) to protect all routes under `/dashboard/*`: unauthenticated requests redirect to `/dashboard/login`.
4. Create `src/app/dashboard/login/page.jsx` — minimal email/password form, calls Supabase auth `signInWithPassword`, redirects to `/dashboard` on success, shows error on failure. Match existing site's design tokens (no new design system) but keep it simple/utilitarian — this is an internal tool, not a marketing page.

STOP after Phase 1 for review — verify login/logout/redirect works before continuing.

---

## Phase 2 — Leads List View

1. Create `src/app/dashboard/page.jsx` (Server Component) — fetch all rows from `leads` table (server-side, using service-role or an authenticated RLS policy — decide based on what's simpler given existing RLS setup; flag the decision for review rather than guessing silently).
2. Table view: name, email, phone, project description (truncated), budget, timeline, created date, status. Sortable by created date (newest first, default).
3. Add a `status` column to the `leads` table if it doesn't exist (`new` | `contacted` | `converted` | `lost`, default `new`) — Supabase migration, RLS unchanged (still service-role/authenticated-only).
4. Basic search/filter: by name/email text match, and by status dropdown.

STOP after Phase 2 for review.

---

## Phase 3 — Lead Detail + Status Update

1. Click a lead row → detail view (modal or `/dashboard/leads/[id]`) showing full project description, all captured fields, timestamps.
2. Status dropdown editable inline (updates `leads.status` via authenticated Supabase client call, optimistic UI update).
3. Quick-action buttons: "Open WhatsApp" (reuse existing `buildWhatsappLink` util if applicable field data present), "Copy email".

STOP after Phase 3 for review — full end-to-end test: login → view leads → change status → confirm persisted → logout → confirm redirect back to login.

---

## Not in scope (future phases, not now)
- Multi-tenant / multi-client dashboard access (would need org/role tables) — noted for later since this is being considered a sellable product, but out of scope for this build.
- Analytics/charts.
- CRM export/integration.
