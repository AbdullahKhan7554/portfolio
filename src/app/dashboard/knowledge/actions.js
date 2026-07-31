'use server';

import { revalidatePath } from 'next/cache';
import * as kb from '@/lib/supabase/knowledgeBase';

const LIST = '/dashboard/knowledge';

export async function createEntryAction(kind, payload) {
  try {
    const res = kind === 'faq' ? await kb.createFaq(payload) : await kb.createDocument(payload);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Create failed' };
  }
}

export async function updateEntryAction(kind, id, payload) {
  try {
    const res = kind === 'faq' ? await kb.updateFaq(id, payload) : await kb.updateDocument(id, payload);
    if (res.ok) {
      revalidatePath(LIST);
      revalidatePath(`${LIST}/${kind}/${id}`);
    }
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Update failed' };
  }
}

export async function deleteEntryAction(kind, id) {
  try {
    const res = kind === 'faq' ? await kb.deleteFaq(id) : await kb.deleteDocument(id);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Delete failed' };
  }
}

export async function toggleActiveAction(kind, id, isActive) {
  try {
    const res =
      kind === 'faq' ? await kb.setFaqActive(id, isActive) : await kb.setDocumentActive(id, isActive);
    if (res.ok) revalidatePath(LIST);
    return res;
  } catch (e) {
    return { ok: false, error: e?.message || 'Update failed' };
  }
}
