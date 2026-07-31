/**
 * Nova — conversation runtime (Milestone 5D glue + Milestone 10 memory).
 *
 * Binds the Conversation Orchestrator (5C) to the streaming chat pipeline (5D
 * = KMS + system prompt + NVIDIA provider). Responsibilities are strictly:
 *   1. let the orchestrator decide the turn (it owns all sales/lead logic),
 *   2. serialize that decision into a one-line directive,
 *   3. reuse `createChatStream` to phrase + stream the reply, grounded in KMS.
 *
 * Milestone 10 adds conversation memory around that pipeline (using ONLY the
 * Memory Framework from M9): restore + merge history before streaming, and
 * persist the user + assistant messages. Streaming is unchanged — tokens pass
 * through immediately; the only accumulation is the assistant text for saving.
 * Memory failures never break chat.
 *
 * Milestone 11 adds provider-agnostic tool execution (using ONLY the Tool
 * Framework from M6): after the stream completes, any tool call in the assistant
 * text is executed through the injected ToolRouter and appended to the
 * conversation. Detection/execution happen POST-stream, so tokens are never
 * buffered; tool failures resolve to normalized ToolResults and never crash.
 *
 * No business decisions are made here — the orchestrator controls the
 * conversation, the provider only phrases, the knowledge service only grounds.
 */
import { ACTION } from '../orchestrator/orchestratorConfig';
import { buildMemoryService } from '../memory';
import { createKnowledgeService } from '../knowledge';
import { createAdminClient } from '../../supabase/admin';
import { createChatStream } from './chatService';
import { getDefaultToolRouter, parseToolCalls, runToolCalls } from './toolRuntime';
import { buildGroundingContext } from './contextInjection';
import { createLeadWriter } from '../data/leadWriter';
import { defaultConversationWriter } from '../data/conversationWriter';
import { buildAnalyticsService, ANALYTICS_EVENT } from '../analytics';
import { createProviderCapabilityRegistry } from '../providers/capabilities';
import { createRuntimeValidator } from '../runtime';
import { createEmailService, leadNurtureSequenceKey } from '../email';
import { buildWhatsappLink } from '../whatsapp/buildWhatsappLink';

/**
 * Phase 2 (email automation): after a lead is SUCCESSFULLY persisted, schedule
 * the company's nurture sequence. This is an ADDITIVE hook — the Lead Engine and
 * Lead Repository are never modified. A company with no configured sequence is a
 * silent skip, and any failure here is swallowed so it can never break chat.
 * @param {{ companyId:string, lead:{ email?:string, fullName?:string } }} args
 */
