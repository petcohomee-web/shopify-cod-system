import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Form config API çalışıyor",
  });
}