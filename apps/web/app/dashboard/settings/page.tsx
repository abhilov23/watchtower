"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { Icons } from "../../../components/Icons";
import { api } from "../../../lib/api";
import { User } from "../../../lib/types";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const u = await api.getMe();
      setUser(u);
    }
    loadUser();
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)", display: "flex", flexDirection: "column" }}>
      <DashboardHeader user={user} />

      <main className="container" style={{ flex: 1, padding: "32px 20px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>Account & Escalation Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
            Configure notification channels, alert policies, and API keys.
          </p>

          {/* Profile Section */}
          <div className="card" style={{ padding: "24px 28px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>User Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input type="text" className="form-input" defaultValue={user?.username || "alex_engineer"} key={user?.username} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue={user?.email || "alex@watchtower.dev"} key={user?.email} />
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
                    <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>Instant alert reports with error snapshots</div>
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
            <div className="form-group">
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            {saved && (
              <span style={{ color: "var(--status-up)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
                <Icons.Check size={15} /> Preferences saved!
              </span>
            )}
            <button className="cta-button btn" onClick={handleSave} style={{ height: "40px", padding: "0 22px" }}>
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
