/**
 * ============================================================================
 * NOVA — Reusable AI Chat Widget · Configuration (single source of truth)
 * ----------------------------------------------------------------------------
 * This is the ONLY file another company needs to edit to re-skin & re-brand
 * Nova. The widget components contain no brand strings, colors, or copy — they
 * read everything from here.
 *
 *   • brandName / assistantName / tagline / logo — identity
 *   • welcomeMessage / inputPlaceholder / quickReplies — conversation copy
 *   • theme.dark / theme.light — full color palettes (resolved to CSS vars)
 *   • launcher — floating-button label & position
 *
 * As of Milestone 4 the widget streams real answers from the Nova chat API,
 * grounded in the active company's knowledge base. `companyId` selects that
 * tenant; `apiPath` is the streaming endpoint. No secrets live here.
 * ============================================================================
 */
export const novaConfig = {
  // --- Identity ------------------------------------------------------------
  brandName: 'Avenix Studio',
  assistantName: 'Nova',
  tagline: 'AI Concierge',
  /** Square-ish brand mark; shown in the header & assistant avatars. */
  logo: '/logo.png',

  // --- AI backend (config-driven; no secrets) ------------------------------
  /** Active company/tenant whose knowledge grounds Nova's replies. */
  companyId: 'avenix',
  /** Streaming chat endpoint. */
  apiPath: '/api/nova/chat',

  // --- Conversation copy ---------------------------------------------------
  welcomeMessage:
    "Hi, I'm Nova 👋 — your guide here. Ask about recent work, services, or how a project comes together, and I'll point you in the right direction.",
  inputPlaceholder: 'Ask Nova anything…',
  /** Shown in the chat if a response fails or Nova is not configured. */
  errorMessage:
    "Sorry — I couldn't respond just now. Please try again in a moment, or reach out directly.",

  // --- Suggested prompts (chips) ------------------------------------------
  quickReplies: [
    'Explore recent work',
    'Services & packages',
    'Start a project',
    'How you work',
  ],

  // --- Floating launcher ---------------------------------------------------
  launcher: {
    ariaLabel: 'Chat with Nova',
    /**
     * Position of the floating button. Default sits ABOVE the existing
     * WhatsApp FAB so the two never overlap. Override per-tenant if needed.
     */
    positionClassName: 'bottom-[5.75rem] right-5 md:bottom-[6.5rem] md:right-6',
  },

  // --- Theme palettes (mapped to --nova-* CSS variables at runtime) --------
  theme: {
    dark: {
      bg: '#0f0e13',
      surface: '#16151a',
      surfaceRaised: '#1c1b21',
      text: '#f6f3ee',
      textMuted: '#97949f',
      border: 'rgba(255, 255, 255, 0.08)',
      accent: '#e3a857',
      accentText: '#0a0a0b',
      userBubble: '#e3a857',
      userText: '#0a0a0b',
      assistantBubble: '#1c1b21',
      assistantText: '#ede9e2',
    },
    light: {
      bg: '#ffffff',
      surface: '#faf8f4',
      surfaceRaised: '#ffffff',
      text: '#1a1916',
      textMuted: '#5c5850',
      border: 'rgba(0, 0, 0, 0.10)',
      accent: '#a66c28',
      accentText: '#ffffff',
      userBubble: '#a66c28',
      userText: '#ffffff',
      assistantBubble: '#efece5',
      assistantText: '#1a1916',
    },
  },
};

export default novaConfig;
