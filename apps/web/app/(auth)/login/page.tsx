"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  backgroundColor: "rgba(17, 20, 34, 0.75)",
  border: "1px solid rgba(114, 125, 161, 0.25)",
  borderRadius: "8px",
  padding: "0 14px",
  fontSize: "14px",
  color: "#FFFFFF",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const res = await api.login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 24px 32px",
        backgroundColor: "#07080D",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background flare */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(91, 99, 211, 0.12) 0%, rgba(124, 135, 247, 0.03) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Back link */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#8F9BB7",
            fontSize: "13px",
            fontWeight: 500,
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8F9BB7")}
        >
          <span>←</span>
          <span>Back to Watchtower</span>
        </Link>
      </div>

      {/* Form */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "380px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "24px", display: "inline-block" }}>
          <svg width="34" height="28" viewBox="0 0 24 20" fill="none">
            <rect
              x="0"
              y="2"
              width="7"
              height="16"
              rx="3.5"
              transform="rotate(-15 0 2)"
              fill="url(#lgr1)"
            />
            <rect
              x="11"
              y="2"
              width="7"
              height="16"
              rx="3.5"
              transform="rotate(-15 11 2)"
              fill="url(#lgr2)"
            />
            <defs>
              <linearGradient id="lgr1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#939DB8" />
              </linearGradient>
              <linearGradient id="lgr2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#B2BACD" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: "14px", color: "#8F9BB7", marginBottom: "28px" }}>
          New to Watchtower?{" "}
          <Link href="/register" style={{ color: "#7C87F7", fontWeight: 500 }}>
            Create a free account.
          </Link>
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "8px",
              padding: "11px 14px",
              color: "#FB7185",
              fontSize: "13px",
              marginBottom: "18px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Icons.AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {/* Email or Username */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#8F9BB7",
                marginBottom: "6px",
              }}
            >
              Email or Username
            </label>
            <input
              type="text"
              placeholder="you@company.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
              }
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label
                style={{ fontSize: "13px", fontWeight: 500, color: "#8F9BB7" }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: "12px", color: "#7C87F7" }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
                onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
                }
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#8F9BB7",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <Icons.EyeOff size={16} />
                ) : (
                  <Icons.Eye size={16} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="cta-button btn"
            style={{
              width: "100%",
              height: "46px",
              fontSize: "14px",
              fontWeight: 600,
            }}
            disabled={loading}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </main>

      <footer
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          fontSize: "12px",
          color: "#656A7B",
          lineHeight: 1.5,
        }}
      >
        <div>
          <Link
            href="/terms"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Terms of Service
          </Link>
          {" · "}
          <Link
            href="/privacy"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
