"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "./Icons";

interface MonitorItem {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST";
  status: "UP" | "DOWN" | "PAUSED";
  statusCode: number;
  intervalSeconds: number;
  responseTimeMs: number;
  uptimePercentage: number;
  regions: string[];
  hasOutage?: boolean;
}

const MOCK_MONITORS: MonitorItem[] = [
  {
    id: "web-1",
    name: "Production API Gateway",
    url: "https://api.watchtower.dev/health",
    method: "GET",
    status: "UP",
    statusCode: 200,
    intervalSeconds: 30,
    responseTimeMs: 42,
    uptimePercentage: 99.98,
    regions: ["US", "DE", "IN"],
  },
  {
    id: "web-2",
    name: "Stripe Payment Webhook",
    url: "https://pay.watchtower.dev/webhooks/status",
    method: "POST",
    status: "UP",
    statusCode: 200,
    intervalSeconds: 60,
    responseTimeMs: 68,
    uptimePercentage: 100.0,
    regions: ["US", "DE"],
  },
  {
    id: "web-3",
    name: "Customer Auth Service",
    url: "https://auth.watchtower.dev/.well-known/jwks.json",
    method: "GET",
    status: "UP",
    statusCode: 200,
    intervalSeconds: 60,
    responseTimeMs: 31,
    uptimePercentage: 99.94,
    regions: ["US", "US"],
    hasOutage: true,
  },
];

