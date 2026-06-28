'use client';

import { useEffect, useRef } from 'react';

/**
 * Elegant custom cursor (desktop / fine-pointer only). A small dot tracks the
 * pointer 1:1 while a ring lerps behind it and swells over interactive targets.
 * Uses requestAnimationFrame + direct style writes — zero React re-renders.
 * Disabled entirely for touch devices and prefers-reduced-motion (native
 * cursor is restored), so usability never regresses.
 */
export function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!finePointer || reduced || !ring || !dot) return;

    const root = document.documentElement;
    root.classList.add('has-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (targetScale - scale) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    const interactive = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor="hover"]';
    const onOver = (e) => {
      if (e.target.closest?.(interactive)) targetScale = 1.9;
    };
    const onOut = (e) => {
      if (e.target.closest?.(interactive)) targetScale = 1;
    };
    const onDown = () => {
      ring.classList.add('is-down');
    };
    const onUp = () => {
      ring.classList.remove('is-down');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      root.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="avx-cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="avx-cursor-dot" />
    </>
  );
}
