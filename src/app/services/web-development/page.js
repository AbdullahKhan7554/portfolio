import { ServiceDetail } from '@/components/sections/services/ServiceDetail';
import { getServicePage } from '@/data/servicePages';
import { buildMetadata } from '@/lib/seo';

/**
 * Thin by design. All copy lives in src/data/servicePages.js and all markup and
 * structured data in <ServiceDetail />, so a new service route is an entry in
 * that array plus a file this size.
 *
 * INTENT OWNERSHIP. This route owns "web development company" and "website
 * development company" for Lahore and Pakistan. It is deliberately NOT the same
 * intent as two neighbours it could otherwise cannibalise:
 *   - /services/software-development owns custom applications, internal systems
 *     and platforms. That page sells engineering; this one sells websites.
 *   - /website-development-pakistan is a long informational guide answering
 *     "what does a website cost / how do I choose a developer". That page sells
 *     nothing; this one is the commercial destination it links into.
 *
 * No `viewport` override: this route renders the type-led PageHeader (no
 * `hero`), so it stays on the light ground and the root layout's white
 * themeColor is already correct.
 */
const SLUG = 'web-development';
const page = getServicePage(SLUG);

export const metadata = buildMetadata({
  // `absoluteTitle`, not `title`: this leads with the service and the market,
  // so the "%s — Avenix Studio" template would put the brand in twice.
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: `/services/${SLUG}`,
  keywords: page.keywords,
});

export default function WebDevelopmentPage() {
  return <ServiceDetail slug={SLUG} />;
}
