/**
 * Nova — Google Gemini adapter (PLACEHOLDER).
 *
 * Declares identity, capabilities, and config requirements only. No SDK import,
 * no API key, no network call. `generate()/stream()` inherit the BaseProvider
 * seams that throw until Milestone 3 wires the real client server-side.
 */
import { BaseProvider } from './baseProvider';

export class GeminiProvider extends BaseProvider {
  get id() {
    return 'gemini';
  }

  get label() {
    return 'Google Gemini';
  }

  capabilities() {
    return { streaming: true, tools: true, vision: true };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.model) missing.push('model');
    return { ok: missing.length === 0, missing };
  }

  // generate()/stream() will translate GenerateParams -> generateContent here.
  // Note: Gemini uses `contents` with 'model' (not 'assistant') roles.
}
