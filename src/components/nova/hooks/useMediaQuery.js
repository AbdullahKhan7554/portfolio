'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. SSR-safe: returns `false` until mounted,
 * then reflects the live match state.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
