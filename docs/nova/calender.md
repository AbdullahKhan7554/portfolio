# Nova — Calendar Booking Feature (Cal.com)

Context: Next.js 15 project. Nova lead capture flow already exists (`fullName → email → phone → projectDescription → budget → timeline → completed`). WhatsApp handoff (wa.me link + button) already shipped on lead completion — this feature runs alongside it, not replacing it.

Provider: Cal.com (free tier, `@calcom/embed-react`).

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 0 — Prerequisite (manual, not code)

Before any code: confirm Abdullah has a Cal.com account + event type created (e.g. "Avenix Discovery Call", 15-30 min) and has the event link handle (e.g. `avenix/discovery-call`). Store as env var `NEXT_PUBLIC_CAL_LINK=avenix/discovery-call` in `.env.local` and Vercel. STOP — do not proceed to Phase 1 until this env var is confirmed present.

---

## Phase 1 — Install + Embed Utility

1. `npm install @calcom/embed-react`
2. Create `src/lib/nova/calendar/calConfig.js` — exports `CAL_LINK` read from `process.env.NEXT_PUBLIC_CAL_LINK`, exports a shared `calConfig` object (theme: match existing widget dark/light mode if detectable, else default).
3. No wiring into chat flow yet.

STOP after Phase 1 for review.

---

## Phase 2 — Trigger on Lead Completion

1. In the same lead-completion turn where `whatsappLink` is attached to the response payload, also attach `calBookingAvailable: true` (boolean flag only — no need to duplicate lead data, the embed doesn't need it).
2. Update closing bot message to also mention booking a call as an option (short, one line, alongside existing WhatsApp mention — do not remove WhatsApp option).

STOP after Phase 2 for review.

---

## Phase 3 — Frontend Button + Modal

1. In the chat widget, if response includes `calBookingAvailable`, render a second CTA button next to (or below) the existing WhatsApp button: "Book a Call".
2. On click, open Cal.com embed in a modal/popup using `@calcom/embed-react`'s `Cal` component or `getCalApi` popup trigger — do NOT navigate away from the page.
3. Match existing widget button styling (same size/radius as WhatsApp button, different accent color, no new design system).
4. Mobile-responsive — modal must work at 375px width without breaking layout.

STOP after Phase 3 for review — test end-to-end: complete a fake lead, click "Book a Call", confirm Cal.com modal opens and a real booking can be made.

---

## Not in scope
- No server-side Cal.com API integration (webhooks, booking sync to Supabase) — this phase is frontend embed only.
- No changes to lead capture question flow.
- No removal or modification of existing WhatsApp handoff feature.
