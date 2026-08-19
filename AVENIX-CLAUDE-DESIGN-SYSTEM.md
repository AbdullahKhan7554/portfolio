# Avenix Studio — Redesign Design System (v2)
**Status: LOCKED reference. Merge into project CLAUDE.md. Do not deviate without explicit approval.**

## 1. Positioning Shift
- FROM: personal portfolio feel
- TO: established digital agency (20–50 employee scale perception), inspired by cubix.co structure (NOT cloned — original layout, original copy, original visuals)
- Tone: premium, confident, enterprise-credible, still conversion-focused for local (Lahore/Pakistan + international) clients

## 2. Theme — Dark → Light Premium
- Base background: `#FFFFFF` (primary), `#FAFAF9` / `#F5F4F1` (section alternation, warm off-white — avoid clinical pure-white fatigue)
- Ink/text: `#0B0B0C` (headings), `#4B4B52` (body)
- Primary accent: keep ONE brand accent (recommend deep indigo/violet `#4338CA` or the existing amber if brand equity already built — confirm with Abdullah which brand color survives the theme flip)
- Secondary accent: muted gold/bronze for premium touches (dividers, icons, hover states) — NOT loud/neon on white
- Borders/dividers: `#E7E5E0` hairline, 1px
- Shadows: soft, diffused, low-opacity (`0 20px 60px -20px rgba(0,0,0,0.08)`) — no hard dark-mode glow shadows anymore
- Dark sections allowed ONLY as intentional contrast blocks (e.g. hero, CTA band, footer) — not the whole site

## 3. Typography
**SHIPPED PAIRING (updated 2026-08-12): Satoshi + Inter + Geist Mono.**
- Display/Headings: **Satoshi** (Fontshare). Self-hosted via `next/font/local`.
- Body/UI: **Inter** (variable, self-hosted).
- Eyebrows/labels/metrics: **Geist Mono**.

⚠️ The original rationale here called for a serif/grotesk contrast (Fraunces over
Inter). **That no longer applies** — Satoshi and Inter are both grotesks, so the
hierarchy is NOT carried by a serif/sans contrast. It is now carried by:
  - **weight and scale** — headings sit at 500 (700 for the semibold tier)
    against 400 body, at much larger sizes;
  - **letterform character** — Satoshi is geometric with closed apertures and a
    tighter, more constructed feel; Inter is neutral and humanist-leaning, tuned
    for small sizes;
  - **Geist Mono** as the third voice, which now does more work: it is the only
    face providing genuine textural contrast, so eyebrows/labels matter more to
    the hierarchy than they did under the serif pairing.
This is a flatter, more modern, more "product" typographic system than the
editorial one originally specified. Deliberate, not accidental.

- Load via `next/font`, apply consistently — no per-section font drift
- Type scale: establish clear hierarchy (H1 56–72px desktop / 32–40px mobile, H2 40–48px, body 16–18px)
- Satoshi statics have **no 600**: `--weight-semibold` is mapped to **700** so
  the browser never synthesises a weight. Revisit if the variable file is wired.

## 4. Motion
- Framer Motion + Lenis (the actual installed stack — GSAP/ScrollTrigger are NOT
  installed and were never in this project; corrected 2026-08-12). Scroll-linked
  work uses `useScroll` / `useTransform` / `useInView` — reveal-on-scroll,
  magnetic buttons, premium card hover (lift + shadow + subtle scale)
- Respect `prefers-reduced-motion`
- No motion sickness — max 400–600ms easing, no bouncy overshoot on large elements

## 5. Site Structure (Target)
- **Home**: Hero (video bg) → Services (grid, expanded) → Selected Work (premium case-study cards) → Toolkit/Tech Stack → Pricing teaser (link to full pricing) → CTA band → Footer
  - REMOVED from Home: About section, Social Proof section, Free Audit section
- **About** (existing page, rebuilt): Vision, Mission, Company story, team/agency scale positioning (20–50 employees) — NOT portfolio, NOT services list
- **Services** (new expanded section/page): all categories below
- **Pricing** (new page or robust section): 3 package tracks — Website, Mobile App, Digital Marketing
- **Work/Portfolio**: existing, restyled

## 6. Services — Final List (replaces current 6-card set)
1. **Web Development** — Next.js, React, TypeScript, Tailwind CSS, CMS integration, Supabase
2. **Mobile App Development** — React Native / Flutter (confirm which Avenix actually offers), cross-platform, app store deployment
3. **AI Automation & AI Agents** — workflow automation, WhatsApp Business API integration, n8n, custom agent pipelines
4. **AI Chatbots** — Groq/LLM-powered chat, lead capture, CRM handoff, website + WhatsApp
5. **Digital Marketing** — SEO (on-page + off-page), Google Ads, Meta Ads, Analytics, AEO/GEO
6. **Graphic Design & Branding** — Identity, Logo, Guidelines, Brand systems
7. **Social Media Management** — Content, Strategy, Growth, Posting
8. **Video Editing** — Reels, YouTube, Shorts, Promos

Each service card: icon, title, 2-line description, tech/tool chips (like current screenshot pattern), "Learn More" link. Add tech-stack chips even to services that didn't have them before (AI Automation, AI Chatbots, Mobile).

## 7. Pricing — Structure Only (numbers TBD by Abdullah)
Three package tracks, each with 3 tiers (Starter / Growth / Premium or similar naming):
- **Website Packages** — landing page vs multi-page vs full custom app
- **Mobile App Packages** — MVP vs full-featured vs enterprise
- **Digital Marketing Packages** — monthly retainer tiers (SEO+Ads+Social combinations)

⚠️ **Actual PKR/USD figures are NOT invented.** Claude Code must insert a clearly marked `{{PRICE_PLACEHOLDER}}` or a pricing config file (`data/pricing.js`) for Abdullah to fill in real numbers before launch. Never ship fabricated prices to production.

## 8. Hero Section
- Full-viewport or near-full-viewport section
- Background: looping muted autoplay video (compressed, WebM+MP4 fallback, poster image for LCP), subtle dark overlay for text contrast even on the light theme (hero can be the one dark-contrast section)
- Headline: agency positioning statement (not "I build websites" — "We build [X] for ambitious brands")
- Subtext: 1–2 lines, credibility + scope (web, mobile, AI, marketing)
- Primary CTA + secondary CTA (e.g. "Start a Project" / "See Our Work")
- Small trust row optional (tech logos strip) — keep tasteful, not corporate-cliché

## 9. Selected Work / Portfolio
- Premium case-study card treatment: large image/video preview, project name, 1-line result-oriented description, category tag, hover reveal
- Grid or horizontal-scroll layout — pick one, execute cleanly

## 10. Toolkit / Tech Stack Section
- Reorganize to mirror the 8 services above (grouped by category: Web, Mobile, AI, Marketing, Design tools)

## 11. Removed Sections
- Social Proof section (client logos/testimonials strip) — DELETE
- Free Audit CTA section — DELETE
- About preview block on Home — DELETE (content moves fully to /about)

## 12. Non-negotiables (from existing standards)
- Mobile-first, no horizontal scroll, breakpoints 320/375/425/768/1024/1440/1920
- Accessibility: semantic HTML, focus states, contrast AA minimum even on new light theme
- Performance: video hero must lazy-load appropriately, poster image for LCP, no CLS from font swap (use `font-display: swap` + preload)
- SEO: title/meta/OG per page, heading hierarchy preserved through restructure
