# Nova White-Label — Phase 2 Plan (Centralize Config)

Scope: replace every hardcoded/defaulted Avenix value with a reference to a single typed
`client.config.js`, fold the sales package catalog into the Knowledge Base, and genericize the
nurture sequence definition — with **zero behavior change for Avenix's live instance**.

**Status: plan only. No code written yet.** Based on the Phase 1 decisions:
1. One typed `client.config.js` that `config/site.js` + `config/nova.config.js` both read from.
2. Fold `avenixPackages` into the KB; genericize the nurture sequence keys/definition.

## Context
Phase 1 found the plumbing is already mostly config-ready (prompts parameterized, integrations
env-driven, email/KB content in Supabase). What remains: literal brand strings + Avenix fallbacks
scattered across `site.js`, `nova.config.js`, `env.js`, `buildWhatsappLink.js`, and marketing
components; a hardcoded sales catalog in `packageConfig.js`; and Avenix-keyed nurture wiring.

## Part A — `src/config/client.config.js` (the single source)

A typed (JSDoc) object, values env-backed where per-deploy, literals where brand-fixed. Both existing
config files import from it — they become thin adapters, not parallel sources.

```
client.config.js  (shape)
  identity   { companyId, brandName, legalName, assistantName, founder, role, monogram,
               foundingYear, tagline, descriptor, shortDescription }
  urls       { siteUrl, logo, ogImage, founderPhoto, cvPath }
  contact    { email, phone, whatsappNumber, whatsappMessage, location, timezone, address }
  social     { github, linkedin, instagram, facebook, twitterHandle }
  seo        { keywords[], locale }
  widget     { welcomeMessage, inputPlaceholder, errorMessage, quickReplies[], theme{dark,light} }
  policy     { quotePricesAllowed }        // drives the pricing guardrail (see Part D)
  nurture    { sequence: [{ templateKey, delayMinutes }] }   // generic keys (see Part C)
```

Per-deploy values read `process.env.*` inside `client.config.js` with **generic** fallbacks (empty
string or neutral placeholder — never "Avenix"). Avenix's real values get filled into this file for the
production deploy, so nothing changes for Avenix; only the source of the value moves.

### Files that change to read from `client.config.js`
- `config/site.js` — replace all brand literals + Avenix fallbacks (name, founder, contact, social,
  seo, ogImage, url fallback) with `clientConfig.*`. `organizationSchemaData` already derives from
  `siteConfig`, so it follows automatically.
- `config/nova.config.js` — brandName, assistantName, logo, companyId, copy, quickReplies, theme all
  from `clientConfig.*`.
- `lib/env.js` — `CONTACT_FROM_EMAIL`/`CONTACT_TO_EMAIL` fallbacks: drop the Avenix literals, source
  the brand-name portion from `clientConfig.identity.brandName`.
- `whatsapp/buildWhatsappLink.js` — replace "Hi Avenix Studio" with `clientConfig.identity.brandName`.
- `knowledge/companies.js` — build the registry from `clientConfig.identity` (companyId, brandName,
  website, assistantName) instead of the hardcoded `avenixCompany` literal. This makes `companyId`
  single-sourced and removes the last hardcoded tenant key.
- Marketing components with literal brand text/assets — `Footer`/`FooterPremium` (giant wordmark),
  `manifest.js` (`short_name`), dashboard "Avenix Dashboard" (`DashboardNav`, login), `Logo`, `About`
  image path, `CinematicIntro` — read `clientConfig.identity.brandName`/`monogram`/asset paths.
  CSS class names (`avenix-word`, `avenix-shimmer`) are cosmetic identifiers — leave as-is (renaming is
  churn with no template value).

## Part B — Move the sales catalog into a CMS-managed table (DECIDED: B2)

`sales/packageConfig.js` (`avenixPackages`) is the last hardcoded Avenix **service/price catalog** in
code. **Decision: B2** — keep the structured package engine and its deterministic scoring; move only its
**data source** from a hardcoded literal to a CMS-managed Supabase table. `sales/salesEngine.js` logic is
**not touched** (this stays within the brief's "no changes to conversational logic" boundary — only where
the data comes from changes).

Design (mirrors the KB CMS built in Phase 3):
- **New table `sales_packages`** (company-scoped, service-role RLS like `knowledge_documents`): `id`,
  `company_id`, `package_id`, `name`, `short_description`, `target_audience`, `recommended_for` (text[]),
  `features` (text[]), `starting_price` (numeric), `currency`, `cta`, `display_order` (int),
  `is_active` (bool), `industry`, `created_at`, `updated_at`.
- **Read/loader:** a Supabase-backed source that maps rows into the exact shape `createCompanyPackages()`
  already produces, so `packageRegistry` / `salesEngine.getRecommendation()` consume identical objects —
  same pattern as `knowledge/supabaseKnowledgeSource.js`. `packageRegistry` is built from the DB rows
  (active only) instead of the hardcoded `avenixPackages`.
