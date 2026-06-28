import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

/**
 * Brand lockup: the Avenix logo mark (logo.png, cropped to the gold monogram)
 * + studio wordmark. Hairline chip framing keeps it crisp against the nav.
 */
export function Logo({ className, compact = false }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} — home`}
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border-strong bg-black transition-colors duration-base group-hover:border-accent">
        <Image
          src="/logo.png"
          alt={`${siteConfig.brand.name} logo`}
          fill
          sizes="40px"
          priority
          className="scale-[1.18] object-cover object-[center_30%]"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] tracking-tight text-text-strong">
            {siteConfig.brand.name}
          </span>
          <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
            by {siteConfig.brand.founder}
          </span>
        </span>
      )}
    </Link>
  );
}
