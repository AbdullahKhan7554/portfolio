'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Editorial browser-frame mock. When a real screenshot (`image`) is supplied it
 * renders inside the browser chrome; otherwise it falls back to a warm-graded
 * obsidian field with the project name + live host (TRD §9.1) so proof stays
 * honest and the composition stays premium even without a screenshot.
 */
export function BrowserMock({ title, url, niche, image, className }) {
  const host = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

  // In-frame parallax: the screenshot drifts vertically inside the fixed canvas
  // as it scrolls past. The image is scaled up so the drift never reveals edges.
  const frameRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <div
      className={cn(
        'group/mock relative overflow-hidden rounded-md border border-border-strong bg-surface shadow-lg',
        className,
      )}
    >
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-bg-alt px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-pill bg-obsidian-600" />
          <span className="h-2.5 w-2.5 rounded-pill bg-obsidian-600" />
          <span className="h-2.5 w-2.5 rounded-pill bg-obsidian-600" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-sm bg-surface-raised px-3 py-1 text-center font-mono text-caption text-muted">
          {host}
        </span>
      </div>

      {/* canvas */}
      {image ? (
        <div ref={frameRef} className="relative aspect-[16/10] overflow-hidden bg-bg-alt">
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: reduced ? 0 : imgY, scale: 1.16 }}
          >
            <Image
              src={image}
              alt={`${title} — live website preview`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-slow ease-out-quad group-hover/mock:scale-[1.04]"
            />
          </motion.div>
          {/* hairline sheen to seat the screenshot into the obsidian frame */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5"
          />
        </div>
      ) : (
        <div
          className="relative flex aspect-[16/10] flex-col items-center justify-center gap-3 p-8 text-center"
          style={{
            background:
              'radial-gradient(80% 90% at 50% 0%, hsl(35 72% 62% / 0.10), transparent 60%), var(--surface)',
          }}
        >
          {niche && (
            <span className="font-mono text-caption uppercase tracking-[0.18em] text-faint">
              {niche}
            </span>
          )}
          <span className="font-display text-h3 text-text-strong">{title}</span>
          <span className="h-px w-12 bg-accent" aria-hidden="true" />
          <span className="font-mono text-caption text-muted">{host}</span>
        </div>
      )}
    </div>
  );
}
