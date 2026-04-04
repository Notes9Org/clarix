"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@clarix/auth/client";
import { authLogger } from "@clarix/observability";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Registration failed");
        authLogger.warn({ email }, "Signup failed");
      } else {
        authLogger.info({ email, name }, "Signup successful");
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      authLogger.error({ email, error: String(err) }, "Signup error");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    background: "#09090b",
    color: "#fafafa",
    border: "1px solid #3f3f46",
    borderRadius: "6px",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#a1a1aa",
    fontSize: "0.85rem",
    marginBottom: "0.4rem",
    fontWeight: 500,
  };

  return (
    <>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          textAlign: "center",
          margin: "0 0 0.25rem 0",
        }}
      >
        Create Account
      </h1>
      <p
        style={{
          color: "#71717a",
          textAlign: "center",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
        }}
      >
        Get started with Clarix
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle} htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Sarah Chen"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="sarah@pharma.com"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
            minLength={8}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem",
            background: loading ? "#3f3f46" : "#fafafa",
            color: "#09090b",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          color: "#71717a",
          fontSize: "0.85rem",
          marginTop: "1.25rem",
        }}
      >
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#fafafa", textDecoration: "underline" }}>
          Sign in
        </Link>
      </p>
    </>
  );
}
