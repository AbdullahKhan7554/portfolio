import { NextResponse } from 'next/server';
import { contactSchema, fieldErrors } from '@/lib/validation';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { createLeadWriter } from '@/lib/nova/data/leadWriter';
import { createEmailService } from '@/lib/nova/email/emailService';
import { novaConfig } from '@/config/nova.config';

export async function POST(request) {
  // Rate limit
  const ip = clientIp(request);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    );
  }

  // Parse + validate
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  // Honeypot — silently accept to not tip off bots
  if (data.company) return NextResponse.json({ ok: true, delivered: false });

  const saved = await createLeadWriter().persist(
    {
      fullName: data.name,
      email: data.email,
      projectDescription: data.message,
      businessType: data.businessType,
      package: data.package,
    },
    { companyId: novaConfig.companyId, source: 'contact_form' },
  );

  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, delivered: false, reason: 'not_configured' },
      { status: 503 },
    );
  }

  try {
    const owner = process.env.LEAD_NOTIFICATION_EMAIL;
    if (owner) {
      await createEmailService().sendNow(novaConfig.companyId, 'internal_lead_notification', owner, {
        name: data.name,
        email: data.email,
        phone: 'Not provided',
        company: '—',
        businessType: data.businessType || '—',
        service: 'Contact form enquiry',
        projectDescription: data.message,
        budget: '—',
        timeline: '—',
      });
    }
  } catch (err) {
    console.error('[Contact] notification failed (non-fatal)', err?.message);
  }

  return NextResponse.json({ ok: true, delivered: true });
}
