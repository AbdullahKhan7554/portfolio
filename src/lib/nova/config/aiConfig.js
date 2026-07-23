/**
 * Nova — AI layer configuration (NON-SECRET only).
 *
 * Central knobs for the AI architecture: which adapter to use, sampling
 * defaults, context budget, memory strategy, and which prompt sections to
 * compose. This mirrors how `nova.config.js` drives the UI — swap values here
 * to retune behavior per tenant.
 *
 * SECURITY: no API keys live here or anywhere client-readable. When a provider
 * is wired in a later milestone, its secret is read SERVER-SIDE from an env var
 * (e.g. via src/lib/env.js) and injected into the adapter — never committed,
 * never bundled to the browser.
 */
export const aiConfig = {
  /**
   * Default adapter id resolved by the provider factory. The runtime resolves
   * the ACTIVE provider from the environment (NOVA_PROVIDER); this is only the
   * fallback default. Supported: 'gemini' (Google AI Studio) and 'nvidia' (NIM).
   */
  defaultProvider: 'gemini',

  /** Per-provider NON-SECRET settings (secrets/keys come from the environment). */
  providers: {
    gemini: {
      model: 'gemini-2.0-flash',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      temperature: 0.6,
    },
    nvidia: {
      model: 'meta/llama-3.1-8b-instruct',
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      temperature: 0.6,
    },
    openai: { model: '', temperature: 0.6 },
    anthropic: { model: '', temperature: 0.6 },
    local: { model: '', baseUrl: '' },
  },

  /** Global sampling + budget defaults. */
  temperature: 0.6,
  maxResponseTokens: 1024,
  /** Upper bound on prompt tokens; the context builder trims history to fit. */
  contextTokenBudget: 6000,
  /** Prefer streaming responses when the chosen provider supports it. */
  streaming: true,

  /** Conversation memory strategy (default volatile; swappable adapter later). */
  memory: {
    strategy: 'in-memory',
    /** Max messages retained per conversation before trimming (0 = unlimited). */
    maxMessages: 50,
  },

  /** Which system-prompt sections to compose. */
  prompts: {
    sales: true,
    faq: true,
  },
};

export default aiConfig;
