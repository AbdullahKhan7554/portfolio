import { cn } from '@/lib/utils';

/**
 * Seamless CSS marquee. Content is duplicated so the translateX(-50%) loop
 * wraps perfectly. Pauses on hover; becomes a static row under reduced motion
 * (handled by the global motion override in tokens.css). GPU transform only.
 */
export function Marquee({ items, duration = 40, separator = '·', className }) {
  const Track = () => (
    <ul
      className="flex shrink-0 items-center gap-8 pr-8 font-mono text-label uppercase tracking-[0.14em] text-muted"
      aria-hidden="false"
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <span className="text-accent" aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn('mask-fade-x group relative flex overflow-hidden', className)}>
      <div
        className="animate-marquee pause-on-hover flex"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        <Track />
        <Track />
      </div>
    </div>
  );
}
