/**
 * Nova — schema validation (zod). Reusable guards for the domain objects.
 * Pure: parsing only, no side effects, no persistence.
 *
 * zod is already a project dependency; using it keeps validation consistent
 * with the rest of the app (src/lib/validation.js).
 */
import { z } from 'zod';
import { MESSAGE_ROLE } from '../types/message';
import { LEAD_STATUS } from '../types/lead';

const optionalString = z.string().trim().max(500).optional().or(z.literal(''));

/** A single conversation message. */
export const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum([MESSAGE_ROLE.SYSTEM, MESSAGE_ROLE.USER, MESSAGE_ROLE.ASSISTANT]),
  content: z.string(),
  at: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

/** The reusable lead capture schema. All fields optional until completion. */
export const leadSchema = z.object({
  id: z.string().optional(),
  name: optionalString,
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: optionalString,
  budget: optionalString,
  service: optionalString,
  timeline: optionalString,
  country: optionalString,
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  status: z.enum(Object.values(LEAD_STATUS)).optional(),
  conversationId: z.string().nullable().optional(),
});

/** Non-secret provider config (model + sampling). Secrets are never here. */
export const providerConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  baseUrl: z.string().url().optional(),
});

/**
 * Normalize a zod result into a simple, framework-free outcome object.
 * @template T
 * @param {import('zod').SafeParseReturnType<any, T>} result
 * @returns {{ ok:true, data:T } | { ok:false, issues:Array<object> }}
 */
function toOutcome(result) {
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, issues: result.error.issues };
}

export const validateLead = (data) => toOutcome(leadSchema.safeParse(data));
export const validateMessage = (data) => toOutcome(messageSchema.safeParse(data));
export const validateProviderConfig = (data) =>
  toOutcome(providerConfigSchema.safeParse(data));
