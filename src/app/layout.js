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
import { CinematicIntro } from '@/components/intro/CinematicIntro';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';

/**
 * Runs BEFORE first paint: on every homepage load/refresh (motion allowed) it
 * pauses the homepage entrance animations so nothing flashes under the cinematic
 * intro. CinematicIntro removes the class once the logo settles.
 */
const INTRO_GATE = `(function(){try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var d=document.documentElement;if(location.pathname==='/'&&!r){d.classList.add('intro-active');setTimeout(function(){d.classList.remove('intro-active');},4200);}}catch(e){}})();`;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({ path: '/' }),
  applicationName: siteConfig.brand.name,
  authors: [{ name: siteConfig.brand.founder, url: siteConfig.url }],
  creator: siteConfig.brand.founder,
  publisher: siteConfig.brand.name,
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={fontVariables} suppressHydrationWarning>
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
        <CinematicIntro />
        <CustomCursor />
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
