'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { AnalyticsEvent } from '@/lib/analytics';

/**
 * WhatsApp click-to-chat CTA. Builds the prefilled wa.me URL from config and
 * fires the `whatsapp_click` event with its source section.
 */
export function WhatsAppButton({
  source = 'unknown',
  message,
  variant = 'secondary',
  size = 'md',
  children = 'Chat on WhatsApp',
  className,
}) {
  return (
    <Button
      href={buildWhatsAppUrl(message)}
      variant={variant}
      size={size}
      className={className}
      analyticsEvent={AnalyticsEvent.WHATSAPP_CLICK}
      analyticsParams={{ source }}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  );
}