async function scheduleNurtureAfterLead({ companyId, lead }) {
  try {
    const recipient = lead?.email;
    if (!recipient) return;
    const email = createEmailService();
    await email.scheduleSequence(companyId, leadNurtureSequenceKey(companyId), recipient, {
      name: lead?.fullName || 'there',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Nova Email] scheduleSequence failed (non-fatal)', err?.message);
  }
}

/**
 * Phase 5 (internal notification): after a lead is SUCCESSFULLY persisted, send an
 * IMMEDIATE internal email to the business owner so they know about the lead right
 * away — sent NOW (transactional) via the same email module, not scheduled. The
 * owner address is read from LEAD_NOTIFICATION_EMAIL so it stays configurable per
 * deploy; when unset this is a silent skip. Fully isolated: this runs AFTER the
 * customer nurture is already scheduled, and any failure here is swallowed so it
 * can NEVER affect the customer welcome/nurture emails or the lead save itself.
 * @param {{ companyId:string, lead:object, service?:string }} args
 */
async function notifyOwnerOfLead({ companyId, lead, service }) {
  try {
    const owner = process.env.LEAD_NOTIFICATION_EMAIL;
    if (!owner) return; // not configured → skip silently
    const email = createEmailService();
    await email.sendNow(companyId, 'internal_lead_notification', owner, {
      name: lead?.fullName || '—',
      email: lead?.email || '—',
      phone: lead?.phone || 'Not provided',
      company: lead?.companyName || '—',
      businessType: lead?.businessType || '—',
      service: service || 'New inquiry',
      projectDescription: lead?.projectDescription || '—',
      budget: lead?.budget || '—',
      timeline: lead?.timeline || '—',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Nova Email] internal lead notification failed (non-fatal)', err?.message);
  }
}

/**
 * Default memory service (lazy). A single instance persists conversations across
 * turns/requests for the in-memory strategy; injection overrides it (DI).
 * Strategy is resolved entirely from aiConfig.memory.strategy inside M9.
 */
let defaultMemory = null;
function getDefaultMemory() {
  if (!defaultMemory) defaultMemory = buildMemoryService();
  return defaultMemory;
}

/**
 * Default Knowledge Service (lazy). A single instance is shared between the
 * grounding search and the chat pipeline so they reuse the SAME cached
 * knowledge index; injection overrides it (DI).
 */
let defaultKnowledgeService = null;
function getDefaultKnowledgeService() {
  if (!defaultKnowledgeService) {
    // Connect the KMS to Supabase (service-role) when configured; otherwise stay
    // disconnected so grounding degrades to empty instead of crashing.
    const supabaseClient =
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? createAdminClient()
        : undefined;
    defaultKnowledgeService = createKnowledgeService({ supabaseClient });
  }
  return defaultKnowledgeService;
}

/** Default lead writer (lazy). Persists via the existing Lead Repository (M7). */
let defaultLeadWriter = null;
function getDefaultLeadWriter() {
  if (!defaultLeadWriter) defaultLeadWriter = createLeadWriter();
  return defaultLeadWriter;
}

/** Default analytics service (lazy). Records events only; injection overrides it. */
let defaultAnalytics = null;
function getDefaultAnalytics() {
  if (!defaultAnalytics) defaultAnalytics = buildAnalyticsService();
  return defaultAnalytics;
}

/** Default conversation writer (lazy). Persists transcripts; non-fatal (Phase 2). */
let defaultConversationWriterInstance = null;
function getDefaultConversationWriter() {
  if (!defaultConversationWriterInstance) defaultConversationWriterInstance = defaultConversationWriter();
  return defaultConversationWriterInstance;
}

/**
 * Default provider capability registry (lazy). Read-only metadata the runtime
 * QUERIES to describe the selected provider; injection overrides it (DI). It
 * never changes provider behavior.
 */
let defaultCapabilityRegistry = null;
function getDefaultCapabilityRegistry() {
  if (!defaultCapabilityRegistry) defaultCapabilityRegistry = createProviderCapabilityRegistry();
  return defaultCapabilityRegistry;
}

/**
 * Default runtime readiness validator (lazy). Validates configuration only —
 * informational health, never changes behavior or blocks streaming; injection
 * overrides it (DI).
 */
let defaultRuntimeValidator = null;
function getDefaultRuntimeValidator() {
  if (!defaultRuntimeValidator) defaultRuntimeValidator = createRuntimeValidator();
  return defaultRuntimeValidator;
}

/**
 * P1 (perf): the conversation-logic defaults are DYNAMICALLY imported and cached
 * the first time a turn actually needs them, so importing the chat runtime no
 * longer eagerly evaluates the orchestrator / planner / sales / lead / handoff
 * subtrees (or their config data). Each default stays a shared singleton;
 * injection still overrides it (DI). Behavior is unchanged — the same objects,
 * resolved one turn later, before any streaming begins.
 */
let defaultOrchestrator = null;
async function getDefaultOrchestrator() {
  if (!defaultOrchestrator) ({ conversationOrchestrator: defaultOrchestrator } = await import('../orchestrator'));
  return defaultOrchestrator;
}

let defaultPlanner = null;
async function getDefaultPlanner() {
  if (!defaultPlanner) ({ defaultIntentPlanner: defaultPlanner } = await import('../planner'));
  return defaultPlanner;
}

let defaultSalesEngine = null;
async function getDefaultSalesEngine() {
  if (!defaultSalesEngine) ({ salesEngine: defaultSalesEngine } = await import('../sales'));
  return defaultSalesEngine;
}

let defaultLeadEngine = null;
async function getDefaultLeadEngine() {
  if (!defaultLeadEngine) ({ leadCaptureEngine: defaultLeadEngine } = await import('../leads'));
  return defaultLeadEngine;
}

let defaultHandoff = null;
let defaultHandoffDirective = null;
async function getDefaultHandoff() {
  if (!defaultHandoff) {
    const mod = await import('./humanHandoff');
    defaultHandoff = mod.defaultHumanHandoff;
    defaultHandoffDirective = mod.DEFAULT_HANDOFF_DIRECTIVE;
  }
  return { service: defaultHandoff, directive: defaultHandoffDirective };
}

/** Latest user message from the running history. */
function lastUserMessage(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'user') return messages[i].content;
  }
  return '';
}

