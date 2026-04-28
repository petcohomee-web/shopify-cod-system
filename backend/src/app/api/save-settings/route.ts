export async function POST(req: Request) {
  const data = await req.json();

  console.log("GELEN AYARLAR:", data);

  return Response.json({ success: true });
}