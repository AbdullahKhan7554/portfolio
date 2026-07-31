import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDocument, getFaq } from '@/lib/supabase/knowledgeBase';
import { KnowledgeForm } from '../../KnowledgeForm';

export const dynamic = 'force-dynamic';

export default async function EditKnowledgePage({ params }) {
  const { kind, id } = await params;
  if (kind !== 'document' && kind !== 'faq') notFound();

  const { entry, error } = kind === 'faq' ? await getFaq(id) : await getDocument(id);
  if (!error && !entry) notFound();

  const backHref = `/dashboard/knowledge?tab=${kind === 'faq' ? 'faqs' : 'documents'}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back to knowledge
      </Link>
      {error ? (
        <p className="mt-6 text-sm text-red-500">Could not load entry: {error}</p>
      ) : (
        <>
          <h1 className="mt-3 text-lg font-semibold text-[var(--text-strong)]">
            Edit {kind === 'faq' ? 'FAQ' : 'document'}
          </h1>
          <KnowledgeForm kind={kind} mode="edit" id={id} initial={entry} />
        </>
      )}
    </div>
  );
}
