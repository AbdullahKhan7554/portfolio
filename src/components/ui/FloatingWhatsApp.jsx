'use client';

import { motion } from 'framer-motion';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { siteConfig } from '@/config/site';

/**
 * Persistent click-to-chat WhatsApp button (bottom-right on every page).
 * Brand-green with the official WhatsApp glyph; opens a prefilled wa.me chat.
 * Sits below the header drawer/intro overlay so it never covers the menu.
 */
export function FloatingWhatsApp() {
  if (!siteConfig.contact.whatsappNumber) return null;

  return (
    <motion.a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Avenix Studio on WhatsApp"
      onClick={() => trackEvent(AnalyticsEvent.WHATSAPP_CLICK, { source: 'floating' })}
      className="group fixed bottom-5 right-5 z-sticky grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/10 md:bottom-6 md:right-6"
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      {/* Soft pulse halo (no flashing) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        style={{ animationDuration: '2.6s' }}
      />
      <svg
        viewBox="0 0 32 32"
        className="relative h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.59-1.72a12.74 12.74 0 0 0 6.21 1.58h.01c7.07 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06A12.71 12.71 0 0 0 16.003 3.2Zm0 23.02h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.01 1.05 1.07-3.91-.25-.4a10.58 10.58 0 0 1-1.62-5.66c0-5.86 4.77-10.62 10.63-10.62 2.84 0 5.5 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.51c0 5.86-4.77 10.62-10.62 10.62Zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.62 0 1.55 1.13 3.04 1.29 3.25.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </motion.a>
  );
}
