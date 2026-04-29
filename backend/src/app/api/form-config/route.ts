import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM form_config ORDER BY id DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return NextResponse.json({});
    }

    return NextResponse.json(result.rows[0].config);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "GET error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

   await pool.query(
  "INSERT INTO form_config (config) VALUES ($1::jsonb)",
  [JSON.stringify(body)]
);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "POST error" }, { status: 500 });
  }
}