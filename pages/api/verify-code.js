const otpStore = global.otpStore ?? (global.otpStore = new Map());

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Telefon ve kod gerekli.' });

  const normalized = phone.trim().startsWith('0')
    ? '+90' + phone.trim().slice(1)
    : phone.trim().startsWith('+')
    ? phone.trim()
    : '+90' + phone.trim();

  const entry = otpStore.get(normalized);

  if (!entry) return res.status(400).json({ error: 'Kod bulunamadı veya süresi doldu.' });
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return res.status(400).json({ error: 'Kodun süresi doldu.' });
  }
  if (entry.code !== code.trim()) return res.status(400).json({ error: 'Kod hatalı.' });

  otpStore.delete(normalized);
  return res.status(200).json({ success: true, verified: true });
}
