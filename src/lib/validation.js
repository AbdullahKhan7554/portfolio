import { z } from 'zod';

/** Contact form (PRD §7.16). Honeypot field `company` must stay empty. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  email: z.string().trim().email('Please enter a valid email address.'),
  businessType: z.string().trim().max(60).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a little more detail (10+ characters).')
    .max(2000),
  package: z.string().trim().max(40).optional().or(z.literal('')),
  // honeypot — bots fill this; humans never see it
  company: z.string().max(0).optional().or(z.literal('')),
});

/** Lead magnet — free audit (PRD §7.17). */
export const leadMagnetSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  website: z.string().trim().max(120).optional().or(z.literal('')),
  company: z.string().max(0).optional().or(z.literal('')),
});

/** Map a ZodError to a flat { field: message } object. */
export function fieldErrors(zodError) {
  const out = {};
  for (const issue of zodError.issues) {
    const key = issue.path[0];
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
