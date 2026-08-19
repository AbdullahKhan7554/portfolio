import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { posts, formatDate } from '@/content/blog';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';
import { getPageHero } from '@/content/pageHeroes';

export const metadata = buildMetadata({
  title: 'Insights',
  description:
    'Practical insights on web performance, conversion, SEO, and modern web development from Avenix Studio.',
  path: '/blog',
});

/** Dark image hero — see the note in app/about/page.js. #0A0A0B = --obsidian-950. */
export const viewport = { themeColor: '#0A0A0B' };

export default function BlogPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        )}
      />
      <PageHeader
        hero={getPageHero('/blog')}
        eyebrow="Insights"
        title="Notes on building better web."
        intro="Practical thinking on performance, conversion, SEO, and the craft of shipping web products that perform."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />

      {/* `py-`, not `pb-`. The hero above is now a full-viewport band, so its own
          bottom padding sits INSIDE the first screen and no longer separates
          anything — this section has to carry its own top spacing. The clamp is
          the same one `Section` uses, so the rhythm matches every other section
          on the site rather than being a value invented here. */}
      <section className="container-page py-[clamp(var(--space-12),10vw,var(--space-24))]">
        <RevealGroup className="divide-y divide-border border-y border-border" stagger={0.08}>
          {posts.map((post, i) => (
            <RevealItem key={post.slug}>
              <Link
                href={post.href ?? `/blog/${post.slug}`}
                className="group grid gap-3 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
              >
                <span className="font-mono text-caption text-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    <span className="text-accent">{post.category}</span>
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="mt-2 font-display text-h3 text-text-strong transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="measure mt-2 text-body text-muted">{post.excerpt}</p>
                </div>
                <ArrowUpRight
                  className="hidden h-6 w-6 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:block"
                  aria-hidden="true"
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
