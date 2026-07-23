/**
 * Nova Router — NVIDIA NIM model registry (CONFIG data, not logic).
 *
 * Maps a Nova model id (used in NOVA_MODEL) → the NVIDIA NIM catalog model
 * string the provider requests. All six models are served by the SAME NVIDIA
 * NIM provider/endpoint, so switching models is purely a config lookup.
 *
 * NOTE: the `nimModel` strings are the NVIDIA NIM catalog identifiers. They are
 * config — verify/adjust them against your NIM catalog without touching code.
 */

export const NIM_MODELS = Object.freeze({
  'glm-5.2': { id: 'glm-5.2', label: 'GLM 5.2', nimModel: 'zai/glm-5.2' },
  'minimax-m3': { id: 'minimax-m3', label: 'MiniMax M3', nimModel: 'minimaxai/minimax-m3' },
  'deepseek-v4-pro': {
    id: 'deepseek-v4-pro',
    label: 'DeepSeek V4 Pro',
    nimModel: 'deepseek-ai/deepseek-v4-pro',
  },
  'deepseek-v4-flash': {
    id: 'deepseek-v4-flash',
    label: 'DeepSeek V4 Flash',
    nimModel: 'deepseek-ai/deepseek-v4-flash',
  },
  'kimi-2.6': { id: 'kimi-2.6', label: 'Kimi 2.6', nimModel: 'moonshotai/kimi-2.6' },
  'qwen-3.6': { id: 'qwen-3.6', label: 'Qwen 3.6', nimModel: 'qwen/qwen3.6' },
});

/** Registry of available NIM models. Holds config only — no I/O, no logic. */
export class ModelRegistry {
  constructor(models = NIM_MODELS) {
    /** @type {Map<string, {id:string,label:string,nimModel:string}>} */
    this._models = new Map(Object.entries(models));
  }

  get(id) {
    return this._models.get(id) ?? null;
  }

  has(id) {
    return this._models.has(id);
  }

  list() {
    return [...this._models.values()];
  }

  ids() {
    return [...this._models.keys()];
  }

  /** Register/replace a model (for future additions). */
  register(entry) {
    if (!entry?.id) throw new Error('ModelRegistry.register: entry requires an id.');
    this._models.set(entry.id, entry);
    return entry;
  }
}

/** DI factory. */
export function createModelRegistry(models) {
  return new ModelRegistry(models);
}

/** Default registry seeded with the bundled NIM models. */
export const modelRegistry = new ModelRegistry();
