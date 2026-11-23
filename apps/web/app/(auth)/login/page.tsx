"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (authMode === "magic") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setMagicSent(true);
      }, 600);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await api.login(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.message || "Invalid email or password");
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await api.login("alex_engineer", "watchtower2026");
    router.push("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "28px 24px 32px",
      backgroundColor: "#07080D",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background Soft Flare */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "700px",
        height: "400px",
        background: "radial-gradient(circle at 50% 50%, rgba(91, 99, 211, 0.12) 0%, rgba(124, 135, 247, 0.03) 50%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Top Left Navigation Link */}
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

      {/* Main Centered Auth Form */}
      <main style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "380px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Logo Mark (Silver 3D Style) */}
        <div style={{ marginBottom: "28px", display: "inline-block" }}>
          <svg width="34" height="28" viewBox="0 0 24 20" fill="none">
            <rect x="0" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 0 2)" fill="url(#silverGrad1)" />
            <rect x="11" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 11 2)" fill="url(#silverGrad2)" />
            <defs>
              <linearGradient id="silverGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#939DB8" />
              </linearGradient>
              <linearGradient id="silverGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#B2BACD" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Heading & Subtitle */}
        <h1 style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "14px", color: "#8F9BB7", marginBottom: "28px" }}>
          First time here?{" "}
          <Link href="/register" style={{ color: "#7C87F7", fontWeight: 500 }}>
            Sign up for free.
          </Link>
        </p>

        {error && (
          <div style={{
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#FB7185",
            fontSize: "13px",
            marginBottom: "18px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Icons.AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {magicSent ? (
          <div style={{
            backgroundColor: "#111424",
            border: "1px solid rgba(114, 125, 161, 0.2)",
            borderRadius: "10px",
            padding: "28px 20px",
            textAlign: "center",
          }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "rgba(124, 135, 247, 0.15)",
              color: "#7C87F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <Icons.Mail size={20} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
              Check your email
            </h3>
            <p style={{ fontSize: "13px", color: "#8F9BB7", lineHeight: 1.5, marginBottom: "20px" }}>
              We sent a temporary sign-in link to <strong style={{ color: "#FFF" }}>{email}</strong>.
            </p>
            <button
              onClick={() => setMagicSent(false)}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", height: "38px" }}
            >
              Back to Sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            {/* Email Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#8F9BB7", marginBottom: "6px" }}>
                E-mail
              </label>
              <input
                type="text"
                placeholder="Your work e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
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
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")}
                required
              />
            </div>

            {/* Password Field (when in password mode) */}
            {authMode === "password" && (
              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#8F9BB7" }}>
                    Password
                  </label>
                  <Link href="/forgot-password" style={{ fontSize: "12px", color: "#8F9BB7" }}>
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
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
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7C87F7")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")}
                  required
                />
              </div>
            )}

            {/* Primary Button */}
            <button
              type="submit"
              className="cta-button btn"
              style={{
                width: "100%",
                height: "46px",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : authMode === "password"
                ? "Sign in"
                : "Send me a magic link"}
            </button>

            {/* Toggle Mode Link */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "password" ? "magic" : "password")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8F9BB7",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {authMode === "password" ? "Sign in using magic link" : "Sign in using password"}
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              color: "#656A7B",
              fontSize: "12px",
            }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(114, 125, 161, 0.18)" }} />
              <span>or</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(114, 125, 161, 0.18)" }} />
            </div>

            {/* Single Sign-On / Instant Demo */}
            <button
              type="button"
              onClick={handleQuickDemo}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: "rgba(17, 20, 34, 0.5)",
                border: "1px solid rgba(114, 125, 161, 0.22)",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(114, 125, 161, 0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(17, 20, 34, 0.5)")}
            >
              <span>Single Sign-On (SSO) / Demo Access</span>
            </button>
          </form>
        )}
      </main>

      {/* Footer Legal Agreement */}
      <footer style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        fontSize: "12px",
        color: "#656A7B",
        lineHeight: 1.5,
      }}>
        <div>You acknowledge that you read, and agree to our</div>
        <div>
          <Link href="/terms" style={{ color: "#8F9BB7", textDecoration: "underline" }}>Terms of Service</Link>
          {" and our "}
          <Link href="/privacy" style={{ color: "#8F9BB7", textDecoration: "underline" }}>Privacy Policy</Link>.
        </div>
      </footer>
    </div>
  );
}
