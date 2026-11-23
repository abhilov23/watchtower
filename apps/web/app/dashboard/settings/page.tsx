"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";
import { User } from "../../../lib/types";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const u = await api.getMe();
      setUser(u);
      if (u) {
        setUsername(u.username || "");
        setEmail(u.email || "");
      }
    }
    loadUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!username.trim() || !email.trim()) {
      setError("Username and email cannot be empty.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    const res = await api.updateProfile({
      username: username.trim(),
      email: email.trim(),
      password: newPassword ? newPassword : undefined,
    });
    setSaving(false);

    if (res.success && res.data) {
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setNewPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } else {
      setError(res.message || "Failed to save profile changes.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", display: "flex", flexDirection: "column" }}>
      <DashboardHeader user={user} />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>Account & Escalation Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
            Configure account profile, notification channels, and API keys.
          </p>

          {error && (
            <div style={{
              backgroundColor: "rgba(244, 63, 94, 0.12)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#FB7185",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <Icons.AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Profile Section */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>User Profile</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex_engineer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@watchtower.dev"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Change Password (leave empty to keep current)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#8F9BB7",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Alert Channels */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>Incident Escalation Channels</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Email */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#0D0F1A",
                  border: "1px solid rgba(114, 125, 161, 0.14)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icons.Mail size={18} color="var(--primary-light)" />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>Email Alerts</div>
                      <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>Instant alert reports with error snapshots to {email || "your registered email"}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary-color)", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

            {/* API Token */}
            <div className="card" style={{ padding: "24px 28px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>Developer API Keys</h3>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Personal Access Token</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="password"
                    className="form-input font-mono"
                    value="wt_live_839f28a9b018c726354890d"
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => alert("API Token copied to clipboard")}
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "14px" }}>
              {saved && (
                <span style={{ color: "var(--status-up)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
                  <Icons.Check size={16} /> Preferences and profile saved!
                </span>
              )}
              <button
                type="submit"
                className="cta-button btn"
                disabled={saving}
                style={{ height: "40px", padding: "0 22px" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
