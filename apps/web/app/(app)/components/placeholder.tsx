"use client";

interface PlaceholderPageProps {
  title: string;
  description: string;
  roles: string[];
  features: string[];
}

export function PlaceholderPage({ title, description, roles, features }: PlaceholderPageProps) {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>{description}</p>
      </div>

      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px 0" }}>
          <div style={iconBox}>
            <span style={{ fontSize: 20 }}>◻</span>
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "16px 0 4px" }}>Coming Soon</h2>
          <p style={{ fontSize: 13, color: "#52525b", margin: 0, textAlign: "center", maxWidth: 400 }}>
            This module is under development. Check back in the next sprint.
          </p>
        </div>

        <div style={divider} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "16px 0" }}>
          <div>
            <p style={sectionLabel}>Accessible by</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {roles.map((r) => (
                <span key={r} style={roleBadge}>{r.replace(/_/g, " ")}</span>
              ))}
            </div>
          </div>
          <div>
            <p style={sectionLabel}>Planned Features</p>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "#71717a" }}>
              {features.map((f) => (
                <li key={f} style={{ marginBottom: 4 }}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, padding: 24 };
const iconBox: React.CSSProperties = { width: 48, height: 48, borderRadius: 10, background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center" };
const divider: React.CSSProperties = { height: 1, background: "#1e1e21", margin: "16px 0" };
const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" };
const roleBadge: React.CSSProperties = { fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#141416", border: "1px solid #27272a", textTransform: "capitalize", color: "#a1a1aa" };
