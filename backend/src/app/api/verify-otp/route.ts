const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("ORDER GELDİ:", data);

    return Response.json(
      { success: true, message: "Sipariş alındı", data },
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return Response.json(
      { success: false, error: "Sipariş oluşturulamadı" },
      { status: 500, headers: corsHeaders }
    );
  }
}
