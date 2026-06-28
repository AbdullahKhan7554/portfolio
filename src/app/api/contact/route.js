import { NextResponse } from 'next/server';
import { contactSchema, fieldErrors } from '@/lib/validation';
import { sendEmail, esc } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { siteConfig } from '@/config/site';

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

  const html = `
    <h2>New enquiry — ${esc(siteConfig.brand.name)}</h2>
    <p><strong>Name:</strong> ${esc(data.name)}</p>
    <p><strong>Email:</strong> ${esc(data.email)}</p>
    <p><strong>Business type:</strong> ${esc(data.businessType || '—')}</p>
    <p><strong>Package:</strong> ${esc(data.package || '—')}</p>
    <p><strong>Message:</strong></p>
    <p>${esc(data.message).replace(/\n/g, '<br/>')}</p>
  `;

  const result = await sendEmail({
    subject: `New enquiry from ${data.name}`,
    html,
    replyTo: data.email,
  });

  if (!result.ok) {
    // Graceful: tell the client to use WhatsApp fallback
    return NextResponse.json(
      { ok: false, delivered: false, reason: result.reason },
      { status: result.reason === 'email_not_configured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
