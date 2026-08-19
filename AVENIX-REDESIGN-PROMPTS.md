# Avenix Studio — Redesign Prompts (Phase-Gated, Token-Optimized)

Paste ONE phase at a time. Wait for STOP. Don't re-explain context Claude Code already has from CLAUDE.md.

## ⚡ Paste this ONCE before Phase 0 (session-wide token rules)

```
Follow these rules for this entire session, all phases:
1. Never re-read a file already read this session unless you just edited it or I flag it as changed.
2. Never re-verify/re-scan files this phase didn't touch — trust prior audit unless something breaks.
3. Batch all edits to a file into one pass — don't reopen the same file across scattered small calls.
4. Don't restate context I already gave (design system, project structure, prior phase output) — reference briefly.
5. No redundant double-check passes — verify once, move on.
6. Reports back: short bullets, file paths, key decisions only — no prose unless input is needed from me.
7. Only fully read a file if you're editing it or it's directly in scope — no proactive exploring outside current phase.
8. If scope is unclear, ask ONE short question instead of exploring the whole codebase to guess.
Confirm, then wait for Phase 0.
```

---

## PHASE 0 — Audit (no code changes)

```
Audit only, zero code changes. Report, in short bullets (paths + one-liners, no full file dumps):
1. File/folder structure: pages, components, sections
2. Current theme tokens (Tailwind config/CSS vars)
3. Current font + loading method
4. Homepage section order + file paths (Hero, Services, About preview, Social Proof, Free Audit, Selected Work, Toolkit, Footer)
5. Services data: hardcoded or config array?
6. About page path + content
7. Selected Work component structure
8. Existing pricing page? (confirm none if absent)
9. Any /public video assets usable for hero bg?
No proposals yet — paths only.
```
**STOP.**

---

## PHASE 1 — Theme + Font (tokens only, no layout/content changes)

```
Merge AVENIX-CLAUDE-DESIGN-SYSTEM.md into CLAUDE.md as locked reference.
Apply globally, styling only — no section reorder, no copy changes:
1. Flip dark theme → light premium palette (bg/ink/accent/borders/shadows per spec)
2. Load new font pairing via next/font, swap + preload, zero CLS
3. Update Tailwind config/CSS vars
4. Token-level pass over existing components (backgrounds/borders/shadows) — not a redesign
5. Verify no broken contrast/invisible elements post-flip
Report: files changed + anything needing manual visual check. One pass, no restating unchanged files.
```
**STOP — visual review.**

---

## PHASE 2 — Hero Rebuild

```
Rebuild homepage Hero per design system §8:
1. Video bg: looping/muted/autoplay, MP4+WebM, poster fallback. Wire to /public/videos/hero-bg.(mp4|webm) — use placeholder poster if video not yet provided, flag it, don't fabricate video content
2. Dark overlay for text contrast
3. 2-3 headline options (agency-scale positioning, covering web/mobile/AI/marketing) — don't auto-pick
4. Primary + secondary CTA
5. Mobile: fall back to poster on slow connections, skip video weight on mobile data
6. Responsive, no CLS
Report: the 2-3 headline options only.
```
**STOP — confirm copy + provide video file.**

---

## PHASE 3 — Services Rebuild

```
Rebuild homepage Services per design system §6:
1. Move data to data/services.js (config array, not hardcoded JSX)
2. Replace with final 8: Web Dev, Mobile App Dev, AI Automation & Agents, AI Chatbots, Digital Marketing, Graphic Design & Branding, Social Media Management, Video Editing
3. Each: icon, title, 2-line desc, tech/tool chips (add chips where missing), Learn More link
4. New premium card design (light theme, hover lift, soft shadow)
5. Responsive grid, no overflow
Report: final services array only.
```
**STOP — review copy/chips.**

---

## PHASE 4 — Pricing (structure only, no invented numbers)

```
Build Pricing page/section per design system §7:
1. 3 tracks: Website, Mobile App, Digital Marketing — 3 tiers each (propose names)
2. Feature-list placeholders per tier
3. data/pricing.js — mark every price field PRICE_TBD, never invent real figures
4. Premium tier UI, recommended-tier highlight
5. Responsive
Report: full config (tiers + placeholders) only.
```
**STOP — I'll fill in real numbers/features.**

---

## PHASE 5 — About Page Rebuild

```
Rebuild /about per design system §5:
1. Vision, Mission, company story — no portfolio explanation, no services list
2. Position as established 20-50 person agency — no fabricated names/photos, flag if real team assets needed
3. Apply new design system
4. Confirm nothing links from Home into an About preview block
Report: vision/mission copy draft only.
```
**STOP — approve copy.**

---

## PHASE 6 — Homepage Cleanup

```
Per design system §11:
1. Delete About preview, Social Proof, Free Audit sections from Home
2. Final order: Hero → Services → Selected Work → Toolkit → Pricing teaser (link /pricing) → CTA → Footer
3. Fix any dead links/nav refs from removed sections
4. Fix spacing/rhythm gaps left behind
Report: final section order + dead-link check, one line each.
```
**STOP — visual review.**

---

## PHASE 7 — Selected Work Redesign

```
Redesign per design system §9:
1. Premium case-study cards: large media, name, 1-line result-driven desc, category tag, hover reveal
2. Use existing project data (confirm Scout stays excluded)
3. New design system styling
4. Responsive (grid or scroll — match existing codebase pattern)
Report: list of projects included only.
```
**STOP — confirm public-facing project list.**

---

## PHASE 8 — Toolkit Realignment

```
Per design system §10:
1. Group tech/tools by the 8 service categories
2. New chip/badge styling, light theme
3. Responsive
Report: grouped structure only.
```
**STOP.**

---

## PHASE 9 — Final QA (fixes only, no new features)

```
QA pass, fix failures, don't just report them:
1. Breakpoints 320/375/425/768/1024/1440/1920 — no h-scroll, no breaks
2. Accessibility: semantic HTML, focus states, AA contrast, ARIA
3. Performance: hero video LCP/CLS, lazy images, font loading
4. SEO: titles/meta/OG per page (Home/About/Services/Pricing/Work)
5. No dead links/console errors
6. Run Playwright if already configured
Report: pass/fail per category only.
```
**STOP — final review before deploy.**

---

## Confirm before relevant phase
- Brand accent: keep amber or switch? (before P1)
- Mobile stack: React Native or Flutter? (before P3)
- Hero video file (before P2 finalize)
- Real pricing + features (before P4 finalize)
- Public portfolio list (before P7)
