/**
 * Nova Email — Resend adapter.
 *
 * Sends via Resend's REST API (POST https://api.resend.com/emails) using `fetch`,
 * mirroring the fetch-based AI adapters (openaiCompatible) — no SDK coupling, so
 * this stays dependency-light and server-side. All Resend-specific config
 * (API key, default sender) is injected via `config`; secrets are never logged.
 *
 * Key:    RESEND_API_KEY (injected via config.apiKey)
 * Sender: EMAIL_FROM (injected via config.from), defaulting to Resend's sandbox
 *         `onboarding@resend.dev` (only delivers to the account owner's address).
 */
import { BaseEmailProvider } from './baseEmailProvider';
import { EmailConfigError, EmailSendError } from './emailErrors';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'onboarding@resend.dev';

export class ResendProvider extends BaseEmailProvider {
  get id() {
    return 'resend';
  }

  get label() {
    return 'Resend';
  }

  validateConfig() {
    const missing = [];
    if (!this.config.apiKey) missing.push('apiKey');
    return { ok: missing.length === 0, missing };
  }

  /**
   * @param {import('./baseEmailProvider').EmailMessage} message
   * @returns {Promise<import('./baseEmailProvider').EmailSendResult>}
   */
  async send({ to, subject, html, from, replyTo }) {
    const check = this.validateConfig();
    if (!check.ok) {
      throw new EmailConfigError(`Resend is not configured: missing ${check.missing.join(', ')}.`, check.missing);
    }

    const payload = {
      from: from || this.config.from || DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };
    if (replyTo) payload.reply_to = replyTo;

    let res;
    try {
      res = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new EmailSendError('resend', 'Resend request failed (network/connection).', { cause: err });
    }

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new EmailSendError('resend', `Resend send failed (${res.status}).`, {
        status: res.status,
        detail: typeof body === 'object' ? JSON.stringify(body) : String(body),
      });
    }

    return { ok: true, id: body?.id ?? null, providerId: 'resend', raw: body };
  }
}
