import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Build a wa.me deep link prefilled with a captured lead's details.
 * Missing fields are omitted so the message never contains "undefined".
 * @param {{ fullName?: string, projectDescription?: string, budget?: string, timeline?: string }} [lead]
 * @returns {string}
 */
export function buildWhatsappLink(lead = {}) {
  const { fullName, projectDescription, budget, timeline } = lead;
  const parts = [];

  parts.push(fullName ? `Hi Avenix Studio, I'm ${fullName}.` : 'Hi Avenix Studio.');

  if (projectDescription) parts.push(`I need: ${projectDescription}.`);

  const meta = [];
  if (budget) meta.push(`Budget: ${budget}`);
  if (timeline) meta.push(`Timeline: ${timeline}`);
  if (meta.length) parts.push(`${meta.join(', ')}.`);

  return buildWhatsAppUrl(parts.join(' '));
}