// 38-bar timeline component
function TimelineBars({
  hasOutage = false,
  uptime = 99.98,
}: {
  hasOutage?: boolean;
  uptime?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const totalBars = 38;
  const outageIndex = hasOutage ? 18 : -1;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          height: "28px",
          padding: "4px 0",
          position: "relative",
        }}
      >
        {Array.from({ length: totalBars }).map((_, idx) => {
          const isOutage = idx === outageIndex;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1,
                height: isHovered ? "26px" : "22px",
                borderRadius: "3px",
                backgroundColor: isOutage ? "#F43F5E" : "#10B981",
                opacity: isHovered ? 1 : 0.9,
                transition: "all 0.12s ease",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "var(--text-dim)",
          marginTop: "4px",
        }}
      >
        <span>38 days ago</span>
        <span
          style={{
            color: "#34D399",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            className="pulse-dot pulse-dot-green"
            style={{ width: "5px", height: "5px" }}
          />
          {uptime.toFixed(2)}% availability
        </span>
        <span>Today</span>
      </div>
    </div>
  );
}

// Latency Wave Chart matching Image 1
function LatencyWaveChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = [
    { x: 30, y: 72, val: 38, time: "00:00" },
    { x: 70, y: 58, val: 45, time: "02:00" },
    { x: 110, y: 78, val: 32, time: "04:00" },
    { x: 150, y: 64, val: 41, time: "06:00" },
    { x: 190, y: 84, val: 28, time: "08:00" },
    { x: 230, y: 74, val: 35, time: "10:00" },
    { x: 270, y: 52, val: 54, time: "12:00" },
    { x: 310, y: 68, val: 39, time: "14:00" },
    { x: 350, y: 88, val: 24, time: "16:00" },
    { x: 390, y: 56, val: 48, time: "18:00" },
    { x: 430, y: 76, val: 34, time: "20:00" },
    { x: 470, y: 62, val: 44, time: "22:00" },
    { x: 510, y: 78, val: 31, time: "00:00" },
    { x: 550, y: 54, val: 51, time: "02:00" },
    { x: 590, y: 82, val: 27, time: "04:00" },
    { x: 630, y: 68, val: 40, time: "06:00" },
    { x: 670, y: 86, val: 26, time: "08:00" },
    { x: 710, y: 52, val: 56, time: "10:00" },
    { x: 750, y: 74, val: 36, time: "12:00" },
    { x: 790, y: 50, val: 62, time: "Now" },
  ];

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");
  const areaD = `${pathD} L 790 120 L 30 120 Z`;

  const activePoint =
    hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: "#FFFFFF",
            }}
          >
            {activePoint?.val || 42} ms
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            average response time
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "14px",
            fontSize: "11px",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>
            Min: <strong style={{ color: "#FFF" }}>18ms</strong>
          </span>
          <span>
            Max: <strong style={{ color: "#FFF" }}>88ms</strong>
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#0C0E1A",
          borderRadius: "8px",
          padding: "16px 14px 10px",
          border: "1px solid rgba(114, 125, 161, 0.16)",
          position: "relative",
        }}
      >
        <svg
          viewBox="0 0 820 130"
          style={{ width: "100%", height: "130px", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="heroLatencyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B63D3" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#5B63D3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="30"
            y1="25"
            x2="790"
            y2="25"
            stroke="rgba(114, 125, 161, 0.1)"
            strokeDasharray="3 3"
          />
          <line
            x1="30"
            y1="65"
            x2="790"
            y2="65"
            stroke="rgba(114, 125, 161, 0.1)"
            strokeDasharray="3 3"
          />
          <line
            x1="30"
            y1="105"
            x2="790"
            y2="105"
            stroke="rgba(114, 125, 161, 0.12)"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#heroLatencyGrad)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#7C87F7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point dots */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isLast = idx === points.length - 1;
            return (
              <g key={idx}>
                {/* Hit target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
                {/* Visual circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : isLast ? 4.5 : 3}
                  fill={
                    isHovered
                      ? "#FFFFFF"
                      : isLast
                        ? "#7C87F7"
                        : "rgba(124, 135, 247, 0.8)"
                  }
                  stroke="#0C0E1A"
                  strokeWidth="1.5"
                />
                {isLast && !isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="rgba(124, 135, 247, 0.25)"
                    className="pulse-dot-purple"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Bottom edge nodes */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            paddingTop: "8px",
            borderTop: "1px solid rgba(114, 125, 161, 0.12)",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className="pulse-dot pulse-dot-green"
              style={{ width: "5px", height: "5px" }}
            />
            <span>
              Global node checks:{" "}
              <strong style={{ color: "#FFF" }}>US East (28ms)</strong> ·
              Frankfurt (34ms) · Tokyo (48ms)
            </span>
          </div>
          <span style={{ color: "#34D399", fontWeight: 500 }}>HTTP 200 OK</span>
        </div>
      </div>
    </div>
  );
}

export function HeroPreview() {
  const [activeView, setActiveView] = useState<"dashboard" | "detail">(
    "dashboard",
  );
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorItem>(
    () => MOCK_MONITORS[0] as MonitorItem,
  );
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "UP" | "DOWN" | "PAUSED"
  >("ALL");

  const handleOpenDetail = (mon: MonitorItem) => {
    setSelectedMonitor(mon);
    setActiveView("detail");
  };

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "44px auto 0",
        position: "relative",
      }}
    >
      {/* Background Atmosphere Flare */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          height: "380px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(91, 99, 211, 0.25) 0%, rgba(124, 135, 247, 0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Glass Window Container */}
      <div
        className="card-glow-hover"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#090A13",
          borderRadius: "14px",
          border: "1px solid rgba(114, 125, 161, 0.22)",
          boxShadow:
            "0 30px 80px -20px rgba(0, 0, 0, 0.95), 0 0 50px rgba(91, 99, 211, 0.14)",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        {/* Top Window Bar with Interactive Tab Switcher */}
        <div
          style={{
            backgroundColor: "#07080E",
            padding: "10px 18px",
            borderBottom: "1px solid rgba(114, 125, 161, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Window Traffic Lights */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#FF5F56",
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#FFBD2E",
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#27C93F",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-dim)",
                marginLeft: "8px",
                fontWeight: 500,
              }}
            >
              Watchtower Telemetry Engine
            </span>
          </div>

          {/* Interactive Mode Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(114, 125, 161, 0.1)",
              padding: "2px",
              borderRadius: "6px",
            }}
          >
            <button
              onClick={() => setActiveView("dashboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  activeView === "dashboard"
                    ? "var(--primary-color)"
                    : "transparent",
                color:
                  activeView === "dashboard" ? "#FFFFFF" : "var(--text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              <Icons.Activity size={13} />
              <span>Monitors Dashboard</span>
            </button>
            <button
              onClick={() => setActiveView("detail")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  activeView === "detail"
                    ? "var(--primary-color)"
                    : "transparent",
                color:
                  activeView === "detail" ? "#FFFFFF" : "var(--text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              <Icons.Clock size={13} />
              <span>Performance & Latency</span>
            </button>
          </div>

          {/* Live indicator badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#34D399",
            }}
          >
            <span
              className="pulse-dot pulse-dot-green"
              style={{ width: "6px", height: "6px" }}
            />
            <span>Connected to 3 edge clusters</span>
          </div>
        </div>

        {/* In-App Header Bar matching Watchtower */}
        <div
          style={{
            backgroundColor: "#0A0B14",
            padding: "12px 24px",
            borderBottom: "1px solid rgba(114, 125, 161, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Brand + Status Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="15" viewBox="0 0 24 20" fill="none">
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
                style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}
              >
                Watchtower
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "2px 10px",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                color: "#34D399",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <span
                className="pulse-dot pulse-dot-green"
                style={{ width: "5px", height: "5px" }}
              />
              <span>All systems normal</span>
            </div>
          </div>

          {/* Right: Actions & User pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/dashboard"
              className="cta-button btn btn-sm"
              style={{ height: "30px", fontSize: "12px", padding: "0 12px" }}
            >
              <Icons.Plus size={13} /> Create monitor
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "30px",
                padding: "0 10px",
                borderRadius: "6px",
                backgroundColor: "rgba(114, 125, 161, 0.08)",
                border: "1px solid rgba(114, 125, 161, 0.16)",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-color)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                A
              </div>
              <span
                style={{ fontSize: "12px", fontWeight: 500, color: "#FFFFFF" }}
              >
                alex_engineer
              </span>
            </div>

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                backgroundColor: "rgba(114, 125, 161, 0.08)",
                border: "1px solid rgba(114, 125, 161, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8F9BB7",
              }}
            >
              <Icons.LogOut size={13} />
            </div>
          </div>
        </div>

        {/* Subnavigation Bar */}
        <div
          style={{
            padding: "0 24px",
            borderBottom: "1px solid rgba(114, 125, 161, 0.12)",
            display: "flex",
            gap: "6px",
            backgroundColor: "#080911",
          }}
        >
          <button
            onClick={() => setActiveView("dashboard")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 500,
              color:
                activeView === "dashboard" ? "#FFFFFF" : "var(--text-muted)",
              border: "none",
              background: "transparent",
              borderBottom:
                activeView === "dashboard"
                  ? "2px solid var(--primary-light)"
                  : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            <Icons.Activity size={14} /> Monitors
          </button>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              color: "var(--text-dim)",
            }}
          >
            <Icons.Globe size={14} /> Status Pages
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              color: "var(--text-dim)",
            }}
          >
            <Icons.Settings size={14} /> Settings
          </div>
        </div>

        {/* BODY CONTENT: VIEW 1 - MONITORS DASHBOARD (Matching Image 2) */}
        {activeView === "dashboard" && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* 4 Executive KPI Metric Cards (Matching Image 2) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "12px",
              }}
            >
              {/* Card 1 */}
              <div
                className="card"
                style={{ padding: "14px 18px", backgroundColor: "#0D0F1B" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Availability (30d)
                  </span>
                  <Icons.Shield size={14} color="var(--primary-light)" />
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "#FFFFFF",
                  }}
                >
                  99.94%
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--status-up)",
                    fontWeight: 500,
                  }}
                >
                  0 active outages
                </span>
              </div>

              {/* Card 2 */}
              <div
                className="card"
                style={{ padding: "14px 18px", backgroundColor: "#0D0F1B" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Monitors
                  </span>
                  <Icons.Activity size={14} color="var(--primary-light)" />
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "#FFFFFF",
                  }}
                >
                  4{" "}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "var(--text-dim)",
                    }}
                  >
                    targets
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                  4 active · 0 paused
                </span>
              </div>

              {/* Card 3 */}
              <div
                className="card"
                style={{ padding: "14px 18px", backgroundColor: "#0D0F1B" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Incidents
                  </span>
                  <Icons.AlertTriangle size={14} color="var(--primary-light)" />
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "#FFFFFF",
                  }}
                >
                  0
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--status-up)",
                    fontWeight: 500,
                  }}
                >
                  All services operational
                </span>
              </div>

              {/* Card 4 */}
              <div
                className="card"
                style={{ padding: "14px 18px", backgroundColor: "#0D0F1B" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Average Latency
                  </span>
                  <Icons.Clock size={14} color="var(--primary-light)" />
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "#FFFFFF",
                  }}
                >
                  40{" "}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "var(--text-dim)",
                    }}
                  >
                    ms
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                  Synthetic probes
                </span>
              </div>
            </div>

            {/* Filter and Search Bar (Matching Image 2) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {/* Filter tabs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#111320",
                  padding: "2px",
                  borderRadius: "6px",
                  border: "1px solid rgba(114, 125, 161, 0.14)",
                }}
              >
                <button
                  onClick={() => setStatusFilter("ALL")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor:
                      statusFilter === "ALL"
                        ? "var(--primary-color)"
                        : "transparent",
                    color:
                      statusFilter === "ALL" ? "#FFF" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  All (4)
                </button>
                <button
                  onClick={() => setStatusFilter("UP")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor:
                      statusFilter === "UP"
                        ? "var(--primary-color)"
                        : "transparent",
                    color: statusFilter === "UP" ? "#FFF" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Up (4)
                </button>
                <button
                  onClick={() => setStatusFilter("DOWN")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor:
                      statusFilter === "DOWN"
                        ? "var(--primary-color)"
                        : "transparent",
                    color:
                      statusFilter === "DOWN" ? "#FFF" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Down (0)
                </button>
                <button
                  onClick={() => setStatusFilter("PAUSED")}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 500,
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor:
                      statusFilter === "PAUSED"
                        ? "var(--primary-color)"
                        : "transparent",
                    color:
                      statusFilter === "PAUSED" ? "#FFF" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Paused (0)
                </button>
              </div>

              {/* Search box + New monitor */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(114, 125, 161, 0.08)",
                    border: "1px solid rgba(114, 125, 161, 0.18)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    width: "200px",
                  }}
                >
                  <Icons.Search size={13} color="var(--text-dim)" />
                  <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                    Filter by name or URL...
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="cta-button btn btn-sm"
                  style={{
                    height: "28px",
                    fontSize: "11px",
                    padding: "0 10px",
                  }}
                >
                  <Icons.Plus size={13} /> New monitor
                </Link>
              </div>
            </div>

            {/* List of Monitors (Matching Image 2) */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {MOCK_MONITORS.map((mon) => (
                <div
                  key={mon.id}
                  className="card card-glow-hover"
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "#0D0F1C",
                    borderRadius: "8px",
                    border: "1px solid rgba(114, 125, 161, 0.16)",
                  }}
                >
                  {/* Monitor Top Details Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    {/* Left title & URL */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          className="pulse-dot pulse-dot-green"
                          style={{ width: "7px", height: "7px" }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                          }}
                        >
                          {mon.name}
                        </span>
                        <span
                          className="badge badge-neutral font-mono"
                          style={{ fontSize: "10px", padding: "1px 6px" }}
                        >
                          {mon.method}
                        </span>
                        <span
                          className="badge badge-green"
                          style={{ fontSize: "10px", padding: "1px 6px" }}
                        >
                          {mon.statusCode} OK
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-dim)",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Icons.Clock size={11} /> {mon.intervalSeconds}s
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-dim)",
                          marginTop: "3px",
                        }}
                      >
                        {mon.url}
                      </div>
                    </div>

                    {/* Right latency & details button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontSize: "10px", color: "var(--text-dim)" }}
                        >
                          Response Time
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            color: "#FFFFFF",
                          }}
                        >
                          {mon.responseTimeMs} ms
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {mon.regions.join(" ")}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <button
                          className="btn-icon"
                          title="Pause"
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "4px",
                            border: "1px solid rgba(114, 125, 161, 0.18)",
                            backgroundColor: "rgba(114, 125, 161, 0.08)",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Icons.Pause size={12} />
                        </button>

                        <button
                          onClick={() => handleOpenDetail(mon)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            height: "26px",
                            fontSize: "11px",
                            padding: "0 10px",
                            backgroundColor: "rgba(114, 125, 161, 0.12)",
                            border: "1px solid rgba(114, 125, 161, 0.22)",
                          }}
                        >
                          Details
                        </button>

                        <button
                          className="btn-icon"
                          title="Delete"
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "4px",
                            border: "1px solid rgba(114, 125, 161, 0.18)",
                            backgroundColor: "rgba(114, 125, 161, 0.08)",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Icons.Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 38-Bar Availability Timeline */}
                  <TimelineBars
                    hasOutage={mon.hasOutage}
                    uptime={mon.uptimePercentage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BODY CONTENT: VIEW 2 - MONITOR PERFORMANCE & LATENCY (Matching Image 1) */}
        {activeView === "detail" && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Monitor Header with Return Breadcrumb */}
            <div
              className="card"
              style={{ padding: "18px 22px", backgroundColor: "#0D0F1C" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span className="pulse-dot pulse-dot-green" />
                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {selectedMonitor.name}
                    </h2>
                    <span
                      className="badge badge-neutral font-mono"
                      style={{ fontSize: "10px" }}
                    >
                      {selectedMonitor.method}
                    </span>
                    <span
                      className="badge badge-green"
                      style={{ fontSize: "10px" }}
                    >
                      {selectedMonitor.statusCode} OK
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-dim)",
                      marginTop: "4px",
                    }}
                  >
                    {selectedMonitor.url}
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ height: "28px", fontSize: "12px" }}
                  >
                    <Icons.Pause size={12} /> Pause
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ height: "28px", fontSize: "12px" }}
                  >
                    <Icons.Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* 5-KPI Strip matching Image 1 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "10px",
                  padding: "12px 16px",
                  backgroundColor: "#0A0B14",
                  borderRadius: "6px",
                  border: "1px solid rgba(114, 125, 161, 0.12)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "2px",
                    }}
                  >
                    Response time
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedMonitor.responseTimeMs} ms
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "2px",
                    }}
                  >
                    30-day availability
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedMonitor.uptimePercentage.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "2px",
                    }}
                  >
                    Check frequency
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedMonitor.intervalSeconds}s
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "2px",
                    }}
                  >
                    Timeout limit
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#FFFFFF",
                    }}
                  >
                    5s
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginBottom: "2px",
                    }}
                  >
                    Target status
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#FFFFFF",
                    }}
                  >
                    {selectedMonitor.statusCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Availability History (38 Days) matching Image 1 */}
            <div
              className="card"
              style={{ padding: "18px 22px", backgroundColor: "#0D0F1C" }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                Availability History (38 Days)
              </h3>
              <TimelineBars
                hasOutage={selectedMonitor.hasOutage}
                uptime={selectedMonitor.uptimePercentage}
              />
            </div>

            {/* Card: Response Time (Synthetic Edge Checks) matching Image 1 */}
            <div
              className="card"
              style={{ padding: "18px 22px", backgroundColor: "#0D0F1C" }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                Response Time (Synthetic Edge Checks)
              </h3>
              <LatencyWaveChart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
