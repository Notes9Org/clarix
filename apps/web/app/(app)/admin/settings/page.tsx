"use client";

export default function SettingsPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
          System configuration
        </p>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {/* General */}
        <div style={card}>
          <h2 style={sectionTitle}>General</h2>
          <div style={fieldRow}>
            <label style={label}>Organization Name</label>
            <input defaultValue="Clarix Demo" style={input} />
          </div>
          <div style={fieldRow}>
            <label style={label}>Slug</label>
            <input defaultValue="clarix-demo" style={input} />
          </div>
          <div style={fieldRow}>
            <label style={label}>Timezone</label>
            <select style={input} defaultValue="America/New_York">
              <option>America/New_York</option>
              <option>America/Chicago</option>
              <option>America/Los_Angeles</option>
              <option>UTC</option>
            </select>
          </div>
        </div>

        {/* Authentication */}
        <div style={card}>
          <h2 style={sectionTitle}>Authentication</h2>
          <div style={fieldRow}>
            <label style={label}>Session Timeout</label>
            <input defaultValue="24 hours" style={input} disabled />
          </div>
          <div style={fieldRow}>
            <label style={label}>Failed Login Lockout</label>
            <input defaultValue="5 attempts / 30 min" style={input} disabled />
          </div>
          <div style={fieldRow}>
            <label style={label}>Password Policy</label>
            <input defaultValue="Min 8 characters" style={input} disabled />
          </div>
        </div>

        {/* Integrations */}
        <div style={card}>
          <h2 style={sectionTitle}>Integrations</h2>
          <div style={{ color: "#3f3f46", fontSize: 13, padding: "16px 0" }}>
            No integrations configured. Coming soon: LIMS, ERP, barcode scanners.
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ ...card, borderColor: "#7f1d1d" }}>
          <h2 style={{ ...sectionTitle, color: "#ef4444" }}>Danger Zone</h2>
          <p style={{ fontSize: 12, color: "#52525b", margin: "0 0 12px" }}>
            These actions are irreversible. Proceed with caution.
          </p>
          <button style={dangerBtn} disabled>Delete Organization</button>
        </div>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, padding: 16 };
const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 600, margin: "0 0 16px" };
const fieldRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 };
const label: React.CSSProperties = { fontSize: 13, color: "#71717a", width: 160, flexShrink: 0 };
const input: React.CSSProperties = { background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "#fafafa", flex: 1, maxWidth: 300 };
const dangerBtn: React.CSSProperties = { background: "transparent", color: "#ef4444", border: "1px solid #7f1d1d", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "not-allowed", opacity: 0.5 };
