'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNova } from '../context/NovaContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { NOVA_IDS } from '../constants/nova.constants';
import { makeWindowVariants } from '../animations/nova.animations';
import { ChatHeader } from './ChatHeader';
import { ConversationArea } from './ConversationArea';
import { QuickReplies } from './QuickReplies';
import { MessageInput } from './MessageInput';

/**
 * The chat surface: an accessible dialog assembled from header, conversation,
 * quick replies, and composer. Full-screen sheet on mobile; a floating,
 * corner-anchored card on desktop. Focus is trapped and Escape closes it.
 */
export function ChatWindow() {
  const { config, close, vars } = useNova();
  const reduce = useReducedMotion();
  const windowRef = useRef(null);

  useFocusTrap(windowRef, { onEscape: close, initialFocus: `#${NOVA_IDS.input}` });

  return (
    <motion.section
      ref={windowRef}
      id={NOVA_IDS.window}
      role="dialog"
      aria-modal="true"
      aria-label={`${config.assistantName} — ${config.brandName}`}
      style={vars}
      variants={makeWindowVariants(reduce)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'fixed z-modal flex flex-col overflow-hidden bg-[var(--nova-bg)] text-[var(--nova-text)]',
        // Mobile: full-screen sheet.
        'inset-0 h-[100dvh] w-full',
        // Desktop: floating card anchored to the bottom-right.
        'md:inset-auto md:bottom-6 md:right-6 md:h-[min(620px,calc(100dvh-3rem))] md:w-[400px]',
        'md:origin-bottom-right md:rounded-3xl md:border md:border-[var(--nova-border)] md:shadow-2xl',
      )}
    >
      <ChatHeader />
      <ConversationArea />
      <QuickReplies />
      <MessageInput />
    </motion.section>
  );
}
