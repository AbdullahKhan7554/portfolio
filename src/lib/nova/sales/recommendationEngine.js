/**
 * Nova Sales — recommendation engine. Picks the best-matching service for the
 * current conversation state. Ranks by intent fit, then qualification progress.
 * No pricing logic, no database. Pure.
 */
import { SERVICES } from './serviceConfig';
import { qualificationScore } from './qualificationEngine';

/**
 * Rank services for a state (intent + answered questions).
 * @param {{intent:string, completedQuestions?:string[]}} state
 * @param {object[]} [services]
 * @returns {Array<{ service:object, score:number }>}
 */
export function rankServices(state, services = SERVICES) {
  const { intent, completedQuestions = [] } = state;
  return services
    .map((service) => {
      const intentFit = service.intents.includes(intent) ? 100 : 0;
      const progress = qualificationScore(service, completedQuestions);
      // Intent match dominates; qualification progress breaks ties.
      return { service, score: intentFit * 2 + progress };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * The single best recommendation for a state.
 * @returns {{ serviceId:string, name:string, score:number } | null}
 */
export function recommendService(state, services = SERVICES) {
  const ranked = rankServices(state, services);
  const top = ranked[0];
  if (!top || top.score === 0) return null;
  return { serviceId: top.service.id, name: top.service.name, score: top.score };
}
