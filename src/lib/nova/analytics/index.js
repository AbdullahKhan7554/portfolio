/**
 * Nova Analytics — public API (Milestone 18, observability layer).
 *
 * Lightweight, provider-agnostic, runtime-independent event recording. Records
 * events only; never throws; DI adapters (default in-memory, optional Supabase
 * later); no globals; no runtime imports.
 *
 * @example
 *   import { buildAnalyticsService, ANALYTICS_EVENT } from '@/lib/nova/analytics';
 *   const analytics = buildAnalyticsService();
 *   analytics.track(ANALYTICS_EVENT.CONVERSATION_STARTED, { conversationId, companyId });
 */
export { ANALYTICS_EVENT } from './events';
export { BaseAnalyticsAdapter } from './baseAnalyticsAdapter';
export { InMemoryAnalyticsAdapter } from './inMemoryAnalyticsAdapter';
export { createAnalyticsService, buildAnalyticsService } from './analyticsService';
