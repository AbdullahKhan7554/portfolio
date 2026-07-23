/**
 * Nova KMS — keyword search (NOT vector search). Builds a lightweight in-memory
 * index over parsed sections and ranks them by term overlap + frequency, with
 * heading matches weighted higher. Pure, dependency-free, deterministic.
 */

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are',
  'do', 'does', 'you', 'your', 'we', 'our', 'i', 'it', 'with', 'how', 'what',
  'can', 'me', 'my', 'about', 'at', 'by', 'be',
]);

/** Lowercase → alphanumeric tokens, minus stopwords and single chars. */
function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** First sentence/line containing any query term (a readable snippet). */
function makeSnippet(text = '', queryTokens, max = 180) {
  const parts = String(text).split(/(?<=[.!?])\s+|\n+/);
  const hit = parts.find((p) => {
    const t = new Set(tokenize(p));
    return queryTokens.some((q) => t.has(q));
  });
  const chosen = (hit || parts[0] || '').trim();
  return chosen.length > max ? `${chosen.slice(0, max - 1)}…` : chosen;
}

/**
 * Build a flat, searchable index from a company's parsed documents.
 * @param {Record<string, {sections?:Array}>} parsedDocs
 * @param {{ companyId?:string }} [meta]
 */
export function buildSearchIndex(parsedDocs = {}, { companyId } = {}) {
  const records = [];
  for (const [docId, doc] of Object.entries(parsedDocs)) {
    for (const section of doc.sections || []) {
      const body = [section.heading, section.content].filter(Boolean).join(' ');
      records.push({
        companyId,
        docId,
        heading: section.heading,
        content: section.content,
        headingTokens: tokenize(section.heading),
        bodyTokens: tokenize(body),
      });
    }
  }
  return { companyId, records };
}

/** Score one record against the query tokens (heading matches weigh 3×). */
function scoreRecord(record, queryTokens) {
  let score = 0;
  for (const q of queryTokens) {
    for (const t of record.bodyTokens) if (t === q) score += 1;
    for (const h of record.headingTokens) if (h === q) score += 3;
  }
  return score;
}

/**
 * Rank index records for a query.
 * @param {{records:Array}} index
 * @param {string} query
 * @param {{ limit?:number }} [options]
 * @returns {Array<{docId:string, heading:string, score:number, snippet:string}>}
 */
export function search(index, query, { limit = 5 } = {}) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || !index?.records?.length) return [];

  return index.records
    .map((record) => ({ record, score: scoreRecord(record, queryTokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record, score }) => ({
      docId: record.docId,
      heading: record.heading,
      score,
      snippet: makeSnippet(record.content, queryTokens),
    }));
}
