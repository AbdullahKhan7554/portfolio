/**
 * Nova — NVIDIA NIM adapter.
 *
 * NVIDIA NIM exposes an OpenAI-compatible Chat Completions API, so it reuses the
 * shared transport. All NVIDIA-specific config (base URL, model) stays here.
 * Server-side only; no other module knows this provider's details.
 */
import { BaseProvider } from './baseProvider';
import {
  buildMessages,
  generateChatCompletion,
  streamChatCompletion,
} from './openaiCompatible';

const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct';

export class NvidiaProvider extends BaseProvider {
  get id() {
    return 'nvidia';
  }

  get label() {
    return 'NVIDIA NIM';
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
