import React, { useState } from "react";
import { ArrowRight, Clock, ShieldAlert, TrendingUp, Users } from "lucide-react";
import {
  DISTRICT_MATRIX_DEMO,
  FUNNEL_METRICS_DEMO,
  type NavScreenId,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import {
  DemoBadge,
  SectionHeader,
  StageChip,
} from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface CommandCentreProps {
  cases: SHGCase[];
  activeCaseId: string;
  role: UserRole;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const CommandCentreScreen: React.FC<CommandCentreProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onNavigate,
}) => {
  const [tab, setTab] = useState<"overview" | "districts">("overview");
  const [districtFilter, setDistrictFilter] = useState<"All" | "Anand" | "Kheda">("All");

  const activeCase = cases.find((c) => c.id === activeCaseId) ?? cases[0];
  const activeNeed =
    activeCase.costLines.reduce((s, x) => s + x.amount, 0) - activeCase.ownContribution;

  const stalledCases = cases.filter(
    (c) =>
      (c.bottleneckReason || c.daysInStage >= 9 || c.readinessScore < 80) &&
      (districtFilter === "All" || c.district === districtFilter)
  );

  const filteredDistrictRows = DISTRICT_MATRIX_DEMO.filter(
    (r) => districtFilter === "All" || r.district === districtFilter
  );

  const keyFunnelStages = FUNNEL_METRICS_DEMO.filter((f) =>
    [
      "Demand identified",
      "Profile verified",
      "Route matched",
      "Pack complete",
      "Submitted",
      "Sanctioned",
    ].includes(f.stage)
  );
  const maxFunnelCount = keyFunnelStages[0]?.count || 148;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="GLPC Pilot · Anand & Kheda"
        title="Command Centre"
        subtitle="Pre-application demand, readiness, and conversion pipeline."
        rightSlot={
          <div className="flex items-center gap-2.5">
            <DemoBadge />
            <div className="flex items-center rounded-lg border border-[var(--sakhi-border)] bg-white p-1 text-[13px]">
            {(["All", "Anand", "Kheda"] as const).map((dist) => (
              <button
                key={dist}
                onClick={() => setDistrictFilter(dist)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-medium transition-all",
                  districtFilter === dist
                    ? "bg-[var(--sakhi-forest)] text-white "
                    : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
                )}
              >
                {dist === "All" ? "All Districts" : dist}
              </button>
            ))}
          </div>
          </div>
        }
      />

      {/* Next Best Action — hero card */}
      <div className="relative overflow-hidden rounded-lg border border-[var(--sakhi-border)] bg-[#0F5E4E] p-6 text-white">
        <div className="absolute top-0 right-0 h-full w-1/3 hidden" />
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 " />
              Next Best Action · {activeCase.caseCode}
            </div>
            <div className="text-[20px] font-bold">
              {activeCase.shgName} — {formatINR(activeNeed)} external need
            </div>
            <div className="text-[14px] text-white/70">
              {activeCase.bottleneckReason ?? "Review financing blueprint and compare regulated lender offers."}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => onNavigate("scheme-match")}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white  transition-all hover:bg-white/20"
            >
              Scheme Match
            </button>
            <button
              onClick={() => onNavigate("application-pack")}
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13px] font-semibold text-[var(--sakhi-forest)]  transition-all hover: "
            >
              Prepare Pack <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: Users,
            label: "Validated Demand (Simulated)",
            value: "148",
            unit: "SHGs",
            detail: "₹3.62 Cr illustrative need",
            accent: false,
          },
          {
            icon: TrendingUp,
            label: "Lender-Ready Packs (Simulated)",
            value: "61",
            unit: "packs",
            detail: "78.7% illustrative complete",
            accent: false,
          },
          {
            icon: ShieldAlert,
            label: "Needs Intervention",
            value: String(stalledCases.length),
            unit: "cases",
            detail: "Cluster follow-up required",
            accent: true,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-5 transition-all",
              stat.accent
                ? "border-amber-200 bg-amber-50"
                : "border-[var(--sakhi-border)] bg-white"
            )}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={cn("h-4 w-4", stat.accent ? "text-amber-600" : "text-[var(--sakhi-muted)]")} />
              <span className={cn("text-[13px] font-medium", stat.accent ? "text-amber-700" : "text-[var(--sakhi-muted)]")}>{stat.label}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={cn("font-serif font-semibold text-[36px] tabular-nums", stat.accent ? "text-amber-700" : "text-[var(--sakhi-slate)]")}>
                {stat.value}
              </span>
              <span className="text-[14px] text-[var(--sakhi-muted)]">{stat.unit}</span>
            </div>
            <div className="mt-1 text-[13px] text-[var(--sakhi-muted)]">{stat.detail}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center justify-between border-b border-[var(--sakhi-border)]">
        <div className="flex gap-6">
          {(["overview", "districts"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "pb-3 text-[14px] font-medium transition-colors border-b-2",
                tab === t
                  ? "border-[var(--sakhi-forest)] text-[var(--sakhi-slate)]"
                  : "border-transparent text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
              )}
            >
              {t === "overview" ? "Funnel & Queue" : "District Matrix"}
            </button>
          ))}
        </div>
        <button
          onClick={() => onNavigate("programme-insights")}
          className="pb-3 text-[13px] font-medium text-[var(--sakhi-forest)] hover:underline"
        >
          Full Insights →
        </button>
      </div>

      {tab === "overview" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Funnel */}
          <section className="rounded-lg border border-[var(--sakhi-border)] bg-white p-6">
            <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
              Conversion Funnel
            </h2>
            <div className="mt-6 space-y-5">
              {keyFunnelStages.map((row) => {
                const widthPct = Math.max(10, Math.round((row.count / maxFunnelCount) * 100));
                return (
                  <div key={row.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-[var(--sakhi-slate)]">{row.stage}</span>
                      <span className="font-mono tabular-nums font-bold text-[var(--sakhi-slate)]">
                        {row.count}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--sakhi-surface)]">
                      <div
                        className="h-full rounded-full bg-[#0F5E4E] transition-all duration-700"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Priority Queue */}
          <section className="rounded-lg border border-[var(--sakhi-border)] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)]">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Priority Queue
              </h2>
              <button
                onClick={() => onNavigate("shg-directory")}
                className="text-[13px] font-medium text-[var(--sakhi-forest)] hover:underline"
              >
                All SHGs →
              </button>
            </div>

            <div className="mt-5 divide-y divide-[var(--sakhi-border)]">
              {stalledCases.slice(0, 4).map((c) => (
                <div key={c.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--sakhi-slate)]">
                        {c.shgName}
                      </div>
                      <div className="mt-0.5 text-[13px] text-[var(--sakhi-muted)]">
                        {c.bottleneckReason ?? `${c.block} · ${c.activity}`}
                      </div>
                    </div>
                    <StageChip stage={c.stage} />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[13px]">
                    <span className="inline-flex items-center gap-1 text-[var(--sakhi-muted)]">
                      <Clock className="h-3.5 w-3.5" /> {c.daysInStage}d in stage
                    </span>
                    <button
                      onClick={() => onSelectCase(c.id, "finance-passport")}
                      className="font-semibold text-[var(--sakhi-forest)] hover:underline"
                    >
                      Open Case →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-[var(--sakhi-border)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
                <tr>
                  <th className="px-5 py-3">Block</th>
                  <th className="px-4 py-3 text-right">Demand</th>
                  <th className="px-4 py-3 text-right">Matched</th>
                  <th className="px-4 py-3 text-right">Pack Ready</th>
                  <th className="px-4 py-3 text-right">Sanctioned</th>
                  <th className="px-5 py-3">Primary Bottleneck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sakhi-border)] tabular-nums">
                {filteredDistrictRows.map((r) => (
                  <tr key={`${r.district}-${r.block}`} className="transition-colors hover:bg-[var(--sakhi-surface)]">
                    <td className="px-5 py-3.5 font-semibold text-[var(--sakhi-slate)]">
                      {r.block} <span className="font-normal text-[var(--sakhi-muted)]">({r.district})</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">{r.demandIdentified}</td>
                    <td className="px-4 py-3.5 text-right">{r.routeMatched}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[var(--sakhi-forest)]">{r.packComplete}</td>
                    <td className="px-4 py-3.5 text-right font-bold">{r.sanctioned}</td>
                    <td className="px-5 py-3.5 text-[var(--sakhi-muted)]">{r.topBottleneck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
