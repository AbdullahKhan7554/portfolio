import './globals.css';
import { fontVariables } from '@/lib/fonts';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import {
  organizationSchema,
  personSchema,
  websiteSchema,
  jsonLd,
} from '@/lib/schema';
import { Analytics } from '@/components/Analytics';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ClientOverlays } from '@/components/ClientOverlays';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { PublicOnly } from '@/components/shell/PublicOnly';

/**
 * Runs BEFORE first paint: on every homepage load/refresh (motion allowed) it
 * pauses the homepage entrance animations so nothing flashes under the cinematic
 * intro. CinematicIntro removes the class once the logo settles.
 *
 * THE TIMEOUT IS A DEAD-MAN'S SWITCH, NOT PART OF THE TIMELINE.
 * `intro-active` both locks scrolling and freezes `.hero-in` / `.hero-line` at
 * their first frame — and those keyframes start at `opacity: 0`, so if nothing
 * ever removed the class the homepage would sit blank and unscrollable forever.
 * This timer is the only release that does not depend on the React bundle, so it
 * still fires if the bundle 404s, errors, or never hydrates.
 *
 * It is deliberately handed off rather than raced. The two clocks have different
 * origins: this one starts at HTML parse, CinematicIntro's REVEAL_AT starts at
 * mount. A fixed value therefore has to outlast hydration or it fires FIRST,
 * un-pausing the hero underneath a still-opaque overlay — the animations play
 * out unseen and the staged reveal is gone. Budgeting for that is what made this
 * 4200ms, and it is why simply shortening it would break the intro on exactly
 * the slow devices a shorter timeout is meant to help.
 *
 * So CinematicIntro clears this handle on mount and takes ownership. Once React
 * is alive the timer is irrelevant, which decouples the value below from
 * hydration speed entirely and lets it be tuned for the no-JS case alone: 3000ms
 * of a blank, locked homepage is the worst a visitor can now experience.
 */
const INTRO_GATE = `(function(){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var d=document.documentElement;if(location.pathname==='/'&&!r){d.classList.add('intro-active');window.__avxIntroRelease=setTimeout(function(){d.classList.remove('intro-active');},3000);}}catch(e){}})();`;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({ path: '/' }),
  applicationName: siteConfig.brand.name,
  authors: [{ name: siteConfig.brand.founder, url: siteConfig.url }],
  creator: siteConfig.brand.founder,
  publisher: siteConfig.brand.name,
  formatDetection: { telephone: false },
  manifest: '/manifest.webmanifest',
  // Favicon assets (derived from the official logo mark) — Metadata API.
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport = {
  // DEFAULT for every route except the homepage: inner pages all open on a
  // white PageHeader, so white chrome is the correct match.
  //
  // A per-scheme array is NOT the right tool for this site: it is light-only
  // (`colorScheme: 'light'`, `data-theme="light"` on <html>), so keying off
  // prefers-color-scheme would hand dark chrome to anyone whose OS is in dark
  // mode while the page under it stayed white. The real split here is
  // per-ROUTE — the homepage opens on a full-bleed dark hero — so it is
  // overridden by `export const viewport` in app/page.js. Next merges viewport
  // shallowly down the segment tree, so that override replaces themeColor only
  // and everything below is still inherited from here.
  themeColor: '#FFFFFF',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/logo.png" fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(personSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteSchema())}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        <SmoothScroll>
          <PublicOnly>
            <Header />
          </PublicOnly>
          {children}
          <PublicOnly>
            <Footer />
          </PublicOnly>
        </SmoothScroll>
        <ClientOverlays />
        <Analytics />
      </body>
    </html>
  );
}
