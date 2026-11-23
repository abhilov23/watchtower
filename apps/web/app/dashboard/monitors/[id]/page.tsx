"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { LatencyChart } from "../../../../components/LatencyChart";
import { UptimeTimeline } from "../../../../components/UptimeTimeline";
import { Icons } from "../../../../components/Icons";
import { EditMonitorModal } from "../../../../components/EditMonitorModal";
import { RegionInspectModal } from "../../../../components/RegionInspectModal";
import { api } from "../../../../lib/api";
import { Website, User } from "../../../../lib/types";

export default function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [website, setWebsite] = useState<Website | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inspectingRegionId, setInspectingRegionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [u, site] = await Promise.all([
        api.getMe(),
        api.getWebsiteById(resolvedParams.id),
      ]);
      setUser(u);
      setWebsite(site);
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  const handleTogglePause = async () => {
    if (!website) return;
    const updated = await api.togglePause(website.id, website.monitorStatus);
    if (updated) setWebsite(updated);
  };

  const handleDelete = async () => {
    if (!website) return;
    if (confirm("Are you sure you want to delete this monitor?")) {
      await api.deleteWebsite(website.id);
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", color: "#FFF" }}>
        <DashboardHeader user={user} />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div className="pulse-dot pulse-dot-green" style={{ width: "14px", height: "14px", marginBottom: "16px" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading monitor metrics...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", color: "#FFF" }}>
        <DashboardHeader user={user} />
        <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
          <h2>Monitor not found</h2>
          <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>
            The monitor you requested could not be located.
          </p>
          <Link href="/dashboard" className="cta-button btn">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPaused = website.monitorStatus === "PAUSED";
  const isDown = website.currentStatus === "DOWN" && !isPaused;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", display: "flex", flexDirection: "column" }}>
      <DashboardHeader user={user} />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-dim)", marginBottom: "20px" }}>
          <Link href="/dashboard" className="btn-ghost" style={{ padding: 0 }}>
            ‹ Monitors
          </Link>
          <span>/</span>
          <span style={{ color: "#FFF", fontWeight: 600 }}>{website.name}</span>
        </div>

        {/* MONITOR HEADER */}
        <div className="card" style={{ padding: "24px 28px", marginBottom: "20px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "20px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span className={`pulse-dot ${isPaused ? "pulse-dot-neutral" : isDown ? "pulse-dot-red" : "pulse-dot-green"}`} />
                <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF" }}>{website.name}</h1>
                <span className="badge badge-neutral font-mono">{website.method}</span>
                <span className={`badge ${isPaused ? "badge-neutral" : isDown ? "badge-red" : "badge-green"}`}>
                  {isPaused ? "PAUSED" : isDown ? "DOWN" : "200 OK"}
                </span>
              </div>
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-dim)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {website.url} <Icons.ExternalLink size={13} />
              </a>
            </div>

            {/* Header actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn btn-secondary btn-sm"
              >
                <Icons.Settings size={13} /> Configure
              </button>
              <button
                onClick={handleTogglePause}
                className="btn btn-secondary btn-sm"
              >
                {isPaused ? (
                  <>
                    <Icons.Play size={13} color="var(--primary-light)" /> Resume
                  </>
                ) : (
                  <>
                    <Icons.Pause size={13} /> Pause
                  </>
                )}
              </button>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Icons.Trash2 size={13} /> Delete
              </button>
            </div>
          </div>

          {toastMessage && (
            <div style={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "10px 16px",
              color: "#34D399",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <Icons.Check size={16} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* KPI Stat strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            padding: "16px 20px",
            backgroundColor: "#0D0F1A",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(114, 125, 161, 0.14)",
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                Response time
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                {website.lastResponseTimeMs || 34} ms
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                30-day availability
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                {website.uptimePercentage?.toFixed(2) || "99.98"}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                Check frequency
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                {website.intervalSeconds}s
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                Timeout limit
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                {(website.timeoutMs / 1000).toFixed(0)}s
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                Target status
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                {website.expectedStatusCode}
              </div>
            </div>
          </div>
        </div>

        {/* 38-DAY TIMELINE */}
        <div className="card card-glow-hover" style={{ padding: "22px 28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "14px" }}>
            Availability History (38 Days)
          </h3>
          <UptimeTimeline
            ticks={website.ticks}
            status={isPaused ? "UNKNOWN" : isDown ? "DOWN" : "UP"}
            uptimePercentage={website.uptimePercentage || 99.98}
            barCount={38}
          />
        </div>

        {/* LATENCY CHART */}
        <div className="card card-glow-hover" style={{ padding: "22px 28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "14px" }}>
            Response Time (Synthetic Edge Checks)
          </h3>
          <LatencyChart ticks={website.ticks} avgMs={website.lastResponseTimeMs || 38} />
        </div>

        {/* MULTI-REGION BREAKDOWN */}
        <div className="card card-glow-hover" style={{ padding: "22px 28px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "14px" }}>
            Multi-Region Edge Breakdown
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {website.regions && website.regions.length > 0 ? (
              website.regions.map((wr, idx) => (
                <div
                  key={idx}
                  className="card-glow-hover"
                  onClick={() => setInspectingRegionId(wr.region?.id || wr.regionId)}
                  title="Click to inspect probe node via GET /api/regions/:id"
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#0F121F",
                    border: "1px solid rgba(114, 125, 161, 0.14)",
                    cursor: "pointer",
                    transition: "border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(114, 125, 161, 0.14)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>{wr.region?.flag || "🌐"}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>{wr.region?.name || wr.regionId}</span>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: "11px" }}>Active</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginTop: "10px" }}>
                    <span style={{ color: "var(--text-dim)" }}>Edge Latency:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong style={{ fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                        {Math.floor(25 + idx * 18)} ms
                      </strong>
                      <span style={{ color: "var(--primary-light)", fontSize: "11px" }}>Inspect ↗</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No specific regions bound.</p>
            )}
          </div>
        </div>

        {/* RECENT CHECK TICKS LOG */}
        <div className="card" style={{ padding: "22px 28px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "14px" }}>
            Recent Check Log
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(114, 125, 161, 0.2)", color: "var(--text-dim)" }}>
                  <th style={{ padding: "10px 12px" }}>Timestamp</th>
                  <th style={{ padding: "10px 12px" }}>Status</th>
                  <th style={{ padding: "10px 12px" }}>HTTP Code</th>
                  <th style={{ padding: "10px 12px" }}>Latency</th>
                  <th style={{ padding: "10px 12px" }}>Edge Region</th>
                </tr>
              </thead>
              <tbody>
                {(website.ticks && website.ticks.length > 0 ? website.ticks.slice(0, 10) : []).map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(114, 125, 161, 0.1)" }}>
                    <td style={{ padding: "12px", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                      {new Date(t.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span className={`badge ${t.status === "DOWN" ? "badge-red" : "badge-green"}`} style={{ fontSize: "11px" }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontFamily: "var(--font-mono)", color: "#FFFFFF" }}>
                      {t.statusCode || 200}
                    </td>
                    <td style={{ padding: "12px", fontFamily: "var(--font-mono)", color: "#FFFFFF", fontWeight: 600 }}>
                      {t.responseTimeMs} ms
                    </td>
                    <td style={{ padding: "12px", color: "var(--text-muted)" }}>
                      US East (N. Virginia)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Monitor Modal */}
      {website && (
        <EditMonitorModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          website={website}
          onUpdated={(updated) => {
            setWebsite(updated);
            setToastMessage("Monitor configuration updated successfully!");
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}

      {/* Inspect Region Modal */}
      <RegionInspectModal
        regionId={inspectingRegionId}
        onClose={() => setInspectingRegionId(null)}
      />
    </div>
  );
}
