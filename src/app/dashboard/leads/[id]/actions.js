'use server';

import { revalidatePath } from 'next/cache';
import { updateLeadStatus } from '@/lib/supabase/leads';

export async function updateStatusAction(id, status) {
  try {
    const result = await updateLeadStatus(id, status);
    if (result.ok) {
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/leads/[id]', 'page');
    }
    return result;
  } catch (e) {
    return { ok: false, error: e?.message || 'Update failed' };
  }
}
