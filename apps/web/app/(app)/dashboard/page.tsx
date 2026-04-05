"use client";

import { authClient } from "@clarix/auth/client";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = (user as Record<string, unknown>)?.role as string || "—";

  const stats = [
    { label: "Active Users", value: "—", sub: "Last 24 hours" },
    { label: "Total Users", value: "—", sub: "All time" },
    { label: "Organizations", value: "1", sub: "Active" },
    { label: "Sessions", value: "—", sub: "Last 7 days" },
  ];

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          Welcome back, {user?.name || "—"}
        </h1>
        <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <p style={{ fontSize: 11, color: "#71717a", margin: 0, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Session info + Recent activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Current Session */}
        <div style={card}>
          <h2 style={cardTitle}>Current Session</h2>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 13 }}>
            <span style={dimText}>Name</span>
            <span>{user?.name}</span>
            <span style={dimText}>Email</span>
            <span>{user?.email}</span>
            <span style={dimText}>Role</span>
            <span style={{ textTransform: "capitalize" }}>{role.replace(/_/g, " ")}</span>
            <span style={dimText}>Session Token</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}>
              {session?.session?.token?.slice(0, 20)}...
            </span>
            <span style={dimText}>IP Address</span>
            <span style={{ fontFamily: "monospace", fontSize: 12 }}>
              {session?.session?.ipAddress || "—"}
            </span>
            <span style={dimText}>Expires</span>
            <span style={{ fontSize: 12 }}>
              {session?.session?.expiresAt
                ? new Date(session.session.expiresAt).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>

        {/* Recent Activity placeholder */}
        <div style={card}>
          <h2 style={cardTitle}>Recent Activity</h2>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 160,
            color: "#3f3f46",
            fontSize: 13,
          }}>
            <p>Activity log will appear here</p>
          </div>
        </div>
      </div>
    </>
  );
}

const card: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #1e1e21",
  borderRadius: 8,
  padding: 16,
};

const cardTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  margin: "0 0 12px",
};

const dimText: React.CSSProperties = {
  color: "#52525b",
};
