'use client';

import { usePathname } from 'next/navigation';

/** Renders children on public routes; hidden on the internal /dashboard tool. */
export function PublicOnly({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;
  return children;
}
