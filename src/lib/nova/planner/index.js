/**
 * Nova Planner — public API (Milestone 13, Intent Detection & Action Planning).
 *
 * A provider-agnostic, PURE, rule-based layer that classifies the user request
 * and returns a normalized execution plan BEFORE the provider is called. It
 * never executes anything — no AI, no DB, no tools, no provider.
 *
 * @example
 *   import { defaultIntentPlanner } from '@/lib/nova/planner';
 *   const plan = defaultIntentPlanner.plan({ message: 'how much does a site cost?' });
 *   // → { intent:'pricing_question', confidence:0.93, useKnowledge:true, salesMode:true, ... }
 */
export {
  INTENT,
  INTENT_KEYWORDS,
  INTENT_PLAN,
  ESCALATION_KEYWORDS,
  createExecutionPlan,
} from './intents';
export { createIntentPlanner, defaultIntentPlanner } from './intentPlanner';
