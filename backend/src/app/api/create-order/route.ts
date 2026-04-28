const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  const data = await req.json();

  console.log("SİPARİŞ TEST BAŞARILI:", data);

  return Response.json(
    { success: true, message: "Sipariş test olarak alındı" },
    { status: 200, headers: corsHeaders }
  );
}
