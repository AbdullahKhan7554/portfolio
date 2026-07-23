# Configuration

Only configurable values. No internal code.

## Widget — `src/config/nova.config.js`

- `brandName`, `assistantName`, `tagline`, `logo`
- `companyId` — active knowledge tenant
- `apiPath` — chat endpoint (default `/api/nova/chat`)
- `welcomeMessage`, `inputPlaceholder`, `errorMessage`
- `quickReplies` — suggested prompts
- `launcher.positionClassName` — floating button position
- `theme.dark` / `theme.light` — color palettes

## AI — `src/lib/nova/config/aiConfig.js`

- `defaultProvider`
- `providers.<id>` — model, temperature (non-secret)
- `temperature`, `maxResponseTokens`, `contextTokenBudget`
- `prompts.sales`, `prompts.faq` — toggle sections

## Company — `createCompanyConfig` (`companies.js`)

- `companyId`, `brandName`, `knowledgeFolder`
- `website`, `logo`, `primaryColor`, `assistantName`

## Environment — `.env.local` (see `.env.example`)

- `OPENAI_API_KEY` (server-only secret)
- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `OPENAI_BASE_URL` (default OpenAI; override for Azure/gateway)

## Rules

- Secrets: env only, never in config files or client
- Re-brand = edit config + knowledge folder only
