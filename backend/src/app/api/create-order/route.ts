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

    console.log("SİPARİŞ GELDİ:", data);

    // 🔥 1. TOKEN AL (CLIENT ID + SECRET)
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

    console.log("TOKEN:", accessToken);

    if (!accessToken) {
      return Response.json(
        { success: false, error: "Token alınamadı" },
        { status: 500, headers: corsHeaders }
      );
    }

    // 🔥 2. SHOPIFY SİPARİŞ OLUŞTUR
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
                quantity: data.quantity,
              },
            ],
            customer: {
              first_name: data.fullName,
              phone: data.phone,
            },
            shipping_address: {
              name: data.fullName,
              phone: data.phone,
              address1: data.address,
              city: data.city,
              country: "Turkey",
            },
            financial_status: "pending",
            note: "Kapıda ödeme siparişi",
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
