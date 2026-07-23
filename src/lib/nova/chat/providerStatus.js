/**
 * Nova — provider status + startup validation (server-only).
 *
 * Resolves the active provider from the environment, confirms the factory can
 * load it, and validates its config — so misconfiguration is reported at
 * STARTUP with a clear checklist, instead of surfacing as a chat-time 503.
 */
import { resolveActiveProvider } from '@/lib/env';
import { createProvider } from '../providers/providerFactory';

/**
 * @returns {{ providerId:string, envVar:string, ok:boolean, loaded:boolean,
 *            validated:boolean, missing:string[], fallback:boolean, error?:string }}
 */
export function getProviderStatus() {
  const active = resolveActiveProvider();
  let loaded = false;
  let validated = false;
  let error;
  try {
    const provider = createProvider(active.providerId, {
      apiKey: active.apiKey,
      model: active.model,
      baseUrl: active.baseUrl,
    });
    loaded = true;
    validated = provider.validateConfig().ok;
  } catch (e) {
    error = e?.message;
  }
  return {
    providerId: active.providerId,
    model: active.model,
    envVar: active.envVar,
    missing: active.missing,
    fallback: active.fallback,
    loaded,
    validated,
    ok: active.ok && loaded && validated,
    error,
  };
}

/** Log the startup checklist. Called once from instrumentation. */
export function logProviderStatus() {
  const s = getProviderStatus();
  const mark = (b) => (b ? '✓' : '✗');

  // eslint-disable-next-line no-console
  console.log(`[Nova] ${mark(true)} Active Provider: ${s.providerId}${s.fallback ? ' (fallback)' : ''}`);
  // eslint-disable-next-line no-console
  console.log(`[Nova] ${mark(Boolean(s.model))} Resolved Model: ${s.model || '(none)'}`);
  // eslint-disable-next-line no-console
  console.log(
    `[Nova] ${mark(s.loaded)} Provider Loaded: ${s.loaded ? 'registered in factory' : s.error || 'not registered'}`,
  );
  // eslint-disable-next-line no-console
  console.log(
    `[Nova] ${mark(s.validated)} Required Environment: ${
      s.validated ? `${s.envVar} present` : `MISSING ${s.missing.join(', ') || s.envVar}`
    }`,
  );

  if (!s.ok) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Nova] ⚠ Provider not ready — set ${s.missing.join(', ') || s.envVar} in .env.local ` +
        `(or NOVA_PROVIDER to switch providers). Chat will return a clear 503 until fixed.`,
    );
  }
  return s;
}
