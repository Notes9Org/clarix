"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@clarix/auth/client";
import { authLogger } from "@clarix/observability";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    authLogger.info({ email: session?.user?.email }, "User signed out");
    router.push("/");
  }

  if (isPending) {
    return (
      <main style={containerStyle}>
        <p style={{ color: "#71717a" }}>Loading session...</p>
      </main>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;

  return (
    <main style={containerStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          padding: "1rem 0",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Dashboard</h1>
        <button
          onClick={handleSignOut}
          style={{
            padding: "0.5rem 1rem",
            background: "transparent",
            color: "#a1a1aa",
            border: "1px solid #3f3f46",
            borderRadius: "6px",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* User Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
          Session Info
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.75rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#71717a" }}>Name</span>
          <span>{user.name}</span>

          <span style={{ color: "#71717a" }}>Email</span>
          <span>{user.email}</span>

          <span style={{ color: "#71717a" }}>Role</span>
          <span style={{ textTransform: "capitalize" }}>
            {(user as Record<string, unknown>).role
              ? String((user as Record<string, unknown>).role).replace(/_/g, " ")
              : "—"}
          </span>

          <span style={{ color: "#71717a" }}>Organization ID</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
            {(user as Record<string, unknown>).organizationId
              ? String((user as Record<string, unknown>).organizationId)
              : "—"}
          </span>

          <span style={{ color: "#71717a" }}>Session Token</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", wordBreak: "break-all" }}>
            {session.session.token?.slice(0, 24)}...
          </span>

          <span style={{ color: "#71717a" }}>Created</span>
          <span>{new Date(session.session.createdAt).toLocaleString()}</span>

          <span style={{ color: "#71717a" }}>Expires</span>
          <span>{new Date(session.session.expiresAt).toLocaleString()}</span>

          <span style={{ color: "#71717a" }}>IP Address</span>
          <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
            {session.session.ipAddress || "—"}
          </span>

          <span style={{ color: "#71717a" }}>User Agent</span>
          <span style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
            {session.session.userAgent?.slice(0, 80) || "—"}...
          </span>
        </div>
      </div>

      {/* Device Info */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "1.5rem",
          marginTop: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.5rem 0" }}>
          Device Tracking
        </h2>
        <p style={{ color: "#71717a", fontSize: "0.85rem", margin: 0 }}>
          Every login records IP address and user agent. The session is synced across all devices
          — web, iPad, and Android — through the shared Better Auth backend.
        </p>
      </div>
    </main>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  background: "#09090b",
};
