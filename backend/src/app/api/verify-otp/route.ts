export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (code !== "1234") {
      return Response.json({ success: false, error: "Kod yanlış" }, { status: 400 });
    }

    return Response.json({ success: true, verified: true }, { status: 200 });
  } catch {
    return Response.json({ success: false, error: "Doğrulama başarısız" }, { status: 500 });
  }
}
