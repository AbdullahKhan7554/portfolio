/**
 * Nova chat — request schema for the /api/nova/chat route. Validates the
 * client payload before any work happens. Conversation only: a company id and
 * the running message list (no lead fields, no tools).
 */
import { z } from 'zod';

export const chatRequestSchema = z.object({
  /** Active company/tenant whose knowledge grounds the reply. */
  companyId: z.string().trim().min(1).max(64),
  /** Running conversation (user/assistant turns only). */
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(50),
});

/** @typedef {z.infer<typeof chatRequestSchema>} ChatRequest */
