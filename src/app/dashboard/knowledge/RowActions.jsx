'use client';

import { useState, useTransition } from 'react';
import { toggleActiveAction, deleteEntryAction } from './actions';

export function RowActions({ kind, id, isActive }) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(isActive);
  const [error, setError] = useState('');

  function onToggle() {
    const next = !active;
    setActive(next); // optimistic
    setError('');
    startTransition(async () => {
      const res = await toggleActiveAction(kind, id, next);
      if (!res?.ok) {
        setActive(!next); // revert
        setError(res?.error || 'Update failed');
      }
    });
  }

  function onDelete() {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    setError('');
    startTransition(async () => {
      const res = await deleteEntryAction(kind, id);
      if (!res?.ok) setError(res?.error || 'Delete failed');
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className={`rounded-[var(--radius-md)] border px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
          active
            ? 'border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)]'
            : 'border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
        }`}
      >
        {active ? 'Active' : 'Inactive'}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="rounded-[var(--radius-md)] border border-[var(--border)] px-2 py-1 text-xs text-red-500 transition-colors hover:border-red-500 disabled:opacity-50"
      >
        Delete
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
