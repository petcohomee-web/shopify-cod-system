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
    const { code } = await req.json();

    if (code !== "1234") {
      return Response.json(
        { success: false, error: "Kod yanlış" },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      { success: true, verified: true },
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return Response.json(
      { success: false, error: "Doğrulama başarısız" },
      { status: 500, headers: corsHeaders }
    );
  }
}
