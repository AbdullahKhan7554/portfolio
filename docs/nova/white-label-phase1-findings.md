# Nova White-Label — Phase 1 Findings (Audit)

Audit only. No code changed. Companion to `docs/nova/white-label-template.md` (the brief).
Goal: make Nova a clean, reusable template — every client-specific value in ONE config file/set
of env vars. Per-client independent deployments (NOT shared multi-tenancy).

**Legend:** (a) already env/config-driven — good · (b) hardcoded string → move to config ·
(c) Avenix-specific data/logic → make data-driven (config/KB), not code.

## Already clean (no change needed) — (a)
- **Prompts / persona:** `prompts/{systemPrompt,salesPrompt,faqPrompt}.js` are fully parameterized —
  `assistantName`/`brandName` are injected; "Nova" is never hardcoded in prompt text. The hard part is done.
- **Cal.com:** `calendar/calConfig.js` — pure env `NEXT_PUBLIC_CAL_LINK`, no Avenix literal.
- **HubSpot:** `crm/hubspotClient.js` + `crm/pushLeadToHubspot.js` — env `HUBSPOT_ACCESS_TOKEN`, standard
  contact/deal properties, **no Avenix pipeline/owner/property IDs**. Confirmed generic.
- **Lead owner alert:** `LEAD_NOTIFICATION_EMAIL` — env, silent skip, no hardcoded fallback.
- **Secrets:** AI provider keys, Resend, Supabase, WhatsApp Cloud API tokens — all env-driven.

## Inventory + classification

| Area | Location | Value(s) | Class |
|---|---|---|---|
| Site URL | `config/site.js:19` | env `NEXT_PUBLIC_SITE_URL`, fallback `avenixstudios.com` | a/b |
| Brand identity | `config/site.js:24-38` | name, legalName, monogram `AS`, founder `Abdullah Khan`, tagline, descriptor, foundingYear, shortDescription | b |
| Contact | `config/site.js:44-59` | email/phone/whatsapp via env but Avenix fallbacks; `whatsappMessage`, location `Lahore`, timezone, address | a/b |
| Social + SEO | `config/site.js:75-131` | github/linkedin/instagram/facebook, defaultTitle, titleTemplate, keywords, ogImage.alt, `@avenixstudio` | b |
| Nova widget | `config/nova.config.js` | brandName, assistantName `Nova`, logo, companyId `avenix`, welcome/placeholder/error copy, quickReplies, theme colors (`#e3a857`) | b |
| Tenant key | `knowledge/companies.js`, `nova.config.js` | `companyId: 'avenix'` + registry seed (brand, website, knowledgeFolder) | b/c |
| Sales packages | `sales/packageConfig.js:205+` | `avenixPackages` — service names, `$300`/`$700`, "5–7 page", features, CTAs, in code | c |
| Email defaults | `lib/env.js:15-16` | `CONTACT_FROM_EMAIL` fallback "Avenix Studio <…>", `CONTACT_TO_EMAIL` fallback `abdullah…@gmail` | a/b |
| Nurture sequence def | `email/nurtureSequences.js:25` | `avenix`-keyed sequence + `avenix_`-prefixed template keys (in code) | c |
| Email template content | Supabase `email_templates` | company-scoped rows; `{{name}}`/`{{service}}` vars, Avenix subjects/colors | data (already right home) |
| WhatsApp msg | `whatsapp/buildWhatsappLink.js:13` | hardcoded "Hi Avenix Studio" in the deep-link text | b |
| Marketing components | Footer (giant `AVENIX`), `globals.css` (`avenix-word`), Hero, About (`/images/abdullah-khan.png`), Logo, `manifest.js` (`Avenix`), dashboard "Avenix Dashboard", CinematicIntro monogram | literal brand + asset paths | b |
| KB content | `src/knowledge/avenix/*.md` + Supabase | Avenix's real services/pricing/FAQ | c |

