-- Nova WhatsApp Phase 4 — idempotency column for the owner stale-lead reminder.
-- Set to now() after a reminder is sent for a lead, so /api/nova/whatsapp-stale-check
-- never re-alerts the same lead on subsequent cron runs. Additive/idempotent.

alter table public.leads
  add column if not exists stale_reminder_sent_at timestamptz;
