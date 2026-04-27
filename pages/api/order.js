import { getAccessToken } from '../../lib/shopifyToken.js';

import crypto from 'crypto';
export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let accessToken;
  try {
    accessToken = await getAccessToken();
  } catch (err) {
    console.error('[order] Token alınamadı:', err.message);
    return res.status(503).json({ error: err.message });
  }

 const { fullName, phone, city, district, address, quantity, variantId } = req.body;
 const formattedPhone = `+90${phone.replace(/^0/, '')}`;
const metaPhone = `90${phone.replace(/^0/, '')}`;

  if (!fullName || !phone || !city || !district || !address || !quantity || !variantId) {
    return res.status(400).json({ error: 'Eksik alan.' });
  }

  const [firstName, ...rest] = fullName.trim().split(' ');
  const lastName = rest.join(' ') || '-';

  const orderBody = {
  order: {
    line_items: [
  {
    title: "Movika Göz Kalemi",
    price: "999.99",
    quantity: Number(quantity) || 1
  }
],
 
phone: formattedPhone,
      shipping_address: {
        first_name: firstName, last_name: lastName,
        address1: address, city: district, province: city, country: 'TR', phone,
      },
      billing_address: {
        first_name: firstName, last_name: lastName,
        address1: address, city: district, province: city, country: 'TR', phone,
      },
      financial_status: 'pending',
      tags: 'kapida-odeme,sms-dogrulandi',
      note: `Kapıda Ödeme. Tel: ${formattedPhone}`,
      send_receipt: false,
      send_fulfillment_receipt: false,
    },
  };

global.orders = global.orders || [];
const now = Date.now();

const userOrders = global.orders.filter(o => o.phone === formattedPhone);

// 🔥 10 dk içinde max 2 sipariş
const last10MinOrders = userOrders.filter(o => now - o.time < 10 * 60 * 1000);

if (last10MinOrders.length >= 2) {
  return res.status(429).json({
    error: "Bu numarayla kısa sürede çok fazla sipariş verildi."
  });
}

// 🔥 24 saat max 3 sipariş
const last24hOrders = userOrders.filter(o => now - o.time < 24 * 60 * 60 * 1000);

if (last24hOrders.length >= 3) {
  return res.status(429).json({
    error: "Günlük sipariş limitine ulaşıldı."
  });
}
  try {
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2024-04/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify(orderBody),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('[order] Shopify hata:', text);
      return res.status(500).json({ error: 'Sipariş oluşturulamadı.', detail: text });
    }

    const data = await response.json();
    global.orders.push({
  phone: formattedPhone,
  time: now
});
const metaRes = await fetch(`https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: data.order.id.toString(),
        action_source: "website",
     user_data: {
  ph: crypto.createHash('sha256').update(metaPhone).digest('hex'),
 fn: crypto.createHash('sha256').update(firstName.toLowerCase().trim()).digest('hex'),
ln: crypto.createHash('sha256').update(lastName.toLowerCase().trim()).digest('hex'),
ct: crypto.createHash('sha256').update(city.toLowerCase().trim()).digest('hex')
},
        custom_data: {
          currency: "TRY",
          value: data.order.total_price
        }
      }
    ],
  access_token: process.env.META_ACCESS_TOKEN
  })
});
const metaData = await metaRes.json();
console.log("META CEVAP:", metaData);
    return res.status(200).json({
      success: true,
      orderId: data.order.id,
      orderName: data.order.name,
    });
  } catch (err) {
    console.error('[order]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
