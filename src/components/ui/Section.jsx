import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { Parallax } from '@/components/ui/Parallax';

/**
 * Section wrapper enforcing consistent vertical rhythm and the
 * eyebrow → H2 → intro header pattern (TRD §6.1, §17.7).
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  containerClassName,
  bleed = false,
  alt = false,
  headerAlign = 'left',
}) {
  const hasHeader = eyebrow || title || intro;
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-24',
        alt && 'bg-bg-alt',
        'py-[clamp(var(--space-12),10vw,var(--space-24))]',
        className,
      )}
    >
      <div className={cn(bleed ? 'container-bleed' : 'container-page', containerClassName)}>
        {hasHeader && (
          <Reveal
            className={cn(
              'mb-10 flex flex-col gap-4',
              headerAlign === 'center' && 'items-center text-center',
              headerAlign === 'left' && 'max-w-measure',
            )}
          >
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && (
              <Parallax distance={12}>
                <h2 className="text-h2 text-balance">{title}</h2>
              </Parallax>
            )}
            {intro && (
              <p className={cn('text-lead text-muted', headerAlign !== 'center' && 'measure')}>
                {intro}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
