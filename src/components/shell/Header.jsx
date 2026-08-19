'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Logo } from './Logo';
import { MenuToggle } from './MenuToggle';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { EASE_OUT_EXPO, EASE_OUT_QUAD } from '@/lib/motion';
import { useIsDesktop } from '@/components/ui/scroll-story/useIsDesktop';

/**
 * Floating pill navigation.
 *
 * VISIBILITY
 * On the DESKTOP homepage the navbar is hidden until the hero has been scrolled
 * past, so the hero owns the viewport uninterrupted. Detection is an
 * IntersectionObserver bound to the real `#hero` element — not a scroll
 * threshold — so it stays correct whatever height the hero ends up being.
 * Every other route has no hero, so the navbar is visible immediately.
 *
 * The gate is desktop-only ON PURPOSE. The hero is full-viewport, so on a phone
 * the rule above meant the entire first screenful had no logo, no menu button
 * and no way to navigate — the reveal that reads as a cinematic beat on a wide
 * viewport just reads as a missing navbar on a small one. Below `lg` the pill is
 * therefore always visible.
 *
 * `useIsDesktop` starts false and upgrades after mount, which is what makes
 * this safe in both directions:
 *  - mobile + no-JS get a visible navbar straight out of the server HTML;
 *  - desktop paints the pill for one frame before the gate engages, and that
 *    frame is spent underneath the CinematicIntro overlay (2.6s, z-index 9999)
 *    on the only route where gating applies. Under reduced motion the intro
 *    doesn't play, but the transition below is zero-duration, so the pill snaps
 *    away in the same frame instead of fading.
 *
 * Deliberately NOT the usual hide-on-scroll-down pattern: once past the hero it
 * stays put in both directions. The only rule is hero = hidden, past hero =
 * visible.
 *
 * RESPONSIVE SPLIT
 * The desktop/mobile switch is `lg` (1024px) — the project's existing
 * breakpoint, unchanged here. Below it the pill carries the logo and the toggle
 * only: the link list is `hidden lg:flex` and the inline CTA is
 * `hidden lg:inline-flex`, so nothing from the desktop bar survives beside the
 * hamburger. Above it everything is exactly as it was.
 *
 * PERFORMANCE
 * No scroll listener at all. The observer fires twice per hero crossing, which
 * is the only React state change involved.
 */
