import Image from 'next/image';
import { Download } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Parallax } from '@/components/ui/Parallax';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { siteConfig } from '@/config/site';

const FACTS = [
  { label: 'Based in', value: siteConfig.contact.location },
  { label: 'Timezone', value: siteConfig.contact.timezone },
  { label: 'Focus', value: 'MERN · Next.js' },
  { label: 'Serving', value: 'Local & international' },
];

export function About() {
  return (
    <Section id="about" alt eyebrow="02 — About">
      <FloatingShapes />
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <Parallax distance={34} innerClassName="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-3 -z-10 rounded-xl opacity-50 blur-2xl"
            style={{
              background:
                'radial-gradient(60% 60% at 30% 20%, hsl(35 72% 62% / 0.3), transparent 70%)',
            }}
          />
          <div className="overflow-hidden rounded-xl border border-border-strong bg-surface shadow-lg">
            <Image
              src="/images/abdullah-khan.png"
              alt={`Portrait of ${siteConfig.brand.founder}`}
              width={800}
              height={1000}
              sizes="(max-width: 1024px) 70vw, 35vw"
              className="h-auto w-full object-cover [filter:saturate(0.9)_contrast(1.03)]"
            />
          </div>
          </Parallax>
        </Reveal>

        <Reveal>
          <h2 className="font-display text-h2 text-text-strong">
            Hi, I&rsquo;m {siteConfig.brand.founder}.
          </h2>
          <div className="measure mt-5 flex flex-col gap-4 text-body text-muted">
            <p>
              I&rsquo;m a Full-Stack MERN developer and the founder of{' '}
              {siteConfig.brand.name} — a small studio built on a simple belief:
              a website should earn its place by producing results, not just
              looking the part.
            </p>
            <p>
              I&rsquo;ve shipped production websites for clinics, gyms, and salons —
              including live clients on their own domains — pairing premium design
              with the engineering discipline of Next.js, clean architecture, and
              real technical SEO.
            </p>
            <p>
              Whether you&rsquo;re a local business or an international startup, you
              work directly with me: clear communication, fixed quotes, and code
              you fully own.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-caption uppercase tracking-[0.14em] text-faint">
                  {f.label}
                </dt>
                <dd className="mt-1 text-body-sm text-text-strong">{f.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={siteConfig.cv.path}
            download
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-pill border border-border-strong px-6 text-label text-text transition-colors hover:border-accent hover:text-accent"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download CV
            <span className="font-mono text-caption text-faint">
              PDF · {siteConfig.cv.updated}
            </span>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