/** New conversation id when the runtime doesn't provide one. */
function createConversationId() {
  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `conv_${rand}`;
}

/** Server-side memory log (never surfaced to the client). */
function logMemory(op, err) {
  // eslint-disable-next-line no-console
  console.error('[Nova Memory]', op, err?.message || err);
}

/** Restore persisted history as { role, content } messages (empty on failure). */
async function loadHistory(memory, conversationId) {
  try {
    const res = await memory.loadConversation(conversationId);
    if (res?.ok && res.data?.messages?.length) {
      return res.data.messages.map((m) => ({ role: m.role, content: m.content }));
    }
  } catch (e) {
    logMemory('loadConversation', e);
  }
  return [];
}

/** Merge restored history with the current request; newest message last, deduped. */
function mergeHistory(history, current) {
  const key = (m) => `${m.role}::${m.content}`;
  const seen = new Set((current || []).map(key));
  const restored = (history || []).filter((m) => !seen.has(key(m)));
  return [...restored, ...(current || [])];
}

/** Append a message; memory failures are logged and swallowed (chat never breaks). */
async function safeAppend(memory, conversationId, message, companyId) {
  try {
    const res = await memory.appendMessage(conversationId, message, { companyId });
    if (res && res.ok === false) logMemory('appendMessage', res.error);
  } catch (e) {
    logMemory('appendMessage', e);
  }
}

/**
 * Phase 7d: decorate the model's streamed lead-in — defuse any stray question
 * mark it emits (so it cannot sneak in a substitute question), then append the
 * exact server-owned question / confirmation VERBATIM. Stays fully streaming:
 * the suffix is yielded right after the model's tokens, never buffered.
 */
async function* decorateStream(stream, { stripQuestionMarks = false, suffix = null } = {}) {
  for await (const token of stream) {
    yield stripQuestionMarks ? token.replace(/\?/g, '.') : token;
  }
  if (suffix) yield suffix;
}

/**
 * True passthrough stream: yields every token immediately (no buffering) while
 * accumulating the assistant text ONLY to persist it after completion. The
 * assistant message is saved solely on a successful, non-aborted stream — so
 * an abort or failure never saves a partial/duplicate reply.
 */
