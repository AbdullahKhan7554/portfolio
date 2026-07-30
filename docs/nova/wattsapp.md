# Nova — WhatsApp Handoff Feature

Context: Next.js 15 project, Nova chatbot lead capture flow already exists (`fullName → email → phone → projectDescription → budget → timeline → completed`). Lead data available in lead state object after `leadSaved=true`.

WhatsApp number: `923026234429` (E.164, no +, no spaces).

Token discipline: minimal comments, no explanatory prose in code, no redundant logging beyond what's specified.

---

## Phase 1 — WhatsApp Link Utility + Config

1. Add env var: `WHATSAPP_NUMBER=923026234429` (also add to `.env.local` and note for Vercel).
2. Create `src/lib/nova/whatsapp/buildWhatsappLink.js`:
   - Export `buildWhatsappLink(lead)` where `lead = { fullName, projectDescription, budget, timeline }`.
   - Build a pre-filled message: `Hi Avenix Studio, I'm {fullName}. I need: {projectDescription}. Budget: {budget}, Timeline: {timeline}.`
   - URL-encode the message.
   - Return `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodedMessage}`.
   - Handle missing fields gracefully (omit that sentence fragment if field empty, never print "undefined").

STOP after Phase 1 for review.

---

## Phase 2 — Trigger on Lead Completion

1. In the lead-completion turn (where `leadSaved=true` is set, same place internal notification email is triggered), call `buildWhatsappLink(lead)` and attach the URL to the chat response payload as `whatsappLink` field.
2. Do NOT block or delay lead saving / email flow — this is additive only.
3. Update the closing bot message to mention WhatsApp as an option, e.g.: "Aap chahain to seedha WhatsApp pe bhi baat kar sakte hain" / English equivalent — keep it short, one line, no rewrite of existing completion logic.

STOP after Phase 2 for review.

---

## Phase 3 — Frontend Button

1. In the chat widget UI component (wherever bot messages render), if response includes `whatsappLink`, render a styled WhatsApp CTA button below that message bubble.
2. Button: opens `whatsappLink` in new tab (`target="_blank" rel="noopener noreferrer"`), WhatsApp brand green, small WhatsApp icon (lucide-react `MessageCircle` if no brand icon available), label "Continue on WhatsApp".
3. Mobile-responsive, matches existing widget styling (no new design system — reuse existing chat widget tokens).

STOP after Phase 3 for review — test end-to-end (complete a fake lead flow, click button, confirm wa.me link opens with correct prefilled text and number).

---

## Not in scope
- No WhatsApp Business API integration (this is just a wa.me deep link, no server-side WhatsApp messaging).
- No changes to lead capture question flow.
