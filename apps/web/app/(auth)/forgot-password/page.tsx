"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugLink, setDebugLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await api.requestPasswordReset(email);
    setLoading(false);
    if (res.debugLink) {
      setDebugLink(res.debugLink);
    }
    setSubmitted(true);
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

      {/* Main Centered Password Reset Container */}
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
        {/* Logo Mark (Silver 3D Style) */}
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

        {/* Heading & Subtitle */}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Reset password
        </h1>
        <p style={{ fontSize: "14px", color: "#8F9BB7", marginBottom: "28px" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#7C87F7", fontWeight: 500 }}>
            Sign in.
          </Link>
        </p>

        {submitted ? (
          <div
            style={{
              backgroundColor: "#111424",
              border: "1px solid rgba(114, 125, 161, 0.2)",
              borderRadius: "10px",
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(124, 135, 247, 0.15)",
                color: "#7C87F7",
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
              Check your inbox
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#8F9BB7",
                lineHeight: 1.6,
                marginBottom: "22px",
              }}
            >
              We've dispatched password reset instructions to{" "}
              <strong style={{ color: "#FFF" }}>{email}</strong>.
            </p>
            {debugLink && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "10px 14px",
                  backgroundColor: "rgba(91, 99, 211, 0.12)",
                  border: "1px solid rgba(124, 135, 247, 0.3)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    color: "#7C87F7",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Development Mode Direct Link:
                </div>
                <Link
                  href={debugLink}
                  style={{
                    color: "#FFF",
                    textDecoration: "underline",
                    wordBreak: "break-all",
                  }}
                >
                  Click here to reset password directly →
                </Link>
              </div>
            )}
            <Link
              href="/login"
              className="btn btn-secondary"
              style={{ width: "100%", height: "42px" }}
            >
              Back to Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#8F9BB7",
                  marginBottom: "6px",
                }}
              >
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
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(114, 125, 161, 0.25)")
                }
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
              {loading ? "Sending..." : "Send reset instructions"}
            </button>

            <div style={{ textAlign: "center" }}>
              <Link
                href="/login"
                style={{ fontSize: "13px", color: "#8F9BB7" }}
              >
                ← Return to Sign in
              </Link>
            </div>
          </form>
        )}
      </main>

      {/* Footer Legal Agreement */}
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
        <div>You acknowledge that you read, and agree to our</div>
        <div>
          <Link
            href="/terms"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Terms of Service
          </Link>
          {" and our "}
          <Link
            href="/privacy"
            style={{ color: "#8F9BB7", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
          .
        </div>
      </footer>
    </div>
  );
}
