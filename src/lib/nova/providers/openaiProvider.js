/**
 * Nova — OpenAI adapter (PLACEHOLDER).
 *
 * Declares identity, capabilities, and config requirements only. No SDK import,
 * no API key, no network call. `generate()/stream()` inherit the BaseProvider
 * seams that throw until Milestone 3 wires the real client server-side.
 */
import { BaseProvider } from './baseProvider';

export class OpenAIProvider extends BaseProvider {
  get id() {
    return 'openai';
  }

  get label() {
    return 'OpenAI';
  }

  capabilities() {
    return { streaming: true, tools: true, vision: true };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.model) missing.push('model');
    return { ok: missing.length === 0, missing };
  }

  // generate()/stream() will translate GenerateParams -> Chat Completions here.
}
