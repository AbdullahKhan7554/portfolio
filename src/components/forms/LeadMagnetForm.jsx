'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Input, Honeypot } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { leadMagnetSchema, fieldErrors } from '@/lib/validation';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';

export function LeadMagnetForm() {
  const [values, setValues] = useState({ email: '', website: '', company: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const parsed = leadMagnetSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      // Treat configured + not-configured both as captured UX; analytics only on real ok
      if (res.ok) trackEvent(AnalyticsEvent.LEAD_MAGNET_SUBMIT, {});
      setStatus('success');
    } catch {
      setStatus('success');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-success bg-bg p-5">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-success" aria-hidden="true" />
        <p className="text-body text-text">
          You&rsquo;re on the list — I&rsquo;ll send your free audit shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-live="polite"
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@business.com"
          value={values.email}
          onChange={update('email')}
          error={errors.email}
          required
        />
      </div>
      <div className="flex-1">
        <Input
          label="Website (optional)"
          name="website"
          placeholder="yourbusiness.com"
          value={values.website}
          onChange={update('website')}
          error={errors.website}
        />
      </div>
      <Honeypot value={values.company} onChange={update('company')} />
      <Button type="submit" size="lg" className="sm:mt-7" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Get my free audit'}
      </Button>
    </form>
  );
}
