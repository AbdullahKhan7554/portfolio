/**
 * Nova — Google AI Studio (Gemini) adapter — OFFICIAL API.
 *
 * Talks to the native Google Generative Language API
 * (`:generateContent` / `:streamGenerateContent`), NOT the OpenAI-compat layer.
 * All Gemini-specific request/response shaping lives here; the BaseProvider
 * contract (id, label, capabilities, validateConfig, generate, stream) is
 * unchanged, so the factory and callers keep working exactly as before.
 *
 * Config (server-side only):
 *   - apiKey  ← GEMINI_API_KEY   (sent as the `x-goog-api-key` header)
 *   - model   ← GEMINI_MODEL     (falls back to DEFAULT_MODEL)
 *   - baseUrl ← optional override (defaults to the official endpoint)
 */
import { BaseProvider } from './baseProvider';
import { ProviderError, ProviderConfigError } from '../types/errors';

/** Official Generative Language API base. */
const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
/** Configurable default model (used only when GEMINI_MODEL is unset). */
const DEFAULT_MODEL = 'gemini-1.5-flash';

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

export class GeminiProvider extends BaseProvider {
  get id() {
    return 'gemini';
  }

  get label() {
    return 'Google AI Studio (Gemini)';
  }

  capabilities() {
    return { streaming: true, tools: false, vision: true };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.apiKey) missing.push('apiKey');
    return { ok: missing.length === 0, missing };
  }

  /** @private Resolved model (GEMINI_MODEL or the configurable default). */
  _model() {
    return String(this.config.model || DEFAULT_MODEL).replace(/^models\//, '');
  }

  /** @private Native endpoint for a method (`generateContent`/`streamGenerateContent`). */
  _endpoint(method, query = '') {
    const base = (this.config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
    return `${base}/models/${this._model()}:${method}${query}`;
  }

  /** @private Map normalized messages + system into the Gemini request body. */
  _body(params) {
    const contents = (params.messages || []).map((m) => ({
      // Gemini uses 'user' and 'model' (no 'assistant'/'system' roles).
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const body = {
      contents,
      generationConfig: {
        temperature: params.temperature ?? this.config.temperature ?? 0.6,
        maxOutputTokens: params.maxTokens ?? this.config.maxTokens ?? 1024,
      },
    };
    if (params.system) body.systemInstruction = { parts: [{ text: params.system }] };
    return body;
  }

  /** @private POST to an endpoint, throwing typed errors with rich context. */
  async _request(endpoint, params) {
    if (!this.config.apiKey) {
      throw new ProviderConfigError('Gemini provider requires an apiKey (GEMINI_API_KEY).', [
        'apiKey',
      ]);
    }
    let res;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey,
        },
        body: JSON.stringify(this._body(params)),
        signal: params.signal,
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      throw new ProviderError(
        this.id,
        `Network error contacting Gemini — provider=${this.id} model=${this._model()} endpoint=${endpoint}.`,
        { cause: e },
      );
    }
    if (!res.ok) {
      const detail = await safeText(res);
      throw new ProviderError(
        this.id,
        `Gemini request failed — provider=${this.id} model=${this._model()} endpoint=${endpoint} status=${res.status}.`,
        { status: res.status, detail },
      );
    }
    return res;
  }

  /** Join the text parts of a Gemini candidate chunk. */
  static _chunkText(json) {
    const parts = json?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';
    return parts.map((p) => p.text || '').join('');
  }

  /**
   * Single-shot completion via `:generateContent`.
   * @param {import('./baseProvider').GenerateParams} params
   */
  async generate(params) {
    const endpoint = this._endpoint('generateContent');
    const res = await this._request(endpoint, params);
    const json = await res.json();
    const candidate = json.candidates?.[0];
    return {
      content: GeminiProvider._chunkText(json),
      finishReason: candidate?.finishReason ?? 'STOP',
      providerId: this.id,
      usage: {
        promptTokens: json.usageMetadata?.promptTokenCount,
        completionTokens: json.usageMetadata?.candidatesTokenCount,
      },
    };
  }

  /**
   * Streaming completion via `:streamGenerateContent?alt=sse`. Yields text
   * deltas; honors `params.signal` for cancellation.
   * @param {import('./baseProvider').GenerateParams} params
   * @returns {AsyncGenerator<string>}
   */
  async *stream(params) {
    const endpoint = this._endpoint('streamGenerateContent', '?alt=sse');
    const res = await this._request(endpoint, params);
    if (!res.body) {
      throw new ProviderError(
        this.id,
        `Gemini returned no response body to stream — provider=${this.id} model=${this._model()} endpoint=${endpoint}.`,
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

        // Gemini SSE frames are newline-delimited `data: {json}` lines.
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line || !line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          try {
            const text = GeminiProvider._chunkText(JSON.parse(data));
            if (text) yield text;
          } catch {
            /* ignore keep-alive / partial frames */
          }
        }
      }
    } catch (e) {
      if (e?.name === 'AbortError') return;
      throw new ProviderError(
        this.id,
        `Gemini stream interrupted — provider=${this.id} model=${this._model()} endpoint=${endpoint}.`,
        { cause: e },
      );
    } finally {
      try {
        reader.releaseLock();
      } catch {
        /* noop */
      }
    }
  }
}
