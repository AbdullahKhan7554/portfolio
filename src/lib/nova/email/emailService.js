/**
 * Nova Email — EmailService (minimal, Phase 1).
 *
 * The transactional path only: `sendNow` resolves a template, fills its
 * placeholders with the given variables, and sends it via the active email
 * provider IMMEDIATELY. There is deliberately NO scheduling/cron logic here —
 * that is Phase 2 (the `scheduled_emails` table exists but is not consumed yet).
 *
 * Everything is DI-friendly (provider factory, provider config, template
 * repository), mirroring how the AI layer is composed.
 */
import { createEmailProvider } from './emailProviderFactory';
import { resolveEmailProviderConfig } from './emailProviderResolver';
import { defaultTemplateRepository } from './templateRepository';
import { defaultScheduledEmailRepository } from './scheduledEmailRepository';
import { getSequence as defaultGetSequence } from './nurtureSequences';
import { EmailConfigError, TemplateNotFoundError } from './emailErrors';

/** Minimal HTML escaping for interpolated variable VALUES (not the body itself). */
function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Replace `{{ placeholder }}` tokens with escaped variable values. Unknown
 * placeholders collapse to an empty string. The template author's own HTML is
 * preserved verbatim; only the injected VALUES are escaped (anti-injection).
 * @param {string} text
 * @param {Record<string, any>} variables
 */
export function renderTemplate(text = '', variables = {}) {
  return String(text).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const v = variables[key];
    return v === undefined || v === null ? '' : esc(v);
  });
}

/**
 * @param {Object} [deps]
 * @param {(id:string, config:object)=>object} [deps.createProvider]  DI (default factory)
 * @param {{ providerId:string, apiKey:string, from:string, ok:boolean, missing:string[] }} [deps.providerConfig]
 *        Resolved provider config override; else read from `env`.
 * @param {{ getTemplate:(companyId:string, key:string)=>Promise<object|null> }} [deps.templateRepository]
 * @param {Record<string,string|undefined>} [deps.env]
 */
export function createEmailService({
  createProvider = createEmailProvider,
  providerConfig,
  templateRepository,
  scheduledEmailRepository,
  getSequence = defaultGetSequence,
  env = process.env,
} = {}) {
  const resolved = providerConfig || resolveEmailProviderConfig(env);
  const templates = templateRepository || defaultTemplateRepository(env);
  const scheduled = scheduledEmailRepository || defaultScheduledEmailRepository(env);

  function requireProviderConfigured() {
    if (!resolved.ok) {
      throw new EmailConfigError(
        `Email provider "${resolved.providerId}" is not configured: missing ${resolved.missing.join(', ')}.`,
        resolved.missing,
      );
    }
  }

  /** @private Render a template row with variables and send it via the provider. */
  async function renderAndSend(tpl, recipientEmail, variables) {
    const subject = renderTemplate(tpl.subject, variables);
    const html = renderTemplate(tpl.html_body, variables);
    const provider = createProvider(resolved.providerId, {
      apiKey: resolved.apiKey,
      from: resolved.from,
    });
    return provider.send({ to: recipientEmail, subject, html, from: resolved.from });
  }

  /**
   * Transactional send: resolve → render → send immediately.
   * @param {string} companyId
   * @param {string} templateKey
   * @param {string|string[]} recipientEmail
   * @param {Record<string, any>} [variables]
   */
  async function sendNow(companyId, templateKey, recipientEmail, variables = {}) {
    requireProviderConfigured();
    const tpl = await templates.getTemplate(companyId, templateKey);
    if (!tpl) throw new TemplateNotFoundError(companyId, templateKey);
    const result = await renderAndSend(tpl, recipientEmail, variables);
    return {
      ok: true,
      id: result.id,
      providerId: resolved.providerId,
      companyId,
      templateKey,
      to: recipientEmail,
    };
  }

  /**
   * Schedule a nurture sequence: lay down one `scheduled_emails` row per step
   * (status='pending', trigger_type='nurture', scheduled_for = now + delay,
   * template_id resolved from templateKey, metadata = variables). Writes use the
   * service-role repository (RLS lockdown). If the company has no configured
   * sequence, this is a SILENT skip — never an error.
   *
   * @param {string} companyId
   * @param {string} sequenceKey
   * @param {string} recipientEmail
   * @param {Record<string, any>} [variables]
   * @returns {Promise<{ ok:true, scheduled:number, skipped?:boolean, rows?:object[] }>}
   */
  async function scheduleSequence(companyId, sequenceKey, recipientEmail, variables = {}) {
    const steps = getSequence(companyId, sequenceKey);
    if (!steps) return { ok: true, scheduled: 0, skipped: true };

    const now = Date.now();
    const rows = [];
    for (const step of steps) {
      const tpl = await templates.getTemplate(companyId, step.templateKey);
      if (!tpl) continue; // a missing template step is skipped, not fatal
      rows.push({
        company_id: companyId,
        recipient_email: recipientEmail,
        template_id: tpl.id,
        scheduled_for: new Date(now + step.delayMinutes * 60_000).toISOString(),
        status: 'pending',
        trigger_type: 'nurture',
        metadata: variables ?? {},
      });
    }
    if (rows.length === 0) return { ok: true, scheduled: 0, skipped: true };

    const inserted = await scheduled.insert(rows);
    return { ok: true, scheduled: inserted.length, rows: inserted };
  }

  /**
   * Cron worker: send every DUE pending row (scheduled_for <= now). Each row is
   * atomically CLAIMED (pending→processing) before sending, so a crash mid-run
   * never double-sends on the next run. Each row then transitions to 'sent'
   * (with sent_at) or 'failed' (with error_message).
   *
   * @param {{ limit?:number }} [opts]
   * @returns {Promise<{ ok:true, processed:number, sent:object[], failed:object[] }>}
   */
  async function processDueBatch({ limit = 50 } = {}) {
    requireProviderConfigured();
    const due = await scheduled.findDue({ limit });
    const sent = [];
    const failed = [];

    for (const row of due) {
      // Claim first — only the worker that flips pending→processing proceeds.
      const claimed = await scheduled.claim(row.id);
      if (!claimed) continue; // already claimed by a concurrent run

      try {
        const tpl = await templates.getTemplateById(row.template_id);
        if (!tpl) throw new TemplateNotFoundError(row.company_id, `id:${row.template_id}`);
        const result = await renderAndSend(tpl, row.recipient_email, row.metadata || {});
        await scheduled.markSent(row.id);
        sent.push({ id: row.id, messageId: result.id, to: row.recipient_email });
      } catch (err) {
        await scheduled.markFailed(row.id, err?.message);
        failed.push({ id: row.id, to: row.recipient_email, error: err?.message });
      }
    }

    return { ok: true, processed: due.length, sent, failed };
  }

  return { sendNow, scheduleSequence, processDueBatch };
}
