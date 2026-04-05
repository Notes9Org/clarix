"use client";

export default function EventsPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Events</h1>
        <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
          Audit trail and system events
        </p>
      </div>

      <div style={card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input placeholder="Search events..." style={input} />
          <select style={select}>
            <option value="">All types</option>
            <option value="auth">Authentication</option>
            <option value="user">User changes</option>
            <option value="batch">Batch operations</option>
            <option value="system">System events</option>
          </select>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Timestamp", "User", "Action", "Resource", "Details"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ ...td, textAlign: "center", color: "#3f3f46", padding: "40px 16px" }}>
                <p style={{ margin: "0 0 4px" }}>No events recorded yet</p>
                <p style={{ fontSize: 11, color: "#27272a", margin: 0 }}>
                  Events will appear here as users interact with the system
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, padding: 16 };
const th: React.CSSProperties = { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 500, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #1e1e21", background: "#141416" };
const td: React.CSSProperties = { padding: "10px 16px" };
const input: React.CSSProperties = { background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "#fafafa", flex: 1 };
const select: React.CSSProperties = { background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "#a1a1aa" };
