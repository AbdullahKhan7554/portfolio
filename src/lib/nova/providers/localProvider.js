/**
 * Nova — Local LLM adapter (PLACEHOLDER).
 *
 * For self-hosted / OpenAI-compatible local runtimes (e.g. Ollama, LM Studio,
 * vLLM). Needs a `baseUrl` rather than a cloud key. No network call here;
 * `generate()/stream()` inherit the BaseProvider seams that throw until
 * Milestone 3.
 */
import { BaseProvider } from './baseProvider';

export class LocalProvider extends BaseProvider {
  get id() {
    return 'local';
  }

  get label() {
    return 'Local LLM';
  }

  capabilities() {
    return { streaming: true, tools: false, vision: false };
  }

  validateConfig() {
    const missing = [];
    if (!this.config.baseUrl) missing.push('baseUrl');
    return { ok: missing.length === 0, missing };
  }

  // generate()/stream() will POST to `${config.baseUrl}` here.
}
