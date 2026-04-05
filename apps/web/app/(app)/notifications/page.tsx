"use client";

export default function NotificationsPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Notifications</h1>
        <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
          System alerts and messages
        </p>
      </div>

      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "48px 0" }}>
          <p style={{ fontSize: 13, color: "#3f3f46", margin: 0 }}>No notifications</p>
          <p style={{ fontSize: 11, color: "#27272a", margin: "4px 0 0" }}>
            You're all caught up
          </p>
        </div>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, padding: 16 };
