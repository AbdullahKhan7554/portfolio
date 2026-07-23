'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Brand avatar for Nova. Renders the configured logo (cropped to the mark),
 * falling back to a monogram of the assistant name if no logo / on error.
 * Single responsibility: display the assistant's identity mark.
 */
export function NovaAvatar({ config, size = 36, className }) {
  const [broken, setBroken] = useState(false);
  const initial = (config.assistantName || '?').trim().charAt(0).toUpperCase();

  if (config.logo && !broken) {
    return (
      <span
        className={cn(
          'relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--nova-border)]',
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Image
          src={config.logo}
          alt=""
          fill
          sizes={`${size}px`}
          onError={() => setBroken(true)}
          className="scale-[1.18] object-cover object-[center_30%]"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-[var(--nova-accent)] font-semibold text-[var(--nova-accent-text)]',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
