/**
 * Nova Runtime — production readiness layer (Milestone 20) public API.
 *
 * Configuration-only, informational validation of the runtime's collaborators.
 * Never throws, never changes behavior, never blocks streaming. DI-first.
 *
 * @example
 *   import { createRuntimeValidator } from '@/lib/nova/runtime';
 *   const health = createRuntimeValidator().validate({ planner, memory, analytics });
 *   health.ok; // false only on unrecoverable configuration errors
 */
export { validateRuntimeReadiness, createRuntimeValidator } from './readinessValidator';
