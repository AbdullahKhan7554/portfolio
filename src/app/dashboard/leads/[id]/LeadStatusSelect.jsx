'use client';

import { useEffect, useState, useTransition } from 'react';
import { LEAD_STATUSES } from '@/lib/dashboard/leadStatus';
import { updateStatusAction } from './actions';

export function LeadStatusSelect({ id, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  // Reflect server truth when the row is revalidated with a new value.
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  function onChange(e) {
    const next = e.target.value;
    const prev = status;
    setStatus(next); // optimistic
    setError('');
    startTransition(async () => {
      try {
        const res = await updateStatusAction(id, next);
        if (res?.ok) {
          setStatus(res.status ?? next); // confirm with the persisted value
        } else {
          setStatus(prev); // revert
          setError(res?.error || 'Update failed');
        }
      } catch (err) {
        setStatus(prev); // revert on a thrown/rejected action
        setError(err?.message || 'Update failed');
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={status}
        onChange={onChange}
        disabled={pending}
        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-50"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <span className="text-xs text-[var(--text-muted)]">Saving…</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
