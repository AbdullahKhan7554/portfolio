'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { RouteTransitionOverlay } from '@/components/ui/RouteTransitionOverlay';

/**
 * Site-wide route transition overlay.
 *
 * The App Router exposes no navigation lifecycle events, so the start of a
 * navigation is detected the only way available from userland: a capture-phase
 * click listener on the document that recognises an internal anchor. The end is
 * `usePathname()` changing. Navigation itself is never intercepted or delayed —
 * the listener does not call preventDefault, so <Link> and the router behave
 * exactly as before and the overlay is purely a paint on top.
 *
 * MINIMUM DISPLAY TIME — 500ms.
 * Without a floor the overlay is a defect rather than a feature: a prefetched
 * route resolves in 30-60ms, and a slab that appears and vanishes inside two
 * frames reads as a flicker, not a transition. 500ms is the midpoint of the
 * 400-600ms brief and comfortably outlasts the 280ms crossfade at each end, so
 * the fade-in finishes before the fade-out can start. The clock starts at the
 * CLICK, not at the pathname change, so a slow route does not pay the floor
 * twice — a navigation that itself takes 500ms hides immediately on arrival.
 *
 * MAXIMUM DISPLAY TIME — 2500ms, a dead-man's switch in the same spirit as
 * layout.js's INTRO_GATE timeout. If a navigation is abandoned (the click is
 * handled but the route never resolves — a rejected prefetch, an error
 * boundary that renders in place, a browser-blocked navigation) nothing else
 * would ever clear `active`, and the site would sit behind an opaque slab. This
 * guarantees the overlay always lifts.
 *
 * WHAT DELIBERATELY DOES NOT TRIGGER IT
 *  - same-pathname links, so a hash link (`#services`), a query-only change
 *    (/work?type=web) and a click on the current page never flash the loader;
 *  - external origins, `target` other than _self, `download`, modified clicks
 *    (⌘/ctrl/shift/alt) and non-primary buttons — all of which either leave the
 *    site or open elsewhere, so a transition on this document would be a lie;
 *  - back/forward. `popstate` fires AFTER the history entry has already been
 *    applied, so an overlay raised there would cover a page that has already
 *    rendered — strictly worse than showing nothing.
 *  - /dashboard, which is an internal tool rather than part of the site.
 */

const MIN_DISPLAY_MS = 500;
const MAX_DISPLAY_MS = 2500;

const TransitionContext = createContext({ isTransitioning: false });

/** Read whether a route transition is currently painted. */
export function useRouteTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  const activeRef = useRef(false);
  const startedAt = useRef(0);
  const targetPath = useRef(null);
  /** Cross-page links carrying a hash must keep their anchor, not jump to top. */
  const resetScroll = useRef(true);
  const hideTimer = useRef(null);
  const failSafe = useRef(null);

  function stop() {
    activeRef.current = false;
    targetPath.current = null;
    setActive(false);
    if (failSafe.current) {
      clearTimeout(failSafe.current);
      failSafe.current = null;
    }
  }

  // ---- Navigation start -----------------------------------------------------
  useEffect(() => {
    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = e.target;
      const anchor = el instanceof Element ? el.closest('a[href]') : null;
      if (!anchor) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const raw = anchor.getAttribute('href');
      // `#…` never leaves the page; `mailto:`/`tel:` never load a document.
      if (!raw || raw.startsWith('#')) return;

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
      // Same document — a hash or query change, not a route transition.
      if (url.pathname === window.location.pathname) return;
      if (url.pathname.startsWith('/dashboard')) return;

      resetScroll.current = !url.hash;

      // A second click mid-transition re-points the destination but keeps the
      // original clock, so the floor is not restarted and the overlay does not
      // outstay it.
      targetPath.current = url.pathname;
      if (activeRef.current) return;

      activeRef.current = true;
      startedAt.current = Date.now();
      setActive(true);

      failSafe.current = setTimeout(stop, MAX_DISPLAY_MS);
    }

    // Capture phase: this must observe the click even if a handler further down
    // (the drawer's `closeFor`, say) stops propagation on the way up.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // ---- Navigation end -------------------------------------------------------
  useEffect(() => {
    if (!activeRef.current) return undefined;
    // Ignore an intermediate pathname that is not the one that was clicked.
    if (targetPath.current && pathname !== targetPath.current) return undefined;

    /**
     * Scroll reset happens HERE — while the slab still covers the viewport — so
     * the jump to the top of the new page is never seen.
     *
     * Next already resets native scroll on navigation, but Lenis keeps its own
     * animated position and will happily scroll the user back down from its
     * stale value on the next wheel event. `immediate` snaps its internal state
     * to match. Guarded because Lenis only runs on desktop pointers with motion
     * allowed (see SmoothScroll), so on a phone this is simply absent.
     *
     * `lenis.stop()` is deliberately NOT called. It adds `.lenis-stopped`, whose
     * `overflow: hidden` removes the scrollbar — a ~15px horizontal layout shift
     * on desktop at the exact moment the overlay lifts. The overlay already
     * covers the page and swallows clicks for its 500ms, so stopping the
     * scroller buys nothing and costs a visible jump.
     */
    if (resetScroll.current) {
      const lenis = typeof window !== 'undefined' ? window.__avxLenis : null;
      if (lenis) lenis.scrollTo(0, { immediate: true });
    }

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    hideTimer.current = setTimeout(stop, remaining);

    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [pathname]);

  // Timers must not outlive the tree.
  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (failSafe.current) clearTimeout(failSafe.current);
    },
    [],
  );

  return (
    <TransitionContext.Provider value={{ isTransitioning: active }}>
      {children}
      <RouteTransitionOverlay active={active} />
      {/*
        The overlay itself is aria-hidden, so this is the only thing a screen
        reader hears. `polite` will not cut off an announcement already in
        progress, which is the requirement — and because the text clears on
        arrival, Next's own route announcer reads the new page title straight
        after it rather than competing with it.
      */}
      <div role="status" aria-live="polite" className="sr-only">
        {active ? 'Loading page…' : ''}
      </div>
    </TransitionContext.Provider>
  );
}
