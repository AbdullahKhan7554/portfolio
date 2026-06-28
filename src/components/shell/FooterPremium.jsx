'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { siteConfig } from '@/config/site';

const GOLD = '#C9A227';
const EASE_OUT = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const SERVICE_LINKS = [
  'Custom Websites',
  'AI Automation',
  'SEO',
  'UI / UX',
  'Performance Optimization',
  'Brand Identity',
];

const CONNECT_LINKS = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'GitHub', href: siteConfig.social.github },
  { label: 'Instagram', href: siteConfig.social.instagram },
  { label: 'X', href: siteConfig.social.x },
];

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemV = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Magnetic footer link with a gold underline that grows from the left. */
function FooterLink({ href, children, external = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.3 });

  function move(e) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  const cls =
    'group relative inline-flex w-fit items-center text-body-sm text-muted transition-colors duration-300 hover:text-text-strong';
  const underline = (
    <span
      aria-hidden="true"
      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
      style={{ backgroundColor: GOLD }}
    />
  );

  if (external) {
    const isHttp = href.startsWith('http');
    return (
      <motion.a
        ref={ref}
        href={href}
        target={isHttp ? '_blank' : undefined}
        rel={isHttp ? 'noopener noreferrer' : undefined}
        onMouseMove={move}
        onMouseLeave={leave}
        style={{ x: sx, y: sy }}
        className={cls}
      >
        {children}
        {underline}
      </motion.a>
    );
  }
  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ x: sx, y: sy }}
      className="w-fit"
    >
      <Link href={href} className={cls}>
        {children}
        {underline}
      </Link>
    </motion.div>
  );
}

function FooterHeading({ children }) {
  return (
    <span className="mb-2 font-mono text-caption uppercase tracking-[0.18em] text-faint">
      {children}
    </span>
  );
}

export function FooterPremium() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  // Giant wordmark: subtle upward parallax on scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const wordY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Gold glow that trails the cursor across the AVENIX typography.
  const glowX = useMotionValue(-9999);
  const glowY = useMotionValue(-9999);
  const sgx = useSpring(glowX, { stiffness: 120, damping: 20, mass: 0.5 });
  const sgy = useSpring(glowY, { stiffness: 120, damping: 20, mass: 0.5 });
  function onWordMove(e) {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(e.clientX - r.left);
    glowY.set(e.clientY - r.top);
  }
  function onWordLeave() {
    glowX.set(-9999);
    glowY.set(-9999);
  }

  const columnHover =
    'flex flex-col items-center gap-3 text-center transition duration-300 hover:brightness-125 sm:col-span-4 sm:items-start sm:text-left lg:col-span-2';

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#090909' }}
    >
      {/* Glass divider with a faint gold radial highlight at center */}
      <div
        aria-hidden="true"
        className="relative h-px w-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[3px] w-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `radial-gradient(ellipse at center, ${GOLD}66, transparent 70%)`,
          }}
        />
      </div>

      <motion.div
        variants={containerV}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-8 gap-y-12 px-[clamp(1.5rem,8vw,120px)] pb-[clamp(10rem,26vw,19rem)] pt-[clamp(3.5rem,9vw,100px)] sm:grid-cols-12"
      >
        {/* LEFT */}
        <motion.div
          variants={itemV}
          className="flex flex-col items-center text-center sm:col-span-12 sm:items-start sm:text-left lg:col-span-6"
        >
          <Link
            href="/"
            aria-label={`${siteConfig.brand.name} — home`}
            className="inline-flex items-center gap-3 transition-transform duration-[400ms] ease-out hover:rotate-[1deg] hover:scale-[1.02]"
          >
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-border-strong bg-black">
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-full w-full scale-[1.18] object-cover object-[center_30%]"
              />
            </span>
            <span className="font-display text-h3 font-semibold text-text-strong">
              {siteConfig.brand.name}
            </span>
          </Link>

          <p className="measure mt-6 text-body text-muted">
            Building world-class websites, AI automations, and digital experiences
            for ambitious brands.
          </p>

          <ul className="mt-7 flex flex-col gap-2 font-mono text-caption uppercase tracking-[0.16em] text-faint">
            <li>Available Worldwide</li>
            <li>Remote First</li>
            <li>Response within 24 Hours</li>
          </ul>

          <div className="mt-8 text-caption text-faint">
            <p>
              © {year} {siteConfig.brand.name}
            </p>
            <p className="mt-1">Crafted with precision.</p>
          </div>
        </motion.div>

        {/* NAVIGATION */}
        <motion.nav variants={itemV} aria-label="Footer navigation" className={columnHover}>
          <FooterHeading>Navigation</FooterHeading>
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </motion.nav>

        {/* SERVICES */}
        <motion.div variants={itemV} className={columnHover}>
          <FooterHeading>Services</FooterHeading>
          {SERVICE_LINKS.map((s) => (
            <FooterLink key={s} href="/services">
              {s}
            </FooterLink>
          ))}
        </motion.div>

        {/* CONNECT */}
        <motion.div variants={itemV} className={columnHover}>
          <FooterHeading>Connect</FooterHeading>
          {CONNECT_LINKS.map((l) => (
            <FooterLink key={l.label} href={l.href} external>
              {l.label}
            </FooterLink>
          ))}
          <FooterLink href={`mailto:${siteConfig.contact.email}`} external>
            {siteConfig.contact.email}
          </FooterLink>
        </motion.div>
      </motion.div>

      {/* GIANT AVENIX WORDMARK */}
      <div
        aria-hidden="true"
        onMouseMove={onWordMove}
        onMouseLeave={onWordLeave}
        className="absolute inset-x-0 bottom-0 z-0 flex translate-y-[10%] items-end justify-center overflow-hidden"
      >
        <motion.span
          style={{
            y: reduced ? 0 : wordY,
            opacity: 0.12,
            letterSpacing: '-0.04em',
            willChange: 'transform',
          }}
          className="avenix-word block select-none font-display text-[clamp(5rem,22vw,20rem)] font-black leading-none"
        >
          AVENIX
        </motion.span>

        {/* cursor-trailing gold glow over the typography */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[42vw] max-h-[460px] w-[42vw] max-w-[460px] rounded-full"
          style={{
            x: sgx,
            y: sgy,
            marginLeft: 'max(-21vw, -230px)',
            marginTop: 'max(-21vw, -230px)',
            background: `radial-gradient(circle, ${GOLD}40, transparent 60%)`,
            mixBlendMode: 'screen',
            opacity: reduced ? 0 : 1,
          }}
        />
      </div>
    </div>
  );
}
