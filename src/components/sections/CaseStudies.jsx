import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { BrowserMock } from '@/components/ui/BrowserMock';
import { Parallax } from '@/components/ui/Parallax';
import { Counter } from '@/components/ui/Counter';
import { Tag, StatusBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { getFeaturedCaseStudies } from '@/content/caseStudies';

function ResultStat({ stat }) {
  return (
    <div>
      <p className="font-display text-h3 text-accent">
        <Counter
          value={stat.value}
          decimals={stat.decimals || 0}
          prefix={stat.prefix || ''}
          suffix={stat.suffix || ''}
        />
      </p>
      <p className="mt-1 text-caption text-muted">{stat.label}</p>
    </div>
  );
}

function CaseStudyRow({ study, index }) {
  const flipped = index % 2 === 1;
  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={cn('order-1', flipped && 'lg:order-2')}>
        <Parallax distance={flipped ? -28 : 28}>
          <Link
            href={`/work/${study.slug}`}
            aria-label={`View the ${study.title} case study`}
            className="block transition-transform duration-base ease-out-quad hover:-translate-y-1"
          >
            <BrowserMock
              title={study.title}
              url={study.liveUrl}
              niche={study.niche}
              image={study.image}
            />
          </Link>
        </Parallax>
      </div>

      <div className={cn('order-2', flipped && 'lg:order-1')}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          {study.isLive && <StatusBadge status="live" label="Live" />}
        </div>

        <h3 className="mt-3 font-display text-h3 text-text-strong">{study.title}</h3>
        <p className="measure mt-3 text-body text-muted">{study.summary}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5">
          {study.results.slice(0, 3).map((stat, i) => (
            <ResultStat key={i} stat={stat} />
          ))}
        </dl>

        <ul className="mt-5 flex flex-col gap-2">
          {study.solution.slice(0, 3).map((point) => (
            <li key={point} className="flex items-start gap-2 text-body-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {study.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            href={`/work/${study.slug}`}
            className="group inline-flex items-center gap-1.5 text-label text-text-strong"
          >
            Read case study
            <span className="h-px w-6 bg-accent transition-all duration-base group-hover:w-9" />
          </Link>
          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-label text-muted transition-colors hover:text-accent"
          >
            Visit live site <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function CaseStudies() {
  const studies = getFeaturedCaseStudies();
  return (
    <Section
      id="case-studies"
      eyebrow="01 — Selected Work"
      title="Proof, Not Promises."
      intro="Real projects for real businesses — framed the way clients think: the problem, what I built, and the outcome."
    >
      <div className="mt-8 flex flex-col gap-14 lg:gap-16">
        {studies.map((study, i) => (
          <CaseStudyRow key={study.slug} study={study} index={i} />
        ))}
      </div>
    </Section>
  );
}
