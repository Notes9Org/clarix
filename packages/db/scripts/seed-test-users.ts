/**
 * Seed test users for Better Auth verification.
 *
 * Creates a demo organization and inserts test users
 * directly into the database with bcrypt-hashed passwords.
 *
 * Run: bun packages/db/scripts/seed-test-users.ts
 */
import { db } from "../src";
import { organizations, users, account } from "../src/schema/auth";
import { scryptSync } from "crypto";

const pool = db.$client;

// Better Auth uses scrypt for password hashing internally
function hashPassword(password: string): string {
  const salt = Buffer.from(
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
  ).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function run() {
  console.log("🔐 Seeding test users for Better Auth...\n");

  // 1. Create demo organization
  const [org] = await db
    .insert(organizations)
    .values({
      name: "Clarix Demo Facility",
      slug: "clarix-demo",
      licenseNumber: "FL-503B-2026-001",
    })
    .returning();

  console.log(`✅ Organization: ${org.name} (${org.id})`);

  // 2. Define test users
  const testUsers = [
    {
      email: "admin@clarix.io",
      name: "Admin User",
      password: "Admin123!",
      role: "admin" as const,
      status: "active" as const,
      title: "System Administrator",
      department: "IT",
    },
    {
      email: "pharmacist@clarix.io",
      name: "Sarah Chen",
      password: "Pharma123!",
      role: "pharmacist_in_charge" as const,
      status: "active" as const,
      title: "Pharmacist in Charge",
      department: "Pharmacy",
    },
    {
      email: "tech@clarix.io",
      name: "James Wilson",
      password: "Tech123!",
      role: "compounding_technician" as const,
      status: "active" as const,
      title: "Compounding Technician",
      department: "Production",
    },
    {
      email: "qa@clarix.io",
      name: "Maria Rodriguez",
      password: "QA123!",
      role: "qa_specialist" as const,
      status: "active" as const,
      title: "QA Specialist",
      department: "Quality Assurance",
    },
  ];

  // 3. Insert users and accounts
  for (const u of testUsers) {
    const [user] = await db
      .insert(users)
      .values({
        organizationId: org.id,
        email: u.email,
        name: u.name,
        emailVerified: true,
        role: u.role,
        status: u.status,
        qualificationStatus: "qualified",
        title: u.title,
        department: u.department,
      })
      .returning();

    await db.insert(account).values({
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: hashPassword(u.password),
    });

    console.log(`✅ User: ${u.name} (${u.email}) [${u.role}]`);
  }

  console.log("\n📋 Test Credentials:");
  console.log("─".repeat(50));
  for (const u of testUsers) {
    console.log(`  ${u.email} / ${u.password}`);
  }
  console.log("─".repeat(50));
  console.log("\n🎉 Seed complete!");
}

try {
  await run();
} catch (e) {
  console.error("❌ Seed failed:", e);
  process.exit(1);
} finally {
  await pool.end();
}
