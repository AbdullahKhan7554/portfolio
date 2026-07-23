# Knowledge

Multi-tenant knowledge for grounding replies.

## Knowledge folder

- Location: `src/knowledge/<companyId>/`
- Required docs: `company`, `services`, `pricing`, `portfolio`, `faq`,
  `process`, `technologies` (`.md`)
- Starter: `src/knowledge/_template/`
- Engine: `src/lib/nova/knowledge/`

## Company registration

- Configs registered in `src/lib/nova/knowledge/companies.js`
- Fields: see `nova/configuration.md`
- Default registry seeds the bundled companies

## Add a new company

1. Copy `src/knowledge/_template/` → `src/knowledge/<companyId>/`
2. Fill each `.md` (keep the headings)
3. Add a config in `companies.js` via `createCompanyConfig({...})`
4. Point `nova.config.js` `companyId` at it (if it's the active tenant)
5. Verify: `createKnowledgeService().getKnowledge('<companyId>')` → `validation.ok`

## Notes

- Engine is tenant-agnostic; no per-company code
- Keyword search only (no vectors)
