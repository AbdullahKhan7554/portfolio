'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { KNOWLEDGE_DOC_TYPES } from '@/lib/dashboard/knowledgeMeta';
import { createEntryAction, updateEntryAction } from './actions';

const field =
  'w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]';
const label = 'block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]';
const HINT =
  "Nova's search injects roughly the first sentence (~180 characters) of a matching entry, not the whole thing. Front-load the key facts — names, numbers, the direct answer — into your opening sentence, then add lists and detail after that.";
const GUIDELINE =
  'One fact, one home: keep a detail like a price, page count, or timeline in a single entry and edit it there. Repeating it across entries leaves stale copies that Nova may retrieve instead of your edit.';

function FieldHelp() {
  return (
    <div className="mt-1 flex flex-col gap-1 text-xs text-[var(--text-muted)]">
      <p>{HINT}</p>
      <p>{GUIDELINE}</p>
    </div>
  );
}

export function KnowledgeForm({ kind, mode, id, initial = {} }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const isFaq = kind === 'faq';
  const backHref = `/dashboard/knowledge?tab=${isFaq ? 'faqs' : 'documents'}`;

  const [docType, setDocType] = useState(initial.doc_type || KNOWLEDGE_DOC_TYPES[0]);
  const [title, setTitle] = useState(initial.title || '');
  const [content, setContent] = useState(initial.content || '');
  const [question, setQuestion] = useState(initial.question || '');
  const [answer, setAnswer] = useState(initial.answer || '');
  const [isActive, setIsActive] = useState(initial.is_active ?? true);

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = isFaq ? { question, answer, isActive } : { docType, title, content, isActive };
    startTransition(async () => {
      const res =
        mode === 'edit'
          ? await updateEntryAction(kind, id, payload)
          : await createEntryAction(kind, payload);
      if (res?.ok) router.push(backHref);
      else setError(res?.error || 'Save failed');
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      {isFaq ? (
        <>
          <div>
            <label className={label} htmlFor="q">Question</label>
            <input
              id="q"
              className={`${field} mt-1`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={300}
            />
          </div>
          <div>
            <label className={label} htmlFor="a">Answer</label>
            <textarea
              id="a"
              rows={8}
              className={`${field} mt-1`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={5000}
            />
            <FieldHelp />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className={label} htmlFor="type">Type</label>
            <select
              id="type"
              className={`${field} mt-1`}
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              {KNOWLEDGE_DOC_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="title">Title</label>
            <input
              id="title"
              className={`${field} mt-1`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className={label} htmlFor="content">Content</label>
            <textarea
              id="content"
              rows={10}
              className={`${field} mt-1`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={8000}
            />
            <FieldHelp />
          </div>
        </>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-[var(--text)]">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Active (included in Nova&apos;s answers)
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {pending ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
