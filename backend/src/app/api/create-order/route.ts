const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    let phone = String(data.phone || "").replace(/\D/g, "");

    if (phone.startsWith("0")) {
      phone = "90" + phone.slice(1);
    }

    if (!phone.startsWith("90")) {
      phone = "90" + phone;
    }

    phone = "+" + phone;

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

    console.log("SİPARİŞ GELDİ:", data);

    const tokenRes = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
              phone: phone,
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

    console.log("SHOPIFY RESPONSE:", orderData);

    if (!orderRes.ok) {
      return Response.json(
        { success: false, error: orderData },
        { status: 500, headers: corsHeaders }
      );
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
