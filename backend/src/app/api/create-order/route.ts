import { NextRequest, NextResponse } from 'next/server';

interface OrderPayload {
  fullName: string;
  phone: string;       // normalize edilmis +90xxx formatinda
  city: string;
  district: string;
  address: string;
  quantity: number;
  variantId: string;   // Shopify variant ID (sayisal string)
  productTitle: string;
  price: string;       // birim fiyat, ornek: "299.99"
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    const { fullName, phone, city, district, address, quantity, variantId, productTitle, price } = body;

    if (!fullName || !phone || !city || !district || !address || !quantity || !variantId) {
      return NextResponse.json({ error: 'Eksik alan.' }, { status: 400 });
    }

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] ?? fullName;
    const lastName = nameParts.slice(1).join(' ') || '-';

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN!;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

    const orderBody = {
      order: {
        line_items: [
          {
            variant_id: Number(variantId),
            quantity: Number(quantity),
            title: productTitle,
            price: price,
          },
        ],
        customer: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address,
          city: district,        // ilce -> city alanina
          province: city,        // il -> province alanina
          country: 'TR',
          phone: phone,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address,
          city: district,
          province: city,
          country: 'TR',
          phone: phone,
        },
        payment_gateway_names: ['Kapida Odeme'],
        financial_status: 'pending',
        tags: 'kapida-odeme,sms-dogrulandi',
        note: `Kapida Odeme siparisi. Tel: ${phone}`,
        send_receipt: false,
        send_fulfillment_receipt: false,
      },
    };

    const res = await fetch(
      `https://${shopifyDomain}/admin/api/2024-04/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken,
        },
        body: JSON.stringify(orderBody),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[create-order] Shopify hata:', errText);
      return NextResponse.json({ error: 'Siparis olusturulamadi.', detail: errText }, { status: 500 });
    }

    const data = await res.json();
    const order = data.order;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderName: order.name,       // #1001 gibi
      orderStatus: order.financial_status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatasi.';
    console.error('[create-order]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
