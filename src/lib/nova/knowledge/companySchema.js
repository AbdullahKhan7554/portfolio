/**
 * Nova KMS — company configuration schema + factory.
 *
 * A company is defined ENTIRELY by this config plus a markdown folder — there
 * is no per-tenant code. Adding a company = create a config + a folder.
 */
import { z } from 'zod';
import { ValidationError } from '../types/errors';

const optional = (schema) => schema.optional().or(z.literal(''));

/** The reusable company configuration contract. */
export const companyConfigSchema = z.object({
  /** Stable slug; also the default knowledge folder name. */
  companyId: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'companyId must be lowercase-kebab-case'),
  brandName: z.string().trim().min(1),
  /** Folder under the knowledge root; defaults to companyId. */
  knowledgeFolder: z.string().trim().min(1),
  website: optional(z.string().trim().url()),
  logo: optional(z.string().trim()),
  primaryColor: optional(z.string().trim()),
  assistantName: z.string().trim().min(1),
});

/** @typedef {z.infer<typeof companyConfigSchema>} CompanyConfig */

/**
 * Build a validated, frozen company config with sensible defaults.
 * @param {Partial<CompanyConfig>} [input]
 * @returns {Readonly<CompanyConfig>}
 */
export function createCompanyConfig(input = {}) {
  const withDefaults = {
    knowledgeFolder: input.companyId,
    assistantName: 'Assistant',
    website: '',
    logo: '',
    primaryColor: '',
    ...input,
  };
  const parsed = companyConfigSchema.safeParse(withDefaults);
  if (!parsed.success) {
    throw new ValidationError(
      `Invalid company config for "${input.companyId ?? '?'}".`,
      parsed.error.issues,
    );
  }
  return Object.freeze(parsed.data);
}

/** Non-throwing validation. */
export function validateCompanyConfig(input) {
  const result = companyConfigSchema.safeParse(input);
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, issues: result.error.issues };
}
