/**
 * Clarix Auth — Browser-side Client SDK
 *
 * Provides React hooks for authentication:
 * - `authClient.useSession()` — current session state
 * - `authClient.signIn.email()` — email + password login
 * - `authClient.signUp.email()` — registration
 * - `authClient.signOut()` — logout
 *
 * Used by both @clarix/web and shared auth utilities.
 */

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

import type { auth } from "./server";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>({
      user: {
        role: { type: "string" },
        organizationId: { type: "string" },
      },
      session: {},
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
