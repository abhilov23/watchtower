"use client";

import { useEffect, useState } from "react";
import { Icons } from "./Icons";
import { api } from "../lib/api";
import { Region } from "../lib/types";

interface RegionInspectModalProps {
  regionId: string | null;
  onClose: () => void;
}

export function RegionInspectModal({ regionId, onClose }: RegionInspectModalProps) {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!regionId) return;
    setLoading(true);
    api.getRegionById(regionId).then((r) => {
      setRegion(r);
      setLoading(false);
    });
  }, [regionId]);

  if (!regionId) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(7, 8, 13, 0.78)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    }}>
      <div className="card" style={{
        width: "100%",
        maxWidth: "460px",
        padding: "28px",
        backgroundColor: "#0D0F1A",
        border: "1px solid rgba(114, 125, 161, 0.25)",
        borderRadius: "12px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>{region?.flag || "🌐"}</span>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF" }}>
                {loading ? "Inspecting Node..." : region?.name}
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                {region?.code || regionId}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "4px", color: "var(--text-dim)" }}>
            <Icons.X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            Fetching probe cluster diagnostics via GET /api/regions/{regionId}...
          </div>
        ) : region ? (
          <div>
            <div style={{
              backgroundColor: "rgba(17, 20, 34, 0.85)",
              border: "1px solid rgba(114, 125, 161, 0.15)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-dim)" }}>Edge Node Status</span>
                <span className="badge badge-green">Operational</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-dim)" }}>Region ID</span>
                <span style={{ color: "#FFF", fontFamily: "var(--font-mono)" }}>{region.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-dim)" }}>Routing Protocol</span>
                <span style={{ color: "#FFF" }}>Anycast BGP Edge</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--text-dim)" }}>Synthetic Node Health</span>
                <span style={{ color: "var(--status-up)", fontWeight: 600 }}>100% Healthy</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ height: "36px", padding: "0 18px" }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)" }}>
            Region details unavailable.
          </div>
        )}
      </div>
    </div>
  );
}
