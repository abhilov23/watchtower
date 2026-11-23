import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watchtower — Radically Better Website Monitoring & Synthetic Probes",
  description:
    "Watchtower delivers multi-region synthetic checks, availability tracking, and incident alerting built for high-reliability engineering teams.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
