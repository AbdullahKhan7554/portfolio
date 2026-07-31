/**
 * Nova KMS — active company registration, built from `client.config.js`.
 *
 * DATA, not logic. The single tenant is derived from the client config so
 * `companyId` and brand identity are single-sourced; a new client changes only
 * `client.config.js`. The engine contains zero company-specific behavior.
 */
import { createCompanyConfig } from './companySchema';
import { createKnowledgeRegistry } from './registry';
import { clientConfig } from '@/config/client.config';

export const activeCompany = createCompanyConfig({
  companyId: clientConfig.identity.companyId,
  brandName: clientConfig.identity.brandName,
  knowledgeFolder: clientConfig.identity.companyId,
  website: clientConfig.urls.website,
  logo: clientConfig.urls.logo,
  primaryColor: clientConfig.widget.theme.dark.accent,
  assistantName: clientConfig.identity.assistantName,
});

/** Default registry, seeded with the active company. */
export const knowledgeRegistry = createKnowledgeRegistry([activeCompany]);
