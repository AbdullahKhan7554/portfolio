/**
 * Nova — NovaEngine: the composition root that wires the AI layer together via
 * dependency injection (provider adapter + memory store + config). It owns
 * orchestration but NOT generation: it can start conversations, record turns,
 * and assemble a provider-ready request — while the actual model call is an
 * explicit seam left for Milestone 3.
 *
 * This demonstrates the full architecture end-to-end without making any AI call.
 */
import { aiConfig as defaultAiConfig } from '../config/aiConfig';
import { ConversationManager } from './conversationManager';
import { InMemoryStore } from './memoryManager';
import { buildSystemPrompt } from './systemPromptBuilder';
import { buildContext } from './contextBuilder';
import { toProviderMessages } from './messageFormatter';
import { NotImplementedError, ProviderConfigError } from '../types/errors';

export class NovaEngine {
  /**
   * @param {Object} deps
   * @param {import('../providers/baseProvider').BaseProvider} deps.provider  injected adapter
   * @param {import('./memoryManager').MemoryStore} [deps.memory]             injected store
   * @param {Object} [deps.config]                                           aiConfig override
   * @param {Object} [deps.identity]                                         brand/assistant identity for prompts
   */
  constructor({ provider, memory, config, identity } = {}) {
    if (!provider) {
      throw new ProviderConfigError('NovaEngine requires an injected provider adapter.');
    }
    this.provider = provider;
    this.memory = memory ?? new InMemoryStore();
    this.config = config ?? defaultAiConfig;
    this.identity = identity ?? {};
  }

  /**
   * Begin a new conversation, persisted through the injected store.
   * @param {Object} [metadata]
   * @returns {Promise<ConversationManager>}
   */
  async startConversation(metadata) {
    const manager = ConversationManager.create({ memory: this.memory });
    if (metadata) Object.assign(manager.conversation.metadata, metadata);
    await this.memory.save(manager.conversation);
    return manager;
  }

  /**
   * Assemble the provider-ready request for the current conversation state —
   * system prompt + budget-trimmed history — WITHOUT calling the provider.
   * @param {ConversationManager} manager
   * @returns {{ system:string, messages:Array, temperature:number, maxTokens:number, meta:object }}
   */
  buildRequest(manager) {
    const system = buildSystemPrompt({
      identity: this.identity,
      sections: this.config.prompts,
    });

    const ctx = buildContext({
      system,
      messages: manager.messages,
      tokenBudget: this.config.contextTokenBudget,
      reserveForResponse: this.config.maxResponseTokens,
    });

    return {
      system: ctx.system,
      messages: toProviderMessages(ctx.messages),
      temperature: this.config.temperature,
      maxTokens: this.config.maxResponseTokens,
      meta: { estimatedTokens: ctx.estimatedTokens, trimmed: ctx.trimmed },
    };
  }

  /**
   * Produce an assistant reply. Intentionally NOT implemented in this milestone
   * — this is the single seam where `this.provider.generate(request)` will be
   * called in Milestone 3. Throws so nothing silently mocks a response.
   * @returns {Promise<never>}
   */
  async respond() {
    throw new NotImplementedError(
      'NovaEngine.respond() lands in Milestone 3 (provider generation).',
    );
  }
}

/**
 * Convenience DI factory.
 * @param {ConstructorParameters<typeof NovaEngine>[0]} deps
 * @returns {NovaEngine}
 */
export function createNovaEngine(deps) {
  return new NovaEngine(deps);
}
