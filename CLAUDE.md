# Avenix Studio — Project Guide

Next.js 15 (App Router, JS not TS) · React 19 · Tailwind 3 · Supabase · Framer Motion.
`npm run dev` · `npm run build` · `npm run lint` · npm is the package manager (`package-lock.json` only).

## Architecture

- `src/app/**` — routes. Public: `/`, `/about`, `/services`, `/work`, `/blog`, `/contact`, `/free-audit`. Auth'd CRM under `/dashboard`. APIs under `/api`.
- `src/components/sections/**` — homepage/page sections. `shell/` — Header, Footer, Logo. `ui/` — primitives (Section, Reveal, Button, Badge, Tilt, Parallax…). `nova/` — the AI chat widget.
- `src/data/**` — editable config arrays (`services.js`). `src/content/**` — other content arrays (caseStudies, faqs, process, techStack, whyMe…).
- `src/lib/nova/**` — chat engine. `src/knowledge/avenix/*.md` — chatbot knowledge base.
- Path alias `@/*` → `src/*` (`jsconfig.json`). A root-level `data/` would fall outside both the alias and `include` — keep config arrays in `src/data/`.

## Design system — LOCKED

`AVENIX-CLAUDE-DESIGN-SYSTEM.md` is the locked reference. Do not deviate without explicit approval. Key standing rules:

**Positioning** — established digital agency (20–50 employee perception), not a personal portfolio. Copy uses "we/Avenix", never "I/me".

**Theme (§2)** — LIGHT is the default, defined on `:root` in `src/styles/tokens.css`.
Dark survives only as an **intentional contrast block** (hero, CTA band, footer), opted into with `class="theme-dark"`, which re-declares the semantic layer. Any token-driven component dropped inside one flips automatically.

**Tokens** — three layers: Primitive → Semantic → Component. **Components reference SEMANTIC tokens only — never a raw hex.** For tinted washes use `hsl(var(--accent-soft-hsl) / 0.12)`, not a literal `hsl(35 72% 62% / 0.12)`.

- Canvas `--bg` #FFFFFF, `--bg-alt` #FAFAF9, `--surface-raised` #F5F4F1
- Ink `--text-strong` #0B0B0C, `--text` #4B4B52
- Accent: **amber, retained through the flip** (confirmed — not indigo). `--accent` #9E6524 is the AA-safe ink/fill; `--accent-soft` #E3A857 is decorative only, never text.
- Secondary accent `--accent-secondary` muted bronze
- Borders `--border` #E7E5E0, 1px hairline
- Shadows are soft/diffused/low-opacity — no dark-mode glow. Nothing exceeds 0.10 alpha on light.

**Typography (§3)** — **Satoshi** (display/headings) + **Inter** (body/UI) + **Geist Mono** (eyebrows, labels, metrics). All self-hosted via `next/font/local` from `src/fonts` — no build-time network call to any font service, ever. Satoshi ships as **static** weights 400/500/700/900 (`Satoshi-Variable.woff2` is not present), so:
- `--weight-semibold` is **700**, not 600 — Satoshi's statics have no 600 and the browser would otherwise synthesise it.
- Display and body are **both grotesks**. Hierarchy comes from weight, scale, and Geist Mono's textural contrast — *not* from a serif/sans pairing. The earlier Fraunces rationale no longer applies.
- No `font-optical-sizing`: that existed for Fraunces' `opsz` axis and is a no-op for Satoshi.

**Contrast (§12)** — AA minimum. `--amber-700` and `--obsidian-400` are contrast-tuned; re-check ratios before changing any semantic colour.

**Motion (§4)** — the motion stack is **Framer Motion + Lenis**. GSAP and ScrollTrigger are *not* installed and never have been; scroll-linked animation uses `useScroll` / `useTransform` / `useInView` (see `Testimonials.jsx`, `Parallax.jsx`, `BrowserMock.jsx`). Reveal-on-scroll, magnetic buttons, card hover = lift + shadow. 400–600ms, no overshoot on large elements. Always respect `prefers-reduced-motion` (motion duration tokens zero out automatically).

**Never ship fabricated content** — no invented prices, metrics, client names, or capability claims. Pricing uses placeholders until real figures are supplied.

## Homepage section order

Hero → Services → WhyMe → Process → ClientLogoStrip → TechStack → PricingTeaser → FAQ → Contact → Footer (Footer renders in `layout.js`, not `page.js`).

Services and Process are scroll-story panels (`ScrollStorySection`): Services on the **light** variant, Process on the **dark** cinematic panel.

Section eyebrows are hardcoded and **numbered** (`"01 — Services"`). Reordering sections means renumbering them. `PricingTeaser` is a reserved empty slot — when it ships it takes 07 and FAQ/Contact shift to 08/09.

Removed from the homepage but still on disk: `About` (used by `/about`), `Testimonials`, `LeadMagnet` (its form is used by `/free-audit`), `CurrentlyLearning`, `PerfSEO` (its metrics merged into `TechStack`), `CaseStudies` (deleted — replaced by `ClientLogoStrip`).

**Deleted outright:** `AIWorkflow` section and its `aiWorkflow` content export (2026-08-12). `public/images/ai-assistance/` (plan/build/review/ship) is now **orphaned** — kept on disk, referenced by nothing.

## Gotchas

- `/services` renders the same `<Services />` section as the homepage — editing it changes both.
- `src/lib/schema.js` reads `name` + `tagline` off every entry in `src/data/services.js` for JSON-LD `OfferCatalog`. Don't rename those keys.
- `layout.js` injects an inline `INTRO_GATE` script that pauses `.hero-in` / `.hero-line` animations before first paint. Keep those class names on hero entrance elements.
- Env: no `.env.example` is committed. Missing vars degrade gracefully (chat 503s, email falls back to WhatsApp) rather than crashing. See `src/lib/env.js` and `src/lib/nova/providers/providerResolver.js`.
- `next/image` `quality` values must be listed in `images.qualities` in `next.config.mjs` from Next 16 on.
- **The Tailwind spacing scale is remapped, and only partially.** `tailwind.config.js` repoints keys `1,2,3,4,5,6,8,10,12,16,20,24` at `--space-*`, so they do **not** mean what stock Tailwind means: `p-6` is 2rem (not 1.5), `p-10` is 4rem (not 2.5), `p-24` is 12rem (not 6). **Every other key — 7, 9, 11, 14, 18, … — falls through to stock Tailwind**, silently mixing two scales: `mt-7` (1.75rem) is *smaller* than `mt-6` (2rem). Stick to mapped keys. If a value genuinely needs to sit off the scale (optical alignment, not rhythm), write it as an arbitrary value like `sm:mt-[1.75rem]` so the intent is explicit — see `LeadMagnetForm.jsx`. Audited clean 2026-08-18; re-check with `grep -rE "\b(m|p)(t|b|l|r|x|y)?-(7|9|11|14|18)\b"`.
- **`text-muted` / `text-faint` are NOT real utilities — they compile to nothing.** The config nests these under `colors.text`, so the utilities Tailwind actually generates are `text-text-muted` and `text-text-faint`. There are ~133 occurrences of the dead form across ~57 files; every one silently inherits its parent's colour instead. Do **not** bulk-rename them: several (the hero lead over the photograph) rely on the inherited value and would fail AA contrast at the real `--text-muted`. Needs a deliberate per-instance pass.
- Hero background is `public/images/final.webp` (115 KB, q92). `final.png` (1.74 MB) is the retained master and is **referenced by nothing** — delete once the WebP is signed off.
