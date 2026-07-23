/**
 * Nova KMS — bundled company registrations.
 *
 * This is DATA, not logic: each company is a plain config paired with a folder
 * under the knowledge root. Add a new tenant by appending a config here (and a
 * matching markdown folder) — no engine changes. The engine contains zero
 * company-specific behavior.
 */
import { createCompanyConfig } from './companySchema';
import { createKnowledgeRegistry } from './registry';

/** First tenant — Avenix Studio. Pure config; swap/extend freely. */
export const avenixCompany = createCompanyConfig({
  companyId: 'avenix',
  brandName: 'Avenix Studio',
  knowledgeFolder: 'avenix',
  website: 'https://www.avenixstudios.com',
  logo: '/logo.png',
  primaryColor: '#e3a857',
  assistantName: 'Nova',
});

/** Default registry, seeded with the bundled companies. */
export const knowledgeRegistry = createKnowledgeRegistry([avenixCompany]);
