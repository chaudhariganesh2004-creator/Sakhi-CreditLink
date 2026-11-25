import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  Calculator,
  CheckCircle2,
  Landmark,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ROLE_META,
  type NavScreenId,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import { SectionHeader, StageChip } from "@/components/shared/ui-primitives";
import { cn, formatINR, formatINRCompact } from "@/lib/utils";

interface RoleProfitDashboardProps {
  cases: SHGCase[];
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const RoleProfitDashboardScreen: React.FC<RoleProfitDashboardProps> = ({
  cases,
  role,
  onChangeRole,
  onSelectCase,
  onNavigate,
}) => {
  // Interactive Sakhi CreditLink Profit & Sustainability Calculator (B2G + Flat-Fee Bank LSP)
  const [activeBlocks, setActiveBlocks] = useState<number>(12);
  const [b2gFeePerBlockYear, setB2gFeePerBlockYear] = useState<number>(25000);
  const [loansPerBlockPerYear, setLoansPerBlockPerYear] = useState<number>(48);
  const [flatBankLspFee, setFlatBankLspFee] = useState<number>(1400);
  const [monthlyOpsCost, setMonthlyOpsCost] = useState<number>(45000);

  const portfolioStats = useMemo(() => {
    let totalProjectValue = 0;
    let totalExternalNeed = 0;
    let grantedLoanValue = 0;
    let grantedCount = 0;
    let inProgressCount = 0;

    cases.forEach((c) => {
      const cost = c.costLines.reduce((s, l) => s + l.amount, 0);
      const ext = Math.max(0, cost - c.ownContribution);
      totalProjectValue += cost;
      totalExternalNeed += ext;

      if (["Sanctioned", "Disbursed", "Enterprise active"].includes(c.stage)) {
        grantedLoanValue += ext;
        grantedCount += 1;
      } else {
        inProgressCount += 1;
      }
    });

    return {
      totalCases: cases.length,
      totalProjectValue,
      totalExternalNeed,
      grantedLoanValue,
      grantedCount,
      inProgressCount,
    };
  }, [cases]);

  // Live Sakhi CreditLink Financial Model Math
  const annualB2GRevenue = activeBlocks * b2gFeePerBlockYear;
  const totalAnnualLoans = activeBlocks * loansPerBlockPerYear;
  const annualLspRevenue = totalAnnualLoans * flatBankLspFee;
  const totalAnnualRevenue = annualB2GRevenue + annualLspRevenue;
  const annualOpsCost = monthlyOpsCost * 12;
  const annualNetProfit = totalAnnualRevenue - annualOpsCost;
  const profitMarginPct =
    totalAnnualRevenue > 0 ? Math.round((annualNetProfit / totalAnnualRevenue) * 100) : 0;

  // Live portfolio revenue from the current portal cases
  const currentPortalGrantedLsp = portfolioStats.grantedCount * flatBankLspFee;
  const currentPortalPipelineLsp = portfolioStats.totalCases * flatBankLspFee;

  const roleCards: { id: UserRole; title: string; focus: string }[] = [
    { id: "shg-leader", title: "SHG Leader", focus: "Applications, Granted Loans & Profit Flow" },
    { id: "bank-sakhi", title: "Bank Sakhi", focus: "Cluster Facilitation & Field Queue" },
    { id: "glpc-officer", title: "GLPC Officer", focus: "District B2G SaaS & Bottlenecks" },
    { id: "bank-officer", title: "Bank Officer", focus: "Pre-Vetted PSL Packs & LSP ROI" },
    { id: "admin", title: "Admin", focus: "Platform P&L & Unit Economics" },
  ];

  const meta = ROLE_META[role];

  return (
    <div className="space-y-8 animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
      <SectionHeader
        eyebrow={`Role Workspace · ${meta.userName}`}
        title={`${meta.shortLabel} Dashboard & Profit Model`}
        subtitle={meta.scopeNote}
        rightSlot={
          <button
            onClick={() => onNavigate("shg-intake")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[var(--sakhi-forest-deep)]"
          >
            <Sparkles className="h-4 w-4" /> + New SHG Application
          </button>
        }
      />

      {/* 5-Role Switcher Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {roleCards.map((rc) => {
          const active = role === rc.id;
          return (
            <button
              key={rc.id}
              onClick={() => onChangeRole(rc.id)}
              className={cn(
                "rounded-2xl p-4 text-left transition-all",
                active
                  ? "ios-glass-dark text-white shadow-lg"
                  : "ios-glass text-[var(--sakhi-slate)] hover:-translate-y-0.5"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-bold">{rc.title}</span>
                <Shield className={cn("h-4 w-4", active ? "text-emerald-300" : "text-[var(--sakhi-forest)]")} />
              </div>
              <div className={cn("mt-1.5 text-[11.5px] leading-snug", active ? "text-white/75" : "text-[var(--sakhi-muted)]")}>
                {rc.focus}
              </div>
            </button>
          );
        })}
      </div>

      {/* Full Application & Granted Loan Flow Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl ios-glass p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
            <Users className="h-4 w-4 text-[var(--sakhi-forest)]" /> Total Applications
          </div>
          <div className="mt-2 font-display text-[34px] text-[var(--sakhi-slate)] tabular-nums">
            {portfolioStats.totalCases}
          </div>
          <div className="mt-1 text-[12.5px] text-[var(--sakhi-muted)]">
            {portfolioStats.inProgressCount} in readiness · {portfolioStats.grantedCount} granted
          </div>
        </div>

        <div className="rounded-2xl ios-glass p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
            <BadgeIndianRupee className="h-4 w-4 text-[var(--sakhi-forest)]" /> Total Credit Demand
          </div>
          <div className="mt-2 font-display text-[34px] text-[var(--sakhi-slate)] tabular-nums">
            {formatINRCompact(portfolioStats.totalExternalNeed)}
          </div>
          <div className="mt-1 text-[12.5px] text-[var(--sakhi-muted)]">
            Across {formatINRCompact(portfolioStats.totalProjectValue)} total project cost
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Granted / Sanctioned Loans
          </div>
          <div className="mt-2 font-display text-[34px] text-emerald-800 tabular-nums">
            {formatINRCompact(portfolioStats.grantedLoanValue)}
          </div>
          <div className="mt-1 text-[12.5px] text-emerald-700">
            {portfolioStats.grantedCount} SHG loan(s) sanctioned/active
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-amber-800">
            <Landmark className="h-4 w-4" /> Live Portal LSP Revenue
          </div>
          <div className="mt-2 font-display text-[34px] text-amber-900 tabular-nums">
            {formatINR(currentPortalGrantedLsp)}
          </div>
          <div className="mt-1 text-[12.5px] text-amber-800">
            Pipeline potential: {formatINR(currentPortalPipelineLsp)}
          </div>
        </div>
      </div>

      {/* End-to-End Flow + Applications & Granted Loans Table */}
      <section className="overflow-hidden rounded-2xl ios-glass">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--sakhi-border)] px-6 py-4">
          <div>
            <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
              All SHG Applications, Granted Loans &amp; Facilitation Flow
            </h2>
            <p className="text-[12.5px] text-[var(--sakhi-muted)]">
              SHGs pay ₹0. Sakhi CreditLink earns a flat RBI-compliant readiness fee only when a bank sanctions/disburses.
            </p>
          </div>
          <span className="rounded-full bg-[var(--sakhi-mint)] px-3 py-1 text-[11.5px] font-semibold text-[var(--sakhi-forest)]">
            {cases.length} Active Cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--sakhi-border)] bg-white/60 text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <tr>
                <th className="px-6 py-3">SHG &amp; Activity</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3 text-right">External Loan</th>
                <th className="px-4 py-3 text-right">Readiness</th>
                <th className="px-4 py-3 text-right">LSP Fee Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sakhi-border)] tabular-nums">
              {cases.map((c) => {
                const total = c.costLines.reduce((s, l) => s + l.amount, 0);
                const ext = Math.max(0, total - c.ownContribution);
                const isGranted = ["Sanctioned", "Disbursed", "Enterprise active"].includes(c.stage);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-white/60">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-[var(--sakhi-slate)]">{c.shgName}</div>
                      <div className="text-[11.5px] text-[var(--sakhi-muted)]">
                        {c.caseCode} · {c.activity} · {c.block}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StageChip stage={c.stage} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-[var(--sakhi-slate)]">
                      {formatINR(ext)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[var(--sakhi-forest)]">
                      {c.readinessScore}%
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {isGranted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-700">
                          +{formatINR(flatBankLspFee)} Earned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11.5px] font-medium text-slate-600">
                          {formatINR(flatBankLspFee)} Pending Sanction
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => onSelectCase(c.id, "financing-blueprint")}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--sakhi-forest)] hover:underline"
                      >
                        Open <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Sakhi CreditLink Profit & Sustainability Calculator */}
      <section className="rounded-3xl ios-glass-strong p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--sakhi-border)] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--sakhi-mint)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
              <Calculator className="h-3.5 w-3.5" /> Business Sustainability Model
            </div>
            <h2 className="mt-2 font-display text-[26px] text-[var(--sakhi-slate)]">
              Sakhi CreditLink Profit Calculator (B2G + Flat-Fee Bank LSP)
            </h2>
            <p className="mt-1 text-[13.5px] text-[var(--sakhi-muted)]">
              Adjust state-scale assumptions below to see how Sakhi CreditLink stays profitable while keeping SHG access 100% free.
            </p>
          </div>

          <div className="rounded-2xl ios-glass-dark px-5 py-3.5 text-right text-white">
            <div className="text-[11px] uppercase tracking-widest text-white/70">Projected Annual Net Profit</div>
            <div className="font-display text-[28px] tabular-nums">
              {formatINR(annualNetProfit)}
            </div>
            <div className="text-[12px] text-emerald-300 font-semibold">
              {profitMarginPct}% Net Margin
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5">
            {[
              {
                label: "Active Pilot / Scale Blocks (GLPC / SRLM)",
                value: activeBlocks,
                display: `${activeBlocks} blocks`,
                min: 2,
                max: 100,
                step: 1,
                onChange: setActiveBlocks,
              },
              {
                label: "B2G Institutional SaaS License (per block / year)",
                value: b2gFeePerBlockYear,
                display: formatINR(b2gFeePerBlockYear),
                min: 10000,
                max: 60000,
                step: 5000,
                onChange: setB2gFeePerBlockYear,
              },
              {
                label: "Sanctioned SHG Enterprise Loans (per block / year)",
                value: loansPerBlockPerYear,
                display: `${loansPerBlockPerYear} loans/yr`,
                min: 12,
                max: 120,
                step: 4,
                onChange: setLoansPerBlockPerYear,
              },
              {
                label: "Flat Bank LSP Readiness Fee (per sanctioned loan)",
                value: flatBankLspFee,
                display: formatINR(flatBankLspFee),
                min: 500,
                max: 3000,
                step: 100,
                onChange: setFlatBankLspFee,
              },
              {
                label: "Platform Ops, Cloud & Field Support Cost (monthly)",
                value: monthlyOpsCost,
                display: `${formatINR(monthlyOpsCost)}/mo`,
                min: 15000,
                max: 250000,
                step: 5000,
                onChange: setMonthlyOpsCost,
              },
            ].map((ctrl) => (
              <div key={ctrl.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[var(--sakhi-slate)]">{ctrl.label}</span>
                  <span className="font-mono font-bold text-[var(--sakhi-forest)] tabular-nums">{ctrl.display}</span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={ctrl.value}
                  onChange={(e) => ctrl.onChange(Number(e.target.value))}
                  className="w-full accent-[var(--sakhi-forest)] cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* P&L Breakdown */}
          <div className="lg:col-span-5 rounded-2xl border border-[var(--sakhi-border)] bg-white/80 p-6 space-y-4">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--sakhi-slate)] border-b border-[var(--sakhi-border)] pb-3">
              <TrendingUp className="h-4 w-4 text-[var(--sakhi-forest)]" />
              Annual P&amp;L Summary
            </div>

            <div className="space-y-3 text-[13.5px] tabular-nums">
              <div className="flex justify-between">
                <span className="text-[var(--sakhi-muted)]">1. B2G Institutional SaaS ({activeBlocks} blocks)</span>
                <span className="font-mono font-semibold text-[var(--sakhi-slate)]">{formatINR(annualB2GRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--sakhi-muted)]">2. Flat Bank LSP Fees ({totalAnnualLoans} loans)</span>
                <span className="font-mono font-semibold text-[var(--sakhi-slate)]">{formatINR(annualLspRevenue)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--sakhi-border)] pt-2.5 font-bold">
                <span className="text-[var(--sakhi-slate)]">Total Annual Revenue</span>
                <span className="font-mono text-[var(--sakhi-forest)]">{formatINR(totalAnnualRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--sakhi-muted)]">Annual Operating &amp; Support Cost</span>
                <span className="font-mono text-red-600">− {formatINR(annualOpsCost)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--sakhi-border)] pt-3 text-[15px] font-bold">
                <span className="text-[var(--sakhi-forest)]">Net Annual Surplus / Profit</span>
                <span className={cn("font-mono", annualNetProfit >= 0 ? "text-emerald-700" : "text-red-600")}>
                  {formatINR(annualNetProfit)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--sakhi-mint)]/70 p-3.5 text-[12px] leading-relaxed text-[var(--sakhi-forest)]">
              <Building2 className="mb-1 inline h-3.5 w-3.5 mr-1" />
              <strong>SHG Fee: ₹0.</strong> Unbiased alphabetical lender comparison is preserved because every bank pays the exact same flat readiness fee.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
