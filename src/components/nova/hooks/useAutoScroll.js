'use client';

import { useEffect, useRef } from 'react';

/**
 * Keep a scroll container pinned to the bottom whenever `dependency` changes
 * (e.g. a new message or the typing indicator appearing). Returns the ref to
 * attach to the scrollable element.
 */
export function useAutoScroll(dependency) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [dependency]);

  return ref;
}
