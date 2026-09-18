import { siteConfig } from '@/config/site';

/**
 * Build a Next.js Metadata object for a route, merging sensible defaults from
 * siteConfig with per-page overrides. Keeps every route's SEO consistent.
 *
 * @param {Object} [opts]
 * @param {string} [opts.title]        page title (without the brand suffix)
 * @param {string} [opts.absoluteTitle] complete title, used VERBATIM — bypasses
 *                                      `titleTemplate`. For keyword-led pages
 *                                      whose title must lead with the service
 *                                      and market rather than the brand.
 * @param {string} [opts.description]
 * @param {string} [opts.path]         route path, e.g. "/work"
 * @param {string} [opts.ogImage]      absolute or relative OG image URL
 * @param {boolean}[opts.noIndex]
 * @param {string[]}[opts.keywords]
 * @returns {import('next').Metadata}
 */
export function buildMetadata(opts = {}) {
  const {
    title,
    absoluteTitle,
    description,
    path = '/',
    ogImage,
    noIndex,
    keywords,
  } = opts;

  const canonical = `${siteConfig.url}${path === '/' ? '' : path}`;
  // Precedence: absoluteTitle (verbatim) → title (templated) → site default.
  // `absoluteTitle` exists because `titleTemplate` can only ever append the
  // brand, and a keyword-led title needs the service and the market in FRONT of
  // it — "Software Development Company in Pakistan | Avenix Studio" is not
  // expressible as "%s — Avenix Studio" without the brand appearing twice.
  // Omitting it changes nothing: every pre-existing caller passes `title` or
  // neither, and both of those branches are byte-identical to before.
  const resolvedTitle = absoluteTitle
    ? absoluteTitle
    : title
      ? siteConfig.seo.titleTemplate.replace('%s', title)
      : siteConfig.seo.defaultTitle;
  const resolvedDesc = description || siteConfig.seo.description;

  // Resolve a single, ABSOLUTE 1200×630 social image. Defaults to the official
  // Avenix Studio brand card (/og-image.png); a per-page `ogImage` overrides it.
  // An explicit absolute image keeps previews identical across WhatsApp,
  // Facebook, LinkedIn, X, Discord & Telegram — none of which run JS, so the URL
  // must be reachable without auth or redirects.
  const { width, height, type, alt } = siteConfig.seo.ogImage;
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${siteConfig.url}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
    : siteConfig.seo.ogImage.url;
  const ogImages = [{ url: imageUrl, width, height, type, alt }];

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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.seo.twitterHandle,
      creator: siteConfig.seo.twitterHandle,
      title: resolvedTitle,
      description: resolvedDesc,
      images: [imageUrl],
    },
  };
}
