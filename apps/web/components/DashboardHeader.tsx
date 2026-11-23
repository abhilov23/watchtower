"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "./Icons";
import { User } from "../lib/types";
import { api } from "../lib/api";

interface DashboardHeaderProps {
  user: User | null;
  onOpenCreateModal?: () => void;
  activeCount?: number;
  downCount?: number;
}

export function DashboardHeader({
  user,
  onOpenCreateModal,
  activeCount = 0,
  downCount = 0,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await api.logout();
    router.push("/login");
  };

  const navLinks = [
    { label: "Monitors", href: "/dashboard", icon: Icons.Activity },
    { label: "Status Pages", href: "/dashboard/status-pages", icon: Icons.Globe },
    { label: "Settings", href: "/dashboard/settings", icon: Icons.Settings },
  ];

  return (
    <header style={{
      backgroundColor: "#090A12",
      borderBottom: "1px solid rgba(114, 125, 161, 0.15)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Top tier */}
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "58px",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="20" height="16" viewBox="0 0 24 20" fill="none">
              <rect x="0" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 0 2)" fill="#FFFFFF" />
              <rect x="11" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 11 2)" fill="#FFFFFF" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
              Watchtower
            </span>
          </Link>

          {/* Operational Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: downCount > 0 ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)",
            border: `1px solid ${downCount > 0 ? "rgba(244, 63, 94, 0.25)" : "rgba(16, 185, 129, 0.25)"}`,
            padding: "3px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
            color: downCount > 0 ? "#FB7185" : "#34D399",
          }}>
            <span className={`pulse-dot ${downCount > 0 ? "pulse-dot-red" : "pulse-dot-green"}`} />
            <span>{downCount > 0 ? `${downCount} Monitor Failing` : "All systems normal"}</span>
          </div>
        </div>

        {/* Right side Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {onOpenCreateModal && (
            <button className="cta-button btn btn-sm" onClick={onOpenCreateModal} style={{ height: "32px", fontSize: "13px" }}>
              <Icons.Plus size={15} /> Create monitor
            </button>
          )}

          {/* User profile & Exit button */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              height: "32px",
              padding: "0 10px",
              borderRadius: "6px",
              backgroundColor: "rgba(114, 125, 161, 0.08)",
              border: "1px solid rgba(114, 125, 161, 0.18)",
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-color)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}>
                {((user?.username || "U")[0] || "U").toUpperCase()}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF" }}>
                {user?.username || "Account"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="btn-icon"
              title="Sign out of account"
              aria-label="Sign out"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                backgroundColor: "rgba(114, 125, 161, 0.08)",
                border: "1px solid rgba(114, 125, 161, 0.18)",
                color: "#8F9BB7",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              <Icons.LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="container">
        <nav style={{ display: "flex", gap: "4px" }}>
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isActive ? "#FFFFFF" : "var(--text-nav)",
                  borderBottom: isActive ? "2px solid var(--primary-light)" : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
