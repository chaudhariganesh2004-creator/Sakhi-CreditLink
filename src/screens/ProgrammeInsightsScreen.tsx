import React, { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import {
  DISTRICT_MATRIX_DEMO,
  FUNNEL_METRICS_DEMO,
  type SHGCase,
} from "@/data/sakhi-data";
import { REASON_CODES } from "@/lib/access-engine";
import { GovernanceNotice, SectionHeader } from "@/components/shared/ui-primitives";
import { Card, SimulatedBadge } from "@/components/ui/primitives";

interface ProgrammeInsightsProps {
  cases?: SHGCase[];
}

export const ProgrammeInsightsScreen: React.FC<ProgrammeInsightsProps> = ({ cases = [] }) => {
  const liveReasonRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of cases) {
      for (const q of c.queries) {
        if (q.reasonCode) {
          counts.set(q.reasonCode, (counts.get(q.reasonCode) ?? 0) + 1);
        }
      }
      if (c.branchDecision?.status === "Rejected" && c.branchDecision.reasonCode) {
        counts.set(
          c.branchDecision.reasonCode,
          (counts.get(c.branchDecision.reasonCode) ?? 0) + 1
        );
      }
    }
    return REASON_CODES.map((rc) => ({
      ...rc,
      count: counts.get(rc.code) ?? 0,
    })).filter((r) => r.count > 0);
  }, [cases]);

  const pilotKpis = [
    { metric: "Pilot Scope (Proposed)", baseline: "1 District · 2 Blocks · 2–3 Branches", target: "30–50 SHGs over 8–12 weeks" },
    { metric: "First-Time-Complete Application Pack Rate", baseline: "Measured at Week 0 (Baseline)", target: "Measured at Week 12 (Endline)" },
    { metric: "Ticket Size vs. RBI 6× Corpus Eligibility", baseline: "Tracked per SHG corpus balance", target: "Close under-sized loan gaps" },
    { metric: "Missing-Document / Branch Query Frequency", baseline: "Logged via Proposed standard codes", target: "Post-readiness check reduction" },
    { metric: "Demand-to-Submission & Sanction Conversion", baseline: "Authorised NRLM/branch data only", target: "No unverified state-wide extrapolation" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="GLPC Pilot Evaluation & Bottleneck Intelligence"
        title="Programme Insights"
        subtitle="Standardized query/rejection patterns, stage durations, and the 8–12 week pilot evaluation protocol."
        rightSlot={<SimulatedBadge />}
      />

      <GovernanceNotice
        title="Evaluation Integrity"
        body="All pilot metrics distinguish verified demand, pack readiness, and authorised bank outcomes. Sanction and disbursement rates are reported strictly where bank/NRLM data access is approved."
        tone="neutral"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Live Reason Code Telemetry */}
        <Card className="lg:col-span-6 p-5 space-y-4">
          <div className="border-b border-[#ECE8DE] pb-3">
            <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-[#141A23]">
              <BarChart3 className="h-4 w-4 text-[#B45309]" />
              Live Standardized Query &amp; Rejection Codes
            </h2>
            <p className="mt-0.5 text-[12px] text-[#475467]">
              Proposed standard codes aggregated from active SHG cases
            </p>
          </div>
          {liveReasonRows.length === 0 ? (
            <div className="py-6 text-[13px] text-[#475467]">
              No active query/rejection codes recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {liveReasonRows.map((row) => (
                <div key={row.code} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[13px]">
                    <span>
                      <code className="mr-1.5 rounded bg-[#F2EFE8] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#141A23]">
                        {row.code}
                      </code>
                      <span className="text-[#141A23]">{row.labelEn}</span>
                    </span>
                    <span className="font-mono text-[12px] font-semibold text-[#B45309] tabular-nums">
                      {row.count} case{row.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2EFE8]">
                    <div
                      className="h-full rounded-full bg-[#B45309]"
                      style={{ width: `${Math.min(100, row.count * 35)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stage Duration Summary */}
        <Card className="lg:col-span-6 p-5 space-y-4">
          <div className="border-b border-[#ECE8DE] pb-3">
            <h2 className="text-[15.5px] font-semibold text-[#141A23]">
              Average Stage Duration (Simulated Pilot Days)
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[13px] tabular-nums">
            {FUNNEL_METRICS_DEMO.filter((f) => f.avgDays > 0).map((f) => (
              <div
                key={f.stage}
                className="flex items-center justify-between rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-3.5 py-2.5"
              >
                <span className="truncate pr-2 text-[#141A23]">{f.stage}</span>
                <span className="shrink-0 font-mono font-bold text-[#0F5E4E]">
                  {f.avgDays.toFixed(1)}d
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pilot Baseline / Endline Framework */}
      <Card className="overflow-hidden">
        <div className="border-b border-[#DFDBD0] bg-[#F2EFE8] px-5 py-3.5">
          <h2 className="text-[15.5px] font-semibold text-[#141A23]">
            GLPC Pilot Baseline &amp; Endline Measurement Protocol
          </h2>
          <p className="mt-0.5 text-[12px] text-[#475467]">
            Structured evaluation across {DISTRICT_MATRIX_DEMO.length} pilot blocks before state-wide scaling.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#DFDBD0] bg-[#FAF8F4] text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              <tr>
                <th className="px-5 py-3">Pilot KPI / Indicator</th>
                <th className="px-4 py-3">Baseline Capture</th>
                <th className="px-5 py-3">Endline Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFDBD0]">
              {pilotKpis.map((k) => (
                <tr key={k.metric} className="hover:bg-[#FAF8F4]">
                  <td className="px-5 py-3 font-semibold text-[#141A23]">{k.metric}</td>
                  <td className="px-4 py-3 text-[#475467]">{k.baseline}</td>
                  <td className="px-5 py-3 font-medium text-[#0F5E4E]">{k.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
