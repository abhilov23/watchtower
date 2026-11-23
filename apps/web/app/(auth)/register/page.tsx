"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await api.register(username, email, password);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.message || "Failed to create account");
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await api.register("alex_engineer", "alex@watchtower.dev", "demo1234");
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

      {/* Main Centered Sign-Up Container */}
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
          Sign up for free
        </h1>
        <p style={{ fontSize: "14px", color: "#8F9BB7", marginBottom: "28px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#7C87F7", fontWeight: 500 }}>
            Sign in.
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

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {/* Username Field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#8F9BB7", marginBottom: "6px" }}>
              Username
            </label>
            <input
              type="text"
              placeholder="alex_engineer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          {/* Email Field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#8F9BB7", marginBottom: "6px" }}>
              E-mail
            </label>
            <input
              type="email"
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

          {/* Password Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#8F9BB7", marginBottom: "6px" }}>
              Password
            </label>
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

          {/* Primary CTA Button */}
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
            {loading ? "Creating Account..." : "Get started in 30 seconds"}
          </button>

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

          {/* Single Sign-On / Instant Sandbox */}
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
