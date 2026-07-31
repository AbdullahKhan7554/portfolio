/**
 * ============================================================================
 * NOVA — Reusable AI Chat Widget · Configuration
 * ----------------------------------------------------------------------------
 * Thin adapter over `client.config.js` (the single source of truth). The widget
 * components read everything from `novaConfig`; all client-specific values —
 * brand, assistant name, copy, colors, companyId — come from `client.config.js`.
 * To re-skin for a new client, edit `client.config.js`, not this file.
 * ============================================================================
 */
import { clientConfig as c } from './client.config';

export const novaConfig = {
  // --- Identity ------------------------------------------------------------
  brandName: c.identity.brandName,
  assistantName: c.identity.assistantName,
  tagline: c.widget.tagline,
  logo: c.urls.logo,

  // --- AI backend (config-driven; no secrets) ------------------------------
  companyId: c.identity.companyId,
  apiPath: '/api/nova/chat',

  // --- Conversation copy ---------------------------------------------------
  welcomeMessage: c.widget.welcomeMessage,
  inputPlaceholder: c.widget.inputPlaceholder,
  errorMessage: c.widget.errorMessage,
  quickReplies: c.widget.quickReplies,

  // --- Floating launcher ---------------------------------------------------
  launcher: c.widget.launcher,

  // --- Theme palettes (mapped to --nova-* CSS variables at runtime) --------
  theme: c.widget.theme,
};

export default novaConfig;
