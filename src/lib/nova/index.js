/**
 * Nova AI layer — public API (Milestone 2, architecture only).
 *
 * Import the AI foundation from here; internal module paths stay private.
 * Nothing in this layer performs a network call or returns a model response.
 *
 * @example
 *   import { createProvider, createNovaEngine, aiConfig } from '@/lib/nova';
 *   const provider = createProvider(aiConfig.defaultProvider, aiConfig.providers.anthropic);
 *   const engine = createNovaEngine({ provider, identity: { assistantName: 'Nova', brandName: 'Acme' } });
 *   const convo = await engine.startConversation();
 *   convo.addUserMessage('Hi');
 *   const request = engine.buildRequest(convo); // ready for a provider — not yet sent
 */

// Config
export { aiConfig } from './config/aiConfig';

// Providers (adapter pattern)
export { BaseProvider } from './providers/baseProvider';
export { OpenAIProvider } from './providers/openaiProvider';
export { AnthropicProvider } from './providers/anthropicProvider';
export { GeminiProvider } from './providers/geminiProvider';
export { LocalProvider } from './providers/localProvider';
export {
  createProvider,
  registerProvider,
  availableProviders,
  defaultProviderRegistry,
} from './providers/providerFactory';

// Core orchestration
export { NovaEngine, createNovaEngine } from './core/novaEngine';
export { ConversationManager } from './core/conversationManager';
export { MemoryStore, InMemoryStore } from './core/memoryManager';
export { buildSystemPrompt } from './core/systemPromptBuilder';
export { buildContext } from './core/contextBuilder';
export { toProviderMessages, toTranscript } from './core/messageFormatter';

// Prompt fragments
export { systemPrompt } from './prompts/systemPrompt';
export { salesPrompt } from './prompts/salesPrompt';
export { faqPrompt } from './prompts/faqPrompt';

// Domain types & factories
export { createConversation, CONVERSATION_STATUS } from './types/conversation';
export { createMessage, MESSAGE_ROLE } from './types/message';
export { createLead, LEAD_STATUS, LEAD_FIELDS } from './types/lead';
export { NovaEvent } from './types/events';
export {
  NovaError,
  NotImplementedError,
  ProviderNotFoundError,
  ProviderConfigError,
  ValidationError,
} from './types/errors';

// Utilities
export { estimateTokens, estimateMessagesTokens } from './utils/tokenEstimator';
export { validateLead, validateMessage, validateProviderConfig } from './utils/validators';
export { createId } from './utils/ids';
