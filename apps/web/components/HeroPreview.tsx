"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "./Icons";

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<"Day" | "Week" | "Month" | "Quarter">("Day");
  const [secondsAgo, setSecondsAgo] = useState(14);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; time: string; latency: string } | null>(null);

  // Live heartbeat ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 29 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dataPoints = [
    { x: 50, y: 82, time: "12:00 PM", latency: "28 ms" },
    { x: 120, y: 76, time: "1:00 PM", latency: "34 ms" },
    { x: 190, y: 72, time: "2:00 PM", latency: "31 ms" },
    { x: 260, y: 80, time: "3:00 PM", latency: "42 ms" },
    { x: 330, y: 78, time: "4:00 PM", latency: "36 ms" },
    { x: 420, y: 32, time: "5:21 PM", latency: "1,240 ms (Spike)" },
    { x: 500, y: 65, time: "6:00 PM", latency: "45 ms" },
    { x: 580, y: 52, time: "7:00 PM", latency: "29 ms" },
  ];

  return (
    <div style={{
      maxWidth: "1060px",
      margin: "48px auto 0",
      position: "relative",
    }}>
      {/* Background Soft Flare */}
      <div style={{
        position: "absolute",
        top: "-80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        height: "360px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(91, 99, 211, 0.28) 0%, rgba(124, 135, 247, 0.1) 45%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Main Dashboard Preview Mockup Window */}
      <div className="card-glow-hover" style={{
        position: "relative",
        zIndex: 1,
        backgroundColor: "#0D0F1A",
        borderRadius: "16px",
        border: "1px solid rgba(114, 125, 161, 0.24)",
        boxShadow: "0 30px 80px -20px rgba(0, 0, 0, 0.95), 0 0 50px rgba(91, 99, 211, 0.15)",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        textAlign: "left",
      }}>
        {/* LEFT SIDEBAR (Exact Better Stack Dashboard) */}
        <aside style={{
          backgroundColor: "#090A12",
          borderRight: "1px solid rgba(114, 125, 161, 0.15)",
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}>
          {/* Logo / Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 10px 18px", borderBottom: "1px solid rgba(114, 125, 161, 0.12)", marginBottom: "8px" }}>
            <svg width="18" height="15" viewBox="0 0 24 20" fill="none">
              <rect x="0" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 0 2)" fill="#FFFFFF" />
              <rect x="11" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 11 2)" fill="#FFFFFF" />
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>Watchtower</span>
          </div>

          {[
            { label: "Incidents", icon: Icons.AlertTriangle, active: false },
            { label: "Who's on-call", icon: Icons.User, active: false },
            { label: "Escalation policies", icon: Icons.Shield, active: false },
            { label: "Monitors", icon: Icons.Activity, active: true },
            { label: "Heartbeats", icon: Icons.Zap, active: false },
            { label: "Status pages", icon: Icons.Globe, active: false },
            { label: "Integrations", icon: Icons.Server, active: false },
            { label: "Reporting", icon: Icons.BarChart3, active: false },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: item.active ? 600 : 400,
                  backgroundColor: item.active ? "rgba(114, 125, 161, 0.18)" : "transparent",
                  color: item.active ? "#FFFFFF" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={15} color={item.active ? "#FFFFFF" : "var(--text-muted)"} />
                <span>{item.label}</span>
              </div>
            );
          })}

          {/* User profile at bottom of sidebar */}
          <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(114, 125, 161, 0.12)", display: "flex", alignItems: "center", gap: "10px", paddingLeft: "8px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--primary-color)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
              C
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Cameron (On-call)
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD SCREEN (Exact Better Stack Hero Preview) */}
        <div style={{ padding: "28px 32px" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>‹ Monitors</span>
          </div>

          {/* Title Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="pulse-dot pulse-dot-green" />
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF" }}>
                  time.com/status
                </h3>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Up · Checked every 30 seconds
              </p>
            </div>

            {/* Quick action buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: "12px" }}>
                <Icons.Bell size={13} /> Send a test alert
              </button>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: "12px" }}>
                <Icons.Pause size={13} /> Pause
              </button>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: "12px" }}>
                <Icons.Settings size={13} /> Configure
              </button>
            </div>
          </div>

          {/* THREE KPI STAT CARDS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
            marginBottom: "24px",
          }}>
            <div className="card-glow-hover" style={{ backgroundColor: "#141728", borderRadius: "8px", border: "1px solid rgba(114, 125, 161, 0.16)", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Monitor is up for</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>4 days 1 hour 4 minutes</div>
            </div>

            <div className="card-glow-hover" style={{ backgroundColor: "#141728", borderRadius: "8px", border: "1px solid rgba(114, 125, 161, 0.16)", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Last checked</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#34D399", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="pulse-dot pulse-dot-green" style={{ width: "6px", height: "6px" }} />
                <span>{secondsAgo} seconds ago</span>
              </div>
            </div>

            <div className="card-glow-hover" style={{ backgroundColor: "#141728", borderRadius: "8px", border: "1px solid rgba(114, 125, 161, 0.16)", padding: "14px 18px" }}>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Incidents</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>17</div>
            </div>
          </div>

          {/* RESPONSE TIMES GRAPH SECTION */}
          <div style={{
            backgroundColor: "#141728",
            borderRadius: "10px",
            border: "1px solid rgba(114, 125, 161, 0.16)",
            padding: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Response times</span>
                <span style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  backgroundColor: "rgba(114, 125, 161, 0.12)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(114, 125, 161, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  🇺🇸 United States ▾
                </span>
              </div>

              {/* Time Range Tabs */}
              <div style={{ display: "flex", backgroundColor: "rgba(114, 125, 161, 0.1)", borderRadius: "6px", padding: "2px" }}>
                {(["Day", "Week", "Month", "Quarter"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: activeTab === tab ? "rgba(114, 125, 161, 0.25)" : "transparent",
                      color: activeTab === tab ? "#FFFFFF" : "var(--text-dim)",
                      border: "none",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Wave Chart with interactive hover & animated radar pulse */}
            <div style={{ width: "100%", height: "140px", position: "relative" }}>
              <svg
                viewBox="0 0 600 130"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
                onMouseLeave={() => setHoverPoint(null)}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B63D3" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#5B63D3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal gridlines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(114, 125, 161, 0.1)" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="600" y2="65" stroke="rgba(114, 125, 161, 0.1)" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(114, 125, 161, 0.1)" />

                {/* Area and Line */}
                <path
                  d="M 0 85 Q 70 80 140 70 T 280 85 T 420 32 T 520 60 T 600 50 L 600 110 L 0 110 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0 85 Q 70 80 140 70 T 280 85 T 420 32 T 520 60 T 600 50"
                  fill="none"
                  stroke="#7C87F7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Spike Data Point with Expanding Ring */}
                <circle cx="420" cy="32" r="8" fill="rgba(244, 63, 94, 0.25)" className="pulse-dot-red" />
                <circle cx="420" cy="32" r="4.5" fill="#FB7185" stroke="#0D0F1A" strokeWidth="2" />

                {/* Live Check End-Point (Pulsing green dot) */}
                <circle cx="580" cy="52" r="7" fill="rgba(16, 185, 129, 0.25)" />
                <circle cx="580" cy="52" r="4" fill="#34D399" stroke="#0D0F1A" strokeWidth="1.5" />

                {/* Interactive hit areas */}
                {dataPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoverPoint(pt)}
                  />
                ))}
              </svg>

              {/* Dynamic Tooltip on Hover or Default to Spike */}
              <div style={{
                position: "absolute",
                top: hoverPoint ? `${hoverPoint.y - 25}px` : "10px",
                left: hoverPoint ? `${(hoverPoint.x / 600) * 100}%` : "70%",
                transform: "translateX(-50%)",
                backgroundColor: "#1F2338",
                border: "1px solid rgba(124, 135, 247, 0.4)",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "11px",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
                pointerEvents: "none",
                transition: "all 0.15s ease",
                zIndex: 10,
              }}>
                <div style={{ color: "var(--text-dim)", fontSize: "10px" }}>
                  {hoverPoint ? hoverPoint.time : "Jul 31 at 3:21pm PT"}
                </div>
                <div style={{ fontWeight: 700, color: hoverPoint?.latency.includes("Spike") ? "#FB7185" : "#FFFFFF" }}>
                  {hoverPoint ? hoverPoint.latency : "1,240 ms 🇺🇸"}
                </div>
              </div>
            </div>

            {/* Bottom Real-time Telemetry Bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(114, 125, 161, 0.12)",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="pulse-dot pulse-dot-green" style={{ width: "6px", height: "6px" }} />
                <span>Global node checks: <strong style={{ color: "#FFF" }}>US East (28ms)</strong> · Frankfurt (34ms) · Tokyo (48ms)</span>
              </div>
              <span style={{ color: "#34D399", fontWeight: 500 }}>HTTP 200 OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
