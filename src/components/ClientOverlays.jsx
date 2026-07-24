'use client';

import dynamic from 'next/dynamic';

/**
 * Client-only overlay bundle (Phase 1 page-load optimization).
 *
 * These are all fixed-position, non-critical UI — a chat launcher, a one-time
 * intro animation, and a floating WhatsApp button — that play no part in the
 * server-rendered content or SEO. They are code-split and loaded on the CLIENT
 * ONLY, keeping them out of the initial JS payload. Behaviour is unchanged; only
 * WHEN their code loads changes (after hydration instead of in the first chunk).
 *
 * This wrapper exists because `ssr: false` requires a Client Component boundary
 * and the root layout is a Server Component.
 */
const NovaWidget = dynamic(() => import('@/components/nova').then((m) => m.NovaWidget), {
  ssr: false,
});
const CinematicIntro = dynamic(
  () => import('@/components/intro/CinematicIntro').then((m) => m.CinematicIntro),
  { ssr: false },
);
const FloatingWhatsApp = dynamic(
  () => import('@/components/ui/FloatingWhatsApp').then((m) => m.FloatingWhatsApp),
  { ssr: false },
);

export function ClientOverlays() {
  return (
    <>
      <CinematicIntro />
      <FloatingWhatsApp />
      <NovaWidget />
    </>
  );
}
