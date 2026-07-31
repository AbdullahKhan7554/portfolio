import Link from 'next/link';
import { KnowledgeForm } from '../KnowledgeForm';

export const dynamic = 'force-dynamic';

export default async function NewKnowledgePage({ searchParams }) {
  const params = (await searchParams) || {};
  const kind = params.kind === 'faq' ? 'faq' : 'document';
  const backHref = `/dashboard/knowledge?tab=${kind === 'faq' ? 'faqs' : 'documents'}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back to knowledge
      </Link>
      <h1 className="mt-3 text-lg font-semibold text-[var(--text-strong)]">
        New {kind === 'faq' ? 'FAQ' : 'document'}
      </h1>
      <KnowledgeForm kind={kind} mode="create" />
    </div>
  );
}
