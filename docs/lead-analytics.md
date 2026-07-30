# Avenix Dashboard — Lead Analytics

Context: Next.js 15 project. Dashboard exists at `/dashboard` (Supabase auth, service-role reads). Data available: `leads` (status, source, created_at, budget, timeline, hubspot_synced), `conversations`/`conversation_messages` (linked via lead_id, so drop-off vs completed conversations are distinguishable). Goal: an analytics page giving Abdullah a real read on lead volume, conversion, and source performance — not vanity charts.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 1 — Investigate + Report (no code changes)

1. Confirm exact live columns/values in `leads` (status values in use, source values in use, date range of existing data, row count) and `conversations` (how many have `lead_id IS NULL` — i.e. drop-offs — vs linked).
2. Report whether enough real data exists yet to make charts meaningful (if there are only ~10 leads total, some chart types — like a 30-day trend line — will look sparse; flag this honestly rather than building something empty-looking).
3. Propose the specific metrics to build (see candidate list below), adjusted for what the real data can actually support. STOP for direction before Phase 2.

Candidate metrics (confirm/cut based on Phase 1 findings):
- Total leads (all-time + last 7/30 days)
- Conversion funnel: conversations started → leads captured → status=won (drop-off visible at each stage)
- Leads by source (chatbot vs contact_form) — count + conversion rate per source
- Leads by status (new/contacted/won/lost) — current pipeline snapshot
- Leads over time (daily/weekly count, only if enough date range exists)
- Average time-to-contact (created_at → status changed from 'new', if status-change timestamps are tracked — flag if they aren't, since `leads` may not currently log status-change history)

---

## Phase 2 — Data Layer

1. Create `src/lib/supabase/analytics.js` — server-side, service-role, aggregate queries for the confirmed metric set (prefer SQL aggregation via PostgREST/RPC over pulling all rows and computing in JS, if the row count could grow).
2. If time-to-contact requires a status-change timestamp that doesn't exist yet, add a lightweight `leads.status_changed_at` column (updated whenever `updateLeadStatus` runs) — flag this as a small schema addition, get confirmation before applying.

STOP after Phase 2 for review.

---

## Phase 3 — Dashboard Page

1. Create `/dashboard/analytics` page — add nav link alongside existing dashboard links.
2. Render the confirmed metrics: summary number cards (total/7-day/30-day) + simple charts (bar for source/status breakdown, line for trend if data supports it). Use a lightweight charting approach consistent with the rest of the dashboard's simple/utilitarian style — no heavy new dependency if avoidable (check what's already in `package.json` first).
3. Mobile-responsive, matches existing dashboard look (no new design system).

STOP after Phase 3 for review — full test: open `/dashboard/analytics`, confirm numbers match a manual spot-check against the `leads` table.

---

## Not in scope
- No predictive/AI-driven insights — this phase is descriptive analytics only.
- No date-range picker/export — future addition if needed.
- No changes to lead capture or status-update logic beyond the optional `status_changed_at` column.
