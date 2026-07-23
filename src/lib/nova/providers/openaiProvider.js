/**
 * Nova — OpenAI adapter (Milestone 4: implemented).
 *
 * Isolates ALL OpenAI-specific logic behind the BaseProvider contract, so the
 * rest of the system stays provider-agnostic. Uses the OpenAI REST API over
 * native `fetch` (no SDK dependency); OpenAI request/response shapes never leak
 * outside this file. Server-side only — the API key is passed in via config and
 * never logged or returned.
 *
 * Implements the M2 seams: `generate()` (single-shot) and `stream()` (token
 * streaming via SSE). No tools, no function calling — conversation only.
 */
import { BaseProvider } from './baseProvider';
import { ProviderError, ProviderConfigError } from '../types/errors';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

/** Read a response body as text without throwing. */
async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

export class OpenAIProvider extends BaseProvider {
  get id() {
    return 'openai';
  }

  get label() {
    return 'OpenAI';
  }

  capabilities() {
    return { streaming: true, tools: false, vision: false };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.apiKey) missing.push('apiKey');
    if (!this.config.model && !DEFAULT_MODEL) missing.push('model');
    return { ok: missing.length === 0, missing };
  }

  /**
   * Translate Nova's normalized params into an OpenAI Chat Completions payload.
   * @param {import('./baseProvider').GenerateParams} params
   * @param {boolean} stream
   * @private
   */
  _payload({ messages = [], system, temperature, maxTokens }, stream) {
    const openaiMessages = [];
    if (system) openaiMessages.push({ role: 'system', content: system });
    for (const m of messages) openaiMessages.push({ role: m.role, content: m.content });
    return {
      model: this.config.model || DEFAULT_MODEL,
      temperature: temperature ?? this.config.temperature ?? 0.6,
      max_tokens: maxTokens ?? this.config.maxTokens ?? 1024,
      stream,
      messages: openaiMessages,
    };
  }

  /** @private Perform the POST, throwing typed errors on failure. */
  async _request(params, stream) {
    if (!this.config.apiKey) {
      throw new ProviderConfigError('OpenAI provider requires an apiKey.', ['apiKey']);
    }
    const baseUrl = this.config.baseUrl || DEFAULT_BASE_URL;
    let res;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(this._payload(params, stream)),
        signal: params.signal,
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new ProviderError(this.id, 'Network error contacting OpenAI.', { cause: e });
    }
    if (!res.ok) {
      throw new ProviderError(this.id, `OpenAI request failed (${res.status}).`, {
        status: res.status,
        detail: await safeText(res),
      });
    }
    return res;
  }

  /**
   * Single-shot completion.
   * @param {import('./baseProvider').GenerateParams} params
   * @returns {Promise<import('./baseProvider').ProviderCompletion>}
   */
  async generate(params) {
    const res = await this._request(params, false);
    const json = await res.json();
    const choice = json.choices?.[0];
    return {
      content: choice?.message?.content ?? '',
      finishReason: choice?.finish_reason ?? 'stop',
      providerId: this.id,
      usage: {
        promptTokens: json.usage?.prompt_tokens,
        completionTokens: json.usage?.completion_tokens,
      },
    };
  }

  /**
   * Streaming completion — yields text deltas as they arrive (SSE).
   * Honors `params.signal` for cancellation.
   * @param {import('./baseProvider').GenerateParams} params
   * @returns {AsyncGenerator<string>}
   */
  async *stream(params) {
    const res = await this._request(params, true);
    if (!res.body) {
      throw new ProviderError(this.id, 'OpenAI returned no response body to stream.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are newline-delimited `data: {...}` lines.
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line || !line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') return;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {
            // ignore keep-alive / partial frames
          }
        }
      }
    } catch (e) {
      if (e?.name === 'AbortError') return;
      throw new ProviderError(this.id, 'OpenAI stream interrupted.', { cause: e });
    } finally {
      try {
        reader.releaseLock();
      } catch {
        /* noop */
      }
    }
  }
}
