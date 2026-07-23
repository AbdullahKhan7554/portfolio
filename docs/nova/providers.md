# Providers

Adapter pattern — all provider logic isolated per file.

## Interface

- Base: `src/lib/nova/providers/baseProvider.js`
- Contract: `id`, `label`, `capabilities()`, `validateConfig()`,
  `generate()`, `stream()`
- Normalized messages `{ role, content }` + `system` in; text deltas out

## Current provider

- OpenAI: `src/lib/nova/providers/openaiProvider.js`
- Native `fetch` + SSE; no SDK; key injected server-side
- Registered in `providerFactory.js`

## Add Anthropic

1. Create `providers/anthropicProvider.js` extending `BaseProvider`
2. Implement `generate`/`stream` (map `system` to top-level param)
3. Register `anthropic` in `providerFactory.js`
4. Add key in `src/lib/env.js`; pass via `providerConfig`

## Add Gemini

1. Create `providers/geminiProvider.js` extending `BaseProvider`
2. Map messages to `contents` (role `model` for assistant)
3. Register `gemini` in `providerFactory.js`; add key in `env.js`

## Notes

- No caller changes: `chatService` + UI stay identical
- Select via `providerId` / `aiConfig.defaultProvider`
