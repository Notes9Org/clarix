export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
