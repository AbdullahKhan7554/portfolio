/**
 * Nova — shared OpenAI-compatible transport.
 *
 * Both Google AI Studio (Gemini, via its OpenAI-compat endpoint) and NVIDIA NIM
 * speak the OpenAI Chat Completions protocol (JSON + SSE). This module holds the
 * one implementation both adapters reuse, so there is NO duplicated transport
 * logic. It never decides which provider to use — callers pass their config.
 */
import { ProviderError, ProviderConfigError } from '../types/errors';

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

/** Build the OpenAI-style message array (system prepended). */
export function buildMessages(messages = [], system) {
  const out = [];
  if (system) out.push({ role: 'system', content: system });
  for (const m of messages) out.push({ role: m.role, content: m.content });
  return out;
}

/** POST to `${baseUrl}/chat/completions`, throwing typed errors on failure. */
async function request({ providerId, apiKey, baseUrl, payload, signal, stream }) {
  if (!apiKey) {
    throw new ProviderConfigError(`${providerId} provider requires an apiKey.`, ['apiKey']);
  }

  let res;

  // ==========================
  // DEBUG (Added Only)
  // ==========================
  const url = `${baseUrl}/chat/completions`;

  console.log('\n========== NVIDIA REQUEST ==========');
  console.log('Provider :', providerId);
  console.log('URL      :', url);
  console.log('Model    :', payload.model);
  console.log('Streaming:', stream);
  console.log('Base URL :', baseUrl);
  console.log('API Key  :', apiKey ? `Present (${apiKey.slice(0, 8)}...)` : 'MISSING');
  console.log('====================================\n');
  // ==========================

  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ ...payload, stream }),
      signal,
    });

    // ==========================
    // DEBUG (Added Only)
    // ==========================
    console.log('\n========== NVIDIA RESPONSE ==========');
    console.log('Status:', res.status);
    console.log('OK    :', res.ok);
    console.log('=====================================\n');
    // ==========================

  } catch (e) {
    console.error('\n========== NVIDIA NETWORK ERROR ==========');
    console.error(e);
    console.error('==========================================\n');

    if (e?.name === 'AbortError') throw e;

    throw new ProviderError(providerId, `Network error contacting ${providerId}.`, {
      cause: e,
    });
  }

  if (!res.ok) {
    const detail = await safeText(res);

    // ==========================
    // DEBUG (Added Only)
    // ==========================
    console.error('\n========== NVIDIA API ERROR ==========');
    console.error('Status :', res.status);
    console.error('URL    :', url);
    console.error('Model  :', payload.model);
    console.error('Body   :');
    console.error(detail);
    console.error('======================================\n');
    // ==========================

    throw new ProviderError(providerId, `${providerId} request failed (${res.status}).`, {
      status: res.status,
      detail,
    });
  }

  return res;
}

/** Single-shot completion → normalized ProviderCompletion. */
export async function generateChatCompletion({
  providerId,
  apiKey,
  baseUrl,
  payload,
  signal,
}) {
  const res = await request({
    providerId,
    apiKey,
    baseUrl,
    payload,
    signal,
    stream: false,
  });

  const json = await res.json();
  const choice = json.choices?.[0];

  return {
    content: choice?.message?.content ?? '',
    finishReason: choice?.finish_reason ?? 'stop',
    providerId,
    usage: {
      promptTokens: json.usage?.prompt_tokens,
      completionTokens: json.usage?.completion_tokens,
    },
  };
}

/** Streaming completion → yields text deltas (SSE). Honors `signal`. */
export async function* streamChatCompletion({
  providerId,
  apiKey,
  baseUrl,
  payload,
  signal,
}) {
  const res = await request({
    providerId,
    apiKey,
    baseUrl,
    payload,
    signal,
    stream: true,
  });

  if (!res.body) {
    throw new ProviderError(
      providerId,
      `${providerId} returned no response body to stream.`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let nl;

      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);

        if (!line || !line.startsWith('data:')) continue;

        const data = line.slice(5).trim();

        if (data === '[DONE]') return;

        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;

          if (delta) {
            yield delta;
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }
  } catch (e) {
    if (e?.name === 'AbortError') return;

    console.error('\n========== NVIDIA STREAM ERROR ==========');
    console.error(e);
    console.error('=========================================\n');

    throw new ProviderError(providerId, `${providerId} stream interrupted.`, {
      cause: e,
    });
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }
}