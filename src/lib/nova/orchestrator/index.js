/**
 * Nova Conversation Orchestrator — public API (Milestone 5C).
 *
 * Coordinates the Sales Engine (5A) + Lead Capture Engine (5B) across the
 * conversation lifecycle. In-memory, config-driven, no persistence, no
 * provider/UI/API logic. Single entry point: `orchestrator.process(msg, state)`.
 *
 * @example
 *   import { conversationOrchestrator as orch } from '@/lib/nova/orchestrator';
 *   let { assistantAction, updatedState } = orch.process('I need a website');
 *   ({ assistantAction, updatedState } = orch.process('My goal is bookings', updatedState));
 */

// Stages
export { STAGE, STAGE_ORDER, stageIndex, isTerminal } from './conversationStages';

// Config
export {
  ACTION,
  defaultOrchestratorConfig,
  resolveConfig,
} from './orchestratorConfig';

// Pure helpers
export { resolveLeadFlow } from './flowResolver';
export { nextStage } from './stateTransitions';

// Composition root
export {
  createConversationOrchestrator,
  conversationOrchestrator,
} from './conversationOrchestrator';
