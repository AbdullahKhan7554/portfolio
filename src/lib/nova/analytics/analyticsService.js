/**
 * Nova Analytics — service (records events only).
 *
 * Provider-agnostic and runtime-independent: it imports NOTHING from the runtime
 * and knows nothing about providers. Writes go through an INJECTED adapter (DI),
 * defaulting to the in-memory adapter. `record()` never throws (errors are
 * normalized into the result), and `track()` is fire-and-forget so it can NEVER
 * block streaming. A Supabase adapter can be injected later without changes here.
 */
import { InMemoryAnalyticsAdapter } from './inMemoryAnalyticsAdapter';

function normalizeError(err) {
  if (err && typeof err === 'object' && 'message' in err) return err.message;
  return String(err);
}

/**
 * @param {Object} [deps]
 * @param {{ record: Function }} [deps.adapter]  injected analytics adapter (DI)
 */
export function createAnalyticsService({ adapter = new InMemoryAnalyticsAdapter() } = {}) {
  /** Record an event. Never throws — returns a normalized outcome. */
  async function record(event, payload = {}) {
    try {
      await adapter.record({ event, payload, at: Date.now() });
      return { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: normalizeError(e) };
    }
  }

  /** Fire-and-forget — never blocks, never throws. */
  function track(event, payload = {}) {
    Promise.resolve()
      .then(() => record(event, payload))
      .catch(() => {});
  }

  return { adapter, record, track };
}

/**
 * Build an analytics service. Defaults to the in-memory adapter; inject a
 * different adapter (e.g. a future Supabase adapter) to change the sink.
 * @param {Object} [options]
 * @param {{ record: Function }} [options.adapter]
 * @param {Array} [options.store]  backing array for the default in-memory adapter
 */
export function buildAnalyticsService({ adapter, store } = {}) {
  return createAnalyticsService({ adapter: adapter || new InMemoryAnalyticsAdapter({ store }) });
}
