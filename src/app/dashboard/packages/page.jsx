import Link from 'next/link';
import { listPackages } from '@/lib/supabase/salesPackages';
import { RowActions } from './RowActions';

export const dynamic = 'force-dynamic';

function truncate(s, n = 70) {
  const t = String(s ?? '');
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function formatPrice(value, currency) {
  if (value == null) return '—';
  const n = Number(value);
  if (n === 0) return 'Free';
  return `${currency || 'USD'} ${n.toLocaleString()}`;
}

const cell = 'px-3 py-2 text-sm align-top';
const head = 'px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';

export default async function PackagesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const search = typeof params.q === 'string' ? params.q : '';
  const activeOnly = params.active === '1';

  const { rows, error } = await listPackages({ search, activeOnly });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-[var(--text-strong)]">Sales Packages</h1>
        <Link
          href="/dashboard/packages/new"
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Add package
        </Link>
      </div>

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Search name, ID, description or audience"
          className="w-72 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
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
        <span className="ml-1 text-sm text-[var(--text-muted)]">
          {rows.length} package{rows.length === 1 ? '' : 's'}
        </span>
      </form>

      {error ? (
        <p className="mt-6 text-sm text-red-500">Could not load packages: {error}</p>
      ) : rows.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--text-muted)]">
          No packages found.
        </div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="mt-4 hidden overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] md:block">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--surface)]">
                <tr>
                  <th className={head}>Order</th>
                  <th className={head}>Name</th>
                  <th className={head}>ID</th>
                  <th className={head}>From</th>
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
                    <td className={cell}>{row.display_order}</td>
                    <td className={cell} title={row.short_description}>
                      <Link
                        href={`/dashboard/packages/${row.id}`}
                        className="font-medium text-[var(--accent)] hover:underline"
                      >
                        {truncate(row.name)}
                      </Link>
                    </td>
                    <td className={cell}>{row.package_id}</td>
                    <td className={cell}>{formatPrice(row.starting_price, row.currency)}</td>
                    <td className={cell}>
                      <RowActions id={row.id} isActive={row.is_active} />
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
                  <Link
                    href={`/dashboard/packages/${row.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {truncate(row.name, 90)}
                  </Link>
                  <span className="shrink-0 text-xs text-[var(--text-muted)]">
                    {formatPrice(row.starting_price, row.currency)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-[var(--text-muted)]">
                  #{row.display_order} · {row.package_id}
                </div>
                <div className="mt-3">
                  <RowActions id={row.id} isActive={row.is_active} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
