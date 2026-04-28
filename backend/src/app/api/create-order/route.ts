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

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE}/admin/api/2024-01/orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
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

    const result = await response.json();

    console.log("SHOPIFY RESPONSE:", result);

    if (!response.ok) {
      return Response.json(
        { success: false, error: result },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      { success: true, order: result },
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
