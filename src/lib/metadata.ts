import type { Metadata } from "next";

const siteUrl = "https://theqall.com";

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Qall — The Performance Engine for Insurance Distribution",
    template: "%s | Qall",
  },
  description:
    "Qall is the CRM built for insurance brokerages. Unified data, real-time performance tracking, automated commissions, and AI-powered efficiency.",
  keywords: [
    "insurance CRM",
    "insurance distribution",
    "brokerage management",
    "commission tracking",
    "advisor management",
    "insurance technology",
  ],
  authors: [{ name: "Qall" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Qall",
    title: "Qall — The Performance Engine for Insurance Distribution",
    description:
      "Qall is the CRM built for insurance brokerages. Unified data, real-time performance tracking, automated commissions, and AI-powered efficiency.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Qall — Insurance Distribution Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qall — The Performance Engine for Insurance Distribution",
    description:
      "Qall is the CRM built for insurance brokerages. Unified data, real-time performance tracking, automated commissions.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
