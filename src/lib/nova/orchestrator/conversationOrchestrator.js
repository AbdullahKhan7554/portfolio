/**
 * Nova Orchestrator — the conversation lifecycle coordinator (composition root).
 *
 * Coordinates the Sales Intelligence Engine (5A) and the Lead Capture Engine
 * (5B) WITHOUT re-implementing either. Both engines are injected (DI) and their
 * default instances are used unless overridden. The orchestrator owns only:
 *   - the composite conversation state,
 *   - stage transitions (delegated to stateTransitions),
 *   - deciding the next assistant action per stage.
 *
 * Single public method: `process(message, state)` → { assistantAction,
 * nextStage, updatedState }. Stateless + in-memory: returns a NEW state, saves
 * nothing.
 */
import { salesEngine as defaultSalesEngine } from '../sales/salesEngine';
import { leadCaptureEngine as defaultLeadEngine } from '../leads/leadCaptureEngine';
import { STAGE } from './conversationStages';
import { ACTION, resolveConfig } from './orchestratorConfig';
import { resolveLeadFlow } from './flowResolver';
import { nextStage as computeNextStage } from './stateTransitions';

/**
 * @param {Object} [deps]
 * @param {object} [deps.salesEngine]   5A engine (injected)
 * @param {object} [deps.leadEngine]    5B engine (injected)
 * @param {object} [deps.config]        orchestrator config override
 */
export function createConversationOrchestrator({
  salesEngine = defaultSalesEngine,
  leadEngine = defaultLeadEngine,
  config: configOverride,
} = {}) {
  const config = resolveConfig(configOverride);

  /** Fresh composite state (sub-engine states owned here, not persisted). */
  function start() {
    return {
      stage: STAGE.GREETING,
      sales: salesEngine.start(),
      lead: null, // created when we enter lead capture (flow depends on intent)
    };
  }

  /** Build a say/complete message action from config copy. */
  const say = (stage) => ({ type: ACTION.SAY, message: config.messages[stage] || '', stage });

  /** Read-only view the transition function needs (no engine internals leak). */
  function view(state) {
    const rec = salesEngine.getRecommendation(state.sales);
    return {
      stage: state.stage,
      intent: state.sales.intent,
      qualificationScore: state.sales.qualificationScore,
      hasRecommendation: Boolean(rec),
      leadComplete: state.lead ? leadEngine.isComplete(state.lead) : false,
    };
  }

  /** Decide the assistant action for the CURRENT stage of a state. */
  function actionFor(state) {
    switch (state.stage) {
      case STAGE.GREETING:
        return say(STAGE.GREETING);

      case STAGE.INTENT:
        return { type: ACTION.SAY, message: config.messages[STAGE.GREETING] || '', stage: STAGE.INTENT };

      case STAGE.QUALIFICATION: {
        const q = salesEngine.getNextQuestion(state.sales);
        return q
          ? { type: ACTION.ASK, source: 'sales', field: q.key, prompt: q.prompt, stage: STAGE.QUALIFICATION }
          : say(STAGE.RECOMMENDATION);
      }

      case STAGE.RECOMMENDATION: {
        const rec = salesEngine.getRecommendation(state.sales);
        return {
          type: ACTION.RECOMMEND,
          message: config.messages[STAGE.RECOMMENDATION] || '',
          recommendation: rec,
          stage: STAGE.RECOMMENDATION,
        };
      }

      case STAGE.LEAD_CAPTURE: {
        const q = leadEngine.nextQuestion(state.lead);
        return q
          ? { type: ACTION.ASK, source: 'lead', field: q.field, prompt: q.prompt, required: q.required, stage: STAGE.LEAD_CAPTURE }
          : say(STAGE.COMPLETED);
      }

      case STAGE.COMPLETED:
      default:
        return { type: ACTION.COMPLETE, message: config.messages[STAGE.COMPLETED] || '', stage: STAGE.COMPLETED };
    }
  }

  /** Ensure a lead state exists, using the flow mapped from the sales intent. */
  function ensureLead(state) {
    if (state.lead) return state;
    const flow = resolveLeadFlow(state.sales.intent, config);
    return { ...state, lead: leadEngine.start(flow) };
  }

  /**
   * Advance the conversation with an inbound user message.
   * @param {string} message
   * @param {object} [inputState]  omit to begin a new conversation
   * @returns {{ assistantAction:object, nextStage:string, updatedState:object }}
   */
  function process(message, inputState) {
    let state = inputState || start();

    // 1) Route the message to the engine that owns the CURRENT stage.
    if (state.stage === STAGE.GREETING || state.stage === STAGE.INTENT) {
      state = { ...state, sales: salesEngine.ingestMessage(state.sales, message) };
    } else if (state.stage === STAGE.QUALIFICATION) {
      const q = salesEngine.getNextQuestion(state.sales);
      if (q) state = { ...state, sales: salesEngine.answer(state.sales, q.key, message) };
    } else if (state.stage === STAGE.LEAD_CAPTURE) {
      state = ensureLead(state);
      const result = leadEngine.submit(state.lead, message);
      state = { ...state, lead: result.state };
      // Invalid input: re-ask the same field (no stage advance).
      if (!result.ok) {
        return {
          assistantAction: {
            type: ACTION.ASK,
            source: 'lead',
            field: leadEngine.nextQuestion(state.lead)?.field,
            prompt: leadEngine.nextQuestion(state.lead)?.prompt,
            error: result.error,
            stage: STAGE.LEAD_CAPTURE,
          },
          nextStage: STAGE.LEAD_CAPTURE,
          updatedState: state,
        };
      }
    }

    // 2) Decide the next stage from the engines' own exposed values.
    const target = computeNextStage(view(state), config);
    let updatedState = { ...state, stage: target };

    // 3) Entering lead capture: lazily create the lead flow from the intent.
    if (target === STAGE.LEAD_CAPTURE) updatedState = ensureLead(updatedState);

    // 4) Produce the assistant action for the new stage.
    return {
      assistantAction: actionFor(updatedState),
      nextStage: target,
      updatedState,
    };
  }

  /** Clean, serializable summary — reuses the lead engine's summary + sales data. */
  function summary(state) {
    const qualification = {
      intent: state.sales.intent,
      qualificationScore: state.sales.qualificationScore,
      stage: state.sales.stage,
    };
    const recommendation = salesEngine.getRecommendation(state.sales);
    return state.lead
      ? leadEngine.summary(state.lead, { qualification, recommendation })
      : { lead: null, progress: null, qualification, recommendation };
  }

  return { start, process, summary, config };
}

/** Default orchestrator bound to the default 5A/5B engines. */
export const conversationOrchestrator = createConversationOrchestrator();
