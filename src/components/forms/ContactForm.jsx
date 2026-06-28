'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { Input, Textarea, Honeypot } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { contactSchema, fieldErrors } from '@/lib/validation';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

const initial = {
  name: '',
  email: '',
  businessType: '',
  message: '',
  company: '',
};

export function ContactForm({ defaultPackage = '' }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | fallback | error
  const [serverMsg, setServerMsg] = useState('');

  const update = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...values, package: defaultPackage };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setStatus('success');
        trackEvent(AnalyticsEvent.CONTACT_SUBMIT, { package: defaultPackage || 'none' });
      } else if (res.status === 503) {
        // Email not configured yet — guide to WhatsApp
        setStatus('fallback');
      } else if (res.status === 422) {
        const data = await res.json();
        setErrors(data.errors || {});
        setStatus('idle');
      } else {
        const data = await res.json().catch(() => ({}));
        setServerMsg(data.error || 'Something went wrong. Please try WhatsApp.');
        setStatus('error');
      }
    } catch {
      setStatus('fallback');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-success bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="mt-4 font-display text-h3 text-text-strong">Message sent.</h3>
        <p className="measure mx-auto mt-2 text-body text-muted">
          Thank you — I&rsquo;ll get back to you within one business day. Prefer to
          talk now? Reach me directly on WhatsApp.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton source="contact-success" variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-live="polite" className="flex flex-col gap-5">
      {defaultPackage && (
        <p className="rounded-sm border border-border bg-surface px-4 py-2 font-mono text-caption text-muted">
          Selected package: <span className="text-accent">{defaultPackage}</span>
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={values.name}
          onChange={update('name')}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={update('email')}
          error={errors.email}
          required
        />
      </div>

      <Input
        label="Business type (optional)"
        name="businessType"
        placeholder="e.g. clinic, gym, startup, e-commerce"
        value={values.businessType}
        onChange={update('businessType')}
        error={errors.businessType}
      />

      <Textarea
        label="Project details"
        name="message"
        placeholder="What are you looking to build, and what outcome matters most?"
        value={values.message}
        onChange={update('message')}
        error={errors.message}
        required
      />

      <Honeypot value={values.company} onChange={update('company')} />

      {status === 'fallback' && (
        <p className="rounded-sm border border-warning bg-surface px-4 py-3 text-body-sm text-muted" role="alert">
          The contact form isn&rsquo;t fully configured yet. Please reach me on
          WhatsApp and I&rsquo;ll respond right away.
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-sm border border-error bg-surface px-4 py-3 text-body-sm text-error" role="alert">
          {serverMsg}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send message'}
          {status !== 'loading' && <Send className="h-4 w-4" aria-hidden="true" />}
        </Button>
        <WhatsAppButton source="contact-form" variant="ghost" size="lg" />
      </div>
    </form>
  );
}
