/**
 * Nova Providers — capability profiles (Milestone 19).
 *
 * METADATA ONLY. These descriptors say what a provider *can* do; they do not
 * change how any provider executes. `DEFAULT_CAPABILITIES` is the safe baseline
 * used when a provider is unknown or omits a field, so reads are always graceful.
 *
 * NOTE: this is intentionally separate from each adapter's behavior-facing
 * `capabilities()` (streaming/tools/vision) — that stays the source of truth for
 * runtime behavior; this layer is informational and never consulted to execute.
 */

/** Conservative baseline: nothing supported, zero limits. */
export const DEFAULT_CAPABILITIES = Object.freeze({
  supportsStreaming: false,
  supportsTools: false,
  supportsImages: false,
  supportsVision: false,
  supportsSystemPrompt: false,
  supportsJSON: false,
  maxContextTokens: 0,
  maxOutputTokens: 0,
});

/** Per-provider capability metadata, keyed by the adapter's stable `id`. */
export const PROVIDER_CAPABILITIES = Object.freeze({
  nvidia: Object.freeze({
    supportsStreaming: true,
    supportsTools: false,
    supportsImages: false,
    supportsVision: false,
    supportsSystemPrompt: true,
    supportsJSON: false,
    maxContextTokens: 128000,
    maxOutputTokens: 4096,
  }),
  gemini: Object.freeze({
    supportsStreaming: true,
    supportsTools: false,
    supportsImages: true,
    supportsVision: true,
    supportsSystemPrompt: true,
    supportsJSON: true,
    maxContextTokens: 1000000,
    maxOutputTokens: 8192,
  }),
  openai: Object.freeze({
    supportsStreaming: true,
    supportsTools: true,
    supportsImages: true,
    supportsVision: true,
    supportsSystemPrompt: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    maxOutputTokens: 4096,
  }),
  anthropic: Object.freeze({
    supportsStreaming: true,
    supportsTools: true,
    supportsImages: true,
    supportsVision: true,
    supportsSystemPrompt: true,
    supportsJSON: false,
    maxContextTokens: 200000,
    maxOutputTokens: 8192,
  }),
  local: Object.freeze({
    supportsStreaming: false,
    supportsTools: false,
    supportsImages: false,
    supportsVision: false,
    supportsSystemPrompt: true,
    supportsJSON: false,
    maxContextTokens: 8192,
    maxOutputTokens: 2048,
  }),
});
