"use client";

import { useState, useEffect } from "react";
import { Icons } from "./Icons";
import { api } from "../lib/api";
import { StatusPage } from "../lib/types";

interface EditStatusPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusPage: StatusPage | null;
  onUpdated: (page: StatusPage) => void;
}

export function EditStatusPageModal({
  isOpen,
  onClose,
  statusPage,
  onUpdated,
}: EditStatusPageModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (statusPage) {
      setName(statusPage.name);
      setSlug(statusPage.slug);
      setDescription(statusPage.description || "");
      setIsPublished(statusPage.isPublished !== false);
      setError(null);
    }
  }, [statusPage, isOpen]);

  if (!isOpen || !statusPage) return null;

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
      const updated = await api.updateStatusPage(statusPage.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        isPublished,
      });

      if (updated) {
        onUpdated(updated);
        onClose();
      } else {
        setError("Failed to update status page");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update status page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
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
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "28px",
          backgroundColor: "#0D0F1A",
          border: "1px solid rgba(114, 125, 161, 0.25)",
          borderRadius: "12px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
              Configure Status Page
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              Update branding, URL slug, and visibility settings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: "4px", color: "var(--text-dim)" }}
          >
            <Icons.X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
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
            }}
          >
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
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Cloud Status"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
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
                }}
              >
                /status/
              </span>
              <input
                type="text"
                className="form-input font-mono"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""),
                  )
                }
                placeholder="acme-cloud"
                style={{
                  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Real-time status updates and incident alerts for our users."
              rows={3}
              style={{ resize: "none", height: "70px", paddingTop: "8px" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              backgroundColor: "#111424",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid rgba(114, 125, 161, 0.15)",
            }}
          >
            <div>
              <div
                style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}
              >
                Public Visibility
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                Allow anyone to view this status page without logging in
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "var(--primary-color)",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="cta-button btn" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
