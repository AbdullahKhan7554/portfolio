import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */

// Security headers applied to every route. CSP is intentionally pragmatic so
// GA4 / Microsoft Clarity can load; tighten with a nonce-based policy if needed.
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  webpack: (config, { dev }) => {
    // This dev machine is RAM-constrained: webpack's persistent filesystem
    // cache (PackFileCacheStrategy) intermittently fails to allocate memory
    // while gzipping the cache pack, spamming ERR_MEMORY_ALLOCATION_FAILED.
    // Compiles themselves succeed — only the caching step OOMs — so disable the
    // persistent cache in dev for a stable (if slightly slower) server.
    if (dev) config.cache = false;
    return config;
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
