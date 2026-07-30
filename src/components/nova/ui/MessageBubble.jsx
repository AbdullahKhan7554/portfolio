'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNova } from '../context/NovaContext';
import { MESSAGE_ROLE } from '../constants/nova.constants';
import { formatTime } from '../helpers/nova.helpers';
import { makeBubbleVariants } from '../animations/nova.animations';
import { NovaAvatar } from './NovaAvatar';
import { CalBookingButton } from './CalBookingButton';

/**
 * A single conversation bubble. Aligns right for the visitor, left (with
 * avatar) for the assistant. A visually-hidden speaker label aids screen
 * readers reading the live conversation log.
 */
export function MessageBubble({ message }) {
  const { config } = useNova();
  const reduce = useReducedMotion();
  const isUser = message.role === MESSAGE_ROLE.USER;

  return (
    <motion.div
      variants={makeBubbleVariants(reduce)}
      initial="hidden"
      animate="visible"
      className={cn('flex w-full gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && <NovaAvatar config={config} size={28} className="mt-auto" />}

      <div className={cn('flex max-w-[78%] flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-relaxed',
            isUser
              ? 'rounded-br-md bg-[var(--nova-user-bubble)] text-[var(--nova-user-text)]'
              : 'rounded-bl-md bg-[var(--nova-assistant-bubble)] text-[var(--nova-assistant-text)]',
          )}
        >
          <span className="sr-only">
            {isUser ? 'You said: ' : `${config.assistantName} said: `}
          </span>
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
          <time
            dateTime={new Date(message.at).toISOString()}
            className="mt-1 block text-[0.65rem] opacity-50"
          >
            {formatTime(message.at)}
          </time>
        </div>

        {!isUser && (message.whatsappLink || message.calBookingAvailable) && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {message.whatsappLink && (
              <a
                href={message.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[0.8rem] font-medium text-white transition-colors hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
              >
                <MessageCircle size={15} aria-hidden="true" />
                Continue on WhatsApp
              </a>
            )}
            {message.calBookingAvailable && <CalBookingButton />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
