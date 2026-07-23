/**
 * Nova KMS — parser. Turns raw markdown into structured objects (no external
 * markdown dependency; a small, predictable heading/list parser). Pure.
 *
 * Output shape:
 *   parseMarkdown(raw) -> { title, sections:[{heading, level, content, items}], text }
 */

/** Extract bullet / numbered list items from a block of lines. */
function extractListItems(lines) {
  return lines
    .map((l) => l.trim())
    .filter((l) => /^([-*+]|\d+\.)\s+/.test(l))
    .map((l) => l.replace(/^([-*+]|\d+\.)\s+/, '').trim());
}

/**
 * Parse a markdown string into ordered sections keyed by their heading.
 * @param {string} raw
 * @returns {{ title:string, sections:Array<{heading:string,level:number,content:string,items:string[]}>, text:string }}
 */
export function parseMarkdown(raw = '') {
  const lines = String(raw).replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let current = null;
  let title = null;

  const flush = () => {
    if (!current) return;
    current.content = current._lines.join('\n').trim();
    current.items = extractListItems(current._lines);
    delete current._lines;
    sections.push(current);
  };

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 1 && title === null) title = text;
      flush();
      current = { heading: text, level, content: '', items: [], _lines: [] };
    } else {
      if (!current) current = { heading: title || '', level: 1, content: '', items: [], _lines: [] };
      current._lines.push(line);
    }
  }
  flush();

  const text = sections
    .map((s) => [s.heading, s.content].filter(Boolean).join('\n'))
    .join('\n\n')
    .trim();

  return { title: title || sections[0]?.heading || '', sections, text };
}

/**
 * Parse a single document, tagged with its id (filename without extension).
 * @param {string} id
 * @param {string} raw
 */
export function parseDocument(id, raw) {
  return { id, ...parseMarkdown(raw) };
}

/**
 * Parse a whole company's raw docs map into parsed documents.
 * @param {Record<string,string>} rawDocs   { docId: rawMarkdown }
 * @returns {Record<string, ReturnType<typeof parseDocument>>}
 */
export function parseDocuments(rawDocs = {}) {
  const out = {};
  for (const [id, raw] of Object.entries(rawDocs)) {
    out[id] = parseDocument(id, raw);
  }
  return out;
}
