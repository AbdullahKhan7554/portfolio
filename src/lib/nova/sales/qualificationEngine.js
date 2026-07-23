/**
 * Nova Sales — qualification engine. Config-driven: it reads a service's
 * `questions` (from serviceConfig) and computes what to ask next plus a
 * qualification score. No questions are hardcoded here. Pure functions.
 */
import { SERVICES } from './serviceConfig';

/** Find the service whose intent list covers the given intent. */
export function selectService(intent, services = SERVICES) {
  return (
    services.find((s) => s.intents.includes(intent)) ||
    services.find((s) => s.id === 'consultation') ||
    services[0] ||
    null
  );
}

/**
 * The next unanswered question for a service, given completed keys.
 * @returns {{key:string, weight:number, prompt:string} | null}
 */
export function nextQuestion(service, completedQuestions = []) {
  if (!service) return null;
  return service.questions.find((q) => !completedQuestions.includes(q.key)) || null;
}

/**
 * Weighted 0..100 qualification score = answered weight / total weight.
 * @param {object} service
 * @param {string[]} completedQuestions
 * @returns {number}
 */
export function qualificationScore(service, completedQuestions = []) {
  if (!service || service.questions.length === 0) return 0;
  const total = service.questions.reduce((sum, q) => sum + (q.weight || 1), 0);
  const done = service.questions
    .filter((q) => completedQuestions.includes(q.key))
    .reduce((sum, q) => sum + (q.weight || 1), 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** True when every question for the service has been answered. */
export function isQualified(service, completedQuestions = []) {
  return Boolean(service) && nextQuestion(service, completedQuestions) === null;
}
