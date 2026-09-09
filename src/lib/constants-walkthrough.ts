export type WalkthroughCategory = "advisor" | "admin";

export interface WalkthroughStep {
  title: string;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  videoPoster?: string;
}

export interface WalkthroughFlow {
  id: string;
  category: WalkthroughCategory;
  title: string;
  summary: string;
  steps: WalkthroughStep[];
}

export const WALKTHROUGH_CATEGORIES: {
  id: WalkthroughCategory;
  label: string;
  heading: string;
  subheading: string;
}[] = [
  {
    id: "advisor",
    label: "For Advisors",
    heading: "Advisor flows",
    subheading:
      "The daily rhythms your team moves through — onboarding clients, opening profiles, and submitting compliance.",
  },
  {
    id: "admin",
    label: "For Admins",
    heading: "Admin flows",
    subheading:
      "Control-room operations — keeping compliance tight, distribution sharp, and data moving through the platform.",
  },
];

export const WALKTHROUGH_FLOWS: WalkthroughFlow[] = [
  {
    id: "add-client",
    category: "advisor",
    title: "Add a Client",
    summary:
      "Capture a new client, policies and contacts in seconds — with validation and audit trail built in.",
    steps: [
      {
        title: "Start a new lead",
        description:
          "Jump in from the 'Add Lead' sidebar menu. The form is designed for speed, with only the essential fields required to get started.",
        imageSrc: "/images/walkthrough/add-client/step-1.png",
      },
      {
        title: "Enter core details",
        description:
          "Name, contact info, and policy details — Qall validates as you type so bad data never makes it into the record.",
        imageSrc: "/images/walkthrough/add-client/step-2.png",
      },
      {
        title: "Attach supporting documents",
        description:
          "Drop in policy docs, ID and correspondence directly into the client's profile for instant recall.",
        imageSrc: "/images/walkthrough/add-client/step-3.png",
      },
    ],
  },
  {
    id: "view-profile",
    category: "advisor",
    title: "View a Client Profile",
    summary:
      "Every policy, interaction and commission for a client — surfaced in a single unified view.",
    steps: [
      {
        title: "Find the client",
        description:
          "Search by name, policy number or reference, or open directly from a dashboard card or task.",
      },
      {
        title: "Scan the summary panel",
        description:
          "Key metrics sit at the top — active policies, renewals due, last interaction, commission to date.",
      },
      {
        title: "Drill into history",
        description:
          "Tabs for policies, interactions, documents and compliance — full history in chronological view.",
      },
      {
        title: "Trigger the next action",
        description:
          "Start a quote, log an interaction, or raise a compliance request without leaving the profile.",
      },
    ],
  },
  {
    id: "submit-compliance",
    category: "advisor",
    title: "Submit a Compliance Form",
    summary:
      "Complete and file required paperwork without leaving the client record — admins review it in real time.",
    steps: [
      {
        title: "Open the compliance tab",
        description:
          "Compliance lives alongside the client record, so you never lose context when filing paperwork.",
      },
      {
        title: "Fill the pre-populated form",
        description:
          "Client data flows through automatically. You only fill what's actually new.",
      },
      {
        title: "Upload supporting evidence",
        description:
          "Drag in screenshots, signed docs and notes. Everything stays attached to the submission.",
      },
      {
        title: "Submit for review",
        description:
          "Submission hits the admin queue instantly and surfaces in the advisor's activity feed.",
      },
    ],
  },
  {
    id: "approve-compliance",
    category: "admin",
    title: "Approve Compliance",
    summary:
      "Review, approve or return compliance submissions from the team — with a complete audit trail.",
    steps: [
      {
        title: "Open the compliance queue",
        description:
          "Every pending submission in one sortable, filterable view. Older items surface first by default.",
      },
      {
        title: "Review the submission",
        description:
          "Form content, attached evidence, and advisor notes side by side. No switching tabs to piece it together.",
      },
      {
        title: "Approve or request changes",
        description:
          "One click approves. Requesting changes returns the submission to the advisor with your notes attached.",
      },
      {
        title: "Status flows back in real time",
        description:
          "The advisor sees the outcome the moment you commit it — no email, no waiting, no chasing.",
      },
    ],
  },
  {
    id: "distribute-leads",
    category: "admin",
    title: "Distribute Leads",
    summary:
      "Push incoming leads to the right advisors using automated or manual routing — and track pick-up in real time.",
    steps: [
      {
        title: "Monitor the incoming board",
        description:
          "Every lead lands in one queue — sourced from forms, imports, or partner feeds — with context attached.",
      },
      {
        title: "Apply routing rules",
        description:
          "Route by region, product, capacity or seniority. Rules run automatically or as a one-click override.",
      },
      {
        title: "Assign to advisors",
        description:
          "Bulk-assign a whole cohort or route individually. Round-robin, capacity-aware, or manual — your call.",
      },
      {
        title: "Track pick-up and conversion",
        description:
          "See who responded, how fast, and what converted — feeding back into the rules you set next.",
      },
    ],
  },
  {
    id: "import-data",
    category: "admin",
    title: "Import Data",
    summary:
      "Bring existing clients, policies and commission history into Qall — no manual re-entry, full validation.",
    steps: [
      {
        title: "Upload a source file",
        description:
          "CSV from your previous CRM or broker statement — drag in and Qall parses the columns.",
      },
      {
        title: "Map fields to Qall",
        description:
          "Auto-mapping proposes the layout. You confirm, override where needed, and the mapping is saved for reuse.",
      },
      {
        title: "Preview and fix issues",
        description:
          "Row-level validation catches duplicates, missing fields and format mismatches before anything is committed.",
      },
      {
        title: "Commit the import",
        description:
          "Added, merged and skipped rows are logged. You get a full import report and the ability to roll back.",
      },
    ],
  },
];
