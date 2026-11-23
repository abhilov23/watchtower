"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Please provide a valid password reset token.");
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
    setError(null);

    const res = await api.resetPassword(token, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.message || "Failed to reset password.");
    }
  };

  return (
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
      {/* Brand Icon */}
      <div style={{ marginBottom: "28px", display: "inline-block" }}>
        <svg width="34" height="28" viewBox="0 0 24 20" fill="none">
          <rect
            x="0"
            y="2"
            width="7"
            height="16"
            rx="3.5"
            transform="rotate(-15 0 2)"
            fill="url(#silverGrad1)"
          />
          <rect
            x="11"
            y="2"
            width="7"
            height="16"
            rx="3.5"
            transform="rotate(-15 11 2)"
            fill="url(#silverGrad2)"
          />
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

      <h1
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}
      >
        Set new password
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#8F9BB7",
          lineHeight: 1.5,
          marginBottom: "32px",
        }}
      >
        Your new password must be at least 6 characters long.
      </p>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: "20px",
            borderRadius: "6px",
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.25)",
            color: "#FB7185",
            fontSize: "13px",
            textAlign: "left",
          }}
        >
          {error}
        </div>
      )}

      {success ? (
        <div
          className="card"
          style={{
            padding: "32px 24px",
            textAlign: "center",
            backgroundColor: "rgba(13, 15, 26, 0.75)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icons.CheckCircle2 size={24} />
          </div>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "8px",
            }}
          >
            Password updated
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#8F9BB7",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Your account password has been reset successfully. You can now log
            in with your new credentials.
          </p>
          <Link
            href="/login"
            className="cta-button btn"
            style={{
              width: "100%",
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Sign in to Watchtower
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {!tokenFromUrl && (
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
                Reset Token
              </label>
              <input
                type="text"
                placeholder="Enter reset token from email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  backgroundColor: "rgba(17, 20, 34, 0.75)",
                  border: "1px solid rgba(114, 125, 161, 0.25)",
                  borderRadius: "8px",
                  padding: "0 14px",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  color: "#FFFFFF",
                  outline: "none",
                }}
                required
              />
            </div>
          )}

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
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: "rgba(17, 20, 34, 0.75)",
                border: "1px solid rgba(114, 125, 161, 0.25)",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "14px",
                color: "#FFFFFF",
                outline: "none",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#8F9BB7",
                marginBottom: "6px",
              }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: "rgba(17, 20, 34, 0.75)",
                border: "1px solid rgba(114, 125, 161, 0.25)",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "14px",
                color: "#FFFFFF",
                outline: "none",
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="cta-button btn"
            style={{
              width: "100%",
              height: "46px",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
            disabled={loading}
          >
            {loading ? "Updating password..." : "Update password"}
          </button>

          <div style={{ textAlign: "center" }}>
            <Link href="/login" style={{ fontSize: "13px", color: "#8F9BB7" }}>
              Back to Sign in
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
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
      {/* Background Soft Flare */}
      <div
        style={{
          position: "absolute",
          top: "20%",
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

      <Suspense
        fallback={
          <div
            style={{
              textAlign: "center",
              color: "#8F9BB7",
              position: "relative",
              zIndex: 1,
            }}
          >
            Loading password reset...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      {/* Minimal Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#555E75",
          maxWidth: "680px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <span>© {new Date().getFullYear()} Watchtower Inc.</span>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/#terms" style={{ color: "#555E75" }}>
            Terms
          </Link>
          <Link href="/#privacy" style={{ color: "#555E75" }}>
            Privacy
          </Link>
          <Link href="/#security" style={{ color: "#555E75" }}>
            Security
          </Link>
        </div>
      </footer>
    </div>
  );
}
