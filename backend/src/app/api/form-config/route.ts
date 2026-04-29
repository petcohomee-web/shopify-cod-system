import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS form_config (
        id SERIAL PRIMARY KEY,
        language TEXT DEFAULT 'tr',
        fields JSONB NOT NULL,
        design JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    return NextResponse.json({
      success: true,
      message: "Form config table hazır",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { language, fields, design } = body;

    await sql`
      INSERT INTO form_config (language, fields, design)
      VALUES (${language}, ${JSON.stringify(fields)}, ${JSON.stringify(design)});
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}