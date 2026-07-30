import { createClient } from '@/lib/supabase/server';
import { DashboardNav } from './DashboardNav';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page (the only unauthenticated /dashboard route) renders bare.
  if (!user) return children;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="md:flex">
        <DashboardNav userEmail={user.email} />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
