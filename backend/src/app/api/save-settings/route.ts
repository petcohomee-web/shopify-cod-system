import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const body = await req.json();
  const { fee, upsell, sms } = body;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        fee TEXT,
        upsell TEXT,
        sms TEXT
      );
    `;

    await sql`
      INSERT INTO settings (fee, upsell, sms)
      VALUES (${fee}, ${upsell}, ${sms});
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { sql } from "@neondatabase/serverless";

// 👇 EKLE
export async function GET() {
  try {
    const result = await sql`SELECT * FROM settings LIMIT 1`;

    return NextResponse.json({
      success: true,
      data: result[0] || null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "db error" },
      { status: 500 }
    );
  }
}