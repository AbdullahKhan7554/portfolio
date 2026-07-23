import { NextResponse } from 'next/server';
import { resolveActiveProvider } from '@/lib/env';
import { chatRequestSchema, runConversationTurn, rateLimitHook } from '@/lib/nova/chat';
import { ProviderConfigError, ProviderError, ValidationError } from '@/lib/nova';

/**
 * Nova chat — streaming conversation endpoint.
 *
 * Server-side only. Resolves the ACTIVE provider (Gemini / NVIDIA NIM) from the
 * environment (keys never exposed to the client), grounds the reply in the
 * active company's knowledge, and streams plain-text tokens back. Cancellation
 * propagates via `request.signal`.
 *
 * Conversation only — no lead capture, memory, analytics, or tools.
 */
export const runtime = 'nodejs'; // KMS loader reads the filesystem
export const dynamic = 'force-dynamic'; // never cache a streamed conversation

/** Adapt an async token iterator to a web ReadableStream. */
function iteratorToStream(iterator) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(value));
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      // Client disconnected / aborted — stop the upstream generator.
      iterator.return?.();
    },
  });
}

export async function POST(request) {
  // 1) Rate-limit hook (placeholder — always allows for now).
  const gate = await rateLimitHook(request);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', message: 'Too many requests. Please slow down.' },
      { status: 429 },
    );
  }

  // 2) Provider readiness — config-driven resolution with a LOGGED root cause.
  const provider = resolveActiveProvider();
  if (!provider.ok) {
    // eslint-disable-next-line no-console
    console.error('[Nova] 503 ai_not_configured — active provider is not configured', {
      provider: provider.providerId,
      missingEnv: provider.missing,
      hint: `Set ${provider.missing.join(', ')} in .env.local, or set NOVA_PROVIDER to a configured provider.`,
    });
    return NextResponse.json(
      {
        ok: false,
        error: 'ai_not_configured',
        provider: provider.providerId,
        missing: provider.missing,
        message: `Nova provider "${provider.providerId}" is not configured.`,
      },
      { status: 503 },
    );
  }

  // 3) Parse + validate the request.
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_request', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  // 4) Orchestrator-driven turn → knowledge-grounded streaming reply.
  try {
    const { stream, updatedState, nextStage } = await runConversationTurn({
      companyId: parsed.data.companyId,
      messages: parsed.data.messages,
      state: parsed.data.state,
      providerId: provider.providerId,
      providerConfig: {
        apiKey: provider.apiKey,
        model: provider.model,
        baseUrl: provider.baseUrl,
      },
      signal: request.signal,
    });

    return new Response(iteratorToStream(stream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, no-transform',
        'X-Accel-Buffering': 'no', // disable proxy buffering so tokens flush live
        // Orchestrator state round-trips to the UI (in-memory; no persistence).
        'X-Nova-State': encodeURIComponent(JSON.stringify(updatedState)),
        'X-Nova-Stage': nextStage,
        'Access-Control-Expose-Headers': 'X-Nova-State, X-Nova-Stage',
      },
    });
  } catch (err) {
    // Always log the REAL root cause (never a silent 503/502).
    // eslint-disable-next-line no-console
    console.error('[Nova] chat turn failed', {
      provider: provider.providerId,
      errorType: err?.name,
      code: err?.code,
      status: err?.status,
      missing: err?.missing,
      detail: err?.detail,
      message: err?.message,
    });

    // Pre-stream failures map to sensible statuses (headers not yet sent).
    if (err instanceof ProviderConfigError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'ai_not_configured',
          provider: provider.providerId,
          missing: err.missing,
          message: `Nova provider "${provider.providerId}" is missing configuration.`,
        },
        { status: 503 },
      );
    }
    if (err instanceof ValidationError) {
      return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 422 });
    }
    if (err instanceof ProviderError) {
      return NextResponse.json(
        { ok: false, error: 'provider_error', message: 'Nova could not respond right now.' },
        { status: 502 },
      );
    }
    // Unknown company id (from the KMS) or anything else.
    return NextResponse.json(
      { ok: false, error: 'bad_request', message: err?.message || 'Unable to start chat.' },
      { status: 400 },
    );
  }
}
