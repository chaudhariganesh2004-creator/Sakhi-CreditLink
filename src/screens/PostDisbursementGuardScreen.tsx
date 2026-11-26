import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeIndianRupee,
  CalendarCheck2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { GovernanceNotice, SectionHeader, StageChip } from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface PostDisbursementProps {
  shg: SHGCase;
  cases: SHGCase[];
  onUpdateCase: (updated: SHGCase) => void;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
}

interface RepaymentPulse {
  id: string;
  month: string;
  emiAmount: number;
  actualSalesINR: number;
  status: "On-Time" | "Buffer Used" | "Upcoming";
}

export const PostDisbursementGuardScreen: React.FC<PostDisbursementProps> = ({
  shg,
  cases,
  onUpdateCase,
  onSelectCase,
}) => {
  const isPostSanction = ["Sanctioned", "Disbursed", "Enterprise active"].includes(shg.stage);

  const totalCost = shg.costLines.reduce((s, c) => s + c.amount, 0);
  const externalNeed = Math.max(0, totalCost - shg.ownContribution);
  const tenor = shg.timelineMonths || 36;
  const r = 10.2 / 12 / 100;
  const monthlyEmi =
    externalNeed === 0
      ? 0
      : Math.round((externalNeed * r * Math.pow(1 + r, tenor)) / (Math.pow(1 + r, tenor) - 1));

  const ue = shg.unitEconomics;
  const projectedMonthlyRevenue = ue.projectedMonthlyUnits * ue.sellingPricePerUnit;
  const netMarginRatio =
    ue.sellingPricePerUnit > 0
      ? Math.max(0.1, (ue.sellingPricePerUnit - ue.directCostPerUnit - ue.overheadPerUnit) / ue.sellingPricePerUnit)
      : 0.22;

  const [actualMonthlySales, setActualMonthlySales] = useState<number>(
    Math.round(projectedMonthlyRevenue * 0.92)
  );
  const [onTimeStreak, setOnTimeStreak] = useState<number>(isPostSanction ? 5 : 1);
  const [pulseLog, setPulseLog] = useState<RepaymentPulse[]>([
    { id: "p-1", month: "Jul 2026 (Lean)", emiAmount: monthlyEmi, actualSalesINR: Math.round(projectedMonthlyRevenue * 0.68), status: "Buffer Used" },
    { id: "p-2", month: "Aug 2026", emiAmount: monthlyEmi, actualSalesINR: Math.round(projectedMonthlyRevenue * 0.84), status: "On-Time" },
    { id: "p-3", month: "Sep 2026", emiAmount: monthlyEmi, actualSalesINR: Math.round(projectedMonthlyRevenue * 0.95), status: "On-Time" },
    { id: "p-4", month: "Oct 2026 (Peak)", emiAmount: monthlyEmi, actualSalesINR: Math.round(projectedMonthlyRevenue * 1.15), status: "On-Time" },
  ]);

  const actualMonthlyMargin = Math.round(actualMonthlySales * netMarginRatio);
  const coverageRatio = monthlyEmi > 0 ? actualMonthlyMargin / monthlyEmi : 2;
  const isLeanWarning = coverageRatio < 1.15;

  // Gujarat 0% effective interest subvention savings estimate (~10.2% p.a. saved on reducing balance)
  const annualSubventionSaved = Math.round(externalNeed * 0.095);
  const annualizedIncomePerMember = Math.round(
    ((actualMonthlyMargin - monthlyEmi) * 12) / Math.max(1, shg.membersCount)
  );

  const sanctionedCases = useMemo(
    () => cases.filter((c) => ["Sanctioned", "Disbursed", "Enterprise active"].includes(c.stage)),
    [cases]
  );

  const handleActivateDisbursed = () => {
    onUpdateCase({
      ...shg,
      stage: "Disbursed",
      timeline: [
        {
          id: `dis-${Date.now()}`,
          stage: "Disbursed",
          actor: "Bank Branch & Bank Sakhi",
          timestamp: "Just now",
          note: `Activated Post-Disbursement & Gujarat 0% Interest Subvention Guard for ${formatINR(externalNeed)}.`,
        },
        ...shg.timeline,
      ],
    });
  };

  const handleLogMonthlyPulse = () => {
    const status: RepaymentPulse["status"] = isLeanWarning ? "Buffer Used" : "On-Time";
    setOnTimeStreak((s) => s + 1);
    setPulseLog((prev) => [
      {
        id: `p-${Date.now()}`,
        month: "Nov 2026 (Latest)",
        emiAmount: monthlyEmi,
        actualSalesINR: actualMonthlySales,
        status,
      },
      ...prev,
    ]);
    onUpdateCase({
      ...shg,
      stage: "Enterprise active",
      timeline: [
        {
          id: `emi-${Date.now()}`,
          stage: "Repayment & Sales Pulse",
          actor: `${shg.bankSakhiName} (Bank Sakhi)`,
          timestamp: "Just now",
          note: `Logged ${status} EMI (${formatINR(monthlyEmi)}) with ${formatINR(actualMonthlySales)} monthly sales. 0% subvention protected.`,
        },
        ...shg.timeline,
      ],
    });
  };

  return (
    <div className="space-y-6 " >
      <SectionHeader
        eyebrow={`Post-Disbursement Guard · ${shg.caseCode}`}
        title="Repayment & 0% Subvention Guard"
        subtitle="Protects Gujarat's 0% effective interest subvention, tracks Lakhpati Didi income uplift, and triggers lean-month early warnings."
        rightSlot={
          <div className="flex items-center gap-2.5">
            <StageChip stage={shg.stage} />
            {!isPostSanction && (
              <button
                type="button"
                onClick={handleActivateDisbursed}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 py-2 text-[12.5px] font-semibold text-white  hover:bg-[var(--sakhi-forest-deep)]"
              >
                <Sparkles className="h-3.5 w-3.5" /> Activate Disbursed Tracking
              </button>
            )}
          </div>
        }
      />

      {!isPostSanction && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/80 px-5 py-3.5 text-[13px] text-amber-900">
          <span>
            <strong>{shg.shgName}</strong> is currently in <strong>{shg.stage}</strong>. Click{" "}
            <strong>Activate Disbursed Tracking</strong> to preview live repayment monitoring, or switch to a sanctioned case:
          </span>
          <div className="flex flex-wrap gap-2">
            {sanctionedCases.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectCase(sc.id, "post-disbursement")}
                className="rounded-lg bg-white px-3 py-1 text-[12px] font-semibold text-[var(--sakhi-forest)] border border-amber-200 hover:bg-emerald-50"
              >
                {sc.shgName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3 Core Guard Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* 1. Next EMI & 0% Subvention Guard */}
        <div className="rounded-lg border border-[#DFDBD0] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--sakhi-forest)]">
              <ShieldCheck className="h-4 w-4" /> 0% Subvention Guard
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              {onTimeStreak} Mo On-Time
            </span>
          </div>
          <div className="font-serif font-semibold text-[32px] text-[var(--sakhi-slate)] tabular-nums">
            {formatINR(monthlyEmi)} <span className="font-sans text-[13px] font-normal text-[var(--sakhi-muted)]">/ mo EMI</span>
          </div>
          <div className="text-[12.5px] text-[var(--sakhi-muted)]">
            Next Due: <strong className="text-[var(--sakhi-slate)]">05 Dec 2026</strong> · Protects{" "}
            <strong className="text-emerald-700">{formatINR(annualSubventionSaved)}/yr</strong> Gujarat interest subsidy.
          </div>
        </div>

        {/* 2. Actual vs Projected Sales (Lakhpati Didi) */}
        <div className="rounded-lg border border-[#DFDBD0] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <TrendingUp className="h-4 w-4 text-[var(--sakhi-forest)]" /> Lakhpati Didi Pulse
            </span>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              annualizedIncomePerMember >= 100000 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            )}>
              {annualizedIncomePerMember >= 100000 ? "≥ ₹1L Target Met" : "Building Uplift"}
            </span>
          </div>
          <div className="font-serif font-semibold text-[32px] text-[var(--sakhi-slate)] tabular-nums">
            {formatINR(actualMonthlySales)}
          </div>
          <div className="text-[12.5px] text-[var(--sakhi-muted)]">
            Projected Target: <strong className="text-[var(--sakhi-slate)]">{formatINR(projectedMonthlyRevenue)}</strong> ·{" "}
            Net/Member: <strong>{formatINR(Math.max(0, annualizedIncomePerMember))}/yr</strong>
          </div>
        </div>

        {/* 3. Lean-Month Early Warning */}
        <div
          className={cn(
            "rounded-lg border p-5 space-y-3",
            isLeanWarning
              ? "border-red-200 bg-red-50/85"
              : "border-emerald-200 bg-emerald-50/75"
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider",
              isLeanWarning ? "text-red-700" : "text-emerald-800"
            )}>
              {isLeanWarning ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              Lean-Month Warning
            </span>
            <span className="font-mono text-[12px] font-bold tabular-nums">
              {coverageRatio.toFixed(2)}x EMI
            </span>
          </div>
          <div className={cn("text-[15px] font-bold", isLeanWarning ? "text-red-900" : "text-emerald-900")}>
            {isLeanWarning
              ? "Early Warning: Margin below 1.15x EMI"
              : "Healthy Margin Coverage"}
          </div>
          <div className={cn("text-[12.5px] leading-snug", isLeanWarning ? "text-red-800" : "text-emerald-800")}>
            {isLeanWarning
              ? `Flagged to ${shg.bankSakhiName}: Use ${formatINR(shg.corpusBalance)} SHG corpus / CIF buffer to pay EMI on time and retain 0% interest.`
              : "Enterprise cash flow comfortably covers monthly EMI without touching group savings corpus."}
          </div>
        </div>
      </div>

      {/* Interactive Monthly Check-In Simulator */}
      <section className="rounded-lg border border-[#DFDBD0] bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--sakhi-border)] pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)]">
              <BadgeIndianRupee className="h-4 w-4 text-[var(--sakhi-forest)]" />
              Bank Sakhi Monthly Repayment &amp; Sales Check-In
            </h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--sakhi-muted)]">
              Test how a lean-month sales dip triggers the Early Warning &amp; Corpus Buffer recommendation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogMonthlyPulse}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white  hover:bg-[var(--sakhi-forest-deep)]"
          >
            <CalendarCheck2 className="h-4 w-4" /> Log Monthly EMI &amp; Sales Pulse
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-[var(--sakhi-slate)]">
              Actual Monthly Sales Reported (₹) — Net Margin: <strong>{formatINR(actualMonthlyMargin)}</strong>
            </span>
            <span className="font-mono font-bold text-[var(--sakhi-forest)]">{formatINR(actualMonthlySales)}</span>
          </div>
          <input
            type="range"
            min={Math.round(projectedMonthlyRevenue * 0.25)}
            max={Math.round(projectedMonthlyRevenue * 1.4)}
            step={2000}
            value={actualMonthlySales}
            onChange={(e) => setActualMonthlySales(Number(e.target.value))}
            className="w-full accent-[var(--sakhi-forest)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[var(--sakhi-muted)]">
            <span>Severe Lean Month (25% target)</span>
            <span>Projected Target ({formatINR(projectedMonthlyRevenue)})</span>
            <span>Peak Festival (140% target)</span>
          </div>
        </div>

        {isLeanWarning && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <strong>Action Flagged for Bank Sakhi ({shg.bankSakhiName}):</strong> Actual margin ({formatINR(actualMonthlyMargin)}) is close to or below EMI ({formatINR(monthlyEmi)}). Recommend temporary bridge from SHG Corpus ({formatINR(shg.corpusBalance)}) or CLF CIF buffer before 05 Dec to prevent 0% subvention loss.
            </div>
          </div>
        )}

        {/* Repayment & Sales Pulse History */}
        <div className="overflow-x-auto rounded-lg border border-[var(--sakhi-border)] bg-white/80">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <tr>
                <th className="px-5 py-3">Month</th>
                <th className="px-4 py-3 text-right">Actual Sales</th>
                <th className="px-4 py-3 text-right">EMI Paid</th>
                <th className="px-5 py-3 text-right">Subvention Guard Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sakhi-border)] tabular-nums">
              {pulseLog.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-semibold text-[var(--sakhi-slate)]">{p.month}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatINR(p.actualSalesINR)}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-[var(--sakhi-forest)]">{formatINR(p.emiAmount)}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        p.status === "On-Time"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {p.status === "On-Time" ? "On-Time · 0% Protected" : "Corpus Buffer Used · 0% Protected"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <GovernanceNotice
        title="Day-1 Field Pulse + Scale CBS Sync"
        body="In Pilot Mode, Bank Sakhis log monthly repayment & sales pulses during cluster meetings. At scale, this view syncs directly with Bank CBS / Account Aggregator repayment webhooks."
        tone="neutral"
      />
    </div>
  );
};
