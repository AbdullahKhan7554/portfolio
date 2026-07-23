'use client';

import { useEffect, useRef, useState } from 'react';
import { useNova } from '../context/NovaContext';
import { NOVA_IDS } from '../constants/nova.constants';
import { SendButton } from './SendButton';

/**
 * Composer. Auto-growing textarea (up to a cap), Enter to send,
 * Shift+Enter for a newline. Owns only its draft text.
 */
export function MessageInput() {
  const { config, sendMessage, isStreaming, stop } = useNova();
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow the textarea to fit content, capped so the window stays stable.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || isStreaming) return;
    sendMessage(text);
    setValue('');
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-[var(--nova-border)] bg-[var(--nova-surface)] p-3"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-[var(--nova-border)] bg-[var(--nova-bg)] px-3 py-2 transition-colors focus-within:border-[var(--nova-accent)]">
        <label htmlFor={NOVA_IDS.input} className="sr-only">
          {config.inputPlaceholder || 'Message'}
        </label>
        <textarea
          id={NOVA_IDS.input}
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={config.inputPlaceholder}
          className="max-h-32 flex-1 resize-none bg-transparent text-[0.95rem] leading-6 text-[var(--nova-text)] placeholder:text-[var(--nova-text-muted)] focus:outline-none"
        />
        <SendButton
          disabled={!value.trim()}
          streaming={isStreaming}
          onStop={stop}
        />
      </div>
    </form>
  );
}
