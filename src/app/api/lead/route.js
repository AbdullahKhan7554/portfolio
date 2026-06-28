import { NextResponse } from 'next/server';
import { leadMagnetSchema, fieldErrors } from '@/lib/validation';
import { sendEmail, esc } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(request) {
  const ip = clientIp(request);
  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = leadMagnetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.company) return NextResponse.json({ ok: true, delivered: false });

  const result = await sendEmail({
    subject: `New free-audit request: ${data.email}`,
    html: `
      <h2>Free website audit request</h2>
      <p><strong>Email:</strong> ${esc(data.email)}</p>
      <p><strong>Website:</strong> ${esc(data.website || '—')}</p>
    `,
    replyTo: data.email,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, delivered: false, reason: result.reason },
      { status: result.reason === 'email_not_configured' ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
