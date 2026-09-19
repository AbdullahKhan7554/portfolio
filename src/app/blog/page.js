import { PageHeader } from '@/components/ui/PageHeader';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { BlogCard } from '@/components/ui/BlogCard';
import { posts } from '@/content/blog';
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
        intro="Practical notes on performance, conversion, SEO, and what it takes to ship a web product that actually works."
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
        {/* 1 / 2 / 3 columns. The stagger now runs across a grid rather than
            down a list, so RevealItem carries `h-full` — without it the grid
            item stretches but the motion.div inside it does not, and a card in
            a row with a shorter excerpt would stop short of the row height. */}
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {posts.map((post) => (
            <RevealItem key={post.slug} className="h-full">
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
