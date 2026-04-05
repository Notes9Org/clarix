import { NextResponse } from "next/server";

/** Raw SQL admin user API — avoids drizzle-orm direct import issues with Turbopack */
async function getDb() {
  const { db } = await import("@clarix/db");
  return db;
}

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.execute(
      `SELECT id, name, email, email_verified, role, organization_id, banned, ban_reason, created_at, updated_at
       FROM "user" ORDER BY created_at DESC`
    );
    return NextResponse.json({ users: result });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, role: newRole, banned } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const setClauses: string[] = [`updated_at = now()`];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (newRole !== undefined) {
      setClauses.push(`role = $${paramIdx++}`);
      params.push(newRole);
    }
    if (banned !== undefined) {
      setClauses.push(`banned = $${paramIdx++}`);
      params.push(banned);
    }

    params.push(userId);
    const db = await getDb();
    await db.execute(
      `UPDATE "user" SET ${setClauses.join(", ")} WHERE id = $${paramIdx}`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update user:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
