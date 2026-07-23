'use client';

import { useNova } from '../context/NovaContext';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { NOVA_IDS } from '../constants/nova.constants';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

/**
 * Scrollable message list. Exposed as an ARIA live log so new messages are
 * announced, and kept auto-scrolled to the latest entry.
 */
export function ConversationArea() {
  const { messages, isTyping } = useNova();
  const scrollRef = useAutoScroll(messages.length + (isTyping ? 1 : 0));

  return (
    <div
      ref={scrollRef}
      id={NOVA_IDS.log}
      role="log"
      aria-live="polite"
      aria-label="Conversation"
      tabIndex={0}
      className="flex-1 space-y-3 overflow-y-auto px-3 py-4 focus-visible:outline-none"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
