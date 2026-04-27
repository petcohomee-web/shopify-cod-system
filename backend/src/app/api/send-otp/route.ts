import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { saveOtp } from '@/lib/otpStore';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\+?[0-9\s\-]{10,15}$/.test(phone.trim())) {
      return NextResponse.json({ error: 'Gecersiz telefon numarasi.' }, { status: 400 });
    }

    // Turkiye numaralarini normalize et: 05xx -> +905xx
    const normalized = phone.trim().startsWith('0')
      ? '+90' + phone.trim().slice(1)
      : phone.trim().startsWith('+')
      ? phone.trim()
      : '+90' + phone.trim();

    const code = generateCode();
    saveOtp(normalized, code);

    await client.messages.create({
      body: `Kapida Odeme dogrulama kodunuz: ${code}. Bu kod 5 dakika gecerlidir.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: normalized,
    });

    return NextResponse.json({ success: true, phone: normalized });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'SMS gonderilemedi.';
    console.error('[send-otp]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
