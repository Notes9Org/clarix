import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2.5rem",
        padding: "2rem",
        background: "#09090b",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #fafafa 0%, #a1a1aa 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "24px",
          color: "#09090b",
        }}
      >
        C
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Clarix
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#a1a1aa",
            marginTop: "0.75rem",
            lineHeight: 1.6,
          }}
        >
          503B Digital Batch Record &amp; Facility Management Platform.
          <br />
          Built for FDA-registered outsourcing compounding facilities.
        </p>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          href="/login"
          style={{
            padding: "0.5rem 1.25rem",
            background: "#fafafa",
            color: "#09090b",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          style={{
            padding: "0.5rem 1.25rem",
            background: "transparent",
            color: "#fafafa",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
            border: "1px solid #3f3f46",
            transition: "opacity 0.2s",
          }}
        >
          Create Account
        </Link>
      </div>

      {/* Footer */}
      <p style={{ color: "#52525b", fontSize: "0.8rem", marginTop: "2rem" }}>
        cGMP Compliant · 21 CFR Part 11 · SOC 2 Ready
      </p>
    </main>
  );
}
