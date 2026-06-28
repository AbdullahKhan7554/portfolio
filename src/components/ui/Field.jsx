'use client';

import { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const baseField =
  'w-full rounded-sm border bg-[var(--input-bg)] px-4 py-3 text-body text-text placeholder:text-[var(--input-placeholder)] transition-colors duration-fast focus-visible:border-transparent';

function ErrorText({ id, error }) {
  if (!error) return null;
  return (
    <p id={id} className="flex items-center gap-1.5 text-caption text-error" role="alert">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      {error}
    </p>
  );
}

export function Input({ label, error, hint, className, ...props }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label text-text-strong">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          baseField,
          error ? 'border-error' : 'border-border-strong hover:border-obsidian-500',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        {...props}
      />
      <ErrorText id={errId} error={error} />
      {hint && !error && <p className="text-caption text-faint">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, rows = 5, ...props }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label text-text-strong">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          baseField,
          'resize-y',
          error ? 'border-error' : 'border-border-strong hover:border-obsidian-500',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        {...props}
      />
      <ErrorText id={errId} error={error} />
    </div>
  );
}

/** Visually-hidden honeypot input — bots fill it, humans don't see it. */
export function Honeypot({ name = 'company', value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Company</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
