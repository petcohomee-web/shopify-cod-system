import twilio from 'twilio';

const otpStore = global.otpStore ?? (global.otpStore = new Map());

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Telefon numarası gerekli.' });

  const normalized = phone.trim().startsWith('0')
    ? '+90' + phone.trim().slice(1)
    : phone.trim().startsWith('+')
    ? phone.trim()
    : '+90' + phone.trim();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(normalized, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Kapıda Ödeme doğrulama kodunuz: ${code}. 5 dakika geçerlidir.`,
      from: process.env.TWILIO_PHONE,
      to: normalized,
    });
    return res.status(200).json({ success: true, phone: normalized });
  } catch (err) {
    console.error('[send-code]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
