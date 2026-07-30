import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLead } from '@/lib/supabase/leads';
import { getConversationByLeadId } from '@/lib/supabase/conversations';
import { normalizePhone as toWaNumber } from '@/lib/nova/whatsapp/normalizePhone';
import { LeadStatusSelect } from './LeadStatusSelect';
import { CopyEmailButton } from './CopyEmailButton';

export const dynamic = 'force-dynamic';

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : '—';
}

const BTN =
  'rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--border-strong)]';

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--text)]">{children || '—'}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }) {
  const { id } = await params;
  const { lead, error } = await getLead(id);
  if (!error && !lead) notFound();

  const waNumber = lead ? toWaNumber(lead.phone) : '';
  const { messages } = lead ? await getConversationByLeadId(lead.id) : { messages: [] };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
        ← Back to leads
      </Link>

        {error ? (
          <p className="mt-6 text-sm text-red-500">Could not load lead: {error}</p>
        ) : (
          <>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="text-lg font-semibold text-[var(--text-strong)]">
                {lead.full_name || 'Lead'}
              </h1>
              <LeadStatusSelect id={lead.id} initialStatus={lead.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {waNumber && (
                <a className={BTN} href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp
                </a>
              )}
              {lead.email && <CopyEmailButton email={lead.email} />}
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2">
              <Field label="Email">{lead.email}</Field>
              <Field label="Phone">{lead.phone}</Field>
              <Field label="Budget">{lead.budget}</Field>
              <Field label="Timeline">{lead.timeline}</Field>
              <Field label="Source">{lead.source}</Field>
              <Field label="Status">{lead.status}</Field>
              <div className="sm:col-span-2">
                <Field label="Project description">
                  <span className="whitespace-pre-wrap break-words">{lead.project_description}</span>
                </Field>
              </div>
              <Field label="Created">{formatDateTime(lead.created_at)}</Field>
              <Field label="Updated">{formatDateTime(lead.updated_at)}</Field>
            </dl>

            <section className="mt-6">
              <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Conversation
              </h2>
              {messages.length > 0 ? (
                <div className="mt-3 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                          m.role === 'user'
                            ? 'bg-[var(--accent)] text-white'
                            : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-muted)]">
                  No transcript available.
                </div>
              )}
            </section>
          </>
        )}
    </div>
  );
}
