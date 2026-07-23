# Nova

Reusable, config-driven AI chat widget. Ships in this portfolio; re-brandable
for other companies by editing configuration only.

## Purpose

- Premium chat UI + grounded AI concierge
- Multi-tenant knowledge, provider-agnostic AI
- Sellable to other companies via config + a knowledge folder

## Current status

- **Milestone 4 complete** — OpenAI streaming conversation
- See `docs/milestones/` for per-milestone detail

## Folder overview

- `src/components/nova/` — UI (widget, hooks, context)
- `src/config/nova.config.js` — widget configuration
- `src/lib/nova/` — AI layer (providers, core, chat, types)
- `src/lib/nova/knowledge/` — Knowledge Management System (engine)
- `src/knowledge/<company>/` — knowledge content (markdown)
- `src/app/api/nova/chat/route.js` — streaming endpoint

## Start development

- `npm install`
- Copy `.env.example` → `.env.local`, set `OPENAI_API_KEY`
- `npm run dev` → open the site; Nova launches bottom-right
- Without a key, Nova shows a graceful fallback message

## Docs

- `architecture.md` — layer overview
- `nova/chat-flow.md` · `nova/knowledge.md` · `nova/providers.md` · `nova/configuration.md`
