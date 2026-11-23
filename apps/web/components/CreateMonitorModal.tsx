"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { api } from "../lib/api";
import { DEFAULT_REGIONS } from "../lib/store";
import { Website } from "../lib/types";

interface CreateMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (website: Website) => void;
}

export function CreateMonitorModal({ isOpen, onClose, onCreated }: CreateMonitorModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [method, setMethod] = useState("GET");
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [expectedStatusCode, setExpectedStatusCode] = useState(200);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "reg-us-east",
    "reg-eu-central",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleRegion = (id: string) => {
    if (selectedRegions.includes(id)) {
      if (selectedRegions.length <= 1) return; // Must have at least 1
      setSelectedRegions(selectedRegions.filter((r) => r !== id));
    } else {
      setSelectedRegions([...selectedRegions, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please specify a monitor name");
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await api.createWebsite({
        name,
        url,
        method,
        intervalSeconds: Number(intervalSeconds),
        expectedStatusCode: Number(expectedStatusCode),
        regionIds: selectedRegions,
      });

      onCreated(created);
      onClose();
      setName("");
      setUrl("https://");
    } catch (err: any) {
      setError(err?.message || "Failed to create monitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px", padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "rgba(91, 99, 211, 0.16)",
              border: "1px solid rgba(124, 135, 247, 0.25)",
              color: "#7C87F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icons.Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                Add New Monitor
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                Configure endpoint checks, interval frequency, and edge regions
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
            style={{ width: "32px", height: "32px", borderRadius: "8px" }}
          >
            <Icons.X size={15} />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            color: "#FB7185",
            fontSize: "13px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Icons.AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Monitor Name */}
          <div className="form-group">
            <label className="form-label">Monitor Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Production API Gateway"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* URL & Method */}
          <div style={{ display: "grid", gridTemplateColumns: "115px 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Method</label>
              <select
                className="form-input"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target URL</label>
              <input
                type="url"
                className="form-input font-mono"
                placeholder="https://api.yourdomain.com/health"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Check Interval & Expected Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Check Frequency</label>
              <select
                className="form-input"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
              >
                <option value={30}>Every 30 seconds (High-frequency)</option>
                <option value={60}>Every 1 minute (Recommended)</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Status Code</label>
              <input
                type="number"
                className="form-input font-mono"
                value={expectedStatusCode}
                onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
                placeholder="200"
              />
            </div>
          </div>

          {/* Monitoring Probe Regions */}
          <div className="form-group" style={{ marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="form-label" style={{ margin: 0 }}>Probe Edge Locations</label>
              <span style={{ fontSize: "12px", color: "var(--primary-light)", fontWeight: 500 }}>
                {selectedRegions.length} of {DEFAULT_REGIONS.length} selected
              </span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}>
              {DEFAULT_REGIONS.map((reg) => {
                const isChecked = selectedRegions.includes(reg.id);
                // Two-letter country/region code
                const codeChip = reg.code.startsWith("us") ? "US" : reg.code.startsWith("eu") ? "EU" : reg.code.startsWith("ap-south") ? "IN" : reg.code.startsWith("ap-northeast") ? "JP" : "GL";
                return (
                  <div
                    key={reg.id}
                    onClick={() => toggleRegion(reg.id)}
                    className={`region-card ${isChecked ? "region-card-selected" : ""}`}
                  >
                    <span className="region-chip">{codeChip}</span>
                    <span style={{
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: isChecked ? "#FFFFFF" : "var(--text-muted)",
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {reg.name}
                    </span>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      border: `1.5px solid ${isChecked ? "var(--primary-light)" : "rgba(114, 125, 161, 0.3)"}`,
                      backgroundColor: isChecked ? "var(--primary-color)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFF",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}>
                      {isChecked && <Icons.Check size={11} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(114, 125, 161, 0.15)",
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ height: "38px", padding: "0 18px", borderRadius: "8px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-button btn"
              disabled={loading}
              style={{ height: "38px", padding: "0 22px", borderRadius: "8px", fontWeight: 600 }}
            >
              {loading ? "Creating..." : "Start Monitoring"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
