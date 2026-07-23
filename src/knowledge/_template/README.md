# Knowledge Template — add a new company

Nova's Knowledge Management System is multi-tenant and config-driven. To onboard
a new company, you only do two things — **no code changes to the engine.**

## 1. Create the folder

Copy this `_template/` folder and rename it to the new company's id
(lowercase-kebab-case), e.g. `acme-co/`:

```
src/knowledge/
  _template/        ← this starter (do not edit in place)
  avenix/           ← example tenant
  acme-co/          ← your new company
```

Fill in every `*.md` file. Keep the headings; replace the placeholder text.
Required documents: `company`, `services`, `pricing`, `portfolio`, `faq`,
`process`, `technologies`.

## 2. Register the company config

Add a config in `src/lib/nova/knowledge/companies.js`:

```js
export const acmeCompany = createCompanyConfig({
  companyId: 'acme-co',
  brandName: 'Acme Co',
  knowledgeFolder: 'acme-co',
  website: 'https://acme.example',
  logo: '/acme-logo.png',
  primaryColor: '#0055ff',
  assistantName: 'Acme Assistant',
});
// ...then add it to createKnowledgeRegistry([...])
```

That's it. The loader/parser/validator/search modules work for any company.
Validate with `createKnowledgeService().getKnowledge('acme-co')` and check
`validation.ok`.
