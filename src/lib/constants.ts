import type { NavLink, Feature, Testimonial, Stat, ComparisonRow, PillarItem } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Walkthrough", href: "/walkthrough" },
  { label: "Why Qall", href: "/why-qall" },
  { label: "Contact", href: "/contact" },
];

export const FEATURES: Feature[] = [
  {
    title: "Unified Source of Truth",
    description:
      "Eliminate data silos. Every advisor, every policy, every commission — one platform, one truth.",
    icon: "database",
  },
  {
    title: "Performance Tracking",
    description:
      "Real-time dashboards that show exactly who's producing, what's converting, and where revenue flows.",
    icon: "chart",
  },
  {
    title: "AI-Powered Capacity",
    description:
      "Intelligent automation that removes administrative drag and unlocks advisor selling time.",
    icon: "brain",
  },
  {
    title: "Operational Efficiency",
    description:
      "Streamline from quote to commission. No more spreadsheet chaos or manual reconciliation.",
    icon: "lightning",
  },
  {
    title: "Client Engagement",
    description:
      "Deepen relationships with data-driven insights that keep your clients coming back.",
    icon: "users",
  },
];

export const STATS: Stat[] = [
  { value: 32, suffix: "%", label: "Increase in Sales Revenue" },
  { value: 99.8, suffix: "%", label: "Commission Accuracy" },
  { value: 5, suffix: "x", label: "Faster Lead Processing" },
  { value: 40, suffix: "%", label: "Reduction in Admin Time" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Tom Richardson",
    role: "Managing Director",
    company: "Sterling Insurance Group",
    quote:
      "Qall transformed how we manage our network. We went from drowning in spreadsheets to having real-time visibility across every metric that matters. The impact on our bottom line was immediate.",
  },
  {
    name: "Gurpreet Dhillon",
    role: "Head of Operations",
    company: "Pinnacle Brokers",
    quote:
      "The commission tracking alone paid for the platform in the first quarter. But it's the performance dashboards that changed how we run the business. We can finally see what's actually driving revenue.",
  },
  {
    name: "Sarah Mitchell",
    role: "CEO",
    company: "Apex Insurance Partners",
    quote:
      "We evaluated six platforms before choosing Qall. Nothing else came close to the depth of insight it gives us. Our advisor retention is up 28% because they finally feel supported by the tools they use every day.",
  },
  {
    name: "James Hargreaves",
    role: "Chief Revenue Officer",
    company: "Bridgepoint Financial",
    quote:
      "Before Qall, we were losing leads between handoffs. Now every lead is tracked, scored, and routed automatically. Our conversion rate doubled in the first six months.",
  },
  {
    name: "Priya Nair",
    role: "Operations Director",
    company: "Vanguard Broking Group",
    quote:
      "The admin burden on our advisors was killing productivity. Qall cut that in half overnight. Our team is selling more, complaining less, and the numbers prove it.",
  },
  {
    name: "David Kowalski",
    role: "Managing Partner",
    company: "Northfield Insurance Network",
    quote:
      "Qall gave us visibility we didn't know we were missing. We discovered an entire revenue channel that was underperforming and fixed it within weeks. That alone was worth the investment ten times over.",
  },
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Lead Management",
    standard: "Manual spreadsheets, lost leads",
    qall: "Automated capture, scoring & routing",
  },
  {
    label: "Commission Tracking",
    standard: "Monthly reconciliation, 3-5% error rate",
    qall: "Real-time tracking, 99.8% accuracy",
  },
  {
    label: "Performance Visibility",
    standard: "Quarterly reports, outdated data",
    qall: "Live dashboards, instant insights",
  },
  {
    label: "Advisor Management",
    standard: "Fragmented tools, no oversight",
    qall: "Unified platform, complete visibility",
  },
];

export const PILLARS: PillarItem[] = [
  {
    title: "Eliminate Admin Drag",
    description:
      "Your advisors spend 40% of their time on admin. Qall automates the repetitive work — data entry, commission reconciliation, reporting — so your team sells more and manages less.",
    icon: "rocket",
    stats: "40% less admin time",
  },
  {
    title: "Financial Precision",
    description:
      "Every commission, every override, every clawback — tracked automatically with 99.8% accuracy. No more end-of-month fire drills or revenue leakage.",
    icon: "target",
    stats: "99.8% accuracy",
  },
  {
    title: "Maximize Revenue",
    description:
      "See exactly which advisors, products, and channels drive your revenue. Make data-backed decisions that compound growth quarter after quarter.",
    icon: "trending",
    stats: "32% revenue increase",
  },
];

export const BARRIERS = [
  { value: "", label: "Select your primary barrier" },
  { value: "advisor-capacity", label: "Advisor Capacity" },
  { value: "manual-reporting", label: "Manual Reporting" },
  { value: "missed-cross-sell", label: "Missed Cross-Sell Revenue" },
  { value: "inefficient-client-access", label: "Inefficient Client Access" },
  { value: "other", label: "Other" },
];

export const MANAGEMENT_BENEFITS = [
  "Real-time network performance dashboards",
  "Automated commission calculations & reconciliation",
  "Advisor productivity scoring & benchmarking",
  "Revenue attribution by product, channel & advisor",
  "Compliance tracking & audit trails",
  "Custom reporting & data exports",
];

export const ADVISOR_BENEFITS = [
  "Personal performance dashboard",
  "Transparent commission tracking",
  "Automated lead assignment & follow-ups",
  "Client portfolio management",
  "Digital quote-to-bind workflows",
  "Mobile-optimized interface",
];
