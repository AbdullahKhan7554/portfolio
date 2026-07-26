/**
 * Nova Leads — multi-field extractor (Phase 7b).
 *
 * Real visitors answer several fields in ONE free-text message
 * ("budget 20000pkr, live in 7 days, email x@y.com name Sara"). This pre-pass
 * pulls clearly-marked field VALUES from anywhere in a message so the capture
 * engine can store each of them — instead of only the one field it happened to
 * be asking for and silently dropping the rest.
 *
 * It returns RAW candidate strings keyed by lead field. It does NOT validate or
 * normalize — the engine runs the SAME per-field validators (validateEmail /
 * validateBudget / validateTimeline→normalizeTimeline / validateName / validatePhone)
 * on these candidates, so nothing here bypasses validation. Conservative by design: only
 * high-confidence, explicitly-marked matches are returned (name especially — it
 * requires an explicit marker, never just a capitalized word).
 */
import { LEAD_FIELD } from './leadConfig';

/** An email token anywhere in the message. */
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/** Amount tied to a currency-ish token (before/after) or the word "budget". */
const BUDGET_RES = [
  /\$\s?\d[\d,]*(?:\.\d+)?/i, // $500 / $ 1,000
  /\d[\d,]*(?:\.\d+)?\s?(?:k|pkr|rs\.?|usd|rupees?|dollars?)\b/i, // 20000pkr / 500 usd / 20k / 5000rs
  /(?:pkr|rs\.?|usd|rupees?|dollars?)\s?\d[\d,]*(?:\.\d+)?/i, // pkr 20000 / rs 5000
  /\bbudget\b\s*(?:is|of|around|about|approx\.?|~|:|=)?\s*(\$?\s?\d[\d,]*(?:\.\d+)?\s?(?:k|pkr|rs\.?|usd|rupees?|dollars?)?)/i, // budget is 20000 / budget 200
];

/** A timeline-indicating phrase anywhere in the message. */
const TIMELINE_RE =
  /\b(?:asap|a\.?s\.?a\.?p|urgent(?:ly)?|immediately|right\s+(?:away|now)|this\s+week|next\s+week|next\s+month|next\s+year|end\s+of\s+(?:the\s+)?year|(?:in\s+)?\d+\s*(?:day|days|week|weeks|month|months|year|years)|a\s+(?:day|week|month)|couple\s+(?:of\s+)?(?:days|weeks|months)|few\s+(?:days|weeks|months)|no\s+rush|no\s+hurry|whenever|flexible)\b/i;

/** An EXPLICITLY-marked name ("my name is X", "name X", "I'm X", "this is X"). */
const NAME_RE =
  /(?:\bmy name is\b|\bname is\b|\bname'?s\b|\bthis is\b|\bi am\b|\bi'?m\b|\bname\b[:\-]?)\s+([a-z][a-z.'-]*(?:\s+[a-z][a-z.'-]*)?)/i;

/**
 * A phone number: either marker-led ("phone/mobile/whatsapp/number/call me … 0300…"),
 * or a distinctive local/international format on its own. A digit run must be ≥8
 * long, so it never grabs a short budget figure. The engine's validatePhone has
 * the final say (7–15 digits after stripping separators).
 */
const PHONE_MARKER_RE =
  /(?:phone|mobile|cell|whats\s?app|number|contact(?:\s+me)?|call\s+me|reach\s+me)\b[^\d+]{0,8}(\+?\d[\d\s().-]{6,16}\d)/i;
const PHONE_STRICT_RE = /(\+92[\s-]?3\d{2}[\s-]?\d{7}|\b03\d{2}[\s-]?\d{7}\b|\+\d{9,15}\b)/;

/** Words that commonly follow a "name marker" but are NOT names (false-positive guard). */
const NAME_STOPWORDS = new Set([
  'looking', 'interested', 'trying', 'here', 'not', 'just', 'still', 'really', 'going', 'gonna',
  'planning', 'hoping', 'thinking', 'from', 'a', 'an', 'the', 'working', 'building', 'making',
  'needing', 'wanting', 'in', 'at', 'on', 'ready', 'done', 'good', 'fine', 'ok', 'okay', 'sorry',
  'new', 'also', 'currently', 'based', 'using', 'about', 'with', 'for', 'and', 'but', 'so', 'very',
]);

/** Trim surrounding whitespace and trailing sentence punctuation (keeps internal commas like 20,000). */
function clean(s) {
  return String(s).trim().replace(/[.,;:!?]+$/, '').trim();
}

function firstMatch(msg, res) {
  for (const re of res) {
    const m = msg.match(re);
    if (m) return clean(m[1] || m[0]);
  }
  return null;
}

function extractPhone(msg) {
  const m = msg.match(PHONE_MARKER_RE) || msg.match(PHONE_STRICT_RE);
  return m ? clean(m[1] || m[0]) : null;
}

function extractName(msg) {
  const m = msg.match(NAME_RE);
  if (!m) return null;
  // Keep leading name words, but stop at the first stopword/connector ("Sara and
  // my budget..." → "Sara"); names here are at most 2 words.
  const kept = [];
  for (const w of m[1].trim().split(/\s+/)) {
    if (NAME_STOPWORDS.has(w.toLowerCase())) break;
    kept.push(w);
    if (kept.length === 2) break;
  }
  return kept.length ? kept.join(' ') : null;
}

/**
 * Pull clearly-marked field candidates from a free-text message.
 * @param {string} message
 * @returns {{ [field:string]: string }} raw candidate strings by lead field (UNVALIDATED)
 */
export function extractLeadFields(message) {
  const msg = String(message ?? '');
  if (!msg.trim()) return {};

  const out = {};
  const email = msg.match(EMAIL_RE);
  if (email) out[LEAD_FIELD.EMAIL] = clean(email[0]);

  const budget = firstMatch(msg, BUDGET_RES);
  if (budget) out[LEAD_FIELD.BUDGET] = budget;

  const timeline = msg.match(TIMELINE_RE);
  if (timeline) out[LEAD_FIELD.TIMELINE] = clean(timeline[0]);

  const phone = extractPhone(msg);
  if (phone) out[LEAD_FIELD.PHONE] = phone;

  const name = extractName(msg);
  if (name) out[LEAD_FIELD.FULL_NAME] = name;

  return out;
}
