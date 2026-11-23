"use client";

import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { api } from "../lib/api";
import { Website, HttpMethod } from "../lib/types";

interface EditMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: Website;
  onUpdated: (updated: Website) => void;
}

export function EditMonitorModal({ isOpen, onClose, website, onUpdated }: EditMonitorModalProps) {
  const [name, setName] = useState(website.name);
  const [url, setUrl] = useState(website.url);
  const [method, setMethod] = useState<HttpMethod>(website.method || "GET");
  const [intervalSeconds, setIntervalSeconds] = useState(website.intervalSeconds || 60);
  const [timeoutMs, setTimeoutMs] = useState(website.timeoutMs || 10000);
  const [expectedStatusCode, setExpectedStatusCode] = useState(website.expectedStatusCode || 200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (website) {
      setName(website.name);
      setUrl(website.url);
      setMethod(website.method || "GET");
      setIntervalSeconds(website.intervalSeconds || 60);
      setTimeoutMs(website.timeoutMs || 10000);
      setExpectedStatusCode(website.expectedStatusCode || 200);
      setError(null);
    }
  }, [website, isOpen]);

  if (!isOpen) return null;

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
      const updated = await api.updateWebsite(website.id, {
        name: name.trim(),
        url: url.trim(),
        method,
        intervalSeconds,
        timeoutMs,
        expectedStatusCode,
      });

      if (updated) {
        onUpdated(updated);
        onClose();
      } else {
        setError("Failed to update monitor configuration");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: "520px",
        padding: "28px",
        backgroundColor: "#0D0F1A",
        border: "1px solid rgba(114, 125, 161, 0.25)",
        borderRadius: "12px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
      }}>
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>Configure Monitor</h2>
            <p style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "4px" }}>
              Update check settings, target URL, and response requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ color: "var(--text-dim)", padding: "4px" }}
          >
            <Icons.X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            borderRadius: "6px",
            padding: "10px 14px",
            color: "#FB7185",
            fontSize: "13px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Icons.AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Monitor Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production API Gateway"
              required
            />
          </div>

          {/* URL & Method */}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "10px", marginBottom: "16px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Method</label>
              <select
                className="form-input"
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                style={{ cursor: "pointer" }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target URL</label>
              <input
                type="text"
                className="form-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
                required
              />
            </div>
          </div>

          {/* Frequency & Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Check Frequency</label>
              <select
                className="form-input"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                style={{ cursor: "pointer" }}
              >
                <option value={30}>Every 30 seconds</option>
                <option value={60}>Every 1 minute (Recommended)</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
                <option value={600}>Every 10 minutes</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Expected Status Code</label>
              <input
                type="number"
                className="form-input"
                value={expectedStatusCode}
                onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
                min={100}
                max={599}
                required
              />
            </div>
          </div>

          {/* Timeout */}
          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label">HTTP Timeout Threshold</label>
            <select
              className="form-input"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(Number(e.target.value))}
              style={{ cursor: "pointer" }}
            >
              <option value={3000}>3 seconds (Fast fail)</option>
              <option value={5000}>5 seconds (Standard)</option>
              <option value={10000}>10 seconds (Recommended)</option>
              <option value={30000}>30 seconds (Long-running requests)</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cta-button btn"
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
