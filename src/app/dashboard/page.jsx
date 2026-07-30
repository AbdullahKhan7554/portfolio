import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-8 text-[var(--text)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-strong)]">Leads Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Signed in as {user?.email}</p>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
