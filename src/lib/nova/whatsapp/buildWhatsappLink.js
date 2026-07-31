import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { clientConfig } from '@/config/client.config';

/**
 * Build a wa.me deep link prefilled with a captured lead's details.
 * Missing fields are omitted so the message never contains "undefined".
 * @param {{ fullName?: string, projectDescription?: string, budget?: string, timeline?: string }} [lead]
 * @returns {string}
 */
export function buildWhatsappLink(lead = {}) {
  const { fullName, projectDescription, budget, timeline } = lead;
  const parts = [];

  const brand = clientConfig.identity.brandName;
  parts.push(fullName ? `Hi ${brand}, I'm ${fullName}.` : `Hi ${brand}.`);

  if (projectDescription) parts.push(`I need: ${projectDescription}.`);

  const meta = [];
  if (budget) meta.push(`Budget: ${budget}`);
  if (timeline) meta.push(`Timeline: ${timeline}`);
  if (meta.length) parts.push(`${meta.join(', ')}.`);

  return buildWhatsAppUrl(parts.join(' '));
}
