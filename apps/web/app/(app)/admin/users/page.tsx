"use client";

import { useEffect, useState } from "react";

const CLARIX_ROLES = [
  "admin", "pharmacist_in_charge", "pharmacist", "production_manager",
  "qa_manager", "qa_specialist", "qc_technician", "compounding_technician",
  "compounding_supervisor", "warehouse_clerk", "procurement_manager",
  "training_coordinator", "maintenance_technician", "executive", "read_only",
] as const;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string | null;
  banned: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(userId: string, newRole: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setEditingId(null);
  }

  async function handleBanToggle(userId: string, banned: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, banned }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, banned } : u)));
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Users</h1>
          <p style={{ fontSize: 13, color: "#52525b", margin: "4px 0 0" }}>
            Manage user accounts, roles, and access
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            style={searchInput}
          />
        </div>
      </div>

      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Name", "Email", "Role", "Status", "Created", "Actions"].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ ...td, textAlign: "center", color: "#52525b" }}>
                  Loading users...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...td, textAlign: "center", color: "#52525b" }}>
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #1e1e21" }}>
                  <td style={td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={avatar}>{u.name?.charAt(0)?.toUpperCase()}</div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ ...td, color: "#71717a" }}>{u.email}</td>
                  <td style={td}>
                    {editingId === u.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => handleRoleChange(u.id, (e.target as HTMLSelectElement).value)}
                        style={selectStyle}
                        autoFocus
                      >
                        {CLARIX_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        style={roleBadge}
                        onClick={() => { setEditingId(u.id); setEditRole(u.role); }}
                        title="Click to change role"
                      >
                        {u.role?.replace(/_/g, " ")}
                      </span>
                    )}
                  </td>
                  <td style={td}>
                    <span style={{
                      ...statusBadge,
                      color: u.banned ? "#ef4444" : "#71717a",
                      borderColor: u.banned ? "#7f1d1d" : "#27272a",
                    }}>
                      {u.banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td style={{ ...td, color: "#52525b", fontSize: 12 }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleBanToggle(u.id, !u.banned)}
                      style={actionBtn}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: "#3f3f46", marginTop: 12 }}>
        {filtered.length} user{filtered.length !== 1 ? "s" : ""} total
      </p>
    </>
  );
}

const searchInput: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 13,
  color: "#fafafa",
  width: 200,
  outline: "none",
};

const tableContainer: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid #1e1e21",
  borderRadius: 8,
  overflow: "hidden",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 16px",
  fontSize: 11,
  fontWeight: 500,
  color: "#52525b",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  borderBottom: "1px solid #1e1e21",
  background: "#141416",
};

const td: React.CSSProperties = {
  padding: "10px 16px",
  verticalAlign: "middle",
};

const avatar: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  background: "#27272a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 600,
  flexShrink: 0,
};

const roleBadge: React.CSSProperties = {
  fontSize: 12,
  padding: "2px 8px",
  borderRadius: 4,
  background: "#141416",
  border: "1px solid #27272a",
  cursor: "pointer",
  textTransform: "capitalize",
  display: "inline-block",
};

const statusBadge: React.CSSProperties = {
  fontSize: 11,
  padding: "2px 6px",
  borderRadius: 4,
  border: "1px solid",
};

const selectStyle: React.CSSProperties = {
  background: "#09090b",
  color: "#fafafa",
  border: "1px solid #3f3f46",
  borderRadius: 4,
  padding: "2px 4px",
  fontSize: 12,
  textTransform: "capitalize",
};

const actionBtn: React.CSSProperties = {
  background: "transparent",
  color: "#71717a",
  border: "1px solid #27272a",
  borderRadius: 4,
  padding: "3px 8px",
  fontSize: 11,
  cursor: "pointer",
};
