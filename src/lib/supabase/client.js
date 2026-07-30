import { createBrowserClient } from '@supabase/ssr';

/** Supabase client for browser/client components (anon key; auth only). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
