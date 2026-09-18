import { ServiceDetail } from '@/components/sections/services/ServiceDetail';
import { getServicePage } from '@/data/servicePages';
import { buildMetadata } from '@/lib/seo';

/**
 * Thin by design. All copy lives in src/data/servicePages.js and all markup and
 * structured data in <ServiceDetail />, so a new service route is an entry in
 * that array plus a file this size.
 *
 * No `viewport` override here: this route renders the type-led PageHeader (no
 * `hero`), which stays on the light ground, so the root layout's white
 * themeColor is already correct. The dark-hero routes (/, /about, /services,
 * /work) override it precisely because they do NOT.
 */
const SLUG = 'mobile-app-development';
const page = getServicePage(SLUG);

export const metadata = buildMetadata({
  // `absoluteTitle`, not `title`: these lead with the service and the market,
  // so the "%s — Avenix Studio" template would put the brand in twice.
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: `/services/${SLUG}`,
  keywords: page.keywords,
});

export default function MobileAppDevelopmentPage() {
  return <ServiceDetail slug={SLUG} />;
}
