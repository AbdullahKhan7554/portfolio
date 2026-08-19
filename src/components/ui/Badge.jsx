import { cn } from '@/lib/utils';

/**
 * Static tech chip — ONE uniform treatment everywhere chips appear. Inter medium
 * with slight tracking rather than mono, which read as "code sample" next to
 * prose. Colour comes from the --chip-* tokens, so the look is changed in one
 * place rather than per instance.
 */
export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1',
        'border border-[var(--chip-border)] bg-[var(--chip-bg)]',
        // `[color:…]` rather than `text-[…]`: tailwind-merge groups both
        // `text-caption` and `text-[…]` as `text-` utilities and drops the size.
        'text-caption font-medium tracking-[0.02em] [color:var(--chip-text)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status badge — dot + label, never color-only (a11y, TRD §13). */
export function StatusBadge({ status = 'live', label, className }) {
  const tone =
    status === 'live'
      ? 'text-success'
      : status === 'wip'
        ? 'text-warning'
        : 'text-muted';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.12em]',
        tone,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-pill bg-current" aria-hidden="true" />
      {label || status}
    </span>
  );
}
