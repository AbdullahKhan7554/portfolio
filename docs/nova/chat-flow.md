# Chat Flow

Request lifecycle for one conversation turn.

```
User
  ↓
UI            src/components/nova (useNovaChat)
  ↓  POST { companyId, messages }
API           src/app/api/nova/chat/route.js
  ↓
Knowledge     src/lib/nova/knowledge (knowledgeService → docs)
  ↓
Provider      src/lib/nova/chat/chatService → providers/openaiProvider
  ↓  SSE tokens
Streaming     ReadableStream (text/plain)
  ↓
UI            tokens appended to assistant bubble
```

## Notes

- Orchestration: `src/lib/nova/chat/chatService.js`
- System prompt = company identity + knowledge (grounded)
- Cancellation: `AbortController` in UI → `request.signal` → provider
- Errors return JSON before streaming; UI shows fallback
