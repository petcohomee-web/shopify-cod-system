// lib/shopifyToken.js
// client_id + client_secret → access_token (client_credentials grant)
// Her çağrıda token alır. Shopify kısa süreli token döndürüyorsa
// basit in-memory cache ile tekrar istek atmaktan kaçınır.

let cached = null; // { token, expiresAt }

export async function getAccessToken() {
  if (cached && Date.now() < cached.expiresAt) {
    return cached.token;
  }

  const store        = process.env.SHOPIFY_STORE?.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const clientId     = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!store || !clientId || !clientSecret) {
    throw new Error('SHOPIFY_STORE, SHOPIFY_CLIENT_ID veya SHOPIFY_CLIENT_SECRET eksik.');
  }

  const res = await fetch(`https://${store}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     clientId,
      client_secret: clientSecret,
      grant_type:    'client_credentials',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token alınamadı (${res.status}): ${text}`);
  }

  const data = await res.json();
  const token = data.access_token;

  if (!token) throw new Error('Yanıtta access_token yok: ' + JSON.stringify(data));

  // expires_in varsa kullan, yoksa 55 dakika varsayılan
  const ttl = (data.expires_in ?? 3300) * 1000;
  cached = { token, expiresAt: Date.now() + ttl - 30000 }; // 30sn erken yenile

  console.log('[shopifyToken] Yeni token alındı.');
  return token;
}
