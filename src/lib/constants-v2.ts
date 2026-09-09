import type {
  ComparisonRowV2,
  ManagementFeature,
  AdvisorFeature,
  ConclusionRow,
} from "@/types";

export const EXPLAINER_SUBHEADLINE =
  "Standard CRM vs. Qall Infrastructure: Compare the speed of a unified central nervous system against the 'Search Tax' of fragmented legacy tools.";

export const COMPARISON_ROWS_V2: ComparisonRowV2[] = [
  {
    label: "Operational Flow",
    standard: "Fragmented tools and manual entry.",
    qall: "Unified Intelligence: One system for every record.",
    detail:
      "The Unified Client View: Centralizes all records, interactions, and policy details to reduce prep time and boost advisor efficiency.",
    svgKey: "operational",
  },
  {
    label: "Financial Tracking",
    standard: '"Best guess" on commissions.',
    qall: "Total Clarity: Real-time Income vs. Clawback tracking.",
    detail:
      "Real-Time Revenue Velocity: Replaces guesswork with precise tracking of leads and advisor activity to boost conversions without delays.",
    svgKey: "financial",
  },
  {
    label: "Advisor Output",
    standard: "Double bookings and lost notes.",
    qall: "High-Velocity Sales: Integrated scheduling and smart filters.",
    detail:
      "Eliminate Administrative Drag: By shifting routine tasks to secure client portals, advisors can focus more on revenue-generating work and portfolio growth.",
    svgKey: "advisor",
  },
  {
    label: "Engagement Logs",
    standard: "Scattered SMS and call history.",
    qall: "Seamless Archiving: Auto-saved recordings and SMS logs.",
    svgKey: "engagement",
  },
];

export const MANAGEMENT_FEATURES: ManagementFeature[] = [
  {
    title: "All Your Business Data in One Place",
    description:
      "All client, policy, sales, and financial data are accessible in one system to eliminate tool-switching and ensure accurate, up-to-date information.",
    colSpan: 7,
  },
  {
    title: "Clear Financial Tracking & Reporting",
    description:
      "Built-in reporting offers full visibility into performance and revenue\u2014tracking income vs. clawbacks, commissions, premiums, and advisor activity\u2014supporting stronger financial control and forecasting.",
    colSpan: 5,
  },
  {
    title: "Advisor Performance & Activity Oversight",
    description:
      "Track advisor productivity with insights into leads, conversions, and communication activity to enable data-driven performance management and coaching.",
    colSpan: 12,
  },
  {
    title: "Compliance & Risk Visibility",
    description:
      "Gain real-time oversight of advisor compliance, engagement levels, and operational risk to support proactive coaching and regulatory confidence.",
    colSpan: 5,
  },
];

export const ADVISOR_FEATURES: AdvisorFeature[] = [
  {
    title: "Complete Client Records, Always Accessible",
    description:
      "Access complete client records in one place, enabling advisors to provide faster, more consistent service.",
    colSpan: 7,
  },
  {
    title: "Simple Calendar & Call Scheduling",
    description:
      "Easily manage appointments and calls with intuitive scheduling that prevents missed calls, double bookings, and follow-up gaps.",
    colSpan: 5,
  },
  {
    title: "Instant Access to Call Recordings & Messages",
    description:
      "Instantly access all call recordings and messages for streamlined follow-ups, quality checks, and compliance.",
    colSpan: 5,
  },
  {
    title: "Personalized Lead Management",
    description:
      "Advisors can easily filter and organize personalized lead lists by stage, provider, or criteria to stay focused and close deals faster.",
    colSpan: 7,
  },
];

export const CONCLUSION_MANAGEMENT: ConclusionRow[] = [
  {
    title: "Centralized Business Data",
    description:
      "Access all client, policy, sales, and financial information in one system — eliminating spreadsheets and disconnected tools.",
  },
  {
    title: "Financial Tracking & Reporting",
    description:
      "Monitor income vs. clawbacks, commission receivables vs. revenue received, and monthly premium payments with built-in reports.",
  },
  {
    title: "Advisor Sales Activity Oversight",
    description:
      "Track policies sold, clawbacks, and overall sales activity across the brokerage.",
  },
  {
    title: "Performance & Conversion Insights",
    description:
      "View leads assigned vs. sold, conversion rates, and call/SMS activity to assess productivity and sales behavior.",
  },
  {
    title: "Compliance & Productivity Visibility",
    description:
      "Gain real-time insight into advisor performance, engagement, and compliance to support coaching and growth.",
  },
];

export const CONCLUSION_ADVISOR: ConclusionRow[] = [
  {
    title: "Complete Client Records",
    description:
      "View and manage all client details, policies, notes, and interaction history within a single, organized profile.",
  },
  {
    title: "Simple Scheduling",
    description:
      "Easily manage calendars, appointments, and calls to avoid missed follow-ups or double bookings.",
  },
  {
    title: "Call & Message History",
    description:
      "Instant access to call recordings and SMS conversations for efficient follow-ups and compliance reviews.",
  },
  {
    title: "Personal Lead Management",
    description:
      "Manage a personal lead list with intuitive filters by stage, provider, and key criteria to stay focused and close faster.",
  },
  {
    title: "Focused, Easy-to-Use Interface",
    description:
      "A streamlined CRM experience designed to help advisors work efficiently and stay organized throughout the sales journey.",
  },
];
