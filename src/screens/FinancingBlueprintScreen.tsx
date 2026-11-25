import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { SectionHeader, GovernanceNotice } from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  onNavigate: (s: NavScreenId) => void;
}

export const FinancingBlueprintScreen: React.FC<Props> = ({ shg, onNavigate }) => {
  const [scenario, setScenario] = useState<"base" | "optimistic" | "conservative">("base");

  const capex = shg.costLines.filter(c => c.category === "Capex").reduce((s, c) => s + c.amount, 0);
  const wc = shg.costLines.filter(c => c.category === "Working Capital").reduce((s, c) => s + c.amount, 0);
  const totalCost = capex + wc;
  const externalNeed = totalCost - shg.ownContribution;

  const ue = shg.unitEconomics;
  const marginPerUnit = ue.sellingPricePerUnit - ue.directCostPerUnit - ue.overheadPerUnit;
  
  const scenarioMultiplier = scenario === "optimistic" ? 1.2 : scenario === "conservative" ? 0.75 : 1;
  const projectedUnits = Math.round(ue.projectedMonthlyUnits * scenarioMultiplier);
  const monthlyRevenue = projectedUnits * ue.sellingPricePerUnit;
  const monthlyMargin = projectedUnits * marginPerUnit;
  
  const illustrativeEMI = Math.round(externalNeed * 0.0085 * Math.pow(1.0085, shg.timelineMonths) / (Math.pow(1.0085, shg.timelineMonths) - 1));
  const dscr = monthlyMargin / illustrativeEMI;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Financing Blueprint"
        subtitle={`Monthly cash-flow model for ${shg.shgName} · ${shg.activity}`}
        rightSlot={
          <button
            onClick={() => onNavigate("scheme-match")}
            className="group flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Scheme Match <ChevronRight className="h-4 w-4" />
          </button>
        }
      />

      {/* Scenario selector */}
      <div className="flex items-center rounded-xl border border-[var(--sakhi-border)] bg-white p-1 w-fit">
        {(["conservative", "base", "optimistic"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={cn(
              "rounded-lg px-4 py-2 text-[13px] font-medium capitalize transition-all",
              scenario === s
                ? "bg-[var(--sakhi-forest)] text-white shadow-sm"
                : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Monthly Revenue</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(monthlyRevenue)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">{projectedUnits} {ue.unitLabel}/mo</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Monthly Margin</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-forest)] tabular-nums">{formatINR(monthlyMargin)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">₹{marginPerUnit}/{ue.unitLabel} margin</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Illustrative EMI</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(illustrativeEMI)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">~10.2% p.a. / {shg.timelineMonths} mo</div>
        </div>
        <div className={cn(
          "rounded-2xl border p-5",
          dscr >= 1.5 ? "border-emerald-200 bg-emerald-50" : dscr >= 1.2 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"
        )}>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">DSCR</div>
          <div className={cn(
            "mt-2 text-[24px] font-bold tabular-nums",
            dscr >= 1.5 ? "text-emerald-700" : dscr >= 1.2 ? "text-amber-700" : "text-red-700"
          )}>
            {dscr.toFixed(2)}x
          </div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">Margin / EMI ratio</div>
        </div>
      </div>

      {/* Unit Economics */}
      <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-6">
        <h3 className="text-[16px] font-bold text-[var(--sakhi-slate)] mb-5">Unit Economics — {ue.primaryProduct}</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            {[
              { label: "Selling Price", value: `₹${ue.sellingPricePerUnit}/${ue.unitLabel}`, color: "text-[var(--sakhi-slate)]" },
              { label: "Direct Cost", value: `₹${ue.directCostPerUnit}/${ue.unitLabel}`, color: "text-red-600" },
              { label: "Overhead", value: `₹${ue.overheadPerUnit}/${ue.unitLabel}`, color: "text-amber-600" },
              { label: "Margin", value: `₹${marginPerUnit}/${ue.unitLabel}`, color: "text-emerald-600" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--sakhi-muted)]">{row.label}</span>
                <span className={cn("font-bold tabular-nums", row.color)}>{row.value}</span>
              </div>
            ))}
            <div className="border-t border-[var(--sakhi-border)] pt-3">
              <div className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--sakhi-muted)]">Margin %</span>
                <span className="font-bold text-[var(--sakhi-forest)] tabular-nums">
                  {Math.round((marginPerUnit / ue.sellingPricePerUnit) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-xl bg-[var(--sakhi-surface)] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Seasonality</div>
            <div className="text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--sakhi-muted)]">Peak:</span> <span className="font-medium text-[var(--sakhi-forest)]">{ue.peakMonths}</span></div>
              <div className="flex justify-between mt-1"><span className="text-[var(--sakhi-muted)]">Lean:</span> <span className="font-medium text-amber-600">{ue.leanMonths}</span></div>
            </div>
            <div className="border-t border-[var(--sakhi-border)] pt-3 text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--sakhi-muted)]">Current Volume:</span> <span className="font-medium">{ue.currentMonthlyUnits} {ue.unitLabel}/mo</span></div>
              <div className="flex justify-between mt-1"><span className="text-[var(--sakhi-muted)]">Projected:</span> <span className="font-bold text-[var(--sakhi-forest)]">{projectedUnits} {ue.unitLabel}/mo</span></div>
            </div>
          </div>
        </div>
      </div>

      <GovernanceNotice
        title="Illustrative Projections"
        body="These cash-flow estimates are illustrative — final sanction terms, interest rates, and repayment schedules are determined solely by the sanctioning bank. EMI calculation uses a simplified reducing-balance formula."
        tone="caution"
      />
    </div>
  );
};
