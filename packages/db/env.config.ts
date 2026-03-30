import { defineEnv } from "envin";
import type { Preset } from "envin/types";
import { z } from "zod";

export const preset = {
  id: "clarix-db",
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_ADMIN_EMAIL: z.email(),
    BETTER_AUTH_ADMIN_PASSWORD: z.string(),
  },
} as const satisfies Preset;

export default defineEnv({
  ...preset,
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});
