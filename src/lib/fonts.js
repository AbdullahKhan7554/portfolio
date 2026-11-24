import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';

/**
 * Site typefaces (changed 2026-11-25):
 *   • Plus Jakarta Sans 600/700 — headings   → --font-heading
 *   • Inter 400/500             — body / UI  → --font-body
 *   • Geist Mono                — eyebrows, labels, metrics (unchanged)
 *
 * Loaded with next/font/google: Next downloads the files at BUILD time and
 * serves them from this site, so visitors never contact Google. The trade-off
 * is that the build itself needs network access to fonts.googleapis.com.
 *
 * Only these weights exist. Text styled with another weight resolves to the
 * nearest loaded one (e.g. a 500 heading renders at 600, a 900 at 700); body
 * text asking for 600/700 gets the browser's synthetic bold of Inter 500.
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

export const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

/** Geist Mono — monospace for eyebrows, metrics, and code accents. */
export const geistMono = GeistMono;

/** Combined class string applied to <html>; exposes the font CSS variables. */
export const fontVariables = `${plusJakartaSans.variable} ${inter.variable} ${geistMono.variable}`;
