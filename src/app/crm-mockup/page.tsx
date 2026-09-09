"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Icons (inline SVG) ── */
const icon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d={d} />
  </svg>
);
const IconSearch = () => icon("M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z");
const IconChevronDown = () => icon("M6 9l6 6 6-6");
const IconChevronRight = () => icon("M9 6l6 6-6 6");
const IconPlus = () => icon("M12 5v14M5 12h14");
const IconBell = () => icon("M15 17h5l-1.4-2.2a1 1 0 0 1-.1-.5V11a6.5 6.5 0 0 0-13 0v3.3a1 1 0 0 1-.2.5L4 17h5m6 0a3 3 0 0 1-6 0");
const IconHome = () => icon("M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z");
const IconUser = () => icon("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z");
const IconBrief = () => icon("M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16");
const IconNote = () => icon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5");
const IconPound = () => icon("M18 7a4 4 0 0 0-8 0v3H7M10 13H7m0 4h11M10 6v11");
const IconList = () => icon("M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01");
const IconSparkle = () => icon("M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2");
const IconUsers = () => icon("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8");
const IconShield = () => icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z");
const IconClock = () => icon("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2");
const IconMail = () => icon("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6");
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="#F88C00" className="h-3 w-3">
    <path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8 5.7 21l1.2-6.9-5-4.9 7-1z" />
  </svg>
);
const IconMore = () => icon("M12 12.01M12 5.01M12 19.01");
const IconArrowRight = () => icon("M5 12h14M12 5l7 7-7 7");
const IconTrash = () => icon("M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6");
const IconX = () => icon("M18 6L6 18M6 6l12 12");

/* ── Types ── */
type TabId =
  | "summary"
  | "payslips"
  | "notes"
  | "expenses"
  | "factfind"
  | "policy"
  | "quoting"
  | "customers"
  | "compliance"
  | "logs"
  | "letters";

const TABS: {
  id: TabId;
  label: string;
  Icon: () => React.ReactElement;
  star?: boolean;
}[] = [
  { id: "summary", label: "Summary", Icon: IconList },
  { id: "payslips", label: "Payslips", Icon: IconPound, star: true },
  { id: "notes", label: "Client Notes", Icon: IconNote },
  { id: "expenses", label: "Expenses", Icon: IconPound },
  { id: "factfind", label: "Fact Find", Icon: IconBrief, star: true },
  { id: "policy", label: "Policy History", Icon: IconShield },
  { id: "quoting", label: "Quoting", Icon: IconSparkle },
  { id: "customers", label: "Customers", Icon: IconUsers },
  { id: "compliance", label: "Compliance", Icon: IconShield },
  { id: "logs", label: "Logs", Icon: IconClock },
  { id: "letters", label: "Letters", Icon: IconMail },
];

