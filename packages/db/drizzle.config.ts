import { defineConfig } from "drizzle-kit";

/**
 * Drizzle ORM configuration for Clarix 503B database.
 *
 * @see https://orm.drizzle.team/docs/drizzle-config-file
 */
import env from "./env.config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
