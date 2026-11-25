import React from "react";
import { BarChart3 } from "lucide-react";
import { DISTRICT_MATRIX_DEMO, FUNNEL_METRICS_DEMO } from "@/data/sakhi-data";
import { GovernanceNotice, SectionHeader } from "@/components/shared/ui-primitives";

export const ProgrammeInsightsScreen: React.FC = () => {
  const bottleneckPatterns = [
    { reason: "Missing buyer / purchase order evidence", share: 31, avgDelayDays: 6.4 },
    { reason: "Panchasutra ledger / MCP update backlog", share: 26, avgDelayDays: 8.2 },
    { reason: "Capex vendor quotation or FSSAI/Udyam pending", share: 22, avgDelayDays: 5.5 },
    { reason: "Bank branch field appraisal turnaround", share: 21, avgDelayDays: 11.4 },
  ];

  const pilotKpis = [
    { metric: "Pilot Scope (Proposed)", baseline: "1 District · 2 Blocks · 2–3 Branches", target: "30–50 SHGs over 8–12 weeks" },
    { metric: "First-Time-Complete Application Pack Rate", baseline: "Measured at Week 0 (Baseline)", target: "Measured at Week 12 (Endline)" },
    { metric: "Median Time from Demand to Lender-Ready Pack", baseline: "Days (Baseline audit)", target: "Target reduction tracked per block" },
    { metric: "Missing-Document / Branch Query Frequency", baseline: "Queries per submitted pack", target: "Post-readiness check rate" },
    { metric: "Demand-to-Submission & Sanction Conversion", baseline: "Authorised NRLM/branch data only", target: "No unverified state-wide extrapolation" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
      <SectionHeader
        eyebrow="GLPC Pilot Evaluation & Bottleneck Intelligence"
        title="Programme Insights"
        subtitle="Stage-duration analysis, recurring query reasons, and the structured 8–12 week pilot evaluation protocol."
      />

      <GovernanceNotice
        title="Evaluation Integrity"
        body="All pilot metrics distinguish verified demand, pack readiness, and authorised bank outcomes. Sanction and disbursement rates are reported strictly where bank/NRLM data access is approved."
        tone="neutral"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bottleneck Drivers */}
        <section className="lg:col-span-6 rounded-2xl border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <div className="border-b border-[var(--sakhi-border)] pb-3.5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)]">
              <BarChart3 className="h-4 w-4 text-amber-600" />
              Top Case-Delay &amp; Query Patterns
            </h2>
          </div>
          <div className="space-y-4">
            {bottleneckPatterns.map((b) => (
              <div key={b.reason} className="space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[var(--sakhi-slate)]">{b.reason}</span>
                  <span className="font-mono text-[12px] text-[var(--sakhi-muted)] tabular-nums">
                    {b.share}% of delays · +{b.avgDelayDays}d
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--sakhi-surface)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-700"
                    style={{ width: `${b.share * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stage Duration Summary */}
        <section className="lg:col-span-6 rounded-2xl border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <div className="border-b border-[var(--sakhi-border)] pb-3.5">
            <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
              Average Stage Duration (Days)
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[13px] tabular-nums">
            {FUNNEL_METRICS_DEMO.filter((f) => f.avgDays > 0).map((f) => (
              <div
                key={f.stage}
                className="flex items-center justify-between rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 py-2.5"
              >
                <span className="truncate pr-2 text-[var(--sakhi-slate)]">{f.stage}</span>
                <span className="shrink-0 font-mono font-bold text-[var(--sakhi-forest)]">
                  {f.avgDays.toFixed(1)}d
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pilot Baseline / Endline Framework */}
      <section className="overflow-hidden rounded-2xl border border-[var(--sakhi-border)] bg-white">
        <div className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
            GLPC Pilot Baseline &amp; Endline Measurement Protocol
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--sakhi-muted)]">
            Structured evaluation across {DISTRICT_MATRIX_DEMO.length} pilot blocks before state-wide scaling.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]/50 text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <tr>
                <th className="px-6 py-3">Pilot KPI / Indicator</th>
                <th className="px-4 py-3">Baseline Capture</th>
                <th className="px-6 py-3">Endline Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sakhi-border)]">
              {pilotKpis.map((k) => (
                <tr key={k.metric} className="transition-colors hover:bg-[var(--sakhi-surface)]">
                  <td className="px-6 py-3.5 font-semibold text-[var(--sakhi-slate)]">{k.metric}</td>
                  <td className="px-4 py-3.5 text-[var(--sakhi-muted)]">{k.baseline}</td>
                  <td className="px-6 py-3.5 font-medium text-[var(--sakhi-forest)]">{k.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
