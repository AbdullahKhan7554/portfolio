'use client';

import { useRef, useState } from 'react';
import { Sparkles, Webhook, Bot, Search, Cloud, GitBranch, Film, Cpu } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Marquee } from '@/components/ui/Marquee';
import { cn } from '@/lib/utils';
import { techCategories, techMarquee } from '@/content/techStack';
import { TECH_ICON_PATHS } from '@/components/ui/techIconPaths';

/**
 * Items with no brand mark get a lucide glyph. Two reasons one lands here:
 * either it is a concept rather than a product (AI Agents, RAG, REST APIs,
 * CI/CD), or simple-icons v16 no longer ships the mark — Adobe, AWS and OpenAI
 * were all removed upstream over trademark policy.
 */
const FALLBACK_ICONS = {
  OpenAI: Sparkles,
  'AI Agents': Bot,
  RAG: Search,
  'REST APIs': Webhook,
  AWS: Cloud,
  'CI/CD': GitBranch,
  'After Effects': Film,
};

function TechIcon({ name, className }) {
  const path = TECH_ICON_PATHS[name];
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={className}
      >
        <path d={path} />
      </svg>
    );
  }
  const Fallback = FALLBACK_ICONS[name] ?? Cpu;
  return <Fallback className={className} aria-hidden="true" />;
}

export function TechStack() {
  const [active, setActive] = useState(techCategories[0].id);
  const tabRefs = useRef([]);
  const activeIndex = techCategories.findIndex((c) => c.id === active);
  const category = techCategories[activeIndex] ?? techCategories[0];

  /** Roving focus: arrow keys move between tabs, per the tablist pattern. */
  const onTabKeyDown = (e) => {
    const last = techCategories.length - 1;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(techCategories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section
      id="tech-stack"
      eyebrow="05 — Toolkit"
      title="A Modern Stack, Used With Intent."
      intro="The right tools, chosen for performance, scalability, and maintainability — not novelty."
    >
      <Reveal className="mt-8">
        <div className="card-premium overflow-hidden p-0 lg:grid lg:grid-cols-[15rem_1fr]">
          {/* Tabs. Vertical sidebar from lg; a horizontally scrollable strip
              below that, since a fixed sidebar cannot work on a phone. */}
          <div
            role="tablist"
            aria-label="Technology categories"
            aria-orientation="vertical"
            onKeyDown={onTabKeyDown}
            className={cn(
              'flex gap-1 overflow-x-auto border-b border-border p-3',
              'lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4',
            )}
          >
            {techCategories.map((cat, i) => {
              const selected = cat.id === active;
              return (
                <button
                  key={cat.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${cat.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    'relative shrink-0 whitespace-nowrap rounded-md px-4 py-2.5 text-left text-label transition-colors duration-base ease-out-quad lg:w-full',
                    selected
                      ? 'bg-[var(--surface-raised)] text-text-strong'
                      : 'text-muted hover:text-text-strong',
                  )}
                >
                  {/* Active marker: a rule, not a filled block — bottom on the
                      mobile strip, left edge in the sidebar. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute bg-accent transition-opacity duration-base',
                      'inset-x-3 bottom-0 h-px lg:inset-x-auto lg:inset-y-2 lg:left-0 lg:h-auto lg:w-px',
                      selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Panel. Scrolls internally on desktop so tab switching never moves
              the page; the cap is lifted on mobile where the content simply
              stacks. */}
          <div
            role="tabpanel"
            id={`panel-${category.id}`}
            aria-labelledby={`tab-${category.id}`}
            tabIndex={0}
            className="p-5 md:p-6 lg:max-h-[24rem] lg:overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {category.groups.map((group) => (
                <div key={group.label}>
                  <h3 className="font-mono text-eyebrow uppercase tracking-[0.18em] text-faint">
                    {group.label}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center gap-2 rounded-pill border border-[var(--chip-border)] bg-[var(--chip-bg)] px-3 py-1.5 text-caption font-medium tracking-[0.02em] [color:var(--chip-text)]"
                      >
                        <TechIcon name={item} className="h-4 w-4 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-12">
        <Marquee items={techMarquee} duration={36} />
      </div>
    </Section>
  );
}
