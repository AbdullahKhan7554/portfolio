import { ServiceDetail } from '@/components/sections/services/ServiceDetail';
import { getServicePage } from '@/data/servicePages';
import { buildMetadata } from '@/lib/seo';

/** Thin route — copy lives in src/data/servicePages.js, markup in <ServiceDetail />. */
const SLUG = 'meta-ads';
const page = getServicePage(SLUG);

export const metadata = buildMetadata({
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: `/services/${SLUG}`,
  keywords: page.keywords,
});

export default function MetaAdsPage() {
  return <ServiceDetail slug={SLUG} />;
}
