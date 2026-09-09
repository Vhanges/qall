export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export interface ComparisonRow {
  label: string;
  standard: string;
  qall: string;
}

export interface PillarItem {
  title: string;
  description: string;
  icon: string;
  stats?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  barrier: string;
  message: string;
}

// V2 Features Page Types
export interface ComparisonRowV2 {
  label: string;
  standard: string;
  qall: string;
  detail?: string;
  svgKey: "operational" | "financial" | "advisor" | "engagement";
}

export interface ManagementFeature {
  title: string;
  description: string;
  bullets?: string[];
  closingNote?: string;
  colSpan: number;
}

export interface AdvisorFeature {
  title: string;
  description: string;
  colSpan: number;
}

export interface ConclusionRow {
  title: string;
  description: string;
}
