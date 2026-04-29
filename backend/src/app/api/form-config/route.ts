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