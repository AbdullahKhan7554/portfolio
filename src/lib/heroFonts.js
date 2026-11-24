import localFont from 'next/font/local';

/**
 * HERO-ONLY typefaces — General Sans (display), DM Sans (body/UI) and
 * IBM Plex Mono (technical labels). Approved for the homepage hero redesign
 * (2026-11-25); the rest of the site stays on Satoshi / Inter / Geist Mono.
 *
 * Self-hosted from src/fonts like every other face, so the build makes no
 * network call. Imported ONLY by sections/Hero.jsx, which means next/font
 * emits and preloads these files on the homepage alone — no other route pays
 * for them.
 *
 * Scoping: Hero.jsx puts `heroFontVariables` on the <section>, and `.hx` in
 * globals.css re-points the site's semantic --font-display / --font-sans /
 * --font-mono at these variables inside that section. Every token-driven
 * element in the hero (headline, copy, <Button>, labels) flips automatically,
 * the same way `.theme-dark` flips colours.
 *
 * Licences: General Sans — ITF Free Font License (Fontshare; commercial use and
 * self-hosting permitted). DM Sans, IBM Plex Mono — SIL Open Font License 1.1.
 */

/** General Sans — variable, 200–700. */
export const generalSans = localFont({
  src: [
    { path: '../fonts/GeneralSans-Variable.woff2', weight: '200 700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-hero-display',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

/** DM Sans — variable (wght axis), latin subset. */
export const dmSans = localFont({
  src: [
    { path: '../fonts/DMSans-Variable-latin.woff2', weight: '100 1000', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-hero-body',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

/** IBM Plex Mono — the two weights the hero uses, latin subset. */
export const plexMono = localFont({
  src: [
    { path: '../fonts/IBMPlexMono-Regular-latin.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/IBMPlexMono-Medium-latin.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-hero-mono',
  // Labels only, all below the fold of attention — not worth a preload slot.
  preload: false,
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
  adjustFontFallback: false,
});

export const heroFontVariables = `${generalSans.variable} ${dmSans.variable} ${plexMono.variable}`;
