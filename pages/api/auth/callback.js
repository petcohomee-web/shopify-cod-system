// pages/api/auth/callback.js
// Shopify OAuth callback: code → access_token
// Token .shopify-token.json dosyasına kaydedilir, bir daha OAuth gerekmez.

import { saveToken } from '../../../lib/tokenStore.js';

export default async function handler(req, res) {
  const { code, shop: rawShop, hmac, state } = req.query;

  const clientId     = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const envStore     = process.env.SHOPIFY_STORE
    ?.replace(/^https?:\/\//i, '')
    .toLowerCase()
    .replace(/\/$/, '');

  // shop yoksa env'den al, varsa normalize et
  const shop = rawShop
    ? rawShop.replace(/^https?:\/\//i, '').toLowerCase().replace(/\/$/, '')
    : envStore;

  if (!code || !shop) {
    return res.status(400).json({ error: 'Eksik OAuth parametresi (code veya shop).' });
  }

  // Uyuşmazlık varsa sadece logla, durma
  if (shop !== envStore) {
    console.warn(`[auth/callback] shop uyuşmazlığı — query: "${shop}", env: "${envStore}" — devam ediliyor.`);
  }

  // Token exchange için gerçek mağaza domain'ini kullan
  const store = shop || envStore;

  try {
    const tokenRes = await fetch(
      `https://${store}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('[auth/callback] Shopify token hatası:', err);
      return res.status(500).json({ error: 'Token alınamadı.', detail: err });
    }

    const { access_token } = await tokenRes.json();
    saveToken(access_token);

    console.log('[auth/callback] Access token başarıyla kaydedildi.');
    return res.status(200).send(`
      <html><body style="font-family:sans-serif;padding:2rem;">
        <h2 style="color:#16a34a">✓ Kurulum tamamlandı!</h2>
        <p>Access token alındı ve kaydedildi. Artık siparişler oluşturulabilir.</p>
        <p><small>Bu sayfayı kapatabilirsiniz.</small></p>
      </body></html>
    `);
  } catch (err) {
    console.error('[auth/callback]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
