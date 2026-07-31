import Link from 'next/link';
import { listDocuments, listFaqs } from '@/lib/supabase/knowledgeBase';
import { KNOWLEDGE_DOC_TYPES } from '@/lib/dashboard/knowledgeMeta';
import { RowActions } from './RowActions';

export const dynamic = 'force-dynamic';

function truncate(s, n = 70) {
  const t = String(s ?? '');
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const cell = 'px-3 py-2 text-sm align-top';
const head = 'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';

function tabClass(active) {
  return `rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors ${
    active
      ? 'bg-[var(--surface)] text-[var(--text-strong)]'
      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
  }`;
}

export default async function KnowledgePage({ searchParams }) {
  const params = (await searchParams) || {};
  const tab = params.tab === 'faqs' ? 'faqs' : 'documents';
  const search = typeof params.q === 'string' ? params.q : '';
  const docType = typeof params.type === 'string' ? params.type : '';
  const activeOnly = params.active === '1';
  const isFaq = tab === 'faqs';

  const { rows, error } = isFaq
    ? await listFaqs({ search, activeOnly })
    : await listDocuments({ docType, search, activeOnly });

  const addHref = `/dashboard/knowledge/new?kind=${isFaq ? 'faq' : 'document'}`;
  const editHref = (id) => `/dashboard/knowledge/${isFaq ? 'faq' : 'document'}/${id}`;
  const rowKind = isFaq ? 'faq' : 'document';

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-[var(--text-strong)]">Knowledge Base</h1>
        <Link
          href={addHref}
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          {isFaq ? 'Add FAQ' : 'Add document'}
        </Link>
      </div>

      <nav className="mt-5 flex gap-1">
        <Link href="/dashboard/knowledge?tab=documents" className={tabClass(!isFaq)}>Documents</Link>
        <Link href="/dashboard/knowledge?tab=faqs" className={tabClass(isFaq)}>FAQs</Link>
      </nav>

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2">
        <input type="hidden" name="tab" value={tab} />
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder={isFaq ? 'Search question or answer' : 'Search title or content'}
          className="w-60 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        {!isFaq && (
          <select
            name="type"
            defaultValue={docType}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">All types</option>
            {KNOWLEDGE_DOC_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <input type="checkbox" name="active" value="1" defaultChecked={activeOnly} />
          Active only
        </label>
        <button
          type="submit"
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Apply
        </button>
        <span className="ml-1 text-sm text-[var(--text-muted)]">{rows.length} entr{rows.length === 1 ? 'y' : 'ies'}</span>
      </form>

      {error ? (
        <p className="mt-6 text-sm text-red-500">Could not load knowledge: {error}</p>
      ) : rows.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--text-muted)]">
          No entries found.
        </div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="mt-4 hidden overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] md:block">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--surface)]">
                <tr>
                  {isFaq ? (
                    <th className={head}>Question</th>
                  ) : (
                    <>
                      <th className={head}>Type</th>
                      <th className={head}>Title</th>
                    </>
                  )}
                  <th className={head}>Updated</th>
                  <th className={head}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-t border-[var(--border)] hover:bg-[var(--surface)] ${
                      row.is_active ? '' : 'opacity-50'
                    }`}
                  >
                    {isFaq ? (
                      <td className={cell} title={row.question}>
                        <Link href={editHref(row.id)} className="font-medium text-[var(--accent)] hover:underline">
                          {truncate(row.question)}
                        </Link>
                      </td>
                    ) : (
                      <>
                        <td className={cell}>{row.doc_type}</td>
                        <td className={cell} title={row.title}>
                          <Link href={editHref(row.id)} className="font-medium text-[var(--accent)] hover:underline">
                            {truncate(row.title)}
                          </Link>
                        </td>
                      </>
                    )}
                    <td className={cell}>{formatDate(row.updated_at)}</td>
                    <td className={cell}>
                      <RowActions kind={rowKind} id={row.id} isActive={row.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {rows.map((row) => (
              <div
                key={row.id}
                className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 ${
                  row.is_active ? '' : 'opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <Link href={editHref(row.id)} className="font-medium text-[var(--accent)] hover:underline">
                    {truncate(isFaq ? row.question : row.title, 90)}
                  </Link>
                  <span className="shrink-0 text-xs text-[var(--text-muted)]">{formatDate(row.updated_at)}</span>
                </div>
                {!isFaq && <div className="mt-1 text-xs text-[var(--text-muted)]">{row.doc_type}</div>}
                <div className="mt-3">
                  <RowActions kind={rowKind} id={row.id} isActive={row.is_active} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
