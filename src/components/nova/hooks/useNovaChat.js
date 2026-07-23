'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MESSAGE_ROLE } from '../constants/nova.constants';
import { createId } from '../helpers/nova.helpers';

/**
 * Conversation state for the widget — UI ONLY.
 *
 * There is deliberately no AI, no network request, and no business logic here
 * (Milestone 1). Sending a message appends the visitor's bubble, shows the
 * typing indicator, then appends a clearly-labelled preview reply from config
 * (`placeholderReply`) purely so the full UI can be demonstrated. A later
 * milestone replaces the timeout with a real response source.
 */
export function useNovaChat(config) {
  const [messages, setMessages] = useState(() =>
    config.welcomeMessage
      ? [
          {
            id: createId(),
            role: MESSAGE_ROLE.ASSISTANT,
            text: config.welcomeMessage,
            at: Date.now(),
          },
        ]
      : [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef(null);

  const sendMessage = useCallback(
    (raw) => {
      const text = String(raw ?? '').trim();
      if (!text) return;

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: MESSAGE_ROLE.USER, text, at: Date.now() },
      ]);

      // UI preview only — no AI. Skip entirely if no placeholder is configured.
      if (!config.placeholderReply) return;

      setIsTyping(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: MESSAGE_ROLE.ASSISTANT,
            text: config.placeholderReply,
            at: Date.now(),
          },
        ]);
      }, config.typingDelayMs ?? 1100);
    },
    [config.placeholderReply, config.typingDelayMs],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { messages, isTyping, sendMessage };
}
