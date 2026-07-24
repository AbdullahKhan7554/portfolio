/**
 * Nova Analytics — event vocabulary. Constants only; no logic.
 */
export const ANALYTICS_EVENT = Object.freeze({
  CONVERSATION_STARTED: 'conversation_started',
  CONVERSATION_COMPLETED: 'conversation_completed',
  PROVIDER_SELECTED: 'provider_selected',
  PROVIDER_FAILOVER: 'provider_failover',
  TOOL_CALLED: 'tool_called',
  TOOL_FAILED: 'tool_failed',
  LEAD_SAVED: 'lead_saved',
  HANDOFF_REQUESTED: 'handoff_requested',
  MEMORY_LOADED: 'memory_loaded',
  KNOWLEDGE_LOADED: 'knowledge_loaded',
});
