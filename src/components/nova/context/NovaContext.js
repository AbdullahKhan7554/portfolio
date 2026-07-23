'use client';

import { createContext, useContext } from 'react';

/**
 * Nova context — the single source of shared widget state (config, theme,
 * disclosure, conversation). Populated by <NovaProvider>.
 */
export const NovaContext = createContext(null);

/** Access Nova state. Throws if used outside <NovaProvider> (developer error). */
export function useNova() {
  const ctx = useContext(NovaContext);
  if (!ctx) {
    throw new Error('useNova() must be used within <NovaProvider>.');
  }
  return ctx;
}
