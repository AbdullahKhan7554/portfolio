import Link from 'next/link';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Inner-page hero band. Includes top padding to clear the fixed header and an
 * optional breadcrumb trail.
 */
export function PageHeader({ eyebrow, title, intro, breadcrumbs, children, className }) {
  return (
    <header className={cn('relative overflow-hidden pb-12 pt-32 md:pb-16 md:pt-40', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />
      <div className="container-page">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-caption text-muted">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 && <span className="text-faint">/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={crumb.path} className="transition-colors hover:text-accent">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-text-strong">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal className="flex max-w-3xl flex-col gap-5">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h1 className="text-h1 text-balance">{title}</h1>}
          {intro && <p className="measure text-lead text-muted">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
