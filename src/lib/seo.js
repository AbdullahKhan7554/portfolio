import { siteConfig } from '@/config/site';

/**
 * Build a Next.js Metadata object for a route, merging sensible defaults from
 * siteConfig with per-page overrides. Keeps every route's SEO consistent.
 *
 * @param {Object} [opts]
 * @param {string} [opts.title]        page title (without the brand suffix)
 * @param {string} [opts.description]
 * @param {string} [opts.path]         route path, e.g. "/work"
 * @param {string} [opts.ogImage]      absolute or relative OG image URL
 * @param {boolean}[opts.noIndex]
 * @param {string[]}[opts.keywords]
 * @returns {import('next').Metadata}
 */
export function buildMetadata(opts = {}) {
  const { title, description, path = '/', ogImage, noIndex, keywords } = opts;

  const canonical = `${siteConfig.url}${path === '/' ? '' : path}`;
  const resolvedTitle = title
    ? siteConfig.seo.titleTemplate.replace('%s', title)
    : siteConfig.seo.defaultTitle;
  const resolvedDesc = description || siteConfig.seo.description;

  // When no custom image is provided, omit `images` so Next's file-convention
  // opengraph-image (which also generates twitter:image) is used automatically.
  const customImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.seo.ogImage.alt }]
    : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDesc,
    keywords: keywords || siteConfig.seo.keywords,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: siteConfig.brand.name,
      title: resolvedTitle,
      description: resolvedDesc,
      url: canonical,
      locale: siteConfig.seo.locale,
      ...(customImages ? { images: customImages } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.seo.twitterHandle,
      creator: siteConfig.seo.twitterHandle,
      title: resolvedTitle,
      description: resolvedDesc,
      ...(customImages ? { images: customImages.map((i) => i.url) } : {}),
    },
  };
}
