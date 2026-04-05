"use client";

import { useEffect, useState } from "react";

interface Org {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch("/api/admin/organizations")
      .then((r) => r.json())
      .then((d) => setOrgs(d.organizations || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    if (!name || !slug) return;
    const res = await fetch("/api/admin/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    const data = await res.json();
    if (data.organization) {
      setOrgs((prev) => [...prev, data.organization]);
      setName("");
      setSlug("");
      setShowCreate(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Organizations</h1>
          <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
            Manage tenant organizations
          </p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={createBtn}>
          + New Organization
        </button>
      </div>

      {showCreate && (
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>Create Organization</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Organization name"
              value={name}
              onChange={(e) => { setName((e.target as HTMLInputElement).value); setSlug((e.target as HTMLInputElement).value.toLowerCase().replace(/\s+/g, "-")); }}
              style={input}
            />
            <input
              placeholder="slug"
              value={slug}
              onChange={(e) => setSlug((e.target as HTMLInputElement).value)}
              style={{ ...input, width: 160 }}
            />
            <button onClick={handleCreate} style={submitBtn}>Create</button>
          </div>
        </div>
      )}

      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Name", "Slug", "ID", "Created"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: "center", color: "#52525b" }}>Loading...</td></tr>
            ) : orgs.length === 0 ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: "center", color: "#52525b" }}>No organizations</td></tr>
            ) : (
              orgs.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #1e1e21" }}>
                  <td style={td}>{o.name}</td>
                  <td style={{ ...td, color: "#71717a", fontFamily: "monospace", fontSize: 12 }}>{o.slug}</td>
                  <td style={{ ...td, color: "#3f3f46", fontFamily: "monospace", fontSize: 11 }}>{o.id.slice(0, 8)}...</td>
                  <td style={{ ...td, color: "#52525b", fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const card: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, padding: 16, marginBottom: 16 };
const tableContainer: React.CSSProperties = { background: "#18181b", border: "1px solid #1e1e21", borderRadius: 8, overflow: "hidden" };
const th: React.CSSProperties = { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 500, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #1e1e21", background: "#141416" };
const td: React.CSSProperties = { padding: "10px 16px" };
const input: React.CSSProperties = { background: "#09090b", border: "1px solid #27272a", borderRadius: 6, padding: "6px 10px", fontSize: 13, color: "#fafafa", flex: 1 };
const createBtn: React.CSSProperties = { background: "#fafafa", color: "#09090b", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" };
const submitBtn: React.CSSProperties = { background: "#fafafa", color: "#09090b", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" };
