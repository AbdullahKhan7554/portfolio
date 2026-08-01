-- Nova — `scheduled_emails` table (descriptive migration of live schema).
-- Nurture/transactional send queue drained by /api/nova/email-cron. FK to
-- email_templates (set null on template delete). RLS enabled with NO policies:
-- service-role only. Depends on: email_templates.

create table if not exists public.scheduled_emails (
  id              uuid primary key default gen_random_uuid(),
  company_id      text not null,
  recipient_email text not null,
  template_id     uuid references public.email_templates(id) on delete set null,
  scheduled_for   timestamptz,
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  trigger_type    text not null default 'transactional'
                    check (trigger_type in ('transactional', 'nurture')),
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  sent_at         timestamptz,
  error_message   text,
  retry_count     integer not null default 0
);

create index if not exists scheduled_emails_company_idx
  on public.scheduled_emails (company_id);
create index if not exists scheduled_emails_due_idx
  on public.scheduled_emails (status, scheduled_for);

alter table public.scheduled_emails enable row level security;

comment on table public.scheduled_emails is
  'Nova scheduled/sent email records (Phase 2 consumes this). metadata = template variables.';
