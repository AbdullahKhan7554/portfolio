'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { AvailabilityPill } from '@/components/ui/AvailabilityPill';
import { Parallax } from '@/components/ui/Parallax';
import { Tag } from '@/components/ui/Badge';
import { siteConfig } from '@/config/site';

const TRUST = ['17 projects shipped', '5 live client projects', 'Next.js · MERN'];

export function Hero() {
  const glowRef = useRef(null);

  // Subtle background-glow parallax on pointer move (desktop, GPU transform).
  function handleMove(e) {
    const el = glowRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const px = (e.clientX / window.innerWidth - 0.5) * 24;
    const py = (e.clientY / window.innerHeight - 0.5) * 24;
    el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  }

  return (
    <section
      id="hero"
      onMouseMove={handleMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 md:pt-32"
    >
      {/* Cinematic aurora backdrop — drifting amber light fields + metallic sheen */}
      <div aria-hidden="true" className="hero-aurora -z-20">
        <span className="hero-orb hero-orb--1" />
        <span className="hero-orb hero-orb--2" />
        <span className="hero-orb hero-orb--3" />
        <span className="hero-sheen" />
      </div>

      {/* Atelier light (pointer-parallax) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        style={{ background: 'var(--gradient-hero-glow)' }}
      />

      <div className="container-page grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <div>
          <div className="hero-in" style={{ animationDelay: '0.05s' }}>
            <span className="eyebrow normal-case tracking-[0.02em]">Bespoke Web Engineering · Est. {siteConfig.brand.foundingYear}</span>
          </div>

          <h1 className="mt-6 font-display text-h1 font-normal leading-[1.08] tracking-[-0.02em] text-text-strong">
            <span className="hero-line-clip">
              <span className="hero-line" style={{ animationDelay: '0.12s' }}>
                Web experiences
              </span>
            </span>
            <span className="hero-line-clip">
              <span className="hero-line" style={{ animationDelay: '0.22s' }}>
                Engineered To Feel
              </span>
            </span>
            <span className="hero-line-clip">
              <span className="hero-line" style={{ animationDelay: '0.32s' }}>
                effortlessly{' '}
                <span className="text-amber-wipe">Premium</span>.
              </span>
            </span>
          </h1>

          <p
            className="hero-in measure mt-7 text-lead text-muted"
            style={{ animationDelay: '0.5s' }}
          >
            Avenix Studio is the digital atelier of {siteConfig.brand.founder} —
            crafting fast, scalable, conversion-focused websites and web apps with
            the precision of fine engineering and the polish of a luxury brand.
          </p>

          <div
            className="hero-in mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '0.62s' }}
          >
            <Button
              href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
              size="lg"
              magnetic
            >
              Book a call
            </Button>
            <Button href="/work" variant="secondary" size="lg">
              View work
            </Button>
            <WhatsAppButton source="hero" variant="ghost" size="lg" />
          </div>

          <div
            className="hero-in mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '0.74s' }}
          >
            <AvailabilityPill />
            {TRUST.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* Portrait — editorial framed treatment (reveals last in the sequence) */}
        <div className="hero-in relative mx-auto w-full max-w-md lg:-mt-[4rem] lg:max-w-none" style={{ animationDelay: '0.85s' }}>
          <Parallax distance={42} innerClassName="relative">
            {/* amber rim glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-xl opacity-60 blur-2xl"
              style={{
                background:
                  'radial-gradient(60% 60% at 70% 20%, hsl(35 72% 62% / 0.35), transparent 70%)',
              }}
            />
            <div className="relative overflow-hidden rounded-xl border border-border-strong bg-surface shadow-lg">
              <Image
                src="/images/hero-dev.png"
                alt="A developer building production web applications at a dark studio workstation with glowing code editors"
                width={1536}
                height={2048}
                priority
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="h-auto w-full object-cover [filter:saturate(0.92)_contrast(1.02)]"
              />
              {/* warm grade veil for cohesion */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 55%, hsl(252 11% 4% / 0.55) 100%)',
                }}
              />
            </div>

            {/* floating mono caption chip */}
            <div className="absolute -bottom-4 left-4 rounded-pill border border-border-strong bg-[var(--nav-bg)] px-4 py-2 backdrop-blur">
              <span className="font-mono text-caption tracking-[0.04em] text-muted">
                Full-Stack · Next.js · MERN
              </span>
            </div>
          </Parallax>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#case-studies"
        aria-label="Scroll to work"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-caption uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent md:inline-flex"
      >
        Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
