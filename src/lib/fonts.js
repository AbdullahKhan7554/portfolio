import { Outfit } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';

/**
 * Outfit — geometric sans-serif used site-wide for BOTH display headings and
 * body/UI text (the clean, modern "Satoshi / Linear / Vercel" look). Variable
 * font, self-hosted via next/font for zero layout shift.
 */
export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});

/** Geist Mono — monospace for eyebrows, metrics, and code accents. */
export const geistMono = GeistMono;

/** Combined class string applied to <html>; exposes the font CSS variables. */
export const fontVariables = `${outfit.variable} ${geistMono.variable}`;
