import { siteConfig } from '@/config/site';
import { caseStudies } from '@/content/caseStudies';
import { posts } from '@/content/blog';

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/free-audit', priority: 0.6, changeFrequency: 'yearly' },
  ].map((r) => ({
    url: `${siteConfig.url}${r.path === '/' ? '' : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const workRoutes = caseStudies.map((c) => ({
    url: `${siteConfig.url}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.8,
  }));

  // Blog posts auto-included from content/blog — adding a new post adds its URL.
  const blogRoutes = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...blogRoutes];
}
