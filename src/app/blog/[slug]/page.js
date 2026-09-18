import { notFound } from 'next/navigation';
import Link from 'next/link';
import { posts, getPost, formatDate } from '@/content/blog';
import { PageHeader } from '@/components/ui/PageHeader';
import { PostCover } from '@/components/ui/PostCover';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  return posts.filter((p) => !p.href).map((p) => ({ slug: p.slug }));
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
    // The post's own cover when it has one — this field is meant to be the
    // article's image, and falling back to the site-wide OG card was only ever
    // a stand-in for not having one. Absolute URL: schema.org consumers do not
    // resolve site-relative paths.
    image: post.cover
      ? `${siteConfig.url}${post.cover.src}`
      : siteConfig.seo.ogImage.url,
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
  /*
   * 'p-link' — a paragraph carrying exactly one internal link.
   *
   * WHY A BLOCK TYPE AND NOT MARKDOWN-IN-TEXT. The other three block types hold
   * plain strings that are rendered as text, which is what keeps this content
   * source safe: nothing here is ever passed to dangerouslySetInnerHTML. Adding
   * inline markup would mean either parsing a mini-syntax or opening that door.
   * Splitting the sentence into before / anchor / after keeps every value a
   * plain string and still produces a real <Link>, so client-side navigation
   * and prefetching work exactly as they do everywhere else on the site.
   *
   * Deliberately ONE link per block and one such block per post — the anchor
   * text is the signal, and a post that links its service page five times is
   * doing something other than helping the reader.
   */
  if (block.type === 'p-link') {
    return (
      <p className="mt-4 text-body text-muted">
        {block.before}
        <Link
          href={block.href}
          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {block.anchor}
        </Link>
        {block.after}
      </p>
    );
  }
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
  if (!post || post.href) notFound();

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
      {/*
        FAQPage — emitted ONLY for posts that define `faqs`. The three posts
        that predate this field define none, so nothing is added to their markup
        and they render byte-identical to before.
      */}
      {post.faqs?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(faqSchema(post.faqs))}
        />
      )}
      <PostCover cover={post.cover} />

      {/* With a cover above it the header is no longer the first thing in
          <main>, so it must not also reserve room for the navbar — PostCover
          already did that. `pt-8 md:pt-10` (3rem/4rem, both mapped keys)
          replaces its `pt-32 md:pt-40` via twMerge and becomes the gap between
          the art and the breadcrumbs. Posts without a cover pass no className
          and keep the original padding untouched. */}
      <PageHeader
        breadcrumbs={crumbs}
        title={post.title}
        className={post.cover ? 'pt-8 md:pt-10' : undefined}
      >
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

        {/*
          FAQ — native <details>, not ui/Accordion.
          Accordion renders `{isOpen && <panel>}`, so only ONE answer is ever in
          the DOM and the rest never reach the server HTML. These FAQs exist to
          be quoted by answer engines, so every answer has to be in the served
          markup. Same decision, same reason, as the service pages.

          Collapsed by default so the post's own copy stays the focus; the
          content is present either way, which is the part that matters here.
        */}
        {post.faqs?.length > 0 && (
          <Reveal className="measure mt-14">
            <h2 className="font-display text-h3 text-text-strong">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {post.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-h4 text-text transition-colors duration-fast hover:text-text-strong">
                    <h3 className="m-0 font-display text-h4">{faq.question}</h3>
                    <span
                      aria-hidden="true"
                      className="relative h-5 w-5 shrink-0 text-accent transition-transform duration-base ease-out-quad group-open:rotate-45"
                    >
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="mt-3 text-body text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        )}

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
