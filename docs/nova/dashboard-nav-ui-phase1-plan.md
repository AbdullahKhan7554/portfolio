# Dashboard Shared Nav — Phase 1 Plan (Shared Layout + Persistent Nav)

## Context

The dashboard pages (`/dashboard`, `/dashboard/leads/[id]`, `/dashboard/analytics`) each render
their own inline header with a title, "Signed in as …", ad-hoc nav links, and a `LogoutButton` —
there is **no shared navigation**, so moving between sections means typing URLs. Goal: one
persistent nav shell across all `/dashboard/*` routes (sidebar on desktop, collapsible top bar on
mobile), with the active route highlighted and the user email shown once.

**Key constraints found in Phase 1 investigation:**
- **No `layout.jsx` exists** under `src/app/dashboard/` today; each page renders its own
  `<main className="min-h-screen bg-[var(--bg)] px-6 py-8 …">`.
- **The login page lives at `/dashboard/login`**, so a `dashboard/layout.jsx` will wrap it too —
  the nav must NOT appear there.
- **`middleware.js`** (`src/middleware.js`, matcher `/dashboard/:path*`) already gates auth:
  unauthenticated → redirect to `/dashboard/login`; authed on login → redirect to `/dashboard`.
  So on **every `/dashboard/*` route except login, `auth.getUser()` returns a user**; on login it
  returns null. This gives a clean, route-group-free way to exclude login from the shell.
- **No Changelog route exists** (only `login`, `leads/[id]`, `analytics`). Nav items = **Leads,
  Analytics, Logout**.
- `LogoutButton` (`src/app/dashboard/LogoutButton.jsx`) is already a reusable client component.

Token discipline: minimal comments, reuse existing `var(--…)` tokens + Tailwind, no new dependency
(`lucide-react` is already installed for the mobile menu icon).

## New files

### 1. `src/app/dashboard/layout.jsx` — Server Component shell
- `createClient()` (`@/lib/supabase/server`) → `auth.getUser()`.
- **`if (!user) return children;`** — the login page (only unauthenticated `/dashboard` route)
  renders bare, with its own full-screen `<main>` untouched. No route group needed.
- Otherwise render the shell:
  ```jsx
  <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <div className="md:flex">
      <DashboardNav userEmail={user.email} />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  </div>
  ```
  (Layout owns `min-h-screen`, background, base text color, and main padding — so pages stop
  setting those.)

### 2. `src/app/dashboard/DashboardNav.jsx` — Client Component (`'use client'`)
Active-route highlighting via **`usePathname()`** (the clean App-Router approach; the server layout
can't read the path easily). Also holds mobile open/close state.
- `items = [{ href: '/dashboard', label: 'Leads' }, { href: '/dashboard/analytics', label: 'Analytics' }]`.
- `isActive(href)` = for `/dashboard`: `pathname === '/dashboard' || pathname.startsWith('/dashboard/leads')` (so the lead-detail page keeps "Leads" active); else `pathname.startsWith(href)`.
- Active link: `bg-[var(--surface)] text-[var(--text-strong)]`; inactive: `text-[var(--text-muted)] hover:text-[var(--text)]`.
- **Desktop sidebar**: `<aside className="hidden md:flex md:h-screen md:w-56 md:flex-col md:sticky md:top-0 border-r border-[var(--border)] px-3 py-6">` — brand label, nav links, then `mt-auto` block with the truncated user email + `<LogoutButton />`.
- **Mobile top bar**: `<div className="md:hidden …">` with brand + a hamburger button (`Menu`/`X` from `lucide-react`) toggling `useState(open)`; when open, a dropdown `<nav>` with the same links (each `onClick={() => setOpen(false)}`), user email, and `<LogoutButton />`.

## Edits to existing pages (strip per-page chrome; keep content)

For each of `src/app/dashboard/page.jsx` (leads list) and `src/app/dashboard/analytics/page.jsx`:
- Remove the outer `<main className="min-h-screen bg-[var(--bg)] px-6 py-8 …">` wrapper — return
  just the inner content container (`<div className="mx-auto max-w-6xl">…</div>`); the layout now
  provides `<main>`, background, and padding.
- Remove the header block's **"Signed in as …", the nav `Link`(s), and `<LogoutButton />`** (all now
  in the layout). Keep the page's own `<h1>` title as content.
- Remove the now-dead `auth.getUser()` call and its `createClient` import (each page used `user`
  only for the "Signed in as" line; `listLeads`/`getLeadAnalytics` use the admin client internally).
  Drop the `LogoutButton` import; drop the `Link` import from `analytics/page.jsx` (its only `Link`
  use was the removed nav).

For `src/app/dashboard/leads/[id]/page.jsx`:
- Remove the outer `<main min-h-screen …>` wrapper → return the `<div className="mx-auto max-w-3xl">`
  content. **Keep** the "← Back to leads" link (contextual sub-page nav; harmless alongside the
  sidebar) — flagged as optional if you'd rather drop it.

No data-fetching logic changes; `login/page.jsx` and `middleware.js` are untouched.

## Not in scope (Phase 1)
- No visual polish / spacing/typography audit / mobile leads-table rework (that's Phase 2).
- No new dashboard sections; no new dependency; no auth changes.

## Verification
1. `npm run build` + `npx eslint` the new/changed files.
2. Run the app, log in, and confirm: the sidebar shows **Leads / Analytics** with the current
   section highlighted and the user email + Logout at the bottom; navigating Leads ↔ Analytics ↔ a
   lead detail works **by sidebar clicks only** (no URL typing); the lead-detail page keeps "Leads"
   highlighted.
3. **Login page**: sign out → `/dashboard/login` renders with **no** sidebar/nav (bare form).
4. **Mobile (375px)**: the sidebar collapses to a top bar; the hamburger opens/closes the menu; a
   link tap navigates and closes the menu.
5. Confirm no page renders a duplicate header/logout anymore.

*(Note: a live visual check needs the Chrome extension connected + a dashboard login; if it's
unavailable I can only verify build/lint + logic, same limitation as the analytics phase.)*
