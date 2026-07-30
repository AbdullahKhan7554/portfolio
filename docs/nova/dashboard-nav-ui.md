# Avenix Dashboard — Shared Nav Layout + UI Polish

Context: Next.js 15 project. Dashboard pages (`/dashboard`, `/dashboard/leads/[id]`, `/dashboard/analytics`, and any future ones) each currently render their own inline header — no shared navigation, so moving between sections requires typing URLs manually. Goal: a persistent sidebar/topbar nav across all `/dashboard/*` pages, plus general visual polish.

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 1 — Shared Layout + Persistent Nav

1. Create `src/app/dashboard/layout.jsx` — Server Component wrapping all `/dashboard/*` routes. Contains:
   - A persistent sidebar (desktop) / top bar with collapsible menu (mobile) listing: Leads, Analytics, (Changelog if it exists), and Logout at the bottom.
   - Active route highlighted (compare `usePathname()` in a small client sub-component, or pass the current path server-side — pick whichever fits Next 15 App Router cleanly).
   - Signed-in user email shown once here (not repeated on every page).
2. Remove the duplicated inline header/nav-link code from `page.jsx` (leads list), `leads/[id]/page.jsx`, and `analytics/page.jsx` — they keep their own content but no longer render their own top header/logout button (now lives in the layout).
3. Auth check stays in `middleware.js` as-is; layout itself doesn't need to re-check auth (middleware already gates it), but should render user info if easily available server-side.

STOP after Phase 1 for review — verify: navigate between Leads/Analytics/Logout using only sidebar clicks, no manual URL typing needed. Confirm mobile (375px) nav collapses cleanly.

---

## Phase 2 — Visual Polish

1. Audit current spacing/typography consistency across the three pages (leads list, lead detail, analytics) — fix any inconsistent card padding, font sizes, or color token usage now that they share a layout shell.
2. Improve the leads table on mobile — currently a wide table; consider a card-based stacked layout below a breakpoint (check what's already there before assuming it's broken).
3. Add subtle empty-state and loading-state polish where currently bare (e.g. "No transcript available" styling, empty leads list).
4. No new design system, no new dependency — refine within the existing `var(--...)` token set and Tailwind utilities already in use.

STOP after Phase 2 for review — full visual pass across desktop (1440px), tablet (768px), and mobile (375px).

---

## Not in scope
- No new dashboard sections/pages in this pass.
- No changes to data-fetching logic — layout/visual only.
