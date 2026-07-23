'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MESSAGE_ROLE } from '../constants/nova.constants';
import { createId } from '../helpers/nova.helpers';

/**
 * Conversation state for the widget (Milestone 4: live streaming).
 *
 * Sends the running history to the Nova chat API and streams the assistant's
 * reply token-by-token into a single growing bubble. Shows the typing indicator
 * while awaiting the first token, and supports cancellation via `stop()`.
 *
 * UI concern only — no AI logic here (that lives server-side behind the API);
 * no lead capture, no persistence.
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
            kind: 'welcome',
          },
        ]
      : [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);
  // Opaque orchestrator state (5C). The UI only carries it between turns — it
  // makes no sales/lead decisions itself.
  const conversationStateRef = useRef(null);

  /** Cancel an in-flight response. */
  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (raw) => {
      const text = String(raw ?? '').trim();
      if (!text || isStreaming) return;

      const userMessage = {
        id: createId(),
        role: MESSAGE_ROLE.USER,
        text,
        at: Date.now(),
      };

      // History for the API = real user/assistant turns only (drop the canned
      // welcome and any prior error notices).
      const history = [...messages, userMessage]
        .filter((m) => m.kind !== 'welcome' && !m.error)
        .map((m) => ({ role: m.role, content: m.text }));

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const assistantId = createId();
      let started = false;

      const appendAssistant = (chunk) => {
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: MESSAGE_ROLE.ASSISTANT, text: chunk, at: Date.now() },
        ]);
      };
      const growAssistant = (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + chunk } : m)),
        );
      };
      const showError = () => {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: MESSAGE_ROLE.ASSISTANT,
            text: config.errorMessage || 'Sorry, something went wrong.',
            at: Date.now(),
            error: true,
          },
        ]);
      };

      try {
        const res = await fetch(config.apiPath || '/api/nova/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyId: config.companyId,
            messages: history,
            state: conversationStateRef.current,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setIsTyping(false);
          showError();
          return;
        }

        // Carry the orchestrator's updated state forward to the next turn.
        const encodedState = res.headers.get('X-Nova-State');
        if (encodedState) {
          try {
            conversationStateRef.current = JSON.parse(decodeURIComponent(encodedState));
          } catch {
            /* ignore malformed state header */
          }
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          if (!started) {
            started = true;
            setIsTyping(false);
            appendAssistant(chunk);
          } else {
            growAssistant(chunk);
          }
        }
      } catch (err) {
        // Aborts are intentional (stop) — leave the partial reply as-is.
        if (err?.name !== 'AbortError' && !started) showError();
      } finally {
        setIsTyping(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, config.apiPath, config.companyId, config.errorMessage],
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return { messages, isTyping, isStreaming, sendMessage, stop };
}
