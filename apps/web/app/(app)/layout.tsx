"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@clarix/auth/client";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "◻" },
  { label: "Users", href: "/admin/users", icon: "◻" },
  { label: "Organizations", href: "/admin/organizations", icon: "◻" },
  { label: "Events", href: "/admin/events", icon: "◻" },
  { label: "Settings", href: "/admin/settings", icon: "◻" },
];

const PRODUCT_ITEMS = [
  { label: "Production", href: "/production" },
  { label: "Batches", href: "/batches" },
  { label: "Formulas", href: "/formulas" },
  { label: "Inventory", href: "/inventory" },
  { label: "Environmental", href: "/environmental" },
  { label: "Quality", href: "/quality" },
  { label: "Equipment", href: "/equipment" },
  { label: "Training", href: "/training" },
  { label: "Documents", href: "/documents" },
  { label: "Lab", href: "/lab" },
  { label: "Reports", href: "/reports" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={styles.loading}>
        <p style={{ color: "#71717a" }}>Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;
  const role = (user as Record<string, unknown>).role as string || "read_only";
  const isAdmin = role === "admin";

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>C</div>
          <span style={styles.logoText}>Clarix</span>
        </div>

        {/* Admin nav */}
        <nav style={styles.nav}>
          <p style={styles.sectionLabel}>Admin</p>
          {NAV_ITEMS.map((item) => {
            if (!isAdmin && item.href.startsWith("/admin")) return null;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
              >
                {item.label}
              </Link>
            );
          })}

          <div style={styles.divider} />

          <p style={styles.sectionLabel}>Modules</p>
          {PRODUCT_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={styles.userSection}>
          <div style={styles.avatar}>
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={styles.userName}>{user.name}</p>
            <p style={styles.userRole}>{role.replace(/_/g, " ")}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#09090b",
    color: "#fafafa",
  },
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#09090b",
    color: "#fafafa",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  sidebar: {
    width: 220,
    borderRight: "1px solid #1e1e21",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
    flexShrink: 0,
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 16px 12px",
    borderBottom: "1px solid #1e1e21",
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "#fafafa",
    color: "#09090b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
  },
  logoText: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: -0.3,
  },
  nav: {
    flex: 1,
    padding: "8px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#52525b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    padding: "12px 8px 4px",
    margin: 0,
  },
  navItem: {
    display: "block",
    padding: "6px 8px",
    fontSize: 13,
    color: "#a1a1aa",
    textDecoration: "none",
    borderRadius: 4,
    transition: "background 0.15s, color 0.15s",
  },
  navItemActive: {
    background: "#18181b",
    color: "#fafafa",
  },
  divider: {
    height: 1,
    background: "#1e1e21",
    margin: "8px 0",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderTop: "1px solid #1e1e21",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#27272a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0,
  },
  userName: {
    fontSize: 12,
    fontWeight: 500,
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: 11,
    color: "#52525b",
    margin: 0,
    textTransform: "capitalize",
  },
  main: {
    flex: 1,
    padding: "24px 32px",
    overflowY: "auto",
    minHeight: "100vh",
  },
};