## Two honesty flags
1. **`OWNER_WHATSAPP_NUMBER` is in `.env.local` but NOT wired into the app** — referenced only in
   `scripts/test-whatsapp.mjs`. `whatsapp/sendWhatsappTemplate.js` has no runtime caller. Owner alerts
   currently go via **email** (`LEAD_NOTIFICATION_EMAIL`), not WhatsApp. That env var is scaffolding.
2. **Service/pricing data is duplicated in THREE places** — `packageConfig.js` (code, still says
   "5–7 page"), the Supabase KB, and marketing content (`content/services.js`). White-label must pick
   ONE source of truth per fact. (This is the same duplication class that caused the Phase 3 KB bug.)

## Nurture email templates — moved-or-not (per Phase 1 decision to check)
- **Template CONTENT** (subject/body, brand colors, "Avenix Studio" text) already lives in Supabase
  `email_templates`, **company-scoped** by `company_id` + `template_key`. This is already data, not code —
  a new client seeds their own rows. No move needed.
- **Sequence DEFINITION + key naming** (`nurtureSequences.js`) IS code and Avenix-specific: an `avenix`
  company key mapping to `avenix_welcome` / `avenix_followup`. This should become **generic/config-driven**
  (generic keys like `lead_welcome`/`lead_followup`, sequence resolved from the active `companyId`). The
  `nova-test` sequence can remain as a dev fixture.

## Proposed "fill this in for a new client" shape
The codebase already has two config homes (`config/site.js`, `config/nova.config.js`). Consolidate behind
env + a single typed `client.config.js` both read from:

```
IDENTITY   companyId · brandName · legalName · assistantName · founder · role · monogram · foundingYear · tagline · descriptor · shortDescription
ASSETS     logo.png · og-image.png · founder photo · favicon · CV pdf   (drop-in /public files)
CONTACT    email · phone · whatsappNumber · whatsappMessage · location · timezone · address
SOCIAL/SEO github · linkedin · instagram · facebook · twitterHandle · keywords · locale
WIDGET     welcome/placeholder/error copy · quickReplies · theme.dark/light colors · accent
POLICY     quotePricesAllowed (flag → drives the pricing guardrail)
CONTENT    KB entries (CMS) · nurture email templates (Supabase) · sales packages (→ folding into KB)
SECRETS(env) SUPABASE_URL/SERVICE_ROLE/ANON · AI provider keys · RESEND_API_KEY · EMAIL_FROM · CONTACT_FROM/TO_EMAIL · LEAD_NOTIFICATION_EMAIL · CAL_LINK · HUBSPOT_ACCESS_TOKEN · WHATSAPP_* · CRON_SECRET · GA4/CLARITY
```

## What is NOT reasonably template-able (honest boundary)
- **Marketing-site content is bespoke, not config.** `content/services.js`, `caseStudies.js`,
  `testimonials.js`, the `websiteDevPakistan` blog, `/work` pages — Avenix's actual written content. A new
  client rewrites all of it. Config-izing brand tokens does NOT make the marketing pages client-ready.
- **Brand assets** (logo, og-image, founder photo, CinematicIntro monogram artwork, favicon) — designed per client.
- **Sales package catalog** — each client's services/prices differ (→ decision: fold into KB).
- **The pricing guardrail policy** — generic default; a client who wants to quote prices is a behavior change.
- **Per-client account provisioning** — Cal.com event, HubSpot pipeline, WhatsApp Business API, Resend domain.
- **Any client-specific custom integration.**

**Framing:** the Nova chatbot layer is highly template-able (prompts parameterized, KB CMS-editable,
integrations env-driven). The marketing/portfolio site is a branded shell whose CONTENT is bespoke —
"clone + config = launch" is true for Nova, not for the marketing pages' content.

## Decisions taken (Phase 1 → Phase 2)
1. Introduce a single typed `client.config.js` that `site.js` + `nova.config.js` both read from.
2. Fold `avenixPackages` (sales catalog) into the Knowledge Base — single source of truth with the
   services the CMS already manages. Nurture: template content stays as Supabase data; the sequence
   definition/keys in `nurtureSequences.js` become generic/config-driven.
