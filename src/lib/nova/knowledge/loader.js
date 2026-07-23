/**
 * Nova KMS — loader. Reads a company's raw markdown files from disk.
 *
 * SOLID/DIP: the filesystem is an INJECTED dependency (`fs`), so the loader can
 * read from node:fs (default), an in-memory map in tests, or any other source
 * without changing callers. Server/build-time only — never a client module,
 * never an API route.
 */
import { promises as nodeFs } from 'node:fs';
import path from 'node:path';
import { DEFAULT_KNOWLEDGE_ROOT, TEMPLATE_FOLDER } from './constants';

/**
 * @typedef {Object} FsLike
 * @property {(dir:string)=>Promise<string[]>} readdir
 * @property {(file:string, enc:string)=>Promise<string>} readFile
 */

/**
 * @param {Object} [options]
 * @param {string} [options.baseDir]   knowledge root (defaults to <cwd>/src/knowledge)
 * @param {FsLike} [options.fs]        injectable filesystem
 */
export function createKnowledgeLoader({ baseDir, fs = nodeFs } = {}) {
  const root = baseDir || path.join(process.cwd(), ...DEFAULT_KNOWLEDGE_ROOT);

  /**
   * Load every content markdown file in a company's folder.
   * @param {string | { knowledgeFolder:string }} companyOrFolder
   * @returns {Promise<Record<string,string>>}  { [docId]: rawMarkdown }
   */
  async function loadCompany(companyOrFolder) {
    const folder =
      typeof companyOrFolder === 'string'
        ? companyOrFolder
        : companyOrFolder?.knowledgeFolder;
    if (!folder) throw new Error('loadCompany: missing knowledge folder.');

    const dir = path.join(root, folder);
    const entries = await fs.readdir(dir);
    const files = entries.filter(
      (f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md',
    );

    const docs = {};
    for (const file of files) {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      docs[file.replace(/\.md$/, '')] = raw;
    }
    return docs;
  }

  /** Convenience: load the starter template as a company. */
  function loadTemplate() {
    return loadCompany(TEMPLATE_FOLDER);
  }

  return { root, loadCompany, loadTemplate };
}
