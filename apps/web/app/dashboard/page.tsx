"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "../../components/DashboardHeader";
import { CreateMonitorModal } from "../../components/CreateMonitorModal";
import { UptimeTimeline } from "../../components/UptimeTimeline";
import { Icons } from "../../components/Icons";
import { api } from "../../lib/api";
import { Website, User } from "../../lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "UP" | "DOWN" | "PAUSED"
  >("ALL");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const userRes = await api.getMe();
      if (!userRes) {
        router.push("/login");
        return;
      }
      setUser(userRes);
      const sites = await api.getWebsites();
      setWebsites(sites);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleCreated = (newSite: Website) => {
    setWebsites([newSite, ...websites]);
  };

  const handleTogglePause = async (site: Website) => {
    const updated = await api.togglePause(site.id, site.monitorStatus);
    if (updated) {
      setWebsites(websites.map((w) => (w.id === site.id ? updated : w)));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this monitor?")) {
      const ok = await api.deleteWebsite(id);
      if (ok) {
        setWebsites(websites.filter((w) => w.id !== id));
      }
    }
  };

  // Metrics computation
  const activeMonitors = websites.filter((w) => w.monitorStatus === "ACTIVE");
  const downMonitors = websites.filter(
    (w) => w.currentStatus === "DOWN" && w.monitorStatus === "ACTIVE",
  );
  const pausedMonitors = websites.filter((w) => w.monitorStatus === "PAUSED");

  const avgLatency = useMemo(() => {
    const withLatency = websites.filter(
      (w) => w.lastResponseTimeMs && w.monitorStatus === "ACTIVE",
    );
    if (!withLatency.length) return 0;
    const sum = withLatency.reduce(
      (acc, w) => acc + (w.lastResponseTimeMs || 0),
      0,
    );
    return Math.round(sum / withLatency.length);
  }, [websites]);

  const avgUptime = useMemo(() => {
    const withUptime = websites.filter((w) => w.uptimePercentage);
    if (!withUptime.length) return 99.98;
    const sum = withUptime.reduce(
      (acc, w) => acc + (w.uptimePercentage || 100),
      0,
    );
    return (sum / withUptime.length).toFixed(2);
  }, [websites]);

  // Filtering
  const filteredWebsites = websites.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.url.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "UP")
      return w.currentStatus === "UP" && w.monitorStatus === "ACTIVE";
    if (statusFilter === "DOWN")
      return w.currentStatus === "DOWN" && w.monitorStatus === "ACTIVE";
    if (statusFilter === "PAUSED") return w.monitorStatus === "PAUSED";
    return true;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DashboardHeader
        user={user}
        onOpenCreateModal={() => setIsModalOpen(true)}
        activeCount={activeMonitors.length}
        downCount={downMonitors.length}
      />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        {/* EXECUTIVE METRICS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {/* Card 1: System Availability */}
          <div
            className="card card-glow-hover"
            style={{ padding: "18px 22px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Availability (30d)
              </span>
              <Icons.Shield size={16} color="var(--primary-light)" />
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "#FFFFFF",
              }}
            >
              {avgUptime}%
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
              0 active outages
            </span>
          </div>

          {/* Card 2: Monitored Services */}
          <div
            className="card card-glow-hover"
            style={{ padding: "18px 22px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Monitors
              </span>
              <Icons.Activity size={16} color="var(--primary-light)" />
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "#FFFFFF",
              }}
            >
              {websites.length}{" "}
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--text-dim)",
                  fontWeight: 400,
                }}
              >
                targets
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
              {activeMonitors.length} active · {pausedMonitors.length} paused
            </span>
          </div>

          {/* Card 3: Active Outages */}
          <div
            className="card card-glow-hover"
            style={{ padding: "18px 22px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Incidents
              </span>
              <Icons.AlertTriangle
                size={16}
                color={
                  downMonitors.length > 0
                    ? "var(--status-down)"
                    : "var(--text-dim)"
                }
              />
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color:
                  downMonitors.length > 0 ? "var(--status-down)" : "#FFFFFF",
              }}
            >
              {downMonitors.length}
            </div>
            <span
              style={{
                fontSize: "12px",
                color:
                  downMonitors.length > 0
                    ? "var(--status-down)"
                    : "var(--status-up)",
                fontWeight: 500,
              }}
            >
              {downMonitors.length > 0
                ? "Action required"
                : "All services operational"}
            </span>
          </div>

          {/* Card 4: Global Latency */}
          <div
            className="card card-glow-hover"
            style={{ padding: "18px 22px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Average Latency
              </span>
              <Icons.Clock size={16} color="var(--primary-light)" />
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "#FFFFFF",
              }}
            >
              {avgLatency}{" "}
              <span
                style={{
                  fontSize: "15px",
                  color: "var(--text-dim)",
                  fontWeight: 400,
                }}
              >
                ms
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
              Synthetic probes
            </span>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Status filter tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#121422",
              padding: "3px",
              borderRadius: "6px",
              border: "1px solid rgba(114, 125, 161, 0.15)",
            }}
          >
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`btn btn-sm ${statusFilter === "ALL" ? "cta-button" : "btn-ghost"}`}
              style={{ height: "28px", fontSize: "12px" }}
            >
              All ({websites.length})
            </button>
            <button
              onClick={() => setStatusFilter("UP")}
              className={`btn btn-sm ${statusFilter === "UP" ? "cta-button" : "btn-ghost"}`}
              style={{ height: "28px", fontSize: "12px" }}
            >
              Up ({activeMonitors.length - downMonitors.length})
            </button>
            <button
              onClick={() => setStatusFilter("DOWN")}
              className={`btn btn-sm ${statusFilter === "DOWN" ? "cta-button" : "btn-ghost"}`}
              style={{ height: "28px", fontSize: "12px" }}
            >
              Down ({downMonitors.length})
            </button>
            <button
              onClick={() => setStatusFilter("PAUSED")}
              className={`btn btn-sm ${statusFilter === "PAUSED" ? "cta-button" : "btn-ghost"}`}
              style={{ height: "28px", fontSize: "12px" }}
            >
              Paused ({pausedMonitors.length})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(114, 125, 161, 0.08)",
                border: "1px solid rgba(114, 125, 161, 0.2)",
                borderRadius: "6px",
                padding: "6px 12px",
                width: "280px",
              }}
            >
              <Icons.Search size={15} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Filter by name or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFF",
                  fontSize: "13px",
                  width: "100%",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-dim)",
                    cursor: "pointer",
                  }}
                >
                  <Icons.X size={13} />
                </button>
              )}
            </div>

            <button
              className="cta-button btn btn-sm"
              onClick={() => setIsModalOpen(true)}
              style={{ height: "32px", fontSize: "13px" }}
            >
              <Icons.Plus size={15} /> New monitor
            </button>
          </div>
        </div>

        {/* MONITOR LIST */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
            }}
          >
            <div
              className="pulse-dot pulse-dot-green"
              style={{ width: "14px", height: "14px", marginBottom: "16px" }}
            />
            <p>Loading monitors...</p>
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "64px 20px" }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(114, 125, 161, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "var(--text-dim)",
              }}
            >
              <Icons.Activity size={22} />
            </div>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "8px",
              }}
            >
              No monitors found
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              {searchQuery
                ? "Try a different search query."
                : "You have not set up any monitors yet."}
            </p>
            <button
              className="cta-button btn btn-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Icons.Plus size={15} /> Create your first monitor
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {filteredWebsites.map((site) => {
              const isPaused = site.monitorStatus === "PAUSED";
              const isDown = site.currentStatus === "DOWN" && !isPaused;

              return (
                <div
                  key={site.id}
                  className="card card-glow-hover"
                  style={{ padding: "18px 22px" }}
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "16px",
                      marginBottom: "14px",
                    }}
                  >
                    {/* Left: Status dot, Name, URL */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        className={`pulse-dot ${isPaused ? "pulse-dot-neutral" : isDown ? "pulse-dot-red" : "pulse-dot-green"}`}
                      />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <Link
                            href={`/dashboard/monitors/${site.id}`}
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#FFFFFF",
                            }}
                            className="btn-ghost"
                          >
                            {site.name}
                          </Link>
                          <span
                            className="badge badge-neutral font-mono"
                            style={{ fontSize: "11px" }}
                          >
                            {site.method}
                          </span>
                          <span
                            className={`badge ${isPaused ? "badge-neutral" : isDown ? "badge-red" : "badge-green"}`}
                          >
                            {isPaused ? "PAUSED" : isDown ? "DOWN" : "200 OK"}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-dim)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Icons.Clock size={12} /> {site.intervalSeconds}s
                          </span>
                        </div>

                        {/* URL */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "2px",
                          }}
                        >
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "var(--text-dim)",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {site.url} <Icons.ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right: Latency & Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      {!isPaused && (
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--text-dim)",
                            }}
                          >
                            Response Time
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              color: "#FFFFFF",
                            }}
                          >
                            {site.lastResponseTimeMs || 34} ms
                          </div>
                        </div>
                      )}

                      {/* Region flags */}
                      <div
                        style={{ display: "flex", gap: "4px" }}
                        title="Configured probe regions"
                      >
                        {site.regions?.slice(0, 3).map((r, i) => (
                          <span key={i} style={{ fontSize: "13px" }}>
                            {r.region?.flag || "🌐"}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <button
                          onClick={() => handleTogglePause(site)}
                          className="btn btn-secondary btn-sm"
                          title={
                            isPaused ? "Resume Monitoring" : "Pause Monitoring"
                          }
                        >
                          {isPaused ? (
                            <Icons.Play
                              size={13}
                              color="var(--primary-light)"
                            />
                          ) : (
                            <Icons.Pause size={13} />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/monitors/${site.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleDelete(site.id)}
                          className="btn-icon"
                          style={{ width: "30px", height: "30px" }}
                          title="Delete Monitor"
                          aria-label="Delete Monitor"
                        >
                          <Icons.Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 38-bar timeline */}
                  <UptimeTimeline
                    ticks={site.ticks}
                    status={isPaused ? "UNKNOWN" : isDown ? "DOWN" : "UP"}
                    uptimePercentage={site.uptimePercentage || 99.98}
                    barCount={38}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CreateMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
