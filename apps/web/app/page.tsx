"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroPreview } from "../components/HeroPreview";
import { Icons } from "../components/Icons";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      router.push(`/register?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-body)" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION (Exact Better Stack Clone) */}
        {/* HERO SECTION */}
        <section style={{
          padding: "70px 0 60px",
          position: "relative",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* Background Grid & Better Stack Atmosphere Flare */}
          <div className="tech-grid-bg" />
          <div className="hero-flare" />
          <div className="hero-flare-cone" />

          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            {/* Main Headline */}
            <h1 className="homepage-heading-gradient animate-fade-in-up" style={{
              fontSize: "clamp(42px, 5.5vw, 72px)",
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              maxWidth: "680px",
              margin: "0 auto 20px",
            }}>
              The most reliable <br />
              Watchtower monitoring
            </h1>

            {/* Subhead */}
            <p className="animate-fade-in-up" style={{
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "var(--text-muted)",
              maxWidth: "520px",
              margin: "0 auto 32px",
              lineHeight: 1.45,
            }}>
              Get 10 monitors, 10 heartbeats and a status page with 3-minute checks totally free.
            </p>

            {/* Better Stack Single-Line Signup Form */}
            <form
              onSubmit={handleStart}
              className="animate-fade-in-up"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <input
                type="email"
                placeholder="Your work e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ width: "290px" }}
              />
              <button type="submit" className="cta-button" style={{ height: "48px", padding: "0 24px", fontSize: "15px" }}>
                Get started in 30 seconds
              </button>
            </form>

            <p style={{ fontSize: "13px", color: "var(--text-dim)", marginBottom: "40px" }}>
              Looking for an enterprise solution?{" "}
              <Link href="/dashboard" style={{ color: "#FFFFFF", textDecoration: "underline" }}>
                Book a demo
              </Link>
            </p>

            {/* Hero Mockup Preview */}
            <HeroPreview />
          </div>
        </section>

        {/* LOGOS / SOCIAL PROOF CONTINUOUS MARQUEE BAR */}
        <section style={{
          padding: "40px 0",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "rgba(11, 12, 20, 0.75)",
          textAlign: "center",
          overflow: "hidden",
        }}>
          <div className="container" style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase" }}>
              Relied on by the world's best engineering teams
            </p>
          </div>

          <div className="marquee-container">
            <div className="marquee-track">
              {[
                "RASPBERRY PI",
                "BRAVE",
                "NORDVPN",
                "UNICEF",
                "DECATHLON",
                "SHOPIFY",
                "VERCEL",
                "SUPABASE",
                "FLY.IO",
                "CLOUDFLARE",
                "RASPBERRY PI",
                "BRAVE",
                "NORDVPN",
                "UNICEF",
                "DECATHLON",
                "SHOPIFY",
                "VERCEL",
                "SUPABASE",
                "FLY.IO",
                "CLOUDFLARE",
              ].map((name, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "#8F9BB7",
                    opacity: 0.7,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#8F9BB7";
                    e.currentTarget.style.opacity = "0.7";
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: NO FALSE POSITIVES */}
        <section id="features" style={{ padding: "100px 0" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "56px",
              alignItems: "center",
            }}>
              <div>
                <h2 style={{
                  fontSize: "clamp(30px, 3.8vw, 46px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  marginBottom: "16px",
                  color: "#FFFFFF",
                }}>
                  Best-in-class Watchtower monitoring. <br />
                  <span style={{ color: "var(--text-muted)" }}>No false positives.</span>
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "17px", lineHeight: 1.6, marginBottom: "28px" }}>
                  Get a screenshot of the error and a second-by-second timeline with our fastest 30-second checks.
                </p>
                <Link href="/register" className="btn btn-secondary" style={{ padding: "12px 20px" }}>
                  Explore website monitoring <Icons.ChevronRight size={14} />
                </Link>
              </div>

              {/* Error Inspection Card (Like Better Stack Screenshot with Live Escalation Ticker) */}
              <div className="card-glow-hover" style={{
                backgroundColor: "#121422",
                borderRadius: "14px",
                border: "1px solid rgba(114, 125, 161, 0.2)",
                padding: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--status-down)", marginBottom: "4px" }}>
                      Error 502
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                      Bad gateway · Ray ID: 5e933f4d8861ef45
                    </div>
                  </div>
                  <span className="badge badge-red font-mono">Incident #17</span>
                </div>

                {/* Nodes verification */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  textAlign: "center",
                  backgroundColor: "#0D0F1A",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(114, 125, 161, 0.12)",
                  marginBottom: "16px",
                }}>
                  <div style={{ transition: "transform 0.2s ease" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--status-up)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Icons.Check size={16} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#FFF", fontWeight: 600 }}>US East</div>
                    <div style={{ fontSize: "11px", color: "var(--status-up)" }}>200 OK · 24ms</div>
                  </div>

                  <div style={{ transition: "transform 0.2s ease" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--status-up)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Icons.Check size={16} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#FFF", fontWeight: 600 }}>Frankfurt</div>
                    <div style={{ fontSize: "11px", color: "var(--status-up)" }}>200 OK · 31ms</div>
                  </div>

                  <div style={{ transition: "transform 0.2s ease" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(244, 63, 94, 0.15)", color: "var(--status-down)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Icons.X size={16} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#FFF", fontWeight: 600 }}>Tokyo Edge</div>
                    <div style={{ fontSize: "11px", color: "var(--status-down)" }}>502 Error · 1240ms</div>
                  </div>
                </div>

                {/* Live Escalation Step Ticker (Exact Better Stack Micro-Animation) */}
                <div style={{
                  backgroundColor: "rgba(114, 125, 161, 0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(114, 125, 161, 0.15)",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}>
                  <div className="alert-ticker-container">
                    <div className="alert-ticker-track" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <div style={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", color: "#FB7185" }}>
                        <span className="pulse-dot pulse-dot-red" />
                        <span><strong>00:00</strong> — Tokyo edge reports 502 Bad Gateway</span>
                      </div>
                      <div style={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", color: "#7C87F7" }}>
                        <span className="pulse-dot" style={{ backgroundColor: "#7C87F7" }} />
                        <span><strong>00:02</strong> — Second-opinion probe dispatched from Frankfurt & US</span>
                      </div>
                      <div style={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", color: "#C9D3EE" }}>
                        <Icons.Check size={14} color="#34D399" />
                        <span><strong>00:05</strong> — Automated screenshot and HTTP headers captured</span>
                      </div>
                      <div style={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", color: "#34D399" }}>
                        <span className="pulse-dot pulse-dot-green" />
                        <span><strong>00:09</strong> — Phone call & Slack incident paged to on-call engineer</span>
                      </div>
                      <div style={{ height: "38px", display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF" }}>
                        <Icons.Check size={14} color="#34D399" />
                        <span><strong>00:45</strong> — Incident logged & status page automatically updated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS GRID */}
        <section style={{ padding: "60px 0 100px", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}>
              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Activity size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Traceroute & MTR for timeouts
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Get automatic traceroute and MTR reports attached directly to every alert notification. Never guess which hop failed.
                </p>
              </div>

              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Globe size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Screenshots & error logs
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  See exactly what your visitors saw when your website went down, with full HTML snapshots and error response bodies.
                </p>
              </div>

              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Zap size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Playwright transaction checks
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Monitor key user flows like user checkout, cart checkout, and authentication with real headless browser synthetic tests.
                </p>
              </div>

              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Shield size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  From SSL to domain expiration
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Never let an expired SSL certificate or forgotten domain renewal take your website down. We notify you 30, 14, and 7 days prior.
                </p>
              </div>

              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Server size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  30s checks around the world
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Multi-region probes running concurrently across North America, Europe, Asia, and Australia.
                </p>
              </div>

              <div className="card card-glow-hover">
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(91, 99, 211, 0.15)", color: "#7C87F7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <Icons.Bell size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                  Cron & heartbeat monitoring
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                  Ensure your recurring backups, queue processors, and scheduled jobs run on time with passive ping heartbeats.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" style={{ padding: "80px 0 100px", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 50px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
                Predictable, transparent pricing
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
                30x cheaper than Datadog. Unlimited seats on all plans.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}>
              {/* Free */}
              <div className="card card-glow-hover" style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>Free</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>For individual side projects</p>
                <div style={{ fontSize: "38px", fontWeight: 700, color: "#FFFFFF", marginBottom: "24px" }}>
                  $0 <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 400 }}>/ month</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "32px", flex: 1 }}>
                  <li>✓ 10 monitors</li>
                  <li>✓ 3-minute checks</li>
                  <li>✓ 1 status page</li>
                  <li>✓ Email alerts</li>
                </ul>
                <Link href="/register" className="btn btn-secondary" style={{ width: "100%" }}>
                  Get started
                </Link>
              </div>

              {/* Freelancer / Pro */}
              <div className="card card-glow-hover" style={{ padding: "32px", display: "flex", flexDirection: "column", borderColor: "rgba(124, 135, 247, 0.4)", position: "relative" }}>
                <div style={{ position: "absolute", top: "-11px", right: "20px", background: "var(--primary-btn-bg)", padding: "2px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, color: "#FFF" }}>
                  POPULAR
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>Freelancer</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>For professional web apps & startups</p>
                <div style={{ fontSize: "38px", fontWeight: 700, color: "#FFFFFF", marginBottom: "24px" }}>
                  $24 <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 400 }}>/ month</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#FFFFFF", marginBottom: "32px", flex: 1 }}>
                  <li>✓ <strong>50 monitors</strong></li>
                  <li>✓ <strong>30-second check intervals</strong></li>
                  <li>✓ Unlimited status pages with custom domains</li>
                  <li>✓ Multi-region checks</li>
                </ul>
                <Link href="/register" className="cta-button btn" style={{ width: "100%", height: "42px" }}>
                  Start 14-day trial
                </Link>
              </div>

              {/* Team */}
              <div className="card card-glow-hover" style={{ padding: "32px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>Team</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>For engineering teams & high-scale infra</p>
                <div style={{ fontSize: "38px", fontWeight: 700, color: "#FFFFFF", marginBottom: "24px" }}>
                  $85 <span style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 400 }}>/ month</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "32px", flex: 1 }}>
                  <li>✓ 150 monitors</li>
                  <li>✓ 30-second check frequency</li>
                  <li>✓ Unlimited phone call & SMS alerts</li>
                  <li>✓ On-call scheduling & escalation policies</li>
                  <li>✓ Slack, Teams, and Webhook integrations</li>
                </ul>
                <Link href="/register" className="btn btn-secondary" style={{ width: "100%" }}>
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM FINAL CTA */}
        <section style={{ padding: "80px 0", textAlign: "center", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="container" style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#FFFFFF", marginBottom: "16px" }}>
              Get started in 30 seconds
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "28px" }}>
              Better Watchtower monitoring with zero false alarms. Free forever.
            </p>
            <Link href="/register" className="cta-button btn" style={{ height: "48px", padding: "0 28px", fontSize: "15px" }}>
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