export function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [heroPassed, setHeroPassed] = useState(false);
  const [open, setOpen] = useState(false);

  // The pill's trigger (focus returns here on close) and the drawer's copy of
  // the same control (focus moves here on open).
  const triggerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);

  /**
   * Set when the drawer is closing BECAUSE the user is navigating away. The
   * scroll-lock cleanup has to behave differently in that case: restoring the
   * old offset onto a freshly mounted route would drop the user halfway down a
   * page they have never seen. Focus too — Next's route announcer owns focus
   * after a navigation, so we must not steal it back to the hamburger.
   */
  const navigatingRef = useRef(false);

  const isHome = pathname === '/';
  const visible = !isHome || !isDesktop || heroPassed;

  // Hero gating — homepage only.
  useEffect(() => {
    if (!isHome) {
      setHeroPassed(false);
      return;
    }
    const hero = document.getElementById('hero');
    // Fail open: if the hero is ever missing, show the navbar rather than
    // stranding the user with no navigation.
    if (!hero) {
      setHeroPassed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      // Shrinks the root from the top so the reveal lands just after the hero's
      // bottom edge clears, rather than exactly on it.
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHome, pathname]);

  // Close the drawer on route change. Catches back/forward and anything that
  // navigates without going through `closeFor` below; the browser restores
  // scroll itself on a popstate, so the lock must not fight it.
  useEffect(() => {
    setOpen((wasOpen) => {
      if (wasOpen) navigatingRef.current = true;
      return false;
    });
  }, [pathname]);

  /**
   * Close handler for anything in the drawer that also navigates. Flags the
   * close as a navigation ONLY when the destination differs from the current
   * route — tapping the link for the page you are already on does not navigate,
   * so that case still needs the normal scroll restore.
   */
  const closeFor = useCallback(
    (href) => () => {
      navigatingRef.current = href !== pathname;
      setOpen(false);
    },
    [pathname],
  );

  // Body scroll-lock + Escape + focus while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    // Captured up front, not read in the cleanup: the lint rule is right that a
    // ref can change, even though this one cannot — the pill's trigger is always
    // mounted (it is CSS-hidden above `lg`, never unmounted).
    const trigger = triggerRef.current;

    /**
     * `overflow: hidden` alone does not hold iOS Safari. Once the page has been
     * scrolled, Safari keeps scrolling the body behind the drawer and then
     * restores a different offset when the lock lifts, which is the jump. The
     * position:fixed technique is the reliable cross-browser lock: take the body
     * out of flow and pin it at a negative top equal to the current scroll, so
     * there is nothing left to scroll and the visual position is unchanged.
     *
     * Safe next to Lenis: SmoothScroll bails out on touch pointers and below
     * 1024px, and this drawer is `lg:hidden` — the two can never be live at the
     * same time, so there is no smooth-scroll instance to fight over the offset.
     *
     * The drawer's nav list is its own `overflow-y-auto overscroll-contain`
     * scroller, so the menu still scrolls on a short viewport while the page
     * underneath stays pinned and the scroll chain never reaches it.
     */
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    /**
     * Escape closes; Tab cycles inside the panel. The trap is deliberately the
     * small version — two `focus()` calls on the first/last tabbable node —
     * rather than an inert/aria-hidden sweep of the rest of the document. The
     * panel is `role="dialog" aria-modal="true"` and covers the viewport, so
     * assistive tech already scopes itself to it; this only stops a sighted
     * keyboard user tabbing into the page behind.
     */
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const outside = !panel.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      document.removeEventListener('keydown', onKey);

      const navigating = navigatingRef.current;
      navigatingRef.current = false;
      if (navigating) return;

      // Un-pinning the body drops the page back to offset 0, so the scroll
      // position has to be put back by hand. `behavior: 'instant'` is required,
      // not decorative: globals.css sets `scroll-behavior: smooth` on <html>,
      // and a plain scrollTo would inherit it and visibly animate the restore —
      // trading the iOS jump for a slow glide.
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
      // Focus returns to the control that opened the menu, but only when the
      // user stayed on the page.
      trigger?.focus();
    };
  }, [open]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  const ctaHref = '/contact';
  const ctaLabel = 'Start a Project';

  /**
   * The drawer's list, derived from `siteConfig.nav` — NOT a second navigation
   * source. Contact is dropped because the "Start a Project" CTA at the bottom
   * of the drawer already goes to `/contact`, so listing it again put the same
   * destination on screen twice. Filtering by `ctaHref` rather than by label
   * means the row disappears automatically if the CTA is ever re-pointed, and
   * the 01…05 numbering below closes up on its own because it is indexed off
   * this array.
   *
   * Desktop still renders the unfiltered `siteConfig.nav` — its CTA sits inline
   * in the pill, where a Contact link in the list is not a duplicate of anything
   * the eye reads as the same control.
   */
  const drawerNav = siteConfig.nav.filter((item) => item.href !== ctaHref);

  return (
    <>
      {/* Outer rail owns the fixed positioning and the viewport gutters; the
          inner element owns the animation. Keeping them apart stops Framer's
          inline `transform` from fighting a centring translate. */}
      {/* px-4 (16px) on both sides gives the pill `calc(100% - 32px)` without
          any width math — it just fills the rail. Was `px-3 sm:px-4`, i.e. 12px
          gutters on every phone (375/390/430 are all below `sm`), so the sm step
          never applied where it was needed.

          `top` is a safe-area max() rather than a flat 16px: in portrait the
          browser already insets the viewport below the notch, but this site
          ships a manifest, and in standalone PWA mode it does not — the pill
          would sit under the status bar. `max()` costs nothing when the inset
          is 0. `md:top-6` is untouched, so desktop geometry (32px + 72px = the
          104px that ScrollStorySection's pt-[6.5rem] is measured against) is
          unchanged. The drawer mirrors both values so its toggle lands on the
          same pixels as this one. */}
      <div className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-header flex justify-center px-4 md:top-6">
        <motion.nav
          aria-label="Primary"
          initial={false}
          animate={
            visible
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: -30, scale: 0.96 }
          }
          // --dur-slow (500ms) + --ease-out-expo. Reduced motion resolves the
          // same way the CSS token override does elsewhere: duration to zero.
          transition={{ duration: reduced ? 0 : 0.5, ease: EASE_OUT_EXPO }}
          // Boolean, not an empty string — React 19 treats `inert=""` as false.
          // Keeps the hidden navbar out of the tab order entirely.
          inert={!visible}
          aria-hidden={!visible}
          className={cn(
            // h-[64px], NOT h-16. The spacing scale is remapped in
            // tailwind.config.js and key 16 points at --space-16 = 8rem, so
            // `h-16` was rendering a 128px pill — not the 64px stock Tailwind
            // implies. `md:h-[72px]` below masked it from 768px up, which is
            // exactly why the capsule only looked wrong on phones. Written as an
            // arbitrary value to match its md sibling: a pill height is a
            // component measurement, not a rhythm step, so it belongs off the
            // scale where it cannot be silently re-pointed again.
            'pointer-events-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between',
            // Solid `bg-surface`, NOT an alpha-modified arbitrary value.
            // `bg-[var(--surface)]/92` silently produced `rgba(0,0,0,0)` —
            // Tailwind cannot apply an alpha channel to a var() that holds a
            // full colour, so the pill rendered fully TRANSPARENT. Over the dark
            // How We Work panel that left dark text on near-black: invisible.
            // An opaque pill also removes any need for section-aware theming —
            // white ground + --text ink is 8.65:1 regardless of what scrolls
            // behind it.
            'rounded-pill border border-border-strong bg-surface px-5 shadow-lg md:h-[72px] md:px-8',
            !visible && 'pointer-events-none',
          )}
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'group relative py-1 text-label text-muted transition-colors duration-fast hover:text-text-strong',
                    isActive(item.href) && 'text-text-strong',
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-base ease-out-expo',
                      isActive(item.href)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button href={ctaHref} size="sm" className="hidden lg:inline-flex" magnetic>
              {ctaLabel}
            </Button>

            {/* Mobile trigger. Below `lg` this and the logo are the whole
                header — the list above and the CTA beside it are both hidden. */}
            <MenuToggle
              ref={triggerRef}
              open={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden"
            />
          </div>
        </motion.nav>
      </div>

      {/* Mobile drawer — full-screen, so it sits above the floating pill rather
          than trying to align beneath it.

          z-modal (500), not z-overlay (400). Nova's launcher is also z-overlay
          and mounts later in the DOM, so at equal z-index it painted on top of
          the open menu. Fixing it from Nova's side does not work: `cn()` runs
          tailwind-merge, which only recognises `auto`/integer/arbitrary values
          in its z-index group — it does NOT dedupe named scale classes like
          `z-overlay` vs `z-header`, so both survive, and `.z-overlay` happens to
          sort after `.z-header` in the emitted stylesheet at equal specificity.
          A config-side override would need `!important` to land. Promoting the
          drawer is also the semantically correct token: this is a
          `role="dialog" aria-modal="true"` surface, which is what z-modal is
          for. Final stack: WhatsApp 100 < pill 200 < Nova launcher 400 < drawer
          500.

          `.theme-dark` is what makes this an Avenix surface rather than a white
          dropdown: it is the §2 dark contrast block, so it supplies BOTH the
          obsidian ground and the whole inverted semantic layer. Every
          token-driven child below — buttons, borders, hairlines, the toggle, the
          amber — flips with it, which is why there is not one literal colour in
          this subtree.

          The `Logo` component is deliberately NOT reused inside it.
          logo3-trimmed.png draws the "AVENIX" wordmark in BLACK ink (only the
          chevron above it is amber), so on an obsidian panel the word would
          disappear and leave a floating mark. The text wordmark below is set
          from `brand.wordmark` — the same config value the footer uses — so no
          asset work and no change to Logo.jsx is needed. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT_QUAD }}
            className="theme-dark fixed inset-0 z-modal overflow-hidden lg:hidden"
          >
            {/* One amber wash bled from the top edge, echoing the hero. Written
                as hsl(var(--accent-hsl) / …) per the token rules — never a
                literal amber, so it re-tints with the accent if that ever
                changes. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 72% at 50% -12%, hsl(var(--accent-hsl) / 0.13), transparent 62%)',
              }}
            />

            {/* Surface enters just behind the backdrop — step two of the
                backdrop → surface → items sequence. */}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0 : 0.4,
                ease: EASE_OUT_EXPO,
                delay: reduced ? 0 : 0.06,
              }}
              /* px-4 here + px-5/md:px-8 below reproduces the pill's rail and
                 inner padding exactly, and the pt matches the rail's top, so the
                 toggle lands on the pixels it occupied a frame earlier and the
                 morph reads as continuous. `container-page`'s 20px gutter would
                 have jogged it sideways as the menu opened. */
              className="relative flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-6"
            >
              <div className="flex min-h-0 flex-1 flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-8">
                {/* Header row — same height as the pill it covers, so the
                    wordmark does not jump vertically either. */}
                <div className="flex h-[64px] shrink-0 items-center justify-between md:h-[72px]">
                  <Link
                    href="/"
                    onClick={closeFor('/')}
                    aria-label={`${siteConfig.brand.name} — home`}
                    className="group inline-flex items-baseline gap-2"
                  >
                    <span className="font-display text-[1.375rem] font-black leading-none tracking-[0.14em] text-text-strong transition-colors duration-base group-hover:text-accent">
                      {siteConfig.brand.wordmark}
                    </span>
                    <span className="font-mono text-eyebrow uppercase text-accent">
                      Studio
                    </span>
                  </Link>

                  {/* The pill's control again, at the pill's coordinates. */}
                  <MenuToggle ref={closeBtnRef} open onClick={() => setOpen(false)} />
                </div>

                {/* The list, not the panel, is the scroller. On 320x568 six 32px
                    entries plus the CTA block overflow by a few dozen pixels;
                    on anything taller this never engages because the content is
                    shorter than the flex track. */}
                <nav
                  aria-label="Mobile"
                  className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain py-6"
                >
                  <ul className="flex flex-col">
                    {drawerNav.map((item, i) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.45,
                          delay: reduced ? 0 : 0.14 + 0.045 * i,
                          ease: EASE_OUT_EXPO,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeFor(item.href)}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className="group flex items-baseline gap-4 border-b border-border py-4"
                        >
                          {/* Index only — the label beside it already carries
                              the accessible name, so this is aria-hidden rather
                              than read out as "zero one Work". */}
                          <span
                            aria-hidden="true"
                            className={cn(
                              'w-6 shrink-0 font-mono text-eyebrow transition-colors duration-base',
                              isActive(item.href)
                                ? 'text-accent'
                                : 'text-text-faint group-hover:text-accent',
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'font-display text-h2 font-bold leading-none transition-colors duration-base',
                              isActive(item.href)
                                ? 'text-accent'
                                : 'text-text-strong group-hover:text-accent',
                            )}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* CTA + meta. Both destinations already exist — /contact and
                    the configured WhatsApp number; nothing new is invented. */}
                <motion.div
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.45,
                    delay: reduced ? 0 : 0.14 + 0.045 * drawerNav.length,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="shrink-0"
                >
                  <Button
                    href={ctaHref}
                    size="lg"
                    className="w-full"
                    onClick={closeFor(ctaHref)}
                  >
                    {ctaLabel}
                  </Button>
                  <WhatsAppButton
                    source="mobile-drawer"
                    size="lg"
                    className="mt-3 w-full"
                  >
                    Chat on WhatsApp
                  </WhatsAppButton>

                  <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-eyebrow uppercase text-text-faint">
                    <span>{siteConfig.contact.location}</span>
                    <span aria-hidden="true" className="text-accent">
                      ·
                    </span>
                    <span>{siteConfig.contact.timezone}</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
