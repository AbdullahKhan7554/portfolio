import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

/**
 * "Available for new projects" pill with a pulsing status dot.
 * Status is driven by siteConfig.availability (PRD §7.1 AC).
 */
export function AvailabilityPill({ className }) {
  const { open, label } = siteConfig.availability;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1.5',
        'bg-[var(--nav-bg)] font-mono text-caption uppercase tracking-[0.14em] text-muted backdrop-blur',
        className,
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-success opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-pill',
            open ? 'bg-success' : 'bg-text-faint',
          )}
        />
      </span>
      {label}
    </span>
  );
}
