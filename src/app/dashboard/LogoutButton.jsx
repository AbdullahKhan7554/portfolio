'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await createClient().auth.signOut();
    router.push('/dashboard/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)] disabled:opacity-50"
    >
      {loading ? 'Signing out…' : 'Logout'}
    </button>
  );
}
