"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { setStoredUser } from "../lib/store";
import { api } from "../lib/api";
import { User } from "../lib/types";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Always verify against the real session cookie via /api/auth/me.
    // If the backend says no session (401), clear any stale localStorage user.
    api.getMe().then((u) => {
      setUser(u);
      if (!u) setStoredUser(null); // wipe stale cached user
    });
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(11, 12, 20, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(114, 125, 161, 0.15)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* Better Stack stylized icon */}
          <svg width="22" height="18" viewBox="0 0 24 20" fill="none">
            <rect
              x="0"
              y="2"
              width="7"
              height="16"
              rx="3.5"
              transform="rotate(-15 0 2)"
              fill="#FFFFFF"
            />
            <rect
              x="11"
              y="2"
              width="7"
              height="16"
              rx="3.5"
              transform="rotate(-15 11 2)"
              fill="#FFFFFF"
            />
          </svg>
          <span
            style={{
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
            }}
          >
            Watchtower
          </span>
        </Link>

        {/* Navigation Items (Exact Better Stack structure) */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "13px",
            color: "var(--text-nav)",
          }}
        >
          <Link
            href="/#features"
            className="btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const span = e.currentTarget.querySelector("span");
              if (span) span.style.transform = "rotate(180deg)";
            }}
            onMouseLeave={(e) => {
              const span = e.currentTarget.querySelector("span");
              if (span) span.style.transform = "rotate(0deg)";
            }}
          >
            Platform{" "}
            <span
              style={{
                fontSize: "10px",
                opacity: 0.7,
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ▾
            </span>
          </Link>
          <Link
            href="/#documentation"
            className="btn-ghost"
            style={{ transition: "color 0.15s ease" }}
          >
            Documentation
          </Link>
          <Link
            href="/#pricing"
            className="btn-ghost"
            style={{ transition: "color 0.15s ease" }}
          >
            Pricing
          </Link>
          <Link
            href="/#community"
            className="btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              const span = e.currentTarget.querySelector("span");
              if (span) span.style.transform = "rotate(180deg)";
            }}
            onMouseLeave={(e) => {
              const span = e.currentTarget.querySelector("span");
              if (span) span.style.transform = "rotate(0deg)";
            }}
          >
            Community{" "}
            <span
              style={{
                fontSize: "10px",
                opacity: 0.7,
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ▾
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost"
            style={{ transition: "color 0.15s ease" }}
          >
            Live Demo
          </Link>
          <Link
            href="/#enterprise"
            className="btn-ghost"
            style={{ transition: "color 0.15s ease" }}
          >
            Enterprise
          </Link>
        </nav>

        {/* Actions (Sign in / Sign up) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <Link href="/dashboard" className="btn-pill-signup">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}
              >
                Sign in
              </Link>
              <Link href="/register" className="btn-pill-signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
