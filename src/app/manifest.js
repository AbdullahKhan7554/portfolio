import { siteConfig } from '@/config/site';

/** PWA web app manifest (served at /manifest.webmanifest). */
export default function manifest() {
  return {
    name: siteConfig.brand.name,
    short_name: 'Avenix',
    description: siteConfig.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0B',
    theme_color: '#0A0A0B',
    lang: 'en',
    categories: ['business', 'technology', 'productivity'],
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
