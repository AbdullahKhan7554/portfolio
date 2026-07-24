/**
 * Nova — Groq adapter.
 *
 * Groq exposes an OpenAI-compatible Chat Completions API (JSON + SSE), so it
 * reuses the SAME shared transport as the NVIDIA NIM adapter — identical
 * streaming shape (token-by-token deltas, no buffering) and identical error
 * normalization (ProviderError / ProviderConfigError). All Groq-specific config
 * (base URL, model) stays here. Server-side only; no other module knows this
 * provider's details.
 *
 * Model: `llama-3.1-8b-instant` (Groq's fast Llama 3.1 8B variant).
 * Key:   GROQ_API_KEY (injected via config; never logged/returned).
 */
import { BaseProvider } from './baseProvider';
import {
  buildMessages,
  generateChatCompletion,
  streamChatCompletion,
} from './openaiCompatible';

const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

export class GroqProvider extends BaseProvider {
  get id() {
    return 'groq';
  }

  get label() {
    return 'Groq';
  }

  capabilities() {
    return { streaming: true, tools: false, vision: false };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.apiKey) missing.push('apiKey');
    return { ok: missing.length === 0, missing };
  }

  /** @private */
  _transport(params) {
    return {
      providerId: this.id,
      apiKey: this.config.apiKey,
      baseUrl: this.config.baseUrl || DEFAULT_BASE_URL,
      signal: params.signal,
      payload: {
        model: this.config.model || DEFAULT_MODEL,
        temperature: params.temperature ?? this.config.temperature ?? 0.6,
        max_tokens: params.maxTokens ?? this.config.maxTokens ?? 1024,
        messages: buildMessages(params.messages, params.system),
      },
    };
  }

  async generate(params) {
    return generateChatCompletion(this._transport(params));
  }

  async *stream(params) {
    yield* streamChatCompletion(this._transport(params));
  }
}
