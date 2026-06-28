import { cn } from '@/lib/utils';

/** Static mono tag (e.g. a tech chip). */
export function Tag({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill bg-surface-raised px-3 py-1',
        'font-mono text-caption text-muted',
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
