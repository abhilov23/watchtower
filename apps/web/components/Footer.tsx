import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        backgroundColor: "#090A12",
        padding: "60px 0 32px",
        fontSize: "13px",
        color: "var(--text-muted)",
      }}
    >
      <div className="container">
        {/* Top summary row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "32px",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: 500 }}>
            30x cheaper than Datadog. Predictable pricing. Exceptional customer
            support.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="tel:+16289003830" style={{ color: "var(--text-nav)" }}>
              +1 (628) 900-3830
            </a>
            <a
              href="mailto:hello@watchtower.dev"
              style={{ color: "var(--text-nav)" }}
            >
              hello@watchtower.dev
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              Product
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <Link href="/#features">Watchtower Monitoring</Link>
              </li>
              <li>
                <Link href="/dashboard">Incident Management</Link>
              </li>
              <li>
                <Link href="/dashboard/status-pages">Status Pages</Link>
              </li>
              <li>
                <Link href="/#pricing">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              Integrations
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <a href="#">Slack</a>
              </li>
              <li>
                <a href="#">Microsoft Teams</a>
              </li>
              <li>
                <a href="#">PagerDuty</a>
              </li>
              <li>
                <a href="#">Datadog</a>
              </li>
            </ul>
          </div>

          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              Comparisons
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <a href="#">vs. Pingdom</a>
              </li>
              <li>
                <a href="#">vs. Datadog</a>
              </li>
              <li>
                <a href="#">vs. Traditional Tools</a>
              </li>
              <li>
                <a href="#">vs. PagerDuty</a>
              </li>
            </ul>
          </div>

          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                marginBottom: "14px",
              }}
            >
              Legal & Status
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/gdpr">GDPR</Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span className="pulse-dot pulse-dot-green" /> System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-subtle)",
            color: "var(--text-dim)",
            fontSize: "12px",
          }}
        >
          <div>
            © {new Date().getFullYear()} Watchtower, Inc. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "inherit" }}>
              Twitter
            </a>
            <a href="#" style={{ color: "inherit" }}>
              GitHub
            </a>
            <a href="#" style={{ color: "inherit" }}>
              LinkedIn
            </a>
            <a href="#" style={{ color: "inherit" }}>
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
