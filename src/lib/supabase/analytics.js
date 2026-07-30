import 'server-only';
import { createAdminClient } from './admin';
import { LEAD_STATUSES } from '@/lib/dashboard/leadStatus';
import { LEAD_SOURCES } from '@/lib/dashboard/leadSource';

const DAY = 86400000;
const TREND_DAYS = 30;

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

/**
 * Aggregate lead metrics for the analytics page. Single service-role select,
 * reduced in JS (row count is small). Every source/status category is present
 * even at count 0; `daily` is zero-filled over the last 30 days.
 */
export async function getLeadAnalytics() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('leads').select('status, source, created_at');
  if (error) return { data: null, error: error.message };
  const rows = data ?? [];
  const now = Date.now();

  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  const bySource = Object.fromEntries(LEAD_SOURCES.map((s) => [s, 0]));
  const perDay = new Map();
  let last7 = 0;
  let last30 = 0;

  for (const r of rows) {
    if (r.status in byStatus) byStatus[r.status] += 1;
    if (r.source in bySource) bySource[r.source] += 1;
    const age = now - new Date(r.created_at).getTime();
    if (age <= 7 * DAY) last7 += 1;
    if (age <= 30 * DAY) last30 += 1;
    const k = dayKey(r.created_at);
    perDay.set(k, (perDay.get(k) || 0) + 1);
  }

  const daily = [];
  for (let i = TREND_DAYS - 1; i >= 0; i -= 1) {
    const k = dayKey(now - i * DAY);
    daily.push({ day: k, count: perDay.get(k) || 0 });
  }

  return { data: { total: rows.length, last7, last30, byStatus, bySource, daily }, error: null };
}
