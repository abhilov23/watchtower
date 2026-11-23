"use client";

import { useState } from "react";
import { WebsiteTick, WebsiteStatus } from "../lib/types";

interface UptimeTimelineProps {
  ticks?: WebsiteTick[];
  days?: number;
  barCount?: number;
  status?: WebsiteStatus;
  uptimePercentage?: number;
}

export function UptimeTimeline({
  ticks = [],
  barCount = 38,
  uptimePercentage = 99.98,
  status = "UP",
}: UptimeTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate segments based on ticks or mock distribution
  const segments = Array.from({ length: barCount }).map((_, index) => {
    // Check if we have tick data
    const tick = ticks[index];
    const isToday = index === barCount - 1;

    // Simulate rare degraded tick if no specific tick data
    const isDown = tick
      ? tick.status === "DOWN"
      : index === 8 && uptimePercentage < 99.9;
    const isPaused = status === "UNKNOWN";
    const latency =
      tick?.responseTimeMs || Math.floor(30 + (Math.sin(index) * 15 + 15));
    const dayAgo = barCount - 1 - index;

    return {
      index,
      isDown,
      isPaused,
      latency,
      dayLabel: isToday ? "Today" : `${dayAgo} day${dayAgo > 1 ? "s" : ""} ago`,
      status: isPaused ? "PAUSED" : isDown ? "DOWN" : "UP",
    };
  });

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Segments container */}
      <div className="uptime-bars-container">
        {segments.map((seg) => {
          let bg = "var(--status-up)";
          if (seg.isPaused) bg = "var(--status-paused)";
          else if (seg.isDown) bg = "var(--status-down)";

          const isHovered = hoveredIndex === seg.index;

          return (
            <div
              key={seg.index}
              className="uptime-bar-item"
              style={{
                backgroundColor: bg,
                opacity: isHovered ? 1 : seg.isPaused ? 0.35 : 0.85,
                transform: isHovered ? "scaleY(1.3) translateY(-1px)" : "none",
                boxShadow: isHovered ? `0 0 8px ${bg}` : "none",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={() => setHoveredIndex(seg.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </div>

      {/* Tooltip on hover */}
      {hoveredIndex !== null && segments[hoveredIndex] && (
        <div
          style={{
            position: "absolute",
            top: "-42px",
            left: `${(hoveredIndex / barCount) * 100}%`,
            transform: "translateX(-50%)",
            backgroundColor: "#0F141C",
            border: "1px solid var(--border-medium)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "12px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 10px 20px -3px rgba(0, 0, 0, 0.7)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.1s ease-out",
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {segments[hoveredIndex]?.dayLabel}
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span
            style={{
              color: segments[hoveredIndex]?.isDown
                ? "var(--status-down)"
                : "var(--status-up)",
              fontWeight: 700,
            }}
          >
            {segments[hoveredIndex]?.status}
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {segments[hoveredIndex]?.latency}ms
          </span>
        </div>
      )}

      {/* Footer labels */}
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
        <span>{barCount} days ago</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor:
                status === "UP" ? "var(--status-up)" : "var(--text-dim)",
            }}
          />
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            {status === "UNKNOWN"
              ? "Monitoring Paused"
              : `${uptimePercentage.toFixed(2)}% availability`}
          </span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}
