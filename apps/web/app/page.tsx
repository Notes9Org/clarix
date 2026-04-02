export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
        Hello World
      </h1>
      <p style={{ color: "#a1a1aa", fontSize: "1.125rem" }}>
        Clarix 503B — Web Dashboard
      </p>
    </main>
  );
}
