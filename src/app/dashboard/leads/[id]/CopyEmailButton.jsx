'use client';

import { useState } from 'react';

const BTN =
  'rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)]';

export function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button type="button" onClick={onCopy} className={BTN}>
      {copied ? 'Copied!' : 'Copy email'}
    </button>
  );
}
