"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

const WatchtowerLogo = () => (
  <svg width="34" height="28" viewBox="0 0 24 20" fill="none">
    <rect
      x="0"
      y="2"
      width="7"
      height="16"
      rx="3.5"
      transform="rotate(-15 0 2)"
      fill="url(#sgr1)"
    />
    <rect
      x="11"
      y="2"
      width="7"
      height="16"
      rx="3.5"
      transform="rotate(-15 11 2)"
      fill="url(#sgr2)"
    />
    <defs>
      <linearGradient id="sgr1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#939DB8" />
      </linearGradient>
      <linearGradient id="sgr2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#B2BACD" />
      </linearGradient>
    </defs>
  </svg>
);

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

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await api.register(username.trim(), email.trim(), password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.message || "Failed to create account. Please try again.");
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
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "24px", display: "inline-block" }}>
          <WatchtowerLogo />
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
          Create your account
        </h1>
        <p style={{ fontSize: "14px", color: "#8F9BB7", marginBottom: "28px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#7C87F7", fontWeight: 500 }}>
            Sign in.
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
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Icons.AlertTriangle
              size={15}
              style={{ marginTop: "1px", flexShrink: 0 }}
            />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {/* Username */}
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
              Username
            </label>
            <input
              type="text"
              placeholder="alex_engineer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
              }
              autoComplete="username"
              required
            />
          </div>

          {/* Email */}
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
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
              }
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
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
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
                onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
                }
                autoComplete="new-password"
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
            {/* Password strength hint */}
            {password.length > 0 && (
              <div style={{ marginTop: "6px", display: "flex", gap: "4px" }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "2px",
                      backgroundColor:
                        password.length >= i * 4
                          ? password.length >= 10
                            ? "#10B981"
                            : password.length >= 7
                              ? "#F59E0B"
                              : "#EF4444"
                          : "rgba(114, 125, 161, 0.2)",
                      transition: "background-color 0.2s ease",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#8F9BB7",
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: "44px",
                  borderColor:
                    confirmPassword && confirmPassword !== password
                      ? "rgba(244, 63, 94, 0.5)"
                      : confirmPassword && confirmPassword === password
                        ? "rgba(16, 185, 129, 0.5)"
                        : "rgba(114, 125, 161, 0.25)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    confirmPassword && confirmPassword !== password
                      ? "rgba(244, 63, 94, 0.5)"
                      : confirmPassword && confirmPassword === password
                        ? "rgba(16, 185, 129, 0.5)"
                        : "rgba(114, 125, 161, 0.25)";
                }}
                autoComplete="new-password"
                required
              />
              {confirmPassword && (
                <div
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: confirmPassword === password ? "#10B981" : "#EF4444",
                  }}
                >
                  {confirmPassword === password ? (
                    <Icons.Check size={16} />
                  ) : (
                    <Icons.X size={16} />
                  )}
                </div>
              )}
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
                Creating account...
              </span>
            ) : (
              "Create account"
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
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Terms of Service
          </Link>
          {" and "}
          <Link
            href="/privacy"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
          .
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
