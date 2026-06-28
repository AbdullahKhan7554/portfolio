'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrowserMock } from '@/components/ui/BrowserMock';
import { Tilt } from '@/components/ui/Tilt';
import { StatusBadge, Tag } from '@/components/ui/Badge';
import { PROJECT_TYPES, filterCaseStudies } from '@/content/caseStudies';
import { EASE_OUT_EXPO } from '@/lib/motion';

export function WorkGallery({ initialType = 'all' }) {
  const [type, setType] = useState(
    PROJECT_TYPES.some((t) => t.id === initialType) ? initialType : 'all',
  );

  const selectType = useCallback((id) => {
    setType(id);
    // URL sync without a navigation/Suspense requirement
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', id);
    window.history.replaceState(null, '', url);
  }, []);

  const items = filterCaseStudies(type);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
        {PROJECT_TYPES.map((t) => {
          const active = t.id === type;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectType(t.id)}
              aria-pressed={active}
              className={cn(
                'rounded-pill border px-4 py-2 font-mono text-caption uppercase tracking-[0.12em] transition-colors duration-fast',
                active
                  ? 'border-accent bg-accent text-accent-on'
                  : 'border-border-strong text-muted hover:border-accent hover:text-text-strong',
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.ul layout className="mt-10 grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((study) => (
            <motion.li
              key={study.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            >
              <Link href={`/work/${study.slug}`} className="group block">
                <Tilt max={6} scale={1.015} className="block">
                <BrowserMock
                  title={study.title}
                  url={study.liveUrl}
                  niche={study.niche}
                  image={study.image}
                />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-h4 text-text-strong">{study.title}</h3>
                    <p className="mt-1 text-body-sm text-muted">{study.summary}</p>
                  </div>
                  {study.isLive && <StatusBadge status="live" label="Live" />}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {study.tech.slice(0, 4).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-label text-accent">
                  View case study
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
                </Tilt>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {items.length === 0 && (
        <p className="mt-10 text-body text-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
