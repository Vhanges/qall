import React, { type ReactNode } from "react";
import type { Testimonial } from "@/types";

/* ─── Hero ─── */
export const HERO_V2 = {
  headline: "The Future of Insurance Distribution is a Better Qall.",
  subheadline:
    "The premier insurance-specific CRM engineered to automate complex financials, track revenue in real-time, and maximize advisor capacity for high-growth brokerages.",
  ctaSubtext: "Join 50+ high-velocity brokerages scaling on Qall.",
  primaryCTA: { text: "Claim Your Qall Advantage", href: "/contact#booking" },
  secondaryCTA: { text: "See Features", href: "/features" },
  stats: [
    { value: 32, suffix: "%", label: "Revenue Uplift" },
    { value: 99.8, suffix: "%", decimals: 1, label: "Commission Accuracy" },
    { value: 5, suffix: "x", label: "Faster Processing" },
    { value: 40, suffix: "%", label: "Less Admin Time" },
  ],
};

/* ─── Infrastructure Intro ─── */
export const INFRA_INTRO_V2 = {
  badge: "",
  heading: "High-Performance Insurance CRM & Brokerage Management",
  body: "Qall unifies your data, automates financials, and delivers the intelligence your advisors need — all in one platform.",
};

/* ─── Feature Blocks ─── */
export interface FeatureBlockV2 {
  id: string;
  number: string;
  title: string;
  subtitle: ReactNode;
  description: ReactNode;
  relatesTo: string;
  highlights: string[];
}

export const FEATURES_V2: FeatureBlockV2[] = [
  {
    id: "unified-source",
    number: "01",
    title: "Zero-Latency Operations",
    subtitle: <>Kill the <span className="text-orange-500">&ldquo;Search Tax&rdquo;</span> with 360° Data Clarity.</>,
    description:
      <>Stop toggling between silos. Qall unifies every policy and interaction into one high-velocity hub, putting <span className="text-orange-500">accurate data</span> in your hands instantly.</>,
    relatesTo: "Operational Flow",
    highlights: [
      "Single database for every policy and client",
      "Eliminate disconnected silos",
      "Instant data access",
    ],
  },
  {
    id: "performance-tracking",
    number: "02",
    title: "Precision Revenue Intelligence",
    subtitle: <>Real-Time Visibility. <span className="text-orange-500">Zero Guesswork.</span></>,
    description:
      <>Monitor your agency&apos;s pulse with live dashboards tracking income vs. clawbacks. Gain the total <span className="text-orange-500">financial transparency</span> needed to protect your margins and scale with confidence.</>,
    relatesTo: "Financial Tracking",
    highlights: [
      "Automated income vs. clawback dashboards",
      "Financial transparency for decisions",
      "Protect your bottom line",
    ],
  },
  {
    id: "ai-advisor",
    number: "03",
    title: "AI-Driven Advisor Velocity",
    subtitle: <>Turn Static Records into <span className="text-orange-500">Actionable Growth.</span></>,
    description:
      <>Our AI engine surfaces coverage gaps and flags renewal leads proactively. Shift your team from manual admin to high-value consulting by uncovering the <span className="text-orange-500">hidden revenue</span> in your book.</>,
    relatesTo: "Advisor Output",
    highlights: [
      "Surfaces coverage gaps and renewal leads",
      "From admin to consulting",
      "Hidden revenue uncovered",
    ],
  },
  {
    id: "efficiency",
    number: "04",
    title: "High-Integrity Automation",
    subtitle: <>Erase Admin Drag. <span className="text-orange-500">Protect Your Margins.</span></>,
    description:
      <>Settle for nothing less than total compliance. Automate data entry and follow-ups to eliminate human error and <span className="text-orange-500">ensure consistency</span> across every branch of your brokerage.</>,
    relatesTo: "Risk & Efficiency",
    highlights: [
      "Automated data entry and logging",
      "Compliance across every branch",
      "Eliminate human error",
    ],
  },
  {
    id: "client-engagement",
    number: "05",
    title: "Proactive Relationship Scaling",
    subtitle: <>Better Experience. <span className="text-orange-500">Better Qall.</span></>,
    description:
      <>Scale your engagement without losing the human touch. Access a unified history to anticipate client needs and deliver <span className="text-orange-500">tailored service</span> before a renewal becomes a &ldquo;to-do.&rdquo;</>,
    relatesTo: "Client Experience",
    highlights: [
      "Full policy history in one view",
      "Anticipate renewal needs",
      "Better Qall, better experience",
    ],
  },
];

/* ─── Data Results ─── */
export const DATA_RESULTS_V2 = {
  badge: "Real Results",
  heading: "The Numbers Speak",
  subheading: "Real results from a live brokerage on Qall.",
  preQall: 57879,
  postQall: 76400,
  upliftPercent: 32,
  stats: [
    { value: 32, suffix: "%", label: "Revenue Uplift" },
    { value: 76.4, suffix: "k", prefix: "£", label: "Monthly Commission", decimals: 1 },
    { value: 100, suffix: "%", label: "Compliance" },
    { value: 96, suffix: "%", prefix: "+", label: "Speed to Lead" },
  ],
};

/* ─── Testimonials ─── */
export const TESTIMONIALS_V2: Testimonial[] = [
  {
    name: "Tom Richardson",
    role: "Managing Director",
    company: "Sterling Insurance Group",
    quote:
      "Having worked as an advisor for over 20 years, Qall is the first solution that actually feels tailor-made for my role as a broker. It understands the nuances of what we do daily and delivers tools that genuinely make my job easier and more productive.",
    image: "/images/testimonials/tom-richardson.png",
  },
  {
    name: "Gurpreet Dhillon",
    role: "Head of Operations",
    company: "Pinnacle Brokers",
    quote:
      "I have found QALL to be easy to navigate, user friendly, and provide good visibility on all the key metrics that matter to our operation. The commission tracking alone transformed our monthly reconciliation process.",
    image: "/images/testimonials/gurpreet-dhillon.png",
  },
  {
    name: "Sarah Mitchell",
    role: "CEO",
    company: "Apex Insurance Partners",
    quote:
      "We evaluated six platforms before choosing Qall. Nothing else came close to the depth of insight it gives us. Our advisor retention is up 28% because they finally feel supported by the tools they use every day.",
    image: "/images/testimonials/sarah-mitchell.png",
  },
  {
    name: "James Hargreaves",
    role: "Chief Revenue Officer",
    company: "Bridgepoint Financial",
    quote:
      "Before Qall, we were losing leads between handoffs. Now every lead is tracked, scored, and routed automatically. Our conversion rate doubled in the first six months.",
    image: "/images/testimonials/james-hargreaves.png",
  },
  {
    name: "Priya Nair",
    role: "Operations Director",
    company: "Vanguard Broking Group",
    quote:
      "The admin burden on our advisors was killing productivity. Qall cut that in half overnight. Our team is selling more, complaining less, and the numbers prove it.",
    image: "/images/testimonials/priya-nair.png",
  },
  {
    name: "David Kowalski",
    role: "Managing Partner",
    company: "Northfield Insurance Network",
    quote:
      "Qall gave us visibility we didn't know we were missing. We discovered an entire revenue channel that was underperforming and fixed it within weeks. That alone was worth the investment ten times over.",
    image: "/images/testimonials/david-kowalski.png",
  },
];

/* ─── Closing CTA ─── */
export const CLOSING_V2 = {
  title: "Outpace the Market. Outperform the Competition.",
  description:
    "Join the brokerages already using Qall to drive revenue, automate compliance, and scale their teams.",
  buttonText: "Book a Demo",
  buttonHref: "/contact#booking",
};
