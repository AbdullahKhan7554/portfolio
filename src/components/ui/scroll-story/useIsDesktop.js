'use client';

import { useEffect, useState } from 'react';

/**
 * True at >=1024px (the `lg` breakpoint), which is where the spec's sticky
 * desktop behaviour applies. SSR-safe: starts false so the server and the first
 * client paint agree, then upgrades after mount — the stacked layout is the
 * safer thing to render if JS never arrives.
 */
export function useIsDesktop(query = '(min-width: 1024px)') {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return isDesktop;
}
