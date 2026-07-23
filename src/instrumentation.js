/**
 * Next.js instrumentation — runs once at server startup.
 *
 * Validates Nova's AI provider configuration up front and prints a clear
 * checklist (Active Provider / Provider Loaded / Required Environment), so
 * misconfiguration is visible at boot rather than as a chat-time 503.
 */
export async function register() {
  // Node.js runtime only (the status check reads server-only env).
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { logProviderStatus } = await import('@/lib/nova/chat/providerStatus');
  logProviderStatus();
}
