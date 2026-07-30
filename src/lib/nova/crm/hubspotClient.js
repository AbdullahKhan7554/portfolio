/**
 * Nova CRM — HubSpot REST client (dependency-free, fetch-based).
 *
 * Thin wrapper over https://api.hubapi.com with a Bearer token from
 * HUBSPOT_ACCESS_TOKEN. Mirrors the fetch adapters (resendProvider / leadWriter):
 * `fetchImpl` is injectable for tests; non-2xx throws. Never logs the token.
 * Must stay free of `server-only`/`@/lib/env` so a bare-Node script can import it.
 */
const HUBSPOT_BASE = 'https://api.hubapi.com';

export function resolveHubspotConfig(env = process.env) {
  const token = env.HUBSPOT_ACCESS_TOKEN || '';
  return { ok: Boolean(token), token, missing: token ? [] : ['HUBSPOT_ACCESS_TOKEN'] };
}

export function createHubspotClient({ token, fetchImpl = fetch } = {}) {
  const configured = Boolean(token);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  async function request(method, path, body) {
    let res;
    try {
      res = await fetchImpl(`${HUBSPOT_BASE}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(`HubSpot ${method} ${path} request failed (network): ${err?.message ?? err}`);
    }
    const parsed = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed);
      throw new Error(`HubSpot ${method} ${path} failed (${res.status}): ${detail}`);
    }
    return parsed;
  }

  return { configured, request };
}

export function defaultHubspotClient(env = process.env) {
  return createHubspotClient({ token: resolveHubspotConfig(env).token });
}
