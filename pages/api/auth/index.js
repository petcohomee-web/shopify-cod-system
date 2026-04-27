// pages/api/auth/index.js
// Shopify OAuth akışını başlatır.
// Tarayıcıda http://localhost:3000/api/auth adresine giderek kurulumu yapın.

export default function handler(req, res) {
  const store    = process.env.SHOPIFY_STORE;
  const clientId = process.env.SHOPIFY_CLIENT_ID;

  if (!store || !clientId) {
    return res.status(500).json({ error: '.env.local içinde SHOPIFY_STORE ve SHOPIFY_CLIENT_ID eksik.' });
  }

  const redirectUri = `${process.env.APP_URL}/api/auth/callback`;
  const scopes      = 'write_orders,read_orders,read_products';
  const nonce       = Math.random().toString(36).slice(2);

  const authUrl =
    `https://${store}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${nonce}`;

  res.redirect(authUrl);
}
