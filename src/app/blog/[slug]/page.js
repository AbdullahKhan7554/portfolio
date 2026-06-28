import { notFound } from 'next/navigation';
import { posts, getPost, formatDate } from '@/content/blog';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Post not found', noIndex: true });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

function articleSchema(post) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${siteConfig.url}/opengraph-image`,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: siteConfig.brand.founder,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.brand.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/logo.png` },
    },
  };
}

function Block({ block }) {
  if (block.type === 'h2') {
    return <h2 className="mt-10 font-display text-h3 text-text-strong">{block.text}</h2>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-body text-muted marker:text-accent">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-4 text-body text-muted">{block.text}</p>;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema(crumbs))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(articleSchema(post))}
      />
      <PageHeader breadcrumbs={crumbs} title={post.title}>
        <div className="flex flex-wrap items-center gap-3 font-mono text-caption uppercase tracking-[0.12em] text-faint">
          <span className="text-accent">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
      </PageHeader>

      <article className="container-page pb-[clamp(var(--space-12),10vw,var(--space-24))]">
        <Reveal className="measure">
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </Reveal>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-border pt-8">
          <p className="font-display text-h4 text-text-strong">
            Want a site that puts this into practice?
          </p>
          <Button
            href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
            magnetic
          >
            Book a call
          </Button>
        </div>
      </article>
    </main>
  );
}
