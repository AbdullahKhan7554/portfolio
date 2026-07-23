'use client';

import { useEffect } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog focus management for the chat window:
 *   • moves focus inside on open (to `initialFocus` selector if given),
 *   • traps Tab / Shift+Tab within the container,
 *   • calls `onEscape` on the Escape key,
 *   • restores focus to the previously focused element (the launcher) on close.
 */
export function useFocusTrap(ref, { onEscape, initialFocus } = {}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const previouslyFocused = document.activeElement;
    const getItems = () =>
      Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );

    const raf = requestAnimationFrame(() => {
      const target = initialFocus ? node.querySelector(initialFocus) : null;
      (target || getItems()[0])?.focus();
    });

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getItems();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    node.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [ref, onEscape, initialFocus]);
}
