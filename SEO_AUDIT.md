# Avenix Studio — SEO Audit

**Mode:** static repo audit. No `APIFY_API_TOKEN`, no GSC/GA4 export available, so no
ranking, impression, CTR or position data is verified. Every priority below is derived
from route structure and intent coverage, not from performance data. Anything that
depends on real numbers is flagged as such.

## Stack

- Next.js 15 App Router, JS. Metadata via `buildMetadata` (`src/lib/seo.js`).
- Schema helpers complete: Organization, Person, ProfessionalService, Service,
  BreadcrumbList, FAQPage, WebSite, ContactPage (`src/lib/schema.js`).
- `app/sitemap.js` derives service routes from `getServicePagePaths()` and filters
  `href` listing-stub posts. Correct.
- `app/robots.js` disallows `/api/`, `/dashboard/`, `/scroll-story-test`. Correct.
- `ProfessionalService` schema carries Lahore + Pakistan `areaServed` and a
  PostalAddress with no invented `geo`/`streetAddress`. Truthful.

## Commercial page owners (before this pass)

| Intent | Owner |
|---|---|
| software development Lahore/Pakistan | `/services/software-development` |
| AI automation / AI agents Pakistan | `/services/ai-automation` |
| mobile app development Lahore | `/services/mobile-app-development` |
| SEO services Lahore | `/services/seo` |
| website development Pakistan (informational) | `/website-development-pakistan` |
| **web development company Lahore/Pakistan** | **NONE** |
| **website development company Lahore** | **NONE** |

## Priorities

### P0

1. **Missing high-intent commercial page: `/services/web-development`.**
   Three of the ten targets have no page owner. `src/data/services.js` leads with a
   "Web Development" card that links nowhere specific, and `/services` has to carry
   the intent by itself. This is the single largest gap.
   Cannibalisation risk: `/website-development-pakistan` is a 28-min informational
   pillar. Keep it informational, make the new page commercial, cross-link both ways.

2. **"Lahore" absent from every service page title.** Six of ten targets are
   Lahore-qualified; all four service `metaTitle`s say "in Pakistan" only. Lahore is
   factually correct (`contact.address.locality`), so adding it is not stuffing.

3. ~~Footer has zero internal links.~~ **Not a problem — checked and withdrawn.**
   `Footer.jsx` holds only the conversion block; `FooterPremium.jsx` already renders
   full nav plus service links derived from `getServiceSummaries()`, so a new service
   route appears sitewide automatically. No change made.

4. **Case-study service mapping is wrong.** Fourteen of sixteen case studies declare
   `service: 'software-development'`, but twelve of them are marketing websites, not
   applications. `app/work/[slug]/page.js` turns that field into the contextual link
   from each case study to its service page, so the links were pointing at the wrong
   owner and the new web-development page had zero inbound links from `/work`.

### P1

4. Service-page `areaServed` defaults to Pakistan + Worldwide. Lahore is not passed,
   so the city signal present in `ProfessionalService` is missing from `Service`.
5. Blog `p-link` internal links point to service pages; the new web-development page
   has no inbound contextual link from content until one is added.
6. Case studies link up to their service via `service:` slug. Twelve of the sixteen
   map to `seo` or platform builds; none maps to `web-development` yet.

### P2

7. Supporting content. Not needed — the site already has a 13-post blog and a pillar.
   One strong page beats ten weak ones; no new articles in this pass.

## Not problems (verified, no action)

- Titles unique, descriptions unique per route (only `/`, `/scroll-story-test` and
  `/_not-found` share the site fallback description; the latter two are noindex or
  not a real page).
- Canonicals derive from `siteConfig.url` with a forced https upgrade.
- H1 structure: one `h1` per route via `PageHeader`.
- No fabricated ratings, reviews, awards or prices anywhere.
- No keyword stuffing found.

## Cannot verify without data

- Current positions, impressions, CTR, indexed page count.
- Whether any page sits at position 4–10 (the highest-ROI band).
- Backlink profile and authority gap.

Recommended next check: connect Google Search Console and export 90 days of
query × page data, then re-prioritise around real position 4–10 queries.
