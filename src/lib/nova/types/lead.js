/**
 * Nova — Lead domain model. A reusable, provider-agnostic capture schema the
 * concierge fills in over a conversation. Pure data + factory only; how a lead
 * is qualified or delivered is NOT decided here.
 */
import { createId } from '../utils/ids';

/** Lifecycle of a captured lead. */
export const LEAD_STATUS = Object.freeze({
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  QUALIFIED: 'qualified',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
});

/** The capturable fields, in the order the concierge typically collects them. */
export const LEAD_FIELDS = Object.freeze([
  'name',
  'email',
  'phone',
  'budget',
  'service',
  'timeline',
  'country',
  'message',
]);

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} budget
 * @property {string} service
 * @property {string} timeline
 * @property {string} country
 * @property {string} message
 * @property {'new'|'in_progress'|'qualified'|'completed'|'abandoned'} status
 * @property {string|null} conversationId
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Factory for a blank lead, overridable with any known fields.
 * @param {Partial<Lead>} [partial]
 * @returns {Lead}
 */
export function createLead(partial = {}) {
  const now = Date.now();
  return {
    id: partial.id ?? createId('lead'),
    name: '',
    email: '',
    phone: '',
    budget: '',
    service: '',
    timeline: '',
    country: '',
    message: '',
    status: LEAD_STATUS.NEW,
    conversationId: null,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}
