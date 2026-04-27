// Basit in-memory OTP store (production'da Redis kullanin)
// Key: telefon numarasi  Value: { code, expiresAt }
import NodeCache from 'node-cache';

// TTL: 300 saniye (5 dakika)
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export function saveOtp(phone: string, code: string) {
  otpCache.set(phone, code);
}

export function verifyOtp(phone: string, code: string): boolean {
  const stored = otpCache.get<string>(phone);
  if (!stored) return false;
  if (stored !== code) return false;
  otpCache.del(phone); // kullanildiktan sonra sil
  return true;
}