async function* persistOnComplete(
  stream,
  { memory, conversationId, companyId, signal, toolRouter, toolResults, analytics, conversationWriter, userText },
) {
  let assistantText = '';
  let completed = false;
  try {
    for await (const token of stream) {
      assistantText += token; // accumulation for memory/tools ONLY (the one allowed exception)
      yield token; // immediate passthrough — tokens reach the client at once
    }
    completed = true;
  } finally {
    if (completed && !signal?.aborted) {
      if (assistantText) {
        await safeAppend(memory, conversationId, { role: 'assistant', content: assistantText }, companyId);
      }
      // Phase 2: persist the transcript turn (non-fatal; post-stream, never blocks tokens).
      if (conversationWriter) {
        await conversationWriter.recordTurn({ sessionId: conversationId, companyId, userText, assistantText });
      }
      // Milestone 11: provider-agnostic tool execution (post-stream — never buffers tokens).
      if (toolRouter) {
        const calls = parseToolCalls(assistantText);
        if (calls.length) {
          const results = await runToolCalls(toolRouter, calls, { companyId, conversationId });
          for (const result of results) {
            if (toolResults) toolResults.push(result);
            await safeAppend(memory, conversationId, { role: 'tool', content: JSON.stringify(result) }, companyId);
            // M18: record tool events (fire-and-forget; post-stream; non-blocking).
            analytics?.track(result.ok ? ANALYTICS_EVENT.TOOL_CALLED : ANALYTICS_EVENT.TOOL_FAILED, {
              conversationId,
              toolName: result.toolName,
            });
          }
        }
      }
    }
  }
}

/**
 * When the plan says salesMode, ask the EXISTING Sales Engine (M5A) for its
 * current best-fit recommendation from the orchestrator-maintained sales state,
 * and turn it into a short consultative directive. Reuses the sales engine and
 * its state — no sales-engine or orchestrator changes. Graceful.
 */
function buildSalesDirective(salesEngine, salesState) {
  const base =
    'Take a consultative, sales-minded tone: understand the need, guide the visitor toward the right fit, and invite a clear next step.';
  try {
    if (!salesState) return base;
    const recommendation = salesEngine.getRecommendation(salesState);
    return recommendation?.name
      ? `${base} The current best-fit recommendation is "${recommendation.name}".`
      : base;
  } catch {
    return base;
  }
}

/**
 * When the plan says captureLead, ask the EXISTING Lead Engine (M5B) for the
 * next field to collect from the orchestrator-maintained lead state, and turn
 * it into a short one-question directive. Reuses the lead engine and its state —
 * no lead-engine or orchestrator changes. Graceful.
 */
function buildLeadDirective(leadEngine, leadState) {
  const base =
    "Politely collect the visitor's contact details one question at a time, and confirm you'll pass them to the team.";
  try {
    if (!leadState) return base;
    const question = leadEngine.nextQuestion(leadState);
    return question
      ? `The ONLY field to collect this turn is "${question.field}". Say exactly this (you may lightly rephrase for tone, but the topic must be this and ONLY this): "${question.prompt}".` +
          ` Do NOT ask about phone number, country, scheduling a call, or ANY topic that is not this exact question — those are not fields we collect. Ask this one thing and nothing else; if unsure, ask exactly the question above.` +
          ` Do NOT thank them as if finished or imply their details are submitted — this is still needed. Never claim to have saved anything they did not actually provide.`
      : 'The lead is fully captured. Simply thank the visitor and confirm the team will reach out shortly — do not ask any further questions.';
  } catch {
    return base;
  }
}

/**
 * When the plan says requiresHuman, produce a handoff directive from the
 * (injected) handoff service. Gracefully falls back to the default directive if
 * the service is missing or throws. No CRM integration here.
 */
function buildHandoffDirective(handoffService, context, fallback) {
  try {
    if (handoffService && typeof handoffService.directive === 'function') {
      return handoffService.directive(context) || fallback;
    }
  } catch {
    /* fall through to default */
  }
  return fallback;
}

/**
 * Serialize the orchestrator's already-made decision into a single instruction
 * for the provider to phrase. Pure formatting — no decisions taken here.
 */
