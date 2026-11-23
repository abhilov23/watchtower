"use client";

import Link from "next/link";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { Icons } from "../../../components/Icons";

export function StatusPagesView() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", display: "flex", flexDirection: "column" }}>
      <DashboardHeader user={null} />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF" }}>Public Status Pages</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
              Publish real-time availability to keep your customers informed during outages.
            </p>
          </div>
          <button className="cta-button btn btn-sm" style={{ height: "32px", fontSize: "13px" }}>
            <Icons.Plus size={15} /> Create Status Page
          </button>
        </div>

        {/* Status page card */}
        <div className="card" style={{ padding: "24px 28px", maxWidth: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span className="pulse-dot pulse-dot-green" />
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF" }}>Watchtower Live Status</h3>
                <span className="badge badge-green">LIVE</span>
              </div>
              <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
                https://status.watchtower.dev
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="/"
                target="_blank"
                className="btn btn-secondary btn-sm"
              >
                <Icons.ExternalLink size={13} /> View Live
              </a>
              <button className="btn btn-secondary btn-sm">
                <Icons.Settings size={13} /> Configure
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: "#0D0F1A",
            borderRadius: "8px",
            padding: "16px 20px",
            border: "1px solid rgba(114, 125, 161, 0.14)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Monitored Components (4)</span>
              <span style={{ fontSize: "12px", color: "var(--status-up)", fontWeight: 500 }}>99.99% overall</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "Production API", status: "Operational" },
                { name: "Stripe Payment Webhook", status: "Operational" },
                { name: "Authentication Cluster", status: "Operational" },
                { name: "Global Edge Assets (CDN)", status: "Operational" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                  <span style={{ color: "var(--text-muted)" }}>{c.name}</span>
                  <span style={{ color: "var(--status-up)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="pulse-dot pulse-dot-green" style={{ width: "6px", height: "6px" }} />
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StatusPagesView;
