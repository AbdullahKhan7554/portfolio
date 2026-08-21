import Image from 'next/image';
import Link from 'next/link';

/**
 * Blog index card.
 *
 * The WHOLE card is a single <Link> — one focusable stop, one hit target, no
 * nested interactive elements. That is why there is no "read more" affordance
 * inside it: a second anchor would double the tab stops for one destination.
 *
 * `post.href` is honoured before the /blog/[slug] fallback, because
 * `website-development-pakistan` is a standalone route rather than a rendered
 * post (see the `href` field in src/content/blog.js).
 *
 * `cover` is optional in the data. A post without one simply starts at the
 * reading-time label; heights still match across a row because the card is a
 * column flexbox whose body carries `flex-1`.
 *
 * ALT TEXT comes from `cover.alt`, which deliberately describes the
 * illustration rather than restating the title — the headline is set into the
 * artwork and repeated as the <h2> directly below it. Same convention as
 * PostCover and pageHeroes.
 *
 * The hover lift is an arbitrary `-3px` rather than `-translate-y-1`: the
 * spacing scale is remapped in tailwind.config.js, so key `1` is a rhythm step
 * and not the 4px an optical nudge wants.
 */
export function BlogCard({ post }) {
  return (
    <Link
      href={post.href ?? `/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg transition-[transform,border-color,box-shadow] duration-base ease-out hover:-translate-y-[3px] hover:border-border-strong hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {post.cover ? (
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border bg-surface-raised">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
            quality={80}
            className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-caption uppercase tracking-[0.12em] text-text-faint">
          {post.readingTime}
        </span>

        <h2 className="mt-3 line-clamp-2 font-display text-h4 text-text-strong transition-colors duration-fast group-hover:text-accent">
          {post.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-body text-text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
