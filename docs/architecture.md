# Architecture

High-level layers only. See `nova/*` for specifics.

## UI Layer

- `src/components/nova/` — floating widget, chat window, streaming bubbles
- Config-driven (`src/config/nova.config.js`); no brand strings hardcoded
- Talks only to the chat API

## Knowledge Layer

- `src/lib/nova/knowledge/` — loader, parser, validator, registry, search
- `src/knowledge/<company>/` — per-company markdown content
- Multi-tenant; company = config + folder

## AI Layer

- `src/lib/nova/chat/` — server-side turn orchestration (composition root)
- `src/lib/nova/core/` — prompt/context building, conversation model
- Assembles knowledge + prompt + history, then calls a provider

## Provider Layer

- `src/lib/nova/providers/` — adapter pattern behind `baseProvider`
- Current: OpenAI. Swappable via `providerFactory`
- All provider-specific logic isolated per adapter

## Future Layers

- Memory / persistence
- Lead capture + CRM
- Analytics
- Retrieval (embeddings / vector)

## Boundaries

- Secrets server-only (`src/lib/env.js`)
- UI ⇄ API ⇄ (Knowledge + Provider); no cross-layer leakage
