import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { listLeads, LEAD_STATUSES, LEAD_SOURCES } from '@/lib/supabase/leads';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

function truncate(s, n = 60) {
  const t = String(s ?? '');
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const cell = 'px-3 py-2 text-sm align-top';
const head = 'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';

export default async function DashboardPage({ searchParams }) {
  const params = (await searchParams) || {};
  const search = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const source = typeof params.source === 'string' ? params.source : '';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { rows, error } = await listLeads({ search, status, source });

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-8 text-[var(--text)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-strong)]">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Signed in as {user?.email}</p>
          </div>
          <LogoutButton />
        </div>

        <form method="get" className="mt-6 flex flex-wrap items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search name or email"
            className="w-56 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <select
            name="status"
            defaultValue={status}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            name="source"
            defaultValue={source}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Apply
          </button>
          <span className="ml-1 text-sm text-[var(--text-muted)]">{rows.length} lead(s)</span>
        </form>

        {error ? (
          <p className="mt-6 text-sm text-red-500">Could not load leads: {error}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className={head}>Name</th>
                  <th className={head}>Email</th>
                  <th className={head}>Phone</th>
                  <th className={head}>Project</th>
                  <th className={head}>Budget</th>
                  <th className={head}>Timeline</th>
                  <th className={head}>Source</th>
                  <th className={head}>Created</th>
                  <th className={head}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className={`${cell} text-[var(--text-muted)]`} colSpan={9}>
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  rows.map((lead) => (
                    <tr key={lead.id} className="border-t border-[var(--border)] hover:bg-[var(--surface)]">
                      <td className={cell}>
                        <Link
                          href={`/dashboard/leads/${lead.id}`}
                          className="font-medium text-[var(--accent)] hover:underline"
                        >
                          {lead.full_name || 'View'}
                        </Link>
                      </td>
                      <td className={cell}>{lead.email || '—'}</td>
                      <td className={cell}>{lead.phone || '—'}</td>
                      <td className={cell} title={lead.project_description || ''}>
                        {truncate(lead.project_description) || '—'}
                      </td>
                      <td className={cell}>{lead.budget || '—'}</td>
                      <td className={cell}>{lead.timeline || '—'}</td>
                      <td className={cell}>{lead.source || '—'}</td>
                      <td className={cell}>{formatDate(lead.created_at)}</td>
                      <td className={cell}>{lead.status || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
