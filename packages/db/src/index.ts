import { drizzle } from "drizzle-orm/node-postgres";

import env from "../env.config";
import * as schema from "./schema";

/**
 * Clarix database client.
 * Uses node-postgres driver with Drizzle ORM.
 *
 * @see https://orm.drizzle.team/docs/connect-overview
 */
export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  schema,
  casing: "snake_case",
  logger: env.NODE_ENV === "development",
});

export * from "drizzle-orm";
