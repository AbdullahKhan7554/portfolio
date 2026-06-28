# Avenix Studio — Portfolio

Premium Full-Stack portfolio for **Avenix Studio** (founder & lead developer: **Abdullah Khan**), built to the **"Obsidian Atelier"** design system. Cinematic dark canvas, a single Aurelian-amber accent, editorial typography, and motion used as punctuation — engineered for Core Web Vitals and WCAG 2.2 AA.

> Built with **Next.js (App Router) · JavaScript · Tailwind CSS · Framer Motion · Lenis**. Deploys on **Vercel**.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (placeholders work out of the box)
cp .env.example .env.local

# 3. Run
npm run dev          # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run format` | Prettier write |

The site **builds and runs with placeholders** — no real keys required to develop or deploy a preview.

---

## Configuration model

Two layers, by design — **no component ever hardcodes brand data or secrets.**

### 1. `src/config/site.js` — public, non-secret info (the single source of truth)
Brand name, founder, tagline, navigation, social links, contact channels, SEO defaults, CV path, Organization-schema data. Edit here to rebrand; nothing else changes.

### 2. `.env.local` — per-environment values & secrets
| Variable | Public? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical URL (metadata, canonical tags, sitemap, OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | WhatsApp Business number (digits only, intl format) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | ✅ | Public email shown on site |
| `NEXT_PUBLIC_CONTACT_PHONE` | ✅ | Public phone shown on site |
| `NEXT_PUBLIC_GA4_ID` | ✅ | Google Analytics 4 ID (blank = disabled) |
| `NEXT_PUBLIC_CLARITY_ID` | ✅ | Microsoft Clarity ID (blank = disabled) |
| `RESEND_API_KEY` | 🔒 secret | Email delivery for forms |
| `CONTACT_FROM_EMAIL` | 🔒 secret | Verified sender |
| `CONTACT_TO_EMAIL` | 🔒 secret | Inbox that receives leads |

`NEXT_PUBLIC_*` are exposed to the browser (safe). Everything else is **server-only** — read solely in `src/lib/env.js` and never imported into client code. `.env.local` is git-ignored.

---

## Replace-placeholders checklist (before launch)

- [ ] `.env.local` → real `NEXT_PUBLIC_SITE_URL`, WhatsApp number, email, phone
- [ ] `.env.local` → `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (enables the contact + lead forms; until then they gracefully fall back to WhatsApp)
- [ ] `.env.local` → `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`
- [ ] `src/config/site.js` → real `social` links (GitHub, LinkedIn, …)
- [ ] `public/abdullah-khan-cv.pdf` → replace placeholder with the real CV
- [ ] `src/content/testimonials.js` → replace placeholder quotes with real client words, set `placeholder: false` (proof **stats are already real**)
- [ ] Optional: swap the `BrowserMock` frames for real screenshots of the live sites

---

## Content

All structured content is typed, data-shaped, and CMS-agnostic (documented upgrade path: MDX/Velite or Sanity, no rendering changes):

| File | Content |
|---|---|
| `src/content/caseStudies.js` | 6 real projects (only documented metrics) |
| `src/content/services.js` | Pricing packages |
| `src/content/faqs.js` | Client FAQ (+ FAQPage schema) |
| `src/content/blog.js` | Insights articles (+ Article schema) |
| `src/content/testimonials.js` | Real proof stats + placeholder quotes |
| `src/content/process.js`, `techStack.js`, `whyMe.js` | Process, stack, differentiators |

---

## Project structure

```
src/
  app/            # routes: /, /work, /work/[slug], /services, /about,
                  #         /blog, /blog/[slug], /contact, /free-audit,
                  #         api/contact, api/lead, sitemap, robots, opengraph-image
  components/
    ui/           # Button, Section, Card, Accordion, Marquee, Counter, Field, …
    sections/     # Hero, CaseStudies, Services, WhyMe, Process, … (home sections)
    shell/        # Header, Footer, Logo
    forms/        # ContactForm, LeadMagnetForm
    providers/    # SmoothScroll (Lenis)
  config/site.js  # centralized public config (single source of truth)
  content/        # typed content modules
  lib/            # seo, schema, analytics, validation, email, fonts, utils
  styles/tokens.css  # Obsidian Atelier design tokens (primitive → semantic → component)
```

---

## SEO, performance & accessibility

- Per-route metadata, canonical URLs, dynamic `sitemap.xml` + `robots.txt`
- JSON-LD: Organization, Person, WebSite, BreadcrumbList, FAQPage, Article
- Dynamic Open Graph image at `/opengraph-image` (also used for Twitter)
- RSC by default; client components only where interactive; static/SSG rendering
- `next/font` (Fraunces + Geist) self-hosted, zero CLS; `next/image` AVIF/WebP
- All motion is transform/opacity only and respects `prefers-reduced-motion`
- WCAG 2.2 AA: semantic landmarks, skip link, focus-visible, keyboard support, AA contrast

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add every variable from `.env.example` under **Settings → Environment Variables**.
4. Deploy. Add your custom domain and set `NEXT_PUBLIC_SITE_URL` to it.

---

© Avenix Studio. Built with Next.js, deployed on Vercel.
