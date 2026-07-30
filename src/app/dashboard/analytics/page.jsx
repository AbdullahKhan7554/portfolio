import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getLeadAnalytics } from '@/lib/supabase/analytics';
import { LogoutButton } from '../LogoutButton';

export const dynamic = 'force-dynamic';

const card = 'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5';
const label = 'text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';

function StatCard({ label: l, value }) {
  return (
    <div className={card}>
      <div className={label}>{l}</div>
      <div className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{value}</div>
    </div>
  );
}

function BarRow({ label: l, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-sm text-[var(--text)]">{l}</div>
      <div className="h-6 flex-1 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg)]">
        <div
          className="h-full rounded-[var(--radius-sm)] bg-[var(--accent)]"
          style={{ width: `${pct}%`, minWidth: value ? '2px' : '0' }}
        />
      </div>
      <div className="w-8 shrink-0 text-right text-sm tabular-nums text-[var(--text-muted)]">{value}</div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getLeadAnalytics();

  const sourceEntries = Object.entries(data?.bySource ?? {});
  const statusEntries = Object.entries(data?.byStatus ?? {});
  const sourceMax = Math.max(1, ...sourceEntries.map(([, v]) => v));
  const statusMax = Math.max(1, ...statusEntries.map(([, v]) => v));
  const trendMax = Math.max(1, ...(data?.daily ?? []).map((d) => d.count));

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-8 text-[var(--text)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-strong)]">Lead Analytics</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Signed in as {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
              ← Leads
            </Link>
            <LogoutButton />
          </div>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-red-500">Could not load analytics: {error}</p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Total leads" value={data.total} />
              <StatCard label="Last 7 days" value={data.last7} />
              <StatCard label="Last 30 days" value={data.last30} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className={card}>
                <h2 className={label}>Leads by source</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {sourceEntries.map(([k, v]) => (
                    <BarRow key={k} label={k} value={v} max={sourceMax} />
                  ))}
                </div>
              </section>
              <section className={card}>
                <h2 className={label}>Leads by status</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {statusEntries.map(([k, v]) => (
                    <BarRow key={k} label={k} value={v} max={statusMax} />
                  ))}
                </div>
              </section>
            </div>

            <section className={`mt-6 ${card}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className={label}>Leads over time (30 days)</h2>
                <span className="text-xs text-[var(--text-muted)]">Limited data so far</span>
              </div>
              <div className="mt-4 flex items-end gap-1">
                {data.daily.map((d) => {
                  const h = trendMax > 0 ? Math.round((d.count / trendMax) * 100) : 0;
                  return (
                    <div key={d.day} className="flex h-32 flex-1 items-end" title={`${d.day}: ${d.count}`}>
                      <div
                        className="w-full rounded-t-[2px] bg-[var(--accent)]"
                        style={{ height: `${h}%`, minHeight: d.count ? '2px' : '0' }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-[var(--text-muted)]">
                <span>{data.daily[0]?.day}</span>
                <span>{data.daily[data.daily.length - 1]?.day}</span>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
