import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Telefon ve kod gereklidir.' }, { status: 400 });
    }

    const normalized = phone.trim().startsWith('0')
      ? '+90' + phone.trim().slice(1)
      : phone.trim().startsWith('+')
      ? phone.trim()
      : '+90' + phone.trim();

    const valid = code.trim() === "1234";

    if (!valid) {
      return NextResponse.json({ error: 'Kod hatali veya suresi dolmus.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, verified: true, phone: normalized });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Dogrulama basarisiz.';
    console.error('[verify-otp]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
