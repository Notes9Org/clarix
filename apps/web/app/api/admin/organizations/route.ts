import { NextResponse } from "next/server";

async function getDb() {
  const { db } = await import("@clarix/db");
  return db;
}

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.execute(
      `SELECT id, name, slug, created_at, updated_at FROM organization ORDER BY created_at DESC`
    );
    return NextResponse.json({ organizations: result });
  } catch (err) {
    console.error("Failed to fetch organizations:", err);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.execute(
      `INSERT INTO organization (name, slug, created_at, updated_at) VALUES ($1, $2, now(), now()) RETURNING *`,
    );

    return NextResponse.json({ organization: result }, { status: 201 });
  } catch (err) {
    console.error("Failed to create organization:", err);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}
