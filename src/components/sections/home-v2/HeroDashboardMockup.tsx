"use client";

/**
 * A styled CRM dashboard mockup for the hero section.
 * Shows a realistic-looking insurance CRM interface.
 */
export function HeroDashboardMockup() {
  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#111827] via-[#0d1525] to-[#091020] shadow-2xl shadow-black/50 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span className="text-[10px] font-bold text-orange-500">QALL</span>
            <span className="text-[10px] text-white">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-5 rounded bg-white/[0.04] border border-white/[0.06]" />
          <div className="w-6 h-6 rounded-full bg-orange-500/15 flex items-center justify-center">
            <span className="text-[8px] font-bold text-orange-500">JH</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-36 shrink-0 border-r border-white/[0.06] py-3 px-3 hidden sm:block">
          <div className="space-y-1">
            {[
              { label: "Dashboard", active: true },
              { label: "Clients", active: false },
              { label: "Policies", active: false },
              { label: "Commission", active: false },
              { label: "Analytics", active: false },
              { label: "Compliance", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[9px] ${
                  item.active
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    : "text-white hover:text-white"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-orange-500" : "bg-dark-600"}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Total Revenue", val: "£982,992", change: "+12.4%", up: true },
              { label: "Active Policies", val: "1,247", change: "+8.2%", up: true },
              { label: "Retention Rate", val: "96.8%", change: "+2.1%", up: true },
              { label: "Avg. Premium", val: "£4,280", change: "+5.7%", up: true },
            ].map((kpi) => (
              <div key={kpi.label} {...(kpi.label === "Retention Rate" ? { "data-dashboard-retention": true } : {})} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
                <div className="text-[8px] text-white uppercase tracking-wider">{kpi.label}</div>
                <div className="text-sm font-bold text-dark-100 mt-1">{kpi.val}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
                    <path d={kpi.up ? "M8 12V4M8 4L4 8M8 4L12 8" : "M8 4V12M8 12L4 8M8 12L12 8"} stroke={kpi.up ? "#22c55e" : "#ef4444"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className={`text-[8px] ${kpi.up ? "text-green-400" : "text-red-400"}`}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Revenue chart */}
            <div data-dashboard-revenue className="md:col-span-2 rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] text-white uppercase tracking-wider">Commission Revenue</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-white">12 months</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[28, 35, 32, 45, 42, 55, 50, 62, 58, 72, 68, 82].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-orange-600 to-orange-400/60 animate-bar-grow" style={{ height: `${h}%`, animationDelay: `${i * 0.04}s` }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[7px] text-white">
                <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
              </div>
            </div>

            {/* Recent activity */}
            <div data-dashboard-activity className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
              <span className="text-[9px] text-white uppercase tracking-wider">Recent Activity</span>
              <div className="mt-2.5 space-y-2">
                {[
                  { icon: "●", color: "text-green-400", text: "Policy bound — £4.2k" },
                  { icon: "◆", color: "text-orange-400", text: "3 renewals due" },
                  { icon: "▲", color: "text-blue-400", text: "New lead assigned" },
                  { icon: "●", color: "text-green-400", text: "Compliance passed" },
                  { icon: "◆", color: "text-yellow-400", text: "Quote requested" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className={`text-[5px] ${a.color}`}>{a.icon}</span>
                    <span className="text-[8px] text-white truncate">{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden">
            <div className="grid grid-cols-5 gap-0 text-[8px] text-white uppercase tracking-wider border-b border-white/[0.05]">
              <div className="px-3 py-2">Client</div>
              <div className="px-3 py-2">Policy Type</div>
              <div className="px-3 py-2">Premium</div>
              <div className="px-3 py-2">Renewal</div>
              <div className="px-3 py-2">Status</div>
            </div>
            {[
              { client: "James Hargreaves", type: "Life Insurance", premium: "£12,400", renewal: "14 days", status: "Active", statusColor: "text-green-400" },
              { client: "Priya Nair", type: "Home & Motor", premium: "£8,200", renewal: "45 days", status: "Active", statusColor: "text-green-400" },
              { client: "David Chen", type: "Critical Illness", premium: "£6,800", renewal: "3 days", status: "Renewal", statusColor: "text-orange-400" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-0 text-[9px] border-b border-white/[0.03] last:border-0">
                <div className="px-3 py-2 text-dark-200 font-medium">{row.client}</div>
                <div className="px-3 py-2 text-white">{row.type}</div>
                <div className="px-3 py-2 text-white">{row.premium}</div>
                <div className="px-3 py-2 text-white">{row.renewal}</div>
                <div className="px-3 py-2">
                  <span className={`${row.statusColor}`}>● {row.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