function buildTurnDirective(action) {
  switch (action?.type) {
    case ACTION.ASK:
      return (
        `Say exactly this to the visitor (you may lightly rephrase for tone, but the TOPIC must be this and ONLY this): "${action.prompt}".` +
        ` Ask this one thing and nothing else this turn.` +
        (action.error ? ` Their last answer for this was not usable (${action.error}); ask for it again, specifically.` : '') +
        ` Do NOT ask about phone number, country, scheduling a call, availability, or anything that is not the exact question above — those are not things we collect. If you are unsure what to ask, ask exactly what is specified above.` +
        ` Do NOT thank them as if the conversation is finished or claim their information has been sent to the team — you still need this answer first.` +
        ` If the visitor already gave some details earlier, briefly acknowledge that, but still ask only for this one thing — never claim to have saved anything they did not actually provide.`
      );
    case ACTION.RECOMMEND: {
      const label = action.recommendation?.name || action.recommendation?.serviceId || 'the best-fit option';
      return `Recommend "${label}" in 2–3 sentences, grounded in the company knowledge, explaining why it fits what they described, then ask if they'd like to proceed.`;
    }
    case ACTION.COMPLETE:
      return 'The lead is fully captured. Simply thank the visitor and confirm the team will reach out shortly — do not ask any further questions.';
    case ACTION.SAY:
    default:
      return action?.message
        ? `Convey this naturally in one short, warm message: "${action.message}"`
        : '';
  }
}

/** Deterministic confirmation appended by the server on the COMPLETE turn (Phase 7d). */
const LEAD_COMPLETE_CONFIRMATION =
  "You're all set — our team now has your details and will reach out to you shortly. Aap chahein to seedha WhatsApp par baat kar sakte hain, ya abhi ek call book kar lein.";

/**
 * Phase 7d — directive for a lead ASK turn. The SERVER appends the exact field
 * question after the model's output, so the model must produce ONLY a short warm
 * lead-in with no question of its own (and no question mark, which the stream
 * decorator also strips as a safety net).
 */
function buildLeadInDirective(action) {
  const errPart = action?.error
    ? ' Their previous answer for this was not usable, so gently acknowledge that in your sentence.'
    : '';
  return (
    'Write ONE short, warm sentence (15 words max) that reacts naturally to what the visitor just said. ' +
    'Do NOT ask any question. Do NOT include a question mark. Do NOT request any information or introduce any ' +
    'new topic — the exact question the visitor needs to answer is added by the system immediately after your ' +
    `sentence.${errPart}`
  );
}

/** Phase 7d — directive for the COMPLETE turn (short warm closing; confirmation is appended). */
function buildClosingDirective() {
  return (
    'Write ONE short, warm closing sentence thanking the visitor for their time. Do NOT ask any question or ' +
    'include a question mark — a confirmation that the team will follow up is added by the system right after ' +
    'your sentence.'
  );
}

/**
 * Run one conversation turn end-to-end (with memory persistence).
 * @param {Object} input
 * @param {string} input.companyId
 * @param {Array<{role:string,content:string}>} input.messages
 * @param {object} [input.state]                     prior orchestrator state (round-tripped; carries conversationId)
 * @param {object} [input.orchestrator]              injectable (DI/testing)
 * @param {object} [input.memory]                    injectable Memory Service (DI); defaults to the shared instance
 * @param {object} [input.toolRouter]                injectable Tool Router (DI); defaults to the shared instance
 * @param {string} [input.providerId]
 * @param {object} [input.providerConfig]
 * @param {object} [input.config]
 * @param {object} [input.knowledgeService]          injectable Knowledge Service (DI); defaults to the shared instance
 * @param {object} [input.planner]                   injectable Intent Planner (DI); defaults to the shared planner
 * @param {object} [input.salesEngine]               injectable Sales Engine (DI); defaults to the shared engine
 * @param {object} [input.leadEngine]                injectable Lead Engine (DI); defaults to the shared engine
 * @param {object} [input.leadWriter]                injectable lead persistence (DI); defaults to the shared writer
 * @param {object} [input.handoffService]            injectable human-handoff service (DI); defaults to the shared service
 * @param {object} [input.analytics]                 injectable Analytics service (DI); defaults to the shared service
 * @param {object} [input.capabilityRegistry]        injectable Provider Capability registry (DI); read-only metadata
 * @param {object} [input.runtimeValidator]          injectable readiness validator (DI); config-only health check
 * @param {AbortSignal} [input.signal]
 * @returns {Promise<{ stream:AsyncGenerator<string>, updatedState:object, nextStage:string, assistantAction:object, toolResults:Array, executionPlan:object, handoffRequired:boolean, providerCapabilities:object, runtimeHealth:object }>}
 */
