import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Megaphone,
  Repeat,
  Scale,
  ShieldAlert,
  Target,
} from "lucide-react";
import {
  DISTRICT_MATRIX_DEMO,
  FUNNEL_METRICS_DEMO,
  type NavScreenId,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import {
  REASON_CODES,
  drawingPowerFirstDose,
  getCaseExternalNeed,
  repeatLinkage,
  slaStatus,
  ticketGap,
} from "@/lib/access-engine";
import { SectionHeader, StageChip } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { Card, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface CommandCentreProps {
  cases: SHGCase[];
  activeCaseId: string;
  role: UserRole;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onUpdateCase?: (updated: SHGCase) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const CommandCentreScreen: React.FC<CommandCentreProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onUpdateCase,
  onNavigate,
}) => {
  const [tab, setTab] = useState<"overview" | "districts">("overview");
  const [districtFilter, setDistrictFilter] = useState<"All" | "Anand" | "Kheda">("All");

  const filteredCases = useMemo(
    () =>
      cases.filter(
        (c) => districtFilter === "All" || c.district === districtFilter
      ),
    [cases, districtFilter]
  );

  const activeCase = cases.find((c) => c.id === activeCaseId) ?? cases[0];
  const activeNeed = getCaseExternalNeed(activeCase);

  const filteredDistrictRows = useMemo(
    () =>
      DISTRICT_MATRIX_DEMO.filter(
        (r) => districtFilter === "All" || r.district === districtFilter
      ),
    [districtFilter]
  );

  // Target vs Access Live Metrics
  const telemetry = useMemo(() => {
    const districtDemandTarget = filteredDistrictRows.reduce(
      (s, r) => s + r.demandIdentified,
      0
    );
    const districtSanctioned = filteredDistrictRows.reduce(
      (s, r) => s + r.sanctioned,
      0
    );

    const liveSanctioned = filteredCases.filter((c) =>
      ["Sanctioned", "Disbursed", "Enterprise active"].includes(c.stage)
    ).length;

    let sumRequested = 0;
    let sumEligible = 0;
    let slaBreached = 0;
    let slaWarning = 0;
    let repeatReady = 0;

    for (const c of filteredCases) {
      const req = getCaseExternalNeed(c);
      const elig = drawingPowerFirstDose(c.corpusBalance);
      sumRequested += req;
      sumEligible += elig;

      const sla = slaStatus(c, c.stage, 14);
      if (sla.state === "breached") slaBreached += 1;
      else if (sla.state === "warning") slaWarning += 1;

      const rep = repeatLinkage(c);
      if (rep.currentDose >= 2 || rep.repaymentGatePassed) {
        repeatReady += 1;
      }
    }

    const avgRequested =
      filteredCases.length > 0 ? Math.round(sumRequested / filteredCases.length) : 0;
    const avgEligible =
      filteredCases.length > 0 ? Math.round(sumEligible / filteredCases.length) : 0;
    const avgGap = ticketGap(avgRequested, avgEligible);

    return {
      districtDemandTarget,
      districtSanctioned,
      liveSanctioned,
      avgRequested,
      avgEligible,
      avgGap,
      slaBreached,
      slaWarning,
      repeatReady,
    };
  }, [filteredCases, filteredDistrictRows]);

  // Live Standardized Query / Rejection Reason Analytics
  const reasonAnalytics = useMemo(() => {
    const counts = new Map<string, { openQueries: number; rejections: number }>();
    for (const rc of REASON_CODES) {
      counts.set(rc.code, { openQueries: 0, rejections: 0 });
    }

    for (const c of filteredCases) {
      for (const q of c.queries) {
        if (q.reasonCode && counts.has(q.reasonCode)) {
          const entry = counts.get(q.reasonCode)!;
          entry.openQueries += 1;
        }
      }
      if (
        c.branchDecision?.status === "Rejected" &&
        c.branchDecision.reasonCode &&
        counts.has(c.branchDecision.reasonCode)
      ) {
        const entry = counts.get(c.branchDecision.reasonCode)!;
        entry.rejections += 1;
      }
    }

    return REASON_CODES.map((rc) => {
      const c = counts.get(rc.code) ?? { openQueries: 0, rejections: 0 };
      const total = c.openQueries + c.rejections;
      return {
        ...rc,
        openQueries: c.openQueries,
        rejections: c.rejections,
        total,
      };
    })
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredCases]);

  const stalledCases = useMemo(
    () =>
      filteredCases.filter((c) => {
        const sla = slaStatus(c, c.stage, 14);
        return (
          Boolean(c.bottleneckReason) ||
          sla.state !== "ok" ||
          c.branchDecision?.status === "Query Raised" ||
          c.branchDecision?.status === "Rejected" ||
          c.readinessScore < 80
        );
      }),
    [filteredCases]
  );

  const handleEscalateLdm = (shg: SHGCase) => {
    if (!onUpdateCase || shg.ldmEscalated) return;
    onUpdateCase({
      ...shg,
      ldmEscalated: true,
      timeline: [
        {
          id: `ev-ldm-${Date.now()}`,
          stage: shg.stage,
          actor: "GLPC District Official (Simulated)",
          timestamp: "Just now",
          note: `Escalated to Lead District Manager (LDM / BLBC) after ${shg.daysInStage}d stage ageing.`,
        },
        ...shg.timeline,
      ],
    });
  };

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
    <div className="space-y-6">
      <SectionHeader
        eyebrow="District / State Official Dashboard (GLPC Pilot)"
        title="Target vs. Credit Access Command Centre"
        subtitle="Contrast programme targets against actual bank sanctions, RBI 6× ticket adequacy, SLA ageing & reason codes."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2.5">
            <SimulatedBadge />
            <div className="flex items-center rounded-md border border-[#DFDBD0] bg-white p-1 text-[13px]">
              {(["All", "Anand", "Kheda"] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistrictFilter(dist)}
                  className={cn(
                    "rounded px-3 py-1.5 font-medium transition-colors",
                    districtFilter === dist
                      ? "bg-[#0F5E4E] text-white"
                      : "text-[#475467] hover:text-[#141A23]"
                  )}
                >
                  {dist === "All" ? "All Districts" : dist}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Next Best Action Banner */}
      <div className="rounded-lg border border-[#0F5E4E] bg-[#0F5E4E] p-5 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <div className="text-[11.5px] font-semibold uppercase tracking-wider text-white/75">
              Active Focus SHG · {activeCase.caseCode}
            </div>
            <div className="text-[18px] font-semibold">
              {activeCase.shgName} — {formatINR(activeNeed)} requested (RBI 6× limit:{" "}
              {formatINR(drawingPowerFirstDose(activeCase.corpusBalance))})
            </div>
            <div className="text-[13.5px] text-white/80">
              {activeCase.bottleneckReason ??
                "Pack progressing within proposed SLA; review bank appraisal readiness."}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate("shg-directory")}
            >
              SHG Directory
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate("application-pack")}
            >
              Inspect Pack <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Target-vs-Access KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-[12px] font-medium text-[#475467]">
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#0F5E4E]" />
              Target vs. Sanctioned
            </span>
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold text-[#141A23] tabular-nums">
            {telemetry.districtSanctioned}{" "}
            <span className="text-[14px] font-normal text-[#475467]">
              / {telemetry.districtDemandTarget}
            </span>
          </div>
          <div className="mt-1 text-[12px] text-[#475467]">
            Live pilot sample: {telemetry.liveSanctioned}/{filteredCases.length} SHGs sanctioned
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#475467]">
            <Scale className="h-4 w-4 text-[#B45309]" />
            Avg Ticket vs. RBI 6× Corpus
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold text-[#B45309] tabular-nums">
            {telemetry.avgGap.adequacyPct}%
            <span className="ml-1.5 text-[13px] font-normal text-[#475467]">adequate</span>
          </div>
          <div className="mt-1 text-[12px] text-[#475467] tabular-nums">
            Avg {formatINR(telemetry.avgRequested)} asked vs {formatINR(telemetry.avgEligible)} 6×
          </div>
        </Card>

        <Card
          className={cn(
            "p-4",
            telemetry.slaBreached > 0 || telemetry.slaWarning > 0
              ? "border-[#FDE68A] bg-[#FFFBEB]"
              : ""
          )}
        >
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#475467]">
            <Clock className="h-4 w-4 text-[#B45309]" />
            SLA Watch (Proposed 14d)
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold text-[#141A23] tabular-nums">
            {telemetry.slaBreached} breached{" "}
            <span className="text-[14px] font-normal text-[#B45309]">
              · {telemetry.slaWarning} warn
            </span>
          </div>
          <div className="mt-1 text-[12px] text-[#475467]">
            Proposed SLA (configurable) stage threshold
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-[12px] font-medium text-[#475467]">
            <span className="flex items-center gap-1.5">
              <Repeat className="h-4 w-4 text-[#0F5E4E]" />
              Repeat Linkage (Dose 2+)
            </span>
            <span className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-medium text-[#B45309]">
              Illustrative
            </span>
          </div>
          <div className="mt-2 font-mono text-[26px] font-semibold text-[#0F5E4E] tabular-nums">
            {telemetry.repeatReady}
            <span className="ml-1 text-[14px] font-normal text-[#475467]">
              / {filteredCases.length} SHGs
            </span>
          </div>
          <div className="mt-1 text-[12px] text-[#475467]">
            Dose 2+ or repayment-gate ready
          </div>
        </Card>
      </div>

      {/* Standardized Reason Code Analytics + Escalation Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Live Query / Rejection Reason Analytics */}
        <Card className="p-5 lg:col-span-5">
          <div className="flex items-start justify-between gap-2 border-b border-[#ECE8DE] pb-3">
            <div>
              <h2 className="text-[15.5px] font-semibold text-[#141A23]">
                Query &amp; Rejection Reason Analytics
              </h2>
              <p className="mt-0.5 text-[12px] text-[#475467]">
                Proposed standard codes · live from branch decisions &amp; open queries
              </p>
            </div>
          </div>

          {reasonAnalytics.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#475467]">
              No branch queries or rejections logged for this district filter yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3.5">
              {reasonAnalytics.map((item) => {
                const maxTotal = Math.max(1, reasonAnalytics[0]?.total || 1);
                const pct = Math.max(16, Math.round((item.total / maxTotal) * 100));
                return (
                  <div key={item.code} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[12.5px]">
                      <div className="min-w-0">
                        <span className="mr-1.5 rounded bg-[#F2EFE8] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#141A23]">
                          {item.code}
                        </span>
                        <span className="text-[#141A23]">{item.labelEn}</span>
                      </div>
                      <span className="shrink-0 font-mono text-[12px] font-semibold text-[#B45309] tabular-nums">
                        {item.total} ({item.openQueries}Q / {item.rejections}R)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2EFE8]">
                      <div
                        className="h-full rounded-full bg-[#B45309]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Priority Bottleneck & LDM Escalation Queue */}
        <Card className="p-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-[#ECE8DE] pb-3">
            <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-[#141A23]">
              <ShieldAlert className="h-4 w-4 text-[#B45309]" />
              SLA &amp; Bottleneck Intervention Queue
            </h2>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => onNavigate("shg-directory")}
            >
              All SHGs →
            </Button>
          </div>

          <div className="mt-3 divide-y divide-[#ECE8DE]">
            {stalledCases.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-[#475467]">
                All filtered cases are within proposed SLA and have no open bottlenecks.
              </div>
            ) : (
              stalledCases.map((c) => {
                const sla = slaStatus(c, c.stage, 14);
                const slaTone =
                  sla.state === "breached"
                    ? "danger"
                    : sla.state === "warning"
                    ? "warning"
                    : "info";

                return (
                  <div key={c.id} className="py-3.5 first:pt-1 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[14px] text-[#141A23]">
                            {c.shgName}
                          </span>
                          <StageChip stage={c.stage} />
                          <StatusChip tone={slaTone}>
                            {sla.elapsedDays}d / {sla.slaDays}d ({sla.label})
                          </StatusChip>
                        </div>
                        <div className="mt-1 text-[12.5px] text-[#475467]">
                          {c.bottleneckReason ?? `${c.block} · ${c.linkedBranch}`}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {c.ldmEscalated ? (
                          <StatusChip tone="warning" icon={<Megaphone className="h-3 w-3" />}>
                            Escalated to LDM/BLBC
                          </StatusChip>
                        ) : (
                          onUpdateCase && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEscalateLdm(c)}
                            >
                              <AlertTriangle className="h-3.5 w-3.5 text-[#B45309]" />
                              Escalate LDM
                            </Button>
                          )
                        )}
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => onSelectCase(c.id, "finance-passport")}
                        >
                          Inspect
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Tab switcher for Funnel & District Matrix */}
      <div className="flex items-center justify-between border-b border-[#DFDBD0]">
        <div className="flex gap-6">
          {(["overview", "districts"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "pb-3 text-[14px] font-medium transition-colors border-b-2",
                tab === t
                  ? "border-[#0F5E4E] text-[#141A23]"
                  : "border-transparent text-[#475467] hover:text-[#141A23]"
              )}
            >
              {t === "overview" ? "Conversion Funnel (Simulated)" : "District / Block Matrix"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onNavigate("programme-insights")}
          className="pb-3 text-[13px] font-medium text-[#0F5E4E] hover:underline"
        >
          Full Programme Insights →
        </button>
      </div>

      {tab === "overview" ? (
        <Card className="p-5">
          <h2 className="text-[15.5px] font-semibold text-[#141A23]">
            District Pilot Conversion Funnel (Simulated Benchmark)
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keyFunnelStages.map((row) => {
              const widthPct = Math.max(10, Math.round((row.count / maxFunnelCount) * 100));
              return (
                <div key={row.stage} className="space-y-1.5 rounded-md border border-[#ECE8DE] bg-[#FAF8F4] p-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-[#141A23]">{row.stage}</span>
                    <span className="font-mono tabular-nums font-bold text-[#141A23]">
                      {row.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white border border-[#DFDBD0]">
                    <div
                      className="h-full rounded-full bg-[#0F5E4E]"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#DFDBD0] bg-[#F2EFE8] text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                <tr>
                  <th className="px-5 py-3">Block</th>
                  <th className="px-4 py-3 text-right">Demand Target</th>
                  <th className="px-4 py-3 text-right">Matched</th>
                  <th className="px-4 py-3 text-right">Pack Ready</th>
                  <th className="px-4 py-3 text-right">Sanctioned</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                  <th className="px-5 py-3">Primary Bottleneck</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDBD0] tabular-nums">
                {filteredDistrictRows.map((r) => {
                  const convPct =
                    r.demandIdentified > 0
                      ? Math.round((r.sanctioned / r.demandIdentified) * 100)
                      : 0;
                  return (
                    <tr key={`${r.district}-${r.block}`} className="hover:bg-[#FAF8F4]">
                      <td className="px-5 py-3.5 font-semibold text-[#141A23]">
                        {r.block}{" "}
                        <span className="font-normal text-[#475467]">({r.district})</span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono">{r.demandIdentified}</td>
                      <td className="px-4 py-3.5 text-right font-mono">{r.routeMatched}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold text-[#0F5E4E]">
                        {r.packComplete}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold">{r.sanctioned}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-[#B45309]">
                        {convPct}%
                      </td>
                      <td className="px-5 py-3.5 text-[#475467]">{r.topBottleneck}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
