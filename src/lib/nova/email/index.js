/**
 * Nova Email — public API (barrel).
 *
 * Standalone, provider-agnostic email infrastructure following the same
 * DI/adapter pattern as src/lib/nova/providers/. Phase 1 = schema + adapter +
 * transactional EmailService only (no scheduling/cron — that is Phase 2).
 */
export { BaseEmailProvider } from './baseEmailProvider';
export { ResendProvider } from './resendProvider';
export {
  createEmailProvider,
  registerEmailProvider,
  availableEmailProviders,
  defaultEmailProviderRegistry,
} from './emailProviderFactory';
export {
  DEFAULT_EMAIL_PROVIDER,
  SUPPORTED_EMAIL_PROVIDERS,
  EMAIL_PROVIDER_ENV,
  resolveActiveEmailProviderId,
  resolveEmailProviderConfig,
} from './emailProviderResolver';
export {
  createSupabaseTemplateRepository,
  defaultTemplateRepository,
} from './templateRepository';
export {
  createScheduledEmailRepository,
  defaultScheduledEmailRepository,
} from './scheduledEmailRepository';
export {
  NURTURE_SEQUENCES,
  DEFAULT_SEQUENCE_KEY,
  getSequence,
} from './nurtureSequences';
export { createEmailService, renderTemplate } from './emailService';
export {
  EmailConfigError,
  EmailProviderNotFoundError,
  EmailSendError,
  TemplateNotFoundError,
} from './emailErrors';