- **Write layer + CMS:** `src/lib/supabase/salesPackages.js` (CRUD, mirrors `knowledgeBase.js`) + a
  **Packages** tab under `/dashboard/knowledge` (or a sibling route), reusing the Phase 3 list/form/
  actions/RowActions patterns. Fields: name, package_id, short description, target audience,
  recommended_for (comma list), features (one per line), starting price, currency, cta, display order,
  active.
- **Seed:** migrate the existing `avenixPackages` rows verbatim into `sales_packages` (delete-then-insert
  scoped to `company_id='avenix'`), so Avenix's recommendations are byte-identical after the switch.
- **Retire:** `avenixPackages` literal + `packageRegistry` static seed in `packageConfig.js` become a
  DB-backed registry; `createCompanyPackages`/scoring helpers stay unchanged.

> Scope note: B2 is effectively a second CMS-managed entity — comparable in size to the Phase 3 KB CMS.
> It is therefore planned as its **own implementation unit** (its own review), separate from the config
> centralization (Parts A/C/D). See "Implementation sequencing" below.

## Part C — Genericize nurture

- **Template content:** unchanged — stays as company-scoped rows in Supabase `email_templates`. A new
  client seeds their own rows (covered in the Phase 3 setup guide).
- **`email/nurtureSequences.js`:** replace the `avenix`-keyed sequence + `avenix_`-prefixed template
  keys with **generic keys** (`lead_welcome`, `lead_followup`, `internal_lead_notification`) and resolve
  the active client's sequence from `clientConfig.nurture.sequence` keyed off `clientConfig.identity
  .companyId`. Keep `nova-test` as a dev fixture. Avenix's live rows get renamed to the generic keys (or
  the client config points at the existing `avenix_*` keys — decide during build; renaming is cleaner).

## Part D — Persona + pricing policy
- Identity already flows through config → confirm it now originates in `client.config.js`.
- Pricing guardrail (`core/systemPromptBuilder.js`): add an optional `clientConfig.policy
  .quotePricesAllowed` flag. Default `false` = current Avenix behavior (never quote). A client who wants
  prices flips it. Keeps the generic policy in code but makes the behavior client-configurable.

## Verification (Avenix unchanged — the acceptance bar)
1. `npm run lint` + `npm run build` clean.
2. **Diff-check zero behavior change:** with `client.config.js` filled with Avenix's real values, the
   marketing pages, SEO metadata, footer wordmark, WhatsApp links, and JSON-LD render byte-identical to
   before (spot-check `/`, `/about`, `/contact`, og-image, schema).
3. **Nova grounding smoke test** (as in the KB phases): "What services do you offer?" / "How much for a
   website?" — same grounded answers, pricing guardrail intact.
4. **Lead flow:** submit a test lead → persisted, nurture scheduled, owner email fires — unchanged.
5. **No silent 'avenix' fallback remains:** grep the codebase for `'avenix'` / `Avenix` and confirm every
   remaining hit is either a comment, the filled-in `client.config.js`, or Avenix's own Supabase data.

## Out of scope (→ Phase 3 / boundary)
- New-client setup guide, migrations, KB seeding with placeholders (Phase 3).
- Marketing-page CONTENT rewrites, brand asset creation (bespoke per client).
- Account provisioning (Cal.com/HubSpot/WhatsApp/Resend).
- Wiring the unused `OWNER_WHATSAPP_NUMBER` / WhatsApp-template automation (out of scope unless requested).

## Resolved decisions
1. **Sales fold (Part B): B2** — keep the structured package engine + deterministic scoring; move package
   data into the CMS-managed `sales_packages` table. `salesEngine.js` logic untouched (data source only).
2. **Pricing flag (Part D):** add `clientConfig.policy.quotePricesAllowed`, default `false` = current
   Avenix guardrail behavior.
3. **Avenix email template keys:** no data change — Avenix's `client.config.js` `nurture.sequence` points
   at the **existing** `avenix_welcome`/`avenix_followup` keys, so live rows are untouched (zero behavior
   change). New clients define their own generic keys. `nurtureSequences.js` stops hardcoding the `avenix`
   map and resolves the active sequence from `clientConfig`.

## Implementation sequencing
- **Unit 1 — Config centralization (Parts A + C + D):** `client.config.js` + rewire `site.js`,
  `nova.config.js`, `env.js`, `buildWhatsappLink.js`, `companies.js`, marketing brand literals; nurture
  genericization; pricing flag. Strict zero-behavior-change bar. **← implement first, its own review.**
- **Unit 2 — Sales packages CMS (Part B2):** new `sales_packages` table + loader + write layer + CMS tab +
  seed + registry rewire. A second CMS entity, comparable to Phase 3. **← its own review after Unit 1.**
