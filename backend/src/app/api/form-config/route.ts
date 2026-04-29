import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS form_config (
      id SERIAL PRIMARY KEY,
      config JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function GET() {
  try {
    await ensureTable();

    const result = await pool.query(`
      SELECT config
      FROM form_config
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({});
    }

    return NextResponse.json(result.rows[0].config);
  } catch (error) {
    console.error("FORM_CONFIG_GET_ERROR:", error);
    return NextResponse.json({ error: "GET error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();

    const body = await req.json();

    await pool.query(
      `INSERT INTO form_config (config) VALUES ($1::jsonb)`,
      [JSON.stringify(body)]
    );

    return NextResponse.json({ success: true, saved: body });
  } catch (error) {
    console.error("FORM_CONFIG_POST_ERROR:", error);
    return NextResponse.json({ error: "POST error" }, { status: 500 });
  }
}