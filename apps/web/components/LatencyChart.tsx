"use client";

import { useState } from "react";
import { WebsiteTick } from "../lib/types";

interface LatencyChartProps {
  ticks?: WebsiteTick[];
  avgMs?: number;
}

export function LatencyChart({ ticks = [], avgMs = 42 }: LatencyChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; time: string } | null>(null);

  const pointsData = ticks.length > 0
    ? ticks.map((t) => ({
        val: t.responseTimeMs || 30,
        time: new Date(t.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: t.status,
      }))
    : Array.from({ length: 24 }).map((_, i) => ({
        val: Math.floor(avgMs + (Math.sin(i / 2) * 12 + Math.random() * 8)),
        time: `${(i * 2).toString().padStart(2, "0")}:00`,
        status: "UP",
      }));

  const maxVal = Math.max(...pointsData.map((d) => d.val), 80);
  const minVal = Math.min(...pointsData.map((d) => d.val), 10);
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 180;
  const padding = 20;

  const coords = pointsData.map((d, index) => {
    const x = padding + (index / (pointsData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.val - minVal) / range) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const firstX = coords[0]?.x ?? padding;
  const lastX = coords[coords.length - 1]?.x ?? (width - padding);
  const areaD = coords.length > 0 ? `${pathD} L ${lastX} ${height - padding} L ${firstX} ${height - padding} Z` : "";

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
            {avgMs} ms
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>average response time</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          <span>Min: <strong style={{ color: "#FFF" }}>{minVal}ms</strong></span>
          <span>Max: <strong style={{ color: "#FFF" }}>{maxVal}ms</strong></span>
        </div>
      </div>

      <div style={{
        width: "100%",
        backgroundColor: "#0F121F",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        border: "1px solid rgba(114, 125, 161, 0.16)",
        position: "relative",
      }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B63D3" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#5B63D3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(114, 125, 161, 0.12)" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(114, 125, 161, 0.12)" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(114, 125, 161, 0.15)" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#latencyGradient)" />

          {/* Line Stroke */}
          <path d={pathD} fill="none" stroke="#7C87F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover Crosshair Vertical Line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={padding}
              x2={hoveredPoint.x}
              y2={height - padding}
              stroke="rgba(124, 135, 247, 0.4)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}

          {/* Latest Check Pulsing Ring */}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1]?.x}
              cy={coords[coords.length - 1]?.y}
              r="8"
              fill="rgba(124, 135, 247, 0.3)"
              className="pulse-dot"
            />
          )}

          {/* Circles */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={hoveredPoint?.x === c.x ? 6 : i === coords.length - 1 ? 4.5 : 3}
              fill={c.status === "DOWN" ? "var(--status-down)" : "#7C87F7"}
              stroke="#0B0C14"
              strokeWidth="2"
              style={{ cursor: "pointer", transition: "r 0.15s ease" }}
              onMouseEnter={() => setHoveredPoint({ x: c.x, y: c.y, val: c.val, time: c.time })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: "absolute",
            top: `${(hoveredPoint.y / height) * 100}%`,
            left: `${(hoveredPoint.x / width) * 100}%`,
            transform: "translate(-50%, -130%)",
            backgroundColor: "#191D30",
            border: "1px solid rgba(114, 125, 161, 0.3)",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "12px",
            color: "#FFF",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}>
            <span style={{ fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>
              {hoveredPoint.val} ms
            </span>
            <span style={{ color: "var(--text-dim)", marginLeft: "6px" }}>{hoveredPoint.time}</span>
          </div>
        )}
      </div>
    </div>
  );
}
