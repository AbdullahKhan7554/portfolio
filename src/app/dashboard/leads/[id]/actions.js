'use server';

import { revalidatePath } from 'next/cache';
import { updateLeadStatus } from '@/lib/supabase/leads';

export async function updateStatusAction(id, status) {
  const result = await updateLeadStatus(id, status);
  if (result.ok) {
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/leads/${id}`);
  }
  return result;
}
