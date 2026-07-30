import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — SERVER ONLY (never import from a client
 * component). Bypasses RLS; used to read the RLS-locked `leads` table behind the
 * authenticated dashboard.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
