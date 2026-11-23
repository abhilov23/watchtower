"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";
import { PublicStatusPageData } from "../../../lib/types";

export default function PublicStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<PublicStatusPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      const res = await api.getPublicStatusPage(resolvedParams.slug);
      if (res) {
        setData(res);
      } else {
        // Fallback demo data
        setData({
          id: "sp-demo",
          name: "Watchtower Live Status",
          slug: resolvedParams.slug,
          description: "Real-time service availability and performance monitoring for our services.",
          overallStatus: "OPERATIONAL",
          updatedAt: new Date().toISOString(),
          monitors: [
            { id: "1", name: "Production API Gateway", url: "https://api.watchtower.dev", method: "GET", status: "UP", lastChecked: new Date().toISOString(), responseTimeMs: 38 },
            { id: "2", name: "Authentication Service", url: "https://auth.watchtower.dev", method: "GET", status: "UP", lastChecked: new Date().toISOString(), responseTimeMs: 44 },
            { id: "3", name: "Stripe Payment Webhook", url: "https://pay.watchtower.dev", method: "POST", status: "UP", lastChecked: new Date().toISOString(), responseTimeMs: 62 },
            { id: "4", name: "Edge CDN & Static Assets", url: "https://cdn.watchtower.dev", method: "GET", status: "UP", lastChecked: new Date().toISOString(), responseTimeMs: 22 },
          ],
        });
      }
    } catch {
      setError("Unable to load status page.");
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [resolvedParams.slug]);

  const isOperational = data?.overallStatus === "OPERATIONAL" && !data.monitors.some((m) => m.status === "DOWN");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#07080D",
      color: "#FFFFFF",
      fontFamily: "var(--font-sans)",
      padding: "36px 20px 60px",
    }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <rect x="0" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 0 2)" fill="#FFFFFF" />
              <rect x="11" y="2" width="7" height="16" rx="3.5" transform="rotate(-15 11 2)" fill="#FFFFFF" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.01em" }}>
              {data?.name || "Watchtower Status"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
              Updated {lastRefreshed.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchStatus}
              className="btn btn-secondary btn-sm"
              style={{ height: "30px", fontSize: "12px", padding: "0 10px" }}
              title="Refresh status"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
            Loading system metrics...
          </div>
        ) : error && !data ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>Status page not found</h2>
            <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>{error}</p>
          </div>
        ) : (
          <div>
            {/* Big Status Banner */}
            <div style={{
              backgroundColor: isOperational ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
              border: `1px solid ${isOperational ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
              borderRadius: "10px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span
                  className={`pulse-dot ${isOperational ? "pulse-dot-green" : "pulse-dot-red"}`}
                  style={{ width: "12px", height: "12px" }}
                />
                <div>
                  <h2 style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: isOperational ? "#34D399" : "#FB7185",
                    margin: 0,
                  }}>
                    {isOperational ? "All Systems Operational" : "Active Service Disruption"}
                  </h2>
                  {data?.description && (
                    <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px", margin: 0 }}>
                      {data.description}
                    </p>
                  )}
                </div>
              </div>

              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: isOperational ? "#34D399" : "#FB7185",
                backgroundColor: isOperational ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                padding: "6px 12px",
                borderRadius: "20px",
              }}>
                99.98% Uptime
              </div>
            </div>

            {/* 90-Day Availability Bars Strip */}
            <div className="card" style={{ padding: "20px 24px", marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "12px" }}>
                <span style={{ fontWeight: 600 }}>90-Day Availability History</span>
                <span style={{ color: "var(--status-up)", fontWeight: 600 }}>99.98% operational</span>
              </div>
              <div style={{ display: "flex", gap: "3px", height: "28px", alignItems: "center" }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    title="100% operational"
                    style={{
                      flex: 1,
                      height: "100%",
                      borderRadius: "2px",
                      backgroundColor: i === 18 ? "#EF4444" : "#10B981",
                      opacity: i === 18 ? 0.9 : 0.85,
                      cursor: "pointer",
                      transition: "transform 0.1s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scaleY(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scaleY(1)")}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-dim)", marginTop: "8px" }}>
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Component Status Cards */}
            <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "16px" }}>
                System Components
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data?.monitors && data.monitors.length > 0 ? (
                  data.monitors.map((m) => {
                    const isDown = m.status === "DOWN";
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 16px",
                          backgroundColor: "#0D0F1A",
                          borderRadius: "8px",
                          border: "1px solid rgba(114, 125, 161, 0.12)",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{m.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>
                            Latency ~{m.responseTimeMs} ms · HTTP {m.method}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            className={`pulse-dot ${isDown ? "pulse-dot-red" : "pulse-dot-green"}`}
                            style={{ width: "8px", height: "8px" }}
                          />
                          <span style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: isDown ? "#FB7185" : "var(--status-up)",
                          }}>
                            {isDown ? "Disrupted" : "Operational"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: "var(--text-dim)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                    No system components published yet.
                  </div>
                )}
              </div>
            </div>

            {/* Past Incidents */}
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "14px" }}>
                Past Incidents
              </h3>
              <div style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>
                <div style={{ marginBottom: "6px", fontWeight: 600, color: "#FFFFFF" }}>
                  {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  No incidents or downtime reported today across all monitored edge clusters.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(114, 125, 161, 0.15)",
          fontSize: "12px",
          color: "var(--text-dim)",
        }}>
          Powered by{" "}
          <Link href="/" style={{ color: "#7C87F7", fontWeight: 600 }}>
            Watchtower
          </Link>
          {" · "}
          Continuous edge uptime monitoring & synthetic latency probing
        </div>
      </div>
    </div>
  );
}
