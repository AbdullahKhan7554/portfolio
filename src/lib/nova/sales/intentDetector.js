/**
 * Nova Sales — intent detection. Pure keyword scoring over the configured
 * vocabulary; no ML, no side effects. Returns the best intent, defaulting to
 * GENERAL when nothing matches.
 */
import { INTENT, INTENT_KEYWORDS } from './serviceConfig';

/** Lowercase normalize for matching. */
function normalize(text = '') {
  return String(text).toLowerCase();
}

/**
 * Score every intent by keyword hits in the text.
 * @param {string} text
 * @param {Record<string,string[]>} [keywords]
 * @returns {Record<string, number>}
 */
export function scoreIntents(text, keywords = INTENT_KEYWORDS) {
  const haystack = normalize(text);
  const scores = {};
  for (const [intent, cues] of Object.entries(keywords)) {
    scores[intent] = cues.reduce((n, cue) => (haystack.includes(cue) ? n + 1 : n), 0);
  }
  return scores;
}

/**
 * Detect the dominant intent in a single message.
 * @param {string} text
 * @param {{ keywords?:Record<string,string[]> }} [options]
 * @returns {{ intent:string, score:number, scores:Record<string,number> }}
 */
export function detectIntent(text, { keywords = INTENT_KEYWORDS } = {}) {
  const scores = scoreIntents(text, keywords);
  let intent = INTENT.GENERAL;
  let best = 0;
  for (const [name, score] of Object.entries(scores)) {
    if (score > best) {
      best = score;
      intent = name;
    }
  }
  return { intent, score: best, scores };
}
