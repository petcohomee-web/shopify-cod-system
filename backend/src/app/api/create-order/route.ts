import crypto from "crypto";

const phoneCache = new Map<string, number>();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function hash(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const now = Date.now();

    let phone = String(data.phone || "").replace(/\D/g, "");

    if (phone.startsWith("0")) phone = "90" + phone.slice(1);
    if (!phone.startsWith("90")) phone = "90" + phone;

    phone = "+" + phone;

    const lastOrderTime = phoneCache.get(phone);

    if (lastOrderTime && now - lastOrderTime < 10 * 60 * 1000) {
      return Response.json(
        {
          success: false,
          error: "Bu numara ile kısa süre içinde tekrar sipariş verilemez.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const fullName = String(data.fullName || "").trim();
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const noteText = `
Kapıda ödeme siparişi

İl: ${data.city}
İlçe: ${data.district}
Adres: ${data.address}
Telefon: ${phone}
`;

    const tokenRes = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  test_event_code: "TEST73658",
  data: [
          client_id: process.env.SHOPIFY_CLIENT_ID,
          client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.json(
        { success: false, error: "Token alınamadı", details: tokenData },
        { status: 500, headers: corsHeaders }
      );
    }

    const orderRes = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            line_items: [
              {
                variant_id: data.variantId,
                quantity: Number(data.quantity) || 1,
              },
            ],
            shipping_address: {
              first_name: firstName,
              last_name: lastName,
              name: fullName,
              phone,
              address1: data.address,
              city: data.city,
              country: "Turkey",
            },
            financial_status: "pending",
            note: noteText,
            tags: "Kapıda Ödeme",
          },
        }),
      }
    );

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      return Response.json(
        { success: false, error: orderData },
        { status: 500, headers: corsHeaders }
      );
    }

    phoneCache.set(phone, now);

    // Meta CAPI Purchase
    try {
      if (process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN) {
        await fetch(
          `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: [
                {
                  event_name: "Purchase",
                  event_time: Math.floor(Date.now() / 1000),
                  action_source: "website",
                  event_source_url: "https://movika.co/",
                  user_data: {
                    ph: [hash(phone.replace(/\D/g, ""))],
                    fn: firstName ? [hash(firstName)] : undefined,
                    ln: lastName !== "-" ? [hash(lastName)] : undefined,
                    ct: data.city ? [hash(String(data.city))] : undefined,
                    country: [hash("tr")],
                  },
                  custom_data: {
                    currency: "TRY",
                    value: 999.99,
                    order_id: String(orderData?.order?.id || ""),
                    content_type: "product",
                    contents: [
                      {
                        id: String(data.variantId),
                        quantity: Number(data.quantity) || 1,
                      },
                    ],
                  },
                },
              ],
            }),
          }
        );
      }
    } catch (metaError) {
      console.error("META CAPI HATA:", metaError);
    }

    return Response.json(
      { success: true, order: orderData },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("HATA:", error);

    return Response.json(
      { success: false, error: "Server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}