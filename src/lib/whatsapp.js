import { siteConfig } from '@/config/site';

/**
 * Build a click-to-chat wa.me URL with a prefilled message.
 * @param {string} [message] custom message; defaults to the configured one
 * @returns {string}
 */
export function buildWhatsAppUrl(message) {
  const number = siteConfig.contact.whatsappNumber.replace(/\D/g, '');
  const text = encodeURIComponent(message || siteConfig.contact.whatsappMessage);
  return `https://wa.me/${number}?text=${text}`;
}
