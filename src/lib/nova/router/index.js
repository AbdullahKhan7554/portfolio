/**
 * Nova Router — public API.
 *
 * Multi-model NVIDIA NIM router. The conversation runtime calls `router.stream`
 * and never knows the model; the router resolves it from NOVA_MODEL (default
 * GLM 5.2). No auto-routing, scoring, or fallback yet — architecture only.
 */
export {
  NIM_MODELS,
  ModelRegistry,
  createModelRegistry,
  modelRegistry,
} from './modelRegistry';
export { DEFAULT_MODEL_ID, resolveActiveModelId, routingConfig } from './routingConfig';
export { ModelRouter } from './modelRouter';
export { createModelRouter } from './routerFactory';
