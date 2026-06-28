import { Database, Webhook, Search, Sparkles, Cpu } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Marquee } from '@/components/ui/Marquee';
import {
  NextjsIcon,
  ReactIcon,
  JavascriptIcon,
  TailwindIcon,
  NodejsIcon,
  ExpressIcon,
  MongoIcon,
  VercelIcon,
  GitIcon,
} from '@/components/ui/TechIcons';
import { techGroups, techMarquee } from '@/content/techStack';

/** Brand SVGs for the real tools; lucide glyphs for the conceptual ones. */
const TECH_ICONS = {
  'Next.js': NextjsIcon,
  React: ReactIcon,
  JavaScript: JavascriptIcon,
  'Tailwind CSS': TailwindIcon,
  'Node.js': NodejsIcon,
  'Express.js': ExpressIcon,
  MongoDB: MongoIcon,
  SQL: Database,
  'REST APIs': Webhook,
  Vercel: VercelIcon,
  'Technical SEO': Search,
  'AI Workflows': Sparkles,
  Git: GitIcon,
};

export function TechStack() {
  return (
    <Section
      id="tech-stack"
      eyebrow="08 — Toolkit"
      title="A Modern Stack, Used With Intent."
      intro="The right tools, chosen for performance, scalability, and maintainability — not novelty."
    >
      <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" stagger={0.1}>
        {techGroups.map((group) => (
          <RevealItem
            key={group.group}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="font-mono text-eyebrow uppercase tracking-[0.18em] text-faint">
              {group.group}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => {
                const Icon = TECH_ICONS[item] ?? Cpu;
                return (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-pill border border-border-strong px-3 py-1.5 text-body-sm text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-12">
        <Marquee items={techMarquee} duration={36} />
      </div>
    </Section>
  );
}
