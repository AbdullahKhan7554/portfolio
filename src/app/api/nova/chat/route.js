import { NextResponse } from 'next/server';
import { serverEnv, isOpenAIConfigured } from '@/lib/env';
import { chatRequestSchema, createChatStream, rateLimitHook } from '@/lib/nova/chat';
import { ProviderConfigError, ProviderError, ValidationError } from '@/lib/nova';

/**
 * Nova chat — streaming conversation endpoint (Milestone 4).
 *
 * Server-side only. Reads the OpenAI key from the environment (never exposed to
 * the client), grounds the reply in the active company's knowledge, and streams
 * plain-text tokens back. Cancellation propagates via `request.signal`.
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

  // 2) Provider readiness — graceful, non-streaming error the UI can fall back on.
  if (!isOpenAIConfigured) {
    return NextResponse.json(
      { ok: false, error: 'ai_not_configured', message: 'Nova is not configured yet.' },
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

  // 4) Build the request lifecycle and open the token stream.
  try {
    const iterator = await createChatStream({
      companyId: parsed.data.companyId,
      messages: parsed.data.messages,
      providerId: 'openai',
      providerConfig: {
        apiKey: serverEnv.openaiApiKey,
        model: serverEnv.openaiModel,
        baseUrl: serverEnv.openaiBaseUrl,
      },
      signal: request.signal,
    });

    return new Response(iteratorToStream(iterator), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, no-transform',
        'X-Accel-Buffering': 'no', // disable proxy buffering so tokens flush live
      },
    });
  } catch (err) {
    // Pre-stream failures map to sensible statuses (headers not yet sent).
    if (err instanceof ProviderConfigError) {
      return NextResponse.json(
        { ok: false, error: 'ai_not_configured', message: 'Nova is not configured yet.' },
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
