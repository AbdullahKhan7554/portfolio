'use client';

import { useEffect, useMemo, useState } from 'react';
import { toCssVars } from '../helpers/nova.helpers';

/**
 * Resolve the active Nova palette from the app's theme.
 *
 * Reads `<html data-theme>` (dark by default) and stays reactive to changes
 * via a MutationObserver, so Nova follows the site's light/dark mode. Returns
 * the current `mode` and the palette mapped to `--nova-*` CSS variables.
 */
export function useNovaTheme(theme) {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.dataset.theme === 'light' ? 'light' : 'dark');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const vars = useMemo(() => {
    const palette = theme?.[mode] || theme?.dark || {};
    return toCssVars(palette);
  }, [theme, mode]);

  return { mode, vars };
}
