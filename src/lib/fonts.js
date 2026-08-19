import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';

/**
 * Fonts are SELF-HOSTED (next/font/local), not fetched from Google at build
 * time. next/font/google downloads from fonts.googleapis.com during the build,
 * which makes every production build — including Vercel's — depend on that
 * request succeeding. The files in src/fonts are committed to the repo so the
 * build has no network dependency at all.
 *
 * `adjustFontFallback` generates a metric-matched fallback face; that override,
 * not `display: swap`, is what stops the swap shifting layout.
 */

/**
 * Satoshi — display/heading face (Design System §3), replacing Fraunces.
 *
 * NOTE: these are the STATIC weights, not the variable file. Satoshi's static
 * family has no 600, so `--weight-semibold` is mapped to 700 in tokens.css —
 * without that, every 600 heading would be synthesised by the browser. Only the
 * four weights the site actually uses are declared (400 hero h1, 500 h1–h4,
 * 700 semibold headings + footer brand, 900 footer wordmark); the italic and
 * Light files in src/fonts are unreferenced and never ship.
 *
 * Dropping in Satoshi-Variable.woff2 later would collapse this to a single
 * `{ path, weight: '300 900' }` entry and restore a true 600.
 */
export const satoshi = localFont({
  src: [
    { path: '../fonts/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/Satoshi-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/Satoshi-Bold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/Satoshi-Black.otf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-satoshi',
  preload: true,
  fallback: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
  // Arial, not Times New Roman: Satoshi is a grotesk, so the fallback metrics
  // must come from a sans face or the pre-swap frame reflows.
  adjustFontFallback: 'Arial',
});

/** Inter — variable grotesk for body/UI text (§3). */
export const inter = localFont({
  src: [
    {
      path: '../fonts/Inter-Variable-latin.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

/** Geist Mono — monospace for eyebrows, metrics, and code accents. */
export const geistMono = GeistMono;

/** Combined class string applied to <html>; exposes the font CSS variables. */
export const fontVariables = `${satoshi.variable} ${inter.variable} ${geistMono.variable}`;
