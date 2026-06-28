'use client';

import { useRef } from 'react';
import { Quote } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { fadeRise } from '@/lib/motion';
import { proofStats, testimonials } from '@/content/testimonials';

/**
 * Quote card that gently floats on scroll at a per-card speed. The OUTER node
 * keeps the RevealGroup stagger (variants); the INNER node carries the card
 * visual + the continuous scroll-float, so the two never fight. No-op under
 * reduced motion.
 */
function FloatingQuote({ t, distance }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} variants={fadeRise}>
      <motion.div
        style={{ y: reduced ? 0 : y, willChange: 'transform' }}
        className="flex h-full flex-col rounded-lg border border-border bg-surface p-6"
      >
        <Quote className="h-6 w-6 text-accent" aria-hidden="true" />
        <p className="mt-4 flex-1 text-body text-text">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-display text-h4 text-text-strong">{t.business}</p>
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-faint">
            {t.role}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="09 — Social Proof"
      title="Trusted With Real Businesses."
      intro="The numbers below are real and documented. Client words are being collected — what's shown gives a feel for the partnership."
    >
      <FloatingShapes />
      {/* Real aggregate proof */}
      <RevealGroup
        className="grid grid-cols-2 gap-5 md:grid-cols-4"
        stagger={0.08}
      >
        {proofStats.map((stat) => (
          <RevealItem
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <p className="font-display text-h2 text-accent">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-body-sm text-text-strong">{stat.label}</p>
            <p className="mt-1 text-caption text-faint">{stat.context}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Client quotes (placeholders — attributed to the business, see content note) */}
      <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3" stagger={0.1}>
        {testimonials.map((t, i) => (
          <FloatingQuote key={t.id} t={t} distance={[20, 34, 26][i % 3]} />
        ))}
      </RevealGroup>
    </Section>
  );
}
