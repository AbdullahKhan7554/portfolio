'use server';

import { revalidatePath } from 'next/cache';
import * as pkg from '@/lib/supabase/salesPackages';

const LIST = '/dashboard/packages';

export async function createPackageAction(payload) {
  try {
    const res = await pkg.createPackage(payload);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Create failed' };
  }
}

export async function updatePackageAction(id, payload) {
  try {
    const res = await pkg.updatePackage(id, payload);
    if (res.ok) {
      revalidatePath(LIST);
      revalidatePath(`${LIST}/${id}`);
    }
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Update failed' };
  }
}

export async function deletePackageAction(id) {
  try {
    const res = await pkg.deletePackage(id);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Delete failed' };
  }
}

export async function togglePackageActiveAction(id, isActive) {
  try {
    const res = await pkg.setPackageActive(id, isActive);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Update failed' };
  }
}
