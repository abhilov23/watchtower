"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { api } from "../lib/api";
import { StatusPage } from "../lib/types";

interface CreateStatusPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (page: StatusPage) => void;
}

export function CreateStatusPageModal({ isOpen, onClose, onCreated }: CreateStatusPageModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a status page name.");
      return;
    }
    if (!slug.trim()) {
      setError("Please provide a URL slug.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await api.createStatusPage({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        isPublished: true,
      });

      onCreated(created);
      setName("");
      setSlug("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create status page");
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
        maxWidth: "500px",
        padding: "28px",
        backgroundColor: "#0D0F1A",
        border: "1px solid rgba(114, 125, 161, 0.25)",
        borderRadius: "12px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>Create Status Page</h2>
            <p style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "4px" }}>
              Publish a public incident and uptime page for your end users.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: "4px", color: "var(--text-dim)" }}>
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
          <div className="form-group">
            <label className="form-label">Page Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Acme Cloud Status"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                backgroundColor: "rgba(17, 20, 34, 0.9)",
                border: "1px solid rgba(114, 125, 161, 0.25)",
                borderRight: "none",
                borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)",
                padding: "0 10px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                color: "var(--text-dim)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}>
                /status/
              </span>
              <input
                type="text"
                className="form-input font-mono"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                placeholder="acme-cloud"
                style={{ borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Real-time status updates and incident alerts for our users."
              rows={3}
              style={{ resize: "none", height: "80px", paddingTop: "8px" }}
            />
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
              {loading ? "Creating..." : "Publish Status Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