export async function runConversationTurn({
  companyId,
  messages,
  state,
  orchestrator,
  memory = getDefaultMemory(),
  toolRouter = getDefaultToolRouter(),
  knowledgeService = getDefaultKnowledgeService(),
  planner,
  salesEngine,
  leadEngine,
  leadWriter = getDefaultLeadWriter(),
  conversationWriter = getDefaultConversationWriter(),
  handoffService,
  analytics = getDefaultAnalytics(),
  capabilityRegistry = getDefaultCapabilityRegistry(),
  runtimeValidator = getDefaultRuntimeValidator(),
  providerId,
  providerConfig,
  config,
  signal,
}) {
  // 0) Conversation id from the runtime state; create one automatically if missing.
  const conversationId = state?.conversationId || createConversationId();
  // M18: analytics record only (fire-and-forget; never blocks/affects the turn).
  if (!state?.conversationId) analytics.track(ANALYTICS_EVENT.CONVERSATION_STARTED, { conversationId, companyId });

  // Phase 7a: detect state loss mid-conversation — the widget still has prior
  // messages on screen (including assistant replies) but sent NO orchestrator
  // state, so the backend restarts from GREETING. Logged distinctly so a state
  // reset is told apart from other causes. Diagnostic only — never alters the turn.
  if (!state?.conversationId && Array.isArray(messages) && messages.some((m) => m.role === 'assistant')) {
    // eslint-disable-next-line no-console
    console.warn('[Nova] state lost mid-conversation', { conversationId });
  }

  // 1) Restore persisted history and merge with the current request (newest last).
  const history = await loadHistory(memory, conversationId);
  analytics.track(ANALYTICS_EVENT.MEMORY_LOADED, { conversationId, count: history.length });
  const merged = mergeHistory(history, messages || []);

  // 2) Orchestrator controls the conversation (unchanged — newest user message).
  //    P1: resolve the default orchestrator lazily (only now, at first turn).
  orchestrator = orchestrator || (await getDefaultOrchestrator());
  // Prior USER-message texts (never assistant text — its prompts contain
  // field-like tokens). Lets lead capture backfill fields already stated during
  // qualification instead of re-asking them.
  const userHistory = merged.filter((m) => m.role === 'user').map((m) => m.content);
  const { assistantAction, nextStage, updatedState: orchestratorState } = orchestrator.process(
    lastUserMessage(messages),
    state || undefined,
    { history: userHistory },
  );
  // Carry the conversation id forward so the runtime restores the same thread.
  const updatedState = { ...orchestratorState, conversationId };
  if (nextStage === 'completed') analytics.track(ANALYTICS_EVENT.CONVERSATION_COMPLETED, { conversationId });

  // 3) Turn decision → directive (glue only).
  const baseDirective = buildTurnDirective(assistantAction);

  // 4) Persist the user message now, so it survives even if streaming aborts.
  const userText = lastUserMessage(messages);
  if (userText) await safeAppend(memory, conversationId, { role: 'user', content: userText }, companyId);

  // 4b) M12: inject RELEVANT company context via the existing search() (cached
  //     index; relevant-only, ordered, deduped, token-budgeted; graceful on any
  //     failure). Shares the injected Knowledge Service with the chat pipeline.
  const context = await buildGroundingContext(knowledgeService, companyId, userText, { config });
  analytics.track(ANALYTICS_EVENT.KNOWLEDGE_LOADED, { companyId, grounded: Boolean(context) });

  // 4c) M13: classify the request into an execution plan (planning only — the
  //     planner never executes anything; the plan is returned for the caller).
  //     P1: resolve the default planner lazily (only when a chat turn runs).
  planner = planner || (await getDefaultPlanner());
  const executionPlan = planner.plan({
    message: userText,
    config: { companyId },
    directive: baseDirective,
    state,
    assistantAction,
  });

  // 4d) M14/M15: the planner DECIDES; the runtime only ROUTES. Engage the
  //     existing Sales Engine when salesMode, and the existing Lead Engine when
  //     captureLead — appending their directives. Normal chat (neither flag) is
  //     completely unchanged.
  const directiveParts = [baseDirective];
  if (executionPlan.salesMode) {
    // P1: the Sales Engine default loads only on a sales turn (never on plain chat).
    salesEngine = salesEngine || (await getDefaultSalesEngine());
    directiveParts.push(buildSalesDirective(salesEngine, updatedState.sales));
  }
  if (executionPlan.captureLead) {
    // P1: the Lead Engine default loads only on a lead-capture turn.
    leadEngine = leadEngine || (await getDefaultLeadEngine());
    directiveParts.push(buildLeadDirective(leadEngine, updatedState.lead));
  }
  // M17: the planner DECIDES (requiresHuman); the runtime only ROUTES — append a
  //      human-handoff directive and expose handoffRequired. Graceful if missing.
  const handoffRequired = executionPlan.requiresHuman === true;
  if (handoffRequired) {
    // P1: the handoff module loads only when a handoff is actually requested.
    const { service: defaultHandoffSvc, directive: fallbackDirective } = await getDefaultHandoff();
    directiveParts.push(
      buildHandoffDirective(handoffService || defaultHandoffSvc, { companyId, conversationId }, fallbackDirective),
    );
    analytics.track(ANALYTICS_EVENT.HANDOFF_REQUESTED, { conversationId });
  }
  const directive = directiveParts.filter(Boolean).join('\n\n');

  // Phase 7d: deterministic question / closing. On a lead ASK turn the SERVER
  // appends the exact field question (verbatim), so the model is constrained to a
  // short warm lead-in with NO question of its own; on the COMPLETE turn the
  // confirmation is appended the same way. This guarantees the required question /
  // confirmation always reaches the visitor, instead of trusting the model to
  // phrase it (which Phase 7c proved it does not reliably do).
  let effectiveDirective = directive;
  let deterministicSuffix = null;
  let stripQuestionMarks = false;
  if (assistantAction?.type === ACTION.ASK && assistantAction?.source === 'lead' && assistantAction?.prompt) {
    effectiveDirective = buildLeadInDirective(assistantAction);
    deterministicSuffix = `\n\n${assistantAction.prompt}`;
    stripQuestionMarks = true;
  } else if (assistantAction?.type === ACTION.COMPLETE) {
    effectiveDirective = buildClosingDirective();
    deterministicSuffix = `\n\n${LEAD_COMPLETE_CONFIRMATION}`;
    stripQuestionMarks = true;
  }

  // 4e) M16: persist a COMPLETED lead once, via the existing Lead Repository.
  //     Trigger = Lead Engine reports complete; saved once (round-tripped flag +
  //     repository dedup); failures are normalized and never break chat.
  let leadSaved = state?.leadSaved === true;
  let whatsappLink = null;
  let calBookingAvailable = false;
  if (!leadSaved && updatedState.lead) {
    // P1: resolve the Lead Engine only when there is lead state to evaluate.
    leadEngine = leadEngine || (await getDefaultLeadEngine());
    if (leadEngine.isComplete(updatedState.lead)) {
      const { lead } = leadEngine.summary(updatedState.lead);
      // Phase 6a: preserve the visitor's ORIGINAL timeline wording (before it was
      // normalized to a bucket) in the lead record's metadata — no info lost.
      const rawTimeline = updatedState.lead?.raw?.timeline ?? null;
      const result = await leadWriter.persist(lead, { companyId, conversationId, rawTimeline });
      if (result?.ok) {
        leadSaved = true;
        whatsappLink = buildWhatsappLink(lead);
        calBookingAvailable = true;
        analytics.track(ANALYTICS_EVENT.LEAD_SAVED, { conversationId });
        // Phase 2: link the transcript to the saved lead (non-fatal).
        await conversationWriter.linkLead({ sessionId: conversationId, companyId, leadId: result.data?.id });
        // Phase 2: schedule the customer nurture sequence AFTER a successful save.
        await scheduleNurtureAfterLead({ companyId, lead });
        // Phase 5: notify the business owner immediately (internal, transactional).
        //          Runs AFTER the customer nurture and is fully isolated — a failure
        //          here never affects the customer emails or the lead save. `service`
        //          is the recommended/intended service label (best-effort, optional).
        const svc = updatedState.sales?.recommendation || updatedState.sales?.intent || null;
        await notifyOwnerOfLead({
          companyId,
          lead,
          service: svc ? svc.charAt(0).toUpperCase() + svc.slice(1) : 'New inquiry',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error('[Nova Lead] persist failed', result?.error);
      }
    }
  }
  updatedState.leadSaved = leadSaved;

  // M18: record the selected provider (fire-and-forget; the router still owns
  //      actual selection/failover — this only observes the requested provider).
  analytics.track(ANALYTICS_EVENT.PROVIDER_SELECTED, { providerId: providerId ?? 'default' });

  // M19: READ-ONLY provider capabilities. Purely informational metadata exposed
  //      on the turn result; it never alters provider execution, streaming, or
  //      tool routing. Graceful — unknown/undefined provider → safe defaults.
  const providerCapabilities = capabilityRegistry.get(providerId);

  // M20: production readiness — validate the runtime's collaborators ONCE before
  //      the stream. Configuration-only, informational: it never throws, never
  //      blocks streaming, and never alters behavior. Chat continues regardless;
  //      only unrecoverable config errors surface (as `runtimeHealth.errors`).
  const runtimeHealth = runtimeValidator.validate({
    providerId,
    providerConfig,
    capabilityRegistry,
    knowledgeService,
    memory,
    analytics,
    planner,
    toolRouter,
  });

  // 5) Reuse the existing streaming pipeline (knowledge + provider) with merged history.
  const rawStream = await createChatStream({
    companyId,
    messages: merged,
    providerId,
    providerConfig,
    config,
    knowledgeService,
    signal,
    directive: effectiveDirective,
    context,
  });

  // 6) Stream tokens straight through; after completion save the assistant reply
  //    and run any tool calls it contains (results populate `toolResults`).
  //    Phase 7d: decorate the model's lead-in with the deterministic question /
  //    confirmation before persistence sees it (so the full message is saved).
  const toolResults = [];
  const decorated = decorateStream(rawStream, { stripQuestionMarks, suffix: deterministicSuffix });
  const stream = persistOnComplete(decorated, {
    memory,
    conversationId,
    companyId,
    signal,
    toolRouter,
    toolResults,
    analytics,
    conversationWriter,
    userText,
  });

  // Phase 7a: one structured, non-PII line per turn so stage/leadSaved progression
  // is visible in logs. Fires after the response is prepared (like the analytics
  // calls above) — a synchronous console call that never touches or slows the
  // stream. `nextField` is guarded so a null lead state can never make it throw.
  // eslint-disable-next-line no-console
  console.log('[Nova Turn]', {
    conversationId,
    stage: updatedState?.stage,
    leadSaved,
    nextField: updatedState?.lead ? leadEngine?.nextQuestion(updatedState.lead)?.field || null : null,
  });

  return {
    stream,
    updatedState,
    nextStage,
    assistantAction,
    toolResults,
    executionPlan,
    handoffRequired,
    providerCapabilities,
    runtimeHealth,
    whatsappLink,
    calBookingAvailable,
  };
}
