import { siteConfig } from '@/config/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /*
       * /scroll-story-test is a development harness (its own file calls it
       * "TEMPORARY ISOLATION HARNESS — delete before deploy"). It already sets
       * robots noindex in its metadata, so this is not a second line of defence
       * against indexing — it is about crawl budget: noindex still requires the
       * page to be fetched and rendered before the directive is read. Nothing
       * links to it, so disallowing it costs nothing.
       *
       * Everything a searcher should reach stays allowed: /, /about, /services
       * and its four children, /work and every case study, /blog, /contact,
       * /free-audit, /website-development-pakistan.
       */
      disallow: ['/api/', '/dashboard/', '/scroll-story-test'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
