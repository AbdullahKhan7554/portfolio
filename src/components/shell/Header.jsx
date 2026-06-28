'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { EASE_OUT_EXPO } from '@/lib/motion';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const closeBtnRef = useRef(null);

  // Scroll: elevate past 80px; hide on scroll-down, reveal on scroll-up.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 80);
        setHidden(y > lastY.current && y > 240);
        lastY.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body scroll-lock + Esc + focus when drawer open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        className={cn(
          'fixed inset-x-0 top-0 z-header transition-colors duration-base',
          scrolled || open
            ? 'border-b border-border bg-[var(--nav-bg)] backdrop-blur-nav'
            : 'border-b border-transparent',
        )}
      >
        <nav
          className={cn(
            'container-page max-w-6xl flex h-14 items-center justify-between gap-4 md:h-16',
            // Part of the homepage cinematic reveal (navbar enters first).
            pathname === '/' && 'intro-reveal',
          )}
          aria-label="Primary"
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group relative py-1 text-label text-muted transition-colors duration-fast hover:text-text-strong',
                    isActive(item.href) && 'text-text-strong',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-base ease-out-expo',
                      isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <WhatsAppButton source="header" variant="ghost" size="sm">
              WhatsApp
            </WhatsAppButton>
            <Button
              href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
              size="sm"
              magnetic
            >
              Book a call
            </Button>
          </div>

          {/* Mobile trigger — animated morphing toggle */}
          <button
            type="button"
            className={cn(
              'group relative grid h-11 w-11 place-items-center rounded-full border bg-[var(--nav-bg)] backdrop-blur-nav transition-colors duration-base lg:hidden',
              open ? 'border-accent' : 'border-border-strong hover:border-accent',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-4 w-5">
              {[
                { closed: { rotate: 0, y: -5 }, opened: { rotate: 45, y: 0 } },
                { closed: { opacity: 1, scaleX: 1 }, opened: { opacity: 0, scaleX: 0.3 } },
                { closed: { rotate: 0, y: 5 }, opened: { rotate: -45, y: 0 } },
              ].map((line, i) => (
                <motion.span
                  key={i}
                  className={cn(
                    'absolute left-0 block w-full rounded-full transition-colors duration-base',
                    open ? 'bg-accent' : 'bg-text-strong group-hover:bg-accent',
                  )}
                  style={{ height: '1.6px', top: 'calc(50% - 0.8px)', transformOrigin: 'center' }}
                  initial={false}
                  animate={open ? line.opened : line.closed}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                />
              ))}
            </span>
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer — kept OUTSIDE the (Framer-transformed) header so its
          `fixed` positioning resolves against the viewport, not the header box.
          Offsets match the header height per breakpoint (h-16 → md:h-20). */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 top-14 z-overlay bg-bg md:top-16 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="container-page flex h-full flex-col">
              <ul className="flex flex-1 flex-col justify-center gap-2">
                {siteConfig.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, ease: EASE_OUT_EXPO }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'block py-3 font-display text-h2 text-text-strong',
                        isActive(item.href) && 'text-accent',
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 pb-10">
                <Button
                  href={`mailto:${siteConfig.contact.email}?subject=Book%20a%20call`}
                  size="lg"
                  className="w-full"
                >
                  Book a call
                </Button>
                <WhatsAppButton source="mobile-drawer" size="lg" className="w-full">
                  Chat on WhatsApp
                </WhatsAppButton>
                <button ref={closeBtnRef} className="sr-only" onClick={() => setOpen(false)}>
                  Close menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
