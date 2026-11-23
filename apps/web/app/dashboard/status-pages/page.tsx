"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { Icons } from "../../../components/Icons";
import { CreateStatusPageModal } from "../../../components/CreateStatusPageModal";
import { EditStatusPageModal } from "../../../components/EditStatusPageModal";
import { api } from "../../../lib/api";
import { User, StatusPage, Website } from "../../../lib/types";

export function StatusPagesView() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [statusPages, setStatusPages] = useState<StatusPage[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<StatusPage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const u = await api.getMe();
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      const [pages, sites] = await Promise.all([
        api.getStatusPages(),
        api.getWebsites(),
      ]);
      setStatusPages(pages);
      setWebsites(sites);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete status page "${name}"?`)) {
      const ok = await api.deleteStatusPage(id);
      if (ok) {
        setStatusPages((prev) => prev.filter((p) => p.id !== id));
        setToastMessage(`Status page "${name}" deleted.`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    }
  };

  const activeWebsites = websites.filter((w) => w.monitorStatus === "ACTIVE");
  const anyDown = activeWebsites.some((w) => w.currentStatus === "DOWN");
  const overallPercentage =
    activeWebsites.length === 0 ? "100.0" : anyDown ? "98.40" : "99.98";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DashboardHeader user={user} />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF" }}>
              Public Status Pages
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Publish real-time availability to keep your customers informed
              during outages.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="cta-button btn btn-sm"
            style={{ height: "34px", fontSize: "13px" }}
          >
            <Icons.Plus size={15} /> Create Status Page
          </button>
        </div>

        {toastMessage && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "10px 16px",
              color: "#34D399",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Icons.Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-dim)",
            }}
          >
            Loading status pages...
          </div>
        ) : statusPages.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              maxWidth: "600px",
              margin: "40px auto",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "8px",
              }}
            >
              No status pages published yet
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginBottom: "24px",
              }}
            >
              Create your first public status page to communicate system health
              transparently.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="cta-button btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icons.Plus size={15} /> Create First Status Page
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "860px",
            }}
          >
            {statusPages.map((page) => (
              <div
                key={page.id}
                className="card"
                style={{ padding: "24px 28px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        className={`pulse-dot ${anyDown ? "pulse-dot-red" : "pulse-dot-green"}`}
                      />
                      <h3
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "#FFFFFF",
                        }}
                      >
                        {page.name}
                      </h3>
                      <span
                        className={`badge ${page.isPublished ? "badge-green" : "badge-neutral"}`}
                      >
                        {page.isPublished ? "LIVE" : "DRAFT"}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
                      Public URL:{" "}
                      <strong
                        style={{
                          color: "#FFF",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        /status/{page.slug}
                      </strong>
                    </p>
                    {page.description && (
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          marginTop: "6px",
                        }}
                      >
                        {page.description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link
                      href={`/status/${page.slug}`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                    >
                      <Icons.ExternalLink size={13} /> View Live
                    </Link>
                    <button
                      onClick={() => setEditingPage(page)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Icons.Settings size={13} /> Configure
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.name)}
                      className="btn btn-danger btn-sm"
                    >
                      <Icons.Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>

                {/* Monitored components list */}
                <div
                  style={{
                    backgroundColor: "#0D0F1A",
                    borderRadius: "8px",
                    padding: "16px 20px",
                    border: "1px solid rgba(114, 125, 161, 0.14)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      Monitored Components ({activeWebsites.length})
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: anyDown ? "#FB7185" : "var(--status-up)",
                        fontWeight: 500,
                      }}
                    >
                      {overallPercentage}% uptime overall
                    </span>
                  </div>

                  {activeWebsites.length === 0 ? (
                    <div style={{ color: "var(--text-dim)", fontSize: "12px" }}>
                      No active monitors configured. Add monitors from your
                      dashboard to display them here.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {activeWebsites.map((site) => {
                        const isDown = site.currentStatus === "DOWN";
                        return (
                          <div
                            key={site.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "13px",
                            }}
                          >
                            <span style={{ color: "var(--text-muted)" }}>
                              {site.name}
                            </span>
                            <span
                              style={{
                                color: isDown ? "#FB7185" : "var(--status-up)",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <span
                                className={`pulse-dot ${isDown ? "pulse-dot-red" : "pulse-dot-green"}`}
                                style={{ width: "6px", height: "6px" }}
                              />
                              {isDown ? "Service Disrupted" : "Operational"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateStatusPageModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newPage) => {
          setStatusPages((prev) => [newPage, ...prev]);
          setToastMessage(
            `Status page "${newPage.name}" created successfully!`,
          );
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      <EditStatusPageModal
        isOpen={!!editingPage}
        onClose={() => setEditingPage(null)}
        statusPage={editingPage}
        onUpdated={(updated) => {
          setStatusPages((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
          );
          setToastMessage(`Status page "${updated.name}" updated!`);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />
    </div>
  );
}

export default StatusPagesView;