/* ── Reusable form bits ── */
function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-[#6B7280]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#F88C00] focus:ring-2 focus:ring-[#FCD49A]/60";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
function Select({
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={`${inputCls} appearance-none pr-9 ${rest.className ?? ""}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
        <IconChevronDown />
      </span>
    </div>
  );
}

/* ── Card shell ── */
function Card({
  title,
  children,
  rightSlot,
  collapsible = true,
  defaultOpen = true,
  padded = true,
}: {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  padded?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <header className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-3.5">
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-[#F3F4F6]"
              aria-label={open ? "Collapse section" : "Expand section"}
            >
              <span
                className={`inline-flex transition-transform duration-300 ${
                  open ? "rotate-0" : "-rotate-90"
                }`}
              >
                <IconChevronDown />
              </span>
            </button>
          )}
          <h2 className="text-sm font-semibold tracking-tight text-[#111827]">
            {title}
          </h2>
        </div>
        {rightSlot}
      </header>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={padded ? "p-5 md:p-6" : ""}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ── Person column (used twice when partner added) ── */
function PersonColumn({
  label,
  name,
  onRemove,
}: {
  label: string;
  name: string;
  onRemove?: () => void;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-[#FAFBFC] p-4 ring-1 ring-inset ring-[#EEF0F3]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F88C00]/10 text-[#F88C00]">
            <IconUser />
          </span>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
              {label}
            </div>
            <div className="text-sm font-semibold text-[#111827]">{name}</div>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-white hover:text-[#EF4444]"
            aria-label="Remove partner"
          >
            <IconX />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title">
          <Select defaultValue="">
            <option value="">Select</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Ms</option>
          </Select>
        </Field>
        <Field label="Marital Status">
          <Select defaultValue={label === "Primary" ? "Married" : "Married"}>
            <option>Married</option>
            <option>Single</option>
            <option>Divorced</option>
          </Select>
        </Field>
        <Field label="Gender">
          <Select defaultValue="">
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
          </Select>
        </Field>
        <Field label="Partner's Gender">
          <Select defaultValue="">
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
          </Select>
        </Field>
        <Field label="First Name">
          <Input defaultValue={name.split(" ")[0]} />
        </Field>
        <Field label="Middle Name">
          <Input placeholder="—" />
        </Field>
        <Field label="Last Name">
          <Input defaultValue={name.split(" ").slice(1).join(" ")} />
        </Field>
        <Field label="Date of Birth">
          <Input type="date" defaultValue="1984-03-12" />
        </Field>
        <Field label="Age">
          <Input defaultValue="41 years, 1 months, 3 days" readOnly />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            defaultValue={`${name.split(" ")[0].toLowerCase()}@example.com`}
          />
        </Field>
        <Field label="Mobile">
          <Input defaultValue="07700 900123" />
        </Field>
        <Field label="Company Name">
          <Input placeholder="—" />
        </Field>
        <Field label="Company Postcode" className="col-span-2">
          <Input placeholder="—" />
        </Field>
      </div>
    </div>
  );
}

function IncomeColumn({ label, name }: { label: string; name: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#FAFBFC] p-4 ring-1 ring-inset ring-[#EEF0F3]">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#042D70]/10 text-[#042D70]">
          <IconPound />
        </span>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            {label}
          </div>
          <div className="text-sm font-semibold text-[#111827]">{name}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Employment Status">
          <Select defaultValue="Employed">
            <option>Employed</option>
            <option>Self-Employed</option>
            <option>Contractor</option>
          </Select>
        </Field>
        <Field label="Occupation">
          <Input defaultValue="Quant. Clerk" />
        </Field>
        <Field label="Self Emp Status">
          <Select defaultValue="LTD Co.">
            <option>LTD Co.</option>
            <option>Sole Trader</option>
          </Select>
        </Field>
        <Field label="Emp Sector">
          <Select defaultValue="Financial">
            <option>Financial</option>
            <option>Medical</option>
          </Select>
        </Field>
        <Field label="Income Per Annum">
          <Input defaultValue="£ 55,000" />
        </Field>
        <Field label="Income Per Month">
          <Input defaultValue="£ 4,583" readOnly />
        </Field>
        <Field label="Income Per Week">
          <Input defaultValue="£ 1,058" readOnly />
        </Field>
        <Field label="Sick Pay">
          <Select defaultValue="Full">
            <option>Full</option>
            <option>Half</option>
            <option>None</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function HealthColumn({ label, name }: { label: string; name: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-[#FAFBFC] p-4 ring-1 ring-inset ring-[#EEF0F3]">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
          <IconShield />
        </span>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            {label}
          </div>
          <div className="text-sm font-semibold text-[#111827]">{name}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Smoker">
          <Select defaultValue="No">
            <option>No</option>
            <option>Yes</option>
          </Select>
        </Field>
        <Field label="Waist (cm)">
          <Input defaultValue="82" />
        </Field>
        <Field label="Height (cm)">
          <Input defaultValue="168" />
        </Field>
        <Field label="Weight (kg)">
          <Input defaultValue="64" />
        </Field>
        <Field label="Mother Age">
          <Input defaultValue="72" />
        </Field>
        <Field label="Alive">
          <Select defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </Select>
        </Field>
        <Field label="Medical Condition">
          <Input defaultValue="None" />
        </Field>
        <Field label="Cvd Age">
          <Input placeholder="—" />
        </Field>
        <Field label="Father Age">
          <Input defaultValue="75" />
        </Field>
        <Field label="Alive">
          <Select defaultValue="Yes">
            <option>Yes</option>
            <option>No</option>
          </Select>
        </Field>
        <Field label="Medical Condition">
          <Input defaultValue="None" />
        </Field>
        <Field label="Cvd Age">
          <Input placeholder="—" />
        </Field>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function CrmMockupPage() {
  const [active, setActive] = useState<TabId>("customers");
  const [hasPartner, setHasPartner] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111827]">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-30 bg-white">
        <div className="flex h-16 items-center gap-4 border-b border-[#EEF0F3] px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/qall-icon.png"
              alt="Qall"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md"
            />
            <span className="hidden text-[15px] font-bold tracking-tight text-[#111827] md:inline">
              Qall
            </span>
          </Link>
          <div className="relative flex-1 max-w-3xl">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              <IconSearch />
            </span>
            <input
              type="search"
              placeholder="Search clients, policies, documents…"
              className="h-10 w-full rounded-lg bg-[#F3F4F6] pl-10 pr-14 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#F88C00]/30"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-[#E5E7EB] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#6B7280]">
              /
            </kbd>
          </div>
          <button className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6] md:inline-flex">
            <IconBell />
            <span className="hidden lg:inline">Alerts</span>
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#F88C00] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#F97316]">
            <IconPlus />
            <span>New Client</span>
          </button>
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#042D70] text-xs font-semibold text-white">
            TS
          </div>
        </div>

        {/* ─── Tab row ─── */}
        <div className="flex items-center border-b border-[#EEF0F3] px-2 md:px-4">
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              className="mr-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F3F4F6]"
              aria-label="All"
            >
              <IconList />
              <span>All</span>
            </button>
            {TABS.map(({ id, label, Icon, star }) => {
              const isActive = id === active;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`relative inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#F88C00]"
                      : "text-[#374151] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Icon />
                  <span>{label}</span>
                  {star && <IconStar />}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-[7px] h-[2px] rounded-full bg-[#F88C00]" />
                  )}
                </button>
              );
            })}
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6]">
              <IconChevronRight />
            </button>
          </nav>
          <Link
            href="#"
            className="ml-4 hidden items-center gap-1.5 text-sm font-medium text-[#111827] hover:text-[#F88C00] md:inline-flex"
          >
            <IconSparkle />
            <span>Reports Hub</span>
          </Link>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-1.5 text-xs text-[#6B7280]">
          <Link href="#" className="inline-flex items-center gap-1 hover:text-[#111827]">
            <IconHome />
            Home
          </Link>
          <span className="text-[#D1D5DB]">/</span>
          <Link href="#" className="hover:text-[#111827]">
            Clients
          </Link>
          <span className="text-[#D1D5DB]">/</span>
          <span className="text-[#111827]">Allison Schmollack</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT column */}
          <div className="flex flex-col gap-4 lg:col-span-8 xl:col-span-9">
            {/* Hero title card */}
            <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#111827]">
                    Allison Schmollack
                  </h1>
                  <p className="mt-1.5 text-sm text-[#6B7280]">
                    Customer file · updated 2 days ago · managed by Tom Richardson
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                    <IconMail />
                    Message
                  </button>
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                    <IconMore />
                  </button>
                </div>
              </div>
            </section>

            {/* Case overview — smarkets event-card style */}
            <section className="rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
              <div className="flex items-center justify-between border-b border-[#F0F0F0] px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB]">
                    <IconBrief />
                  </span>
                  <h3 className="text-[15px] font-semibold text-[#111827]">
                    09:15 · Fact Find in Progress
                  </h3>
                </div>
                <span className="text-xs font-medium tracking-wider text-[#9CA3AF]">
                  QALL · LUKUS Account
                </span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#F0F0F0] px-6 py-3 text-xs text-[#6B7280]">
                <span className="rounded-md bg-[#F3F4F6] px-2 py-1 font-medium text-[#374151]">
                  In Progress
                </span>
                <span>·</span>
                <span>Lead since 14 Mar 2026</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <IconClock />
                  SLA 3d 4h
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">
                {/* Left: rankings */}
                <div className="border-b border-[#F0F0F0] px-6 py-5 md:border-b-0 md:border-r">
                  <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    <span>Product</span>
                    <span>Status</span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {[
                      { rank: 2, name: "Income Protection", meta: "Vitality · Tier 1", status: "Won", color: "#10B981" },
                      { rank: 1, name: "Life Insurance", meta: "L&G · Level Term", status: "Won", color: "#10B981" },
                      { rank: 3, name: "Critical Illness", meta: "Aviva · 25yr", status: "Lost", color: "#EF4444" },
                      { rank: 4, name: "Private Health", meta: "Bupa · Family", status: "Lost", color: "#EF4444" },
                    ].map((r) => (
                      <li
                        key={r.rank}
                        className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-[#FAFBFC]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#F3F4F6] text-[11px] font-bold text-[#6B7280]">
                            {r.rank}
                          </span>
                          <div className="leading-tight">
                            <div className="font-medium text-[#111827]">{r.name}</div>
                            <div className="text-xs text-[#6B7280]">{r.meta}</div>
                          </div>
                        </div>
                        <span
                          className="rounded-md px-2 py-0.5 text-xs font-semibold"
                          style={{ background: `${r.color}15`, color: r.color }}
                        >
                          {r.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-3 text-sm font-medium text-[#F88C00] hover:text-[#F97316]">
                    Show more
                  </button>
                </div>
                {/* Right: sparkline chart */}
                <div className="px-6 py-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      Fact Find Progress
                    </span>
                    <span className="text-xs font-medium text-[#10B981]">
                      +26.3%
                    </span>
                  </div>
                  <svg viewBox="0 0 400 140" className="h-[140px] w-full">
                    <defs>
                      <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F88C00" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#F88C00" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="#F0F0F0" strokeDasharray="2,3">
                      {[30, 60, 90, 120].map((y) => (
                        <line key={y} x1="0" x2="400" y1={y} y2={y} />
                      ))}
                    </g>
                    <path
                      d="M0 105 L60 98 L110 100 L160 80 L210 82 L260 50 L320 40 L400 30"
                      stroke="#F88C00"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 105 L60 98 L110 100 L160 80 L210 82 L260 50 L320 40 L400 30 L400 140 L0 140 Z"
                      fill="url(#ga)"
                    />
                    <path
                      d="M0 115 L60 110 L110 115 L160 112 L210 108 L260 95 L320 90 L400 85"
                      stroke="#042D70"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="3,3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#F88C00]" />
                      Completion
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#042D70]" />
                      Benchmark
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Information */}
            <Card
              title="Customer Information"
              rightSlot={
                !hasPartner ? (
                  <button
                    onClick={() => setHasPartner(true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-[#F88C00]/40 bg-[#FFF7EC] px-3 text-xs font-semibold text-[#F88C00] transition-all hover:border-[#F88C00] hover:bg-[#FFEED1]"
                  >
                    <IconPlus />
                    Add Partner
                  </button>
                ) : undefined
              }
            >
              <div
                className={`grid gap-4 transition-[grid-template-columns] duration-500 ${
                  hasPartner ? "md:grid-cols-2" : "md:grid-cols-1"
                }`}
              >
                <PersonColumn label="Primary" name="Allison Schmollack" />
                {hasPartner && (
                  <div className="animate-[crmFade_.35s_ease-out_both]">
                    <PersonColumn
                      label="Partner"
                      name="Christopher Schmollack"
                      onRemove={() => setHasPartner(false)}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Income */}
            <Card title="Income">
              <div
                className={`grid gap-4 ${
                  hasPartner ? "md:grid-cols-2" : "md:grid-cols-1"
                }`}
              >
                <IncomeColumn label="Primary" name="Allison Schmollack" />
                {hasPartner && (
                  <div className="animate-[crmFade_.35s_ease-out_both]">
                    <IncomeColumn label="Partner" name="Christopher Schmollack" />
                  </div>
                )}
              </div>
            </Card>

            {/* Health Screening */}
            <Card title="Health Screening">
              <div
                className={`grid gap-4 ${
                  hasPartner ? "md:grid-cols-2" : "md:grid-cols-1"
                }`}
              >
                <HealthColumn label="Primary" name="Allison Schmollack" />
                {hasPartner && (
                  <div className="animate-[crmFade_.35s_ease-out_both]">
                    <HealthColumn label="Partner" name="Christopher Schmollack" />
                  </div>
                )}
              </div>
            </Card>

            {/* Medical Conditions */}
            <Card
              title="Medical Conditions"
              rightSlot={
                <button className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F88C00] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#F97316]">
                  <IconPlus />
                  Add Medical Condition
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      {[
                        "Condition",
                        "Diagnosis",
                        "Treated",
                        "Symptoms",
                        "Recovered",
                        "Notes",
                      ].map((h) => (
                        <th key={h} className="border-b border-[#F0F0F0] pb-2 pr-4">
                          {h}
                        </th>
                      ))}
                      <th className="border-b border-[#F0F0F0] pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        c: "Hypertension",
                        d: "2021-06-14",
                        t: "Yes",
                        s: "Mild",
                        r: "Controlled",
                        n: "Ramipril 5mg",
                      },
                      {
                        c: "Asthma",
                        d: "2009-02-03",
                        t: "Yes",
                        s: "Moderate",
                        r: "Ongoing",
                        n: "Inhaler PRN",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="transition-colors hover:bg-[#FAFBFC]"
                      >
                        <td className="py-3 pr-4 font-medium text-[#111827]">{row.c}</td>
                        <td className="py-3 pr-4 text-[#6B7280]">{row.d}</td>
                        <td className="py-3 pr-4 text-[#6B7280]">{row.t}</td>
                        <td className="py-3 pr-4 text-[#6B7280]">{row.s}</td>
                        <td className="py-3 pr-4 text-[#6B7280]">{row.r}</td>
                        <td className="py-3 pr-4 text-[#6B7280]">{row.n}</td>
                        <td className="py-3 text-right">
                          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#EF4444]">
                            <IconTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Property Information */}
            <Card
              title="Property Information"
              rightSlot={
                <button className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F88C00] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#F97316]">
                  <IconPlus />
                  Add Property
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      {["Address", "Postcode", "Term", "Value", "IP Type", "MI", "Own", "Amount", "Type"].map((h) => (
                        <th key={h} className="border-b border-[#F0F0F0] pb-2 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="transition-colors hover:bg-[#FAFBFC]">
                      <td className="py-3 pr-4 font-medium text-[#111827]">12 Elm Grove</td>
                      <td className="py-3 pr-4 text-[#6B7280]">E14 9SH</td>
                      <td className="py-3 pr-4 text-[#6B7280]">25 yrs</td>
                      <td className="py-3 pr-4 text-[#6B7280]">£ 640,000</td>
                      <td className="py-3 pr-4 text-[#6B7280]">Repay.</td>
                      <td className="py-3 pr-4 text-[#6B7280]">Yes</td>
                      <td className="py-3 pr-4 text-[#6B7280]">Joint</td>
                      <td className="py-3 pr-4 text-[#6B7280]">£ 420,000</td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex rounded-md bg-[#EFF6FF] px-2 py-0.5 text-xs font-semibold text-[#2563EB]">
                          Main
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Outgoings */}
            <Card title="Outgoings">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ["Children", "2"],
                  ["Financially Dependent", "Yes"],
                  ["Lone Parent", "No"],
                  ["Cost To 18", "£ 248,000"],
                  ["Food", "£ 720"],
                  ["C.Tax", "£ 210"],
                  ["Utilities", "£ 180"],
                  ["Internet", "£ 40"],
                  ["Loans", "£ 0"],
                  ["Credit Cards", "£ 120"],
                  ["Cards", "£ 60"],
                  ["Other", "£ 90"],
                ].map(([l, v]) => (
                  <Field key={l} label={l}>
                    <Input defaultValue={v} />
                  </Field>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#FAFBFC] p-4 md:grid-cols-4">
                {[
                  ["Total Per Day", "£ 46"],
                  ["Total Per Week", "£ 322"],
                  ["Total Per Month", "£ 1,420"],
                  ["Total Per Annum", "£ 17,040"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      {l}
                    </div>
                    <div className="mt-1 text-lg font-bold text-[#111827]">{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Additional Info */}
            <Card title="Additional Info">
              <textarea
                rows={5}
                defaultValue={
                  "BMI: 21.38. Allison is a LTD Co. Quant. Clerk — stable income, low personal debt, primary mortgage held jointly with Christopher. Follow-up on Critical Illness rejection from Aviva pending."
                }
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white p-3.5 text-sm leading-relaxed text-[#111827] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#F88C00] focus:ring-2 focus:ring-[#FCD49A]/60"
              />
            </Card>

            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
              <div className="text-xs text-[#6B7280]">
                Last autosave 12s ago · v2026.4
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-10 items-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]">
                  Reject
                </button>
                <button className="inline-flex h-10 items-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                  Save Draft
                </button>
                <button className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#F88C00] px-5 text-sm font-semibold text-white shadow-[0_2px_6px_rgba(248,140,0,0.25)] transition-all hover:bg-[#F97316] hover:shadow-[0_4px_10px_rgba(248,140,0,0.3)]">
                  Complete
                  <IconArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT column — promo-style sticky card */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-[140px] flex flex-col gap-4">
              <PromoCard />
              <QuickStatsCard />
              <ActivityCard />
            </div>
          </aside>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-[#EEF0F3] py-4 text-xs text-[#9CA3AF]">
          <span>Copyright &copy; 2026 by Qall</span>
          <span>v2026.4 · all systems operational</span>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes crmFade {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ── Right-column cards ── */
function PromoCard() {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div
        className="relative h-36 w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #042D70 0%, #1A3A6E 50%, #0A0E17 100%)",
        }}
      >
        <svg viewBox="0 0 400 144" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="pg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F88C00" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F88C00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 110 L40 100 L80 95 L120 85 L160 70 L200 75 L240 55 L280 40 L320 35 L360 25 L400 15"
            stroke="#F8A030"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M0 110 L40 100 L80 95 L120 85 L160 70 L200 75 L240 55 L280 40 L320 35 L360 25 L400 15 L400 144 L0 144 Z"
            fill="url(#pg)"
          />
        </svg>
        <div className="absolute bottom-2 right-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          Beta
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-[#111827]">AI-Assisted Fact Find</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
          Auto-extract policy details from uploads, pre-fill forms, and flag
          compliance gaps before they hit the advisor.
        </p>
        <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#F88C00] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F97316]">
          Try AI Pilot
          <IconArrowRight />
        </button>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-5 bg-[#F88C00]" : "w-1.5 bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStatsCard() {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <h3 className="text-sm font-semibold text-[#111827]">Client Snapshot</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[
          ["Policies Held", "2", "#10B981"],
          ["Annual Premium", "£ 2,184", "#F88C00"],
          ["LTV", "65.6%", "#2563EB"],
          ["Risk Score", "B+", "#8B5CF6"],
        ].map(([l, v, c]) => (
          <div
            key={l as string}
            className="rounded-lg bg-[#FAFBFC] p-3 ring-1 ring-inset ring-[#EEF0F3]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              {l}
            </div>
            <div
              className="mt-1 text-lg font-bold"
              style={{ color: c as string }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityCard() {
  const items = [
    { t: "Fact find Q17 auto-filled", by: "AI Pilot", ago: "2m" },
    { t: "Document uploaded: payslip_feb.pdf", by: "Allison", ago: "1h" },
    { t: "Critical Illness quote declined", by: "Aviva", ago: "4h" },
    { t: "Income verified from LTD Co. return", by: "System", ago: "1d" },
  ];
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111827]">Recent Activity</h3>
        <Link
          href="#"
          className="text-xs font-medium text-[#F88C00] hover:text-[#F97316]"
        >
          View all
        </Link>
      </div>
      <ul className="mt-3 space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F88C00]" />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-[#111827]">{it.t}</div>
              <div className="mt-0.5 text-xs text-[#6B7280]">
                {it.by} · {it.ago} ago
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
