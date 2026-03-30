import { reset, seed } from "drizzle-seed";
import env from "../env.config";
import { db } from "../src";
import { organizations, users, account } from "../src/schema/auth";
import { rooms } from "../src/schema/environment";
import { equipment } from "../src/schema/equipment";

const pool = db.$client;

async function run() {
  console.log("🌱 Seeding Clarix database...");
  console.time("🌱 Database seeded");

  console.time("🧹 Cleaned up the database...");
  await reset(db, { organizations, users, account, rooms, equipment });
  console.timeEnd("🧹 Cleaned up the database...");

  await seed(db, { organizations, users, account, rooms, equipment }).refine(
    (f) => ({
      organizations: {
        columns: {
          name: f.default({ defaultValue: "Clarix Demo Facility" }),
          slug: f.default({ defaultValue: "clarix-demo" }),
          licenseNumber: f.default({ defaultValue: "FL-503B-2026-001" }),
        },
        count: 1,
      },
      users: {
        columns: {
          name: f.default({ defaultValue: "Admin User" }),
          email: f.default({
            defaultValue: env.BETTER_AUTH_ADMIN_EMAIL as string,
          }),
          emailVerified: f.default({ defaultValue: true }),
          role: f.default({ defaultValue: "admin" }),
          status: f.default({ defaultValue: "active" }),
          qualificationStatus: f.default({ defaultValue: "qualified" }),
          title: f.default({ defaultValue: "System Administrator" }),
          department: f.default({ defaultValue: "IT" }),
        },
        count: 1,
        with: {
          account: 1,
        },
      },
      account: {
        columns: {
          providerId: f.default({ defaultValue: "credential" }),
          accessToken: f.default({ defaultValue: null }),
          refreshToken: f.default({ defaultValue: null }),
          idToken: f.default({ defaultValue: null }),
          password: f.default({ defaultValue: "SEED_PLACEHOLDER" }),
        },
      },
      rooms: {
        columns: {
          name: f.valuesFromArray({
            values: [
              "ISO 5 Hood A",
              "ISO 5 Hood B",
              "ISO 7 Buffer Room",
              "ISO 8 Ante Room",
              "Warehouse",
            ],
          }),
          code: f.valuesFromArray({
            values: ["ISO5-A", "ISO5-B", "ISO7-BUF", "ISO8-ANT", "WH-01"],
            isUnique: true,
          }),
          roomType: f.valuesFromArray({
            values: [
              "compounding",
              "compounding",
              "compounding",
              "ante_room",
              "warehouse",
            ],
          }),
          isoClassification: f.valuesFromArray({
            values: [
              "iso_5",
              "iso_5",
              "iso_7",
              "iso_8",
              "unclassified",
            ],
          }),
          isActive: f.default({ defaultValue: true }),
        },
        count: 5,
      },
      equipment: {
        columns: {
          name: f.valuesFromArray({
            values: [
              "Mettler Toledo XPR206DR",
              "Thermo Orion Star A211",
              "Colonnar AF-100",
            ],
          }),
          equipmentType: f.valuesFromArray({
            values: ["balance", "ph_meter", "colonnar_filler"],
          }),
          status: f.default({ defaultValue: "qualified" }),
          isActive: f.default({ defaultValue: true }),
        },
        count: 3,
      },
    })
  );

  console.timeEnd("🌱 Database seeded");
}

try {
  await run();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await pool.end();
}
