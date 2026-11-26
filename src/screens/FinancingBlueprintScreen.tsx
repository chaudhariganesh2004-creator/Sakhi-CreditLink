import React, { useMemo, useState } from "react";
import { CalendarRange, ChevronRight, FileSpreadsheet, TrendingUp, Upload } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { SectionHeader, GovernanceNotice } from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  onNavigate: (s: NavScreenId) => void;
}

interface MonthlySaleRow {
  month: string;
  unitsSold: number;
}

const MONTHS_12 = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const SEASONAL_WEIGHTS = [1.05, 1.0, 0.95, 1.15, 1.1, 0.9, 0.72, 0.68, 0.85, 1.25, 1.3, 1.05];

export const FinancingBlueprintScreen: React.FC<Props> = ({ shg, onNavigate }) => {
  const [scenario, setScenario] = useState<"base" | "optimistic" | "conservative">("base");
  const [historyWindow, setHistoryWindow] = useState<6 | 12>(12);
  const [annualRatePct, setAnnualRatePct] = useState<number>(10.2);
  const [tenorMonths, setTenorMonths] = useState<number>(shg.timelineMonths || 36);
  const [csvStatus, setCsvStatus] = useState<string>("");

  const ue = shg.unitEconomics;
  const baseCurrent = Math.max(50, ue.currentMonthlyUnits);

  const [salesLedger, setSalesLedger] = useState<MonthlySaleRow[]>(() =>
    MONTHS_12.map((m, idx) => ({
      month: m,
      unitsSold: Math.round(baseCurrent * SEASONAL_WEIGHTS[idx]),
    }))
  );

  const capex = shg.costLines.filter((c) => c.category === "Capex").reduce((s, c) => s + c.amount, 0);
  const wc = shg.costLines.filter((c) => c.category === "Working Capital").reduce((s, c) => s + c.amount, 0);
  const totalCost = capex + wc;
  const externalNeed = Math.max(0, totalCost - shg.ownContribution);

  const marginPerUnit = Math.max(1, ue.sellingPricePerUnit - ue.directCostPerUnit - ue.overheadPerUnit);

  const activeRows = useMemo(
    () => (historyWindow === 6 ? salesLedger.slice(6) : salesLedger),
    [salesLedger, historyWindow]
  );

  const historicalStats = useMemo(() => {
    const totalUnits = activeRows.reduce((s, r) => s + r.unitsSold, 0);
    const avgUnits = Math.round(totalUnits / Math.max(1, activeRows.length));
    const minRow = activeRows.reduce((min, r) => (r.unitsSold < min.unitsSold ? r : min), activeRows[0]);
    const maxRow = activeRows.reduce((max, r) => (r.unitsSold > max.unitsSold ? r : max), activeRows[0]);
    return {
      avgUnits,
      avgRevenue: avgUnits * ue.sellingPricePerUnit,
      avgMargin: avgUnits * marginPerUnit,
      leanMonth: minRow,
      leanMargin: minRow.unitsSold * marginPerUnit,
      peakMonth: maxRow,
    };
  }, [activeRows, ue.sellingPricePerUnit, marginPerUnit]);

  // Post-loan capacity multiplier applied on top of verified historical average
  const expansionRatio = ue.projectedMonthlyUnits / Math.max(1, ue.currentMonthlyUnits);
  const scenarioMultiplier = scenario === "optimistic" ? 1.15 : scenario === "conservative" ? 0.85 : 1;
  const projectedUnits = Math.round(historicalStats.avgUnits * expansionRatio * scenarioMultiplier);
  const monthlyRevenue = projectedUnits * ue.sellingPricePerUnit;
  const monthlyMargin = projectedUnits * marginPerUnit;

  // Reducing-balance EMI calculation
  const monthlyRate = annualRatePct / 12 / 100;
  const illustrativeEMI =
    externalNeed === 0
      ? 0
      : monthlyRate === 0
      ? Math.round(externalNeed / tenorMonths)
      : Math.round(
          (externalNeed * monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) /
            (Math.pow(1 + monthlyRate, tenorMonths) - 1)
        );

  const dscr = illustrativeEMI > 0 ? monthlyMargin / illustrativeEMI : 0;
  const historicalDscr = illustrativeEMI > 0 ? historicalStats.avgMargin / illustrativeEMI : 0;
  const leanMonthDscr = illustrativeEMI > 0 ? historicalStats.leanMargin / illustrativeEMI : 0;

  const handleUpdateMonthUnits = (month: string, units: number) => {
    setSalesLedger((prev) =>
      prev.map((row) => (row.month === month ? { ...row, unitsSold: Math.max(0, units) } : row))
    );
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed: MonthlySaleRow[] = [];
    for (const line of lines) {
      const [m, u] = line.split(",").map((x) => x.trim());
      if (!m || m.toLowerCase() === "month") continue;
      const num = Number(u);
      if (!Number.isNaN(num)) parsed.push({ month: m, unitsSold: Math.max(0, num) });
    }
    if (parsed.length >= 6) {
      setSalesLedger(parsed.slice(-12));
      setHistoryWindow(parsed.length >= 12 ? 12 : 6);
      setCsvStatus(`Fetched ${parsed.length} months from ${file.name}`);
    } else {
      setCsvStatus("CSV needs at least 6 rows (month,unitsSold)");
    }
  };

  const maxUnitsInChart = Math.max(...activeRows.map((r) => r.unitsSold), 1);

  return (
    <div className="space-y-6 " >
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Financing Blueprint & Sales-Backed EMI"
        subtitle={`Natural loan EMI & DSCR calculated from ${shg.shgName}'s last ${historyWindow}-month sales track record.`}
        rightSlot={
          <button
            onClick={() => onNavigate("scheme-match")}
            className="group flex items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Scheme Match <ChevronRight className="h-4 w-4" />
          </button>
        }
      />

      {/* Last 6 to 12 Months Sales Report Section */}
      <section className="rounded-lg border border-[#DFDBD0] bg-white p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--sakhi-border)] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[15px] font-bold text-[var(--sakhi-slate)]">
              <CalendarRange className="h-4 w-4 text-[var(--sakhi-forest)]" />
              Last {historyWindow}-Month Sales Report ({ue.primaryProduct})
            </div>
            <p className="mt-0.5 text-[12.5px] text-[var(--sakhi-muted)]">
              Edit monthly units sold below or import a 6–12 month sales CSV so EMI sizing reflects real seasonal cash flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-lg border border-[var(--sakhi-border)] bg-white p-1 text-[12.5px]">
              {([6, 12] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setHistoryWindow(w)}
                  className={cn(
                    "rounded-lg px-3 py-1 font-semibold transition-all",
                    historyWindow === w
                      ? "bg-[var(--sakhi-forest)] text-white"
                      : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
                  )}
                >
                  Last {w} Months
                </button>
              ))}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--sakhi-border)] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[var(--sakhi-slate)] hover:bg-[var(--sakhi-surface)]">
              <Upload className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              Fetch Sales CSV
              <input type="file" accept=".csv,.txt" onChange={handleCsvImport} className="hidden" />
            </label>
          </div>
        </div>

        {csvStatus && (
          <div className="text-[12.5px] font-semibold text-[var(--sakhi-forest)]">{csvStatus}</div>
        )}

        {/* Monthly Bar Strip + Editable Units */}
        <div className={cn("grid gap-2.5", historyWindow === 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-3 sm:grid-cols-6 lg:grid-cols-12")}>
          {activeRows.map((row) => {
            const barPct = Math.max(12, Math.round((row.unitsSold / maxUnitsInChart) * 100));
            const isLean = row.month === historicalStats.leanMonth.month;
            const isPeak = row.month === historicalStats.peakMonth.month;
            return (
              <div
                key={row.month}
                className={cn(
                  "rounded-lg border p-2.5 text-center transition-colors",
                  isLean
                    ? "border-amber-200 bg-amber-50/70"
                    : isPeak
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-[var(--sakhi-border)] bg-white/80"
                )}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--sakhi-muted)]">
                  {row.month}
                </div>
                <div className="mx-auto my-2 flex h-12 w-3 items-end rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      "w-full rounded-full transition-all",
                      isLean ? "bg-amber-500" : "bg-[var(--sakhi-forest)]"
                    )}
                    style={{ height: `${barPct}%` }}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  value={row.unitsSold}
                  onChange={(e) => handleUpdateMonthUnits(row.month, Number(e.target.value) || 0)}
                  aria-label={`${row.month} units sold`}
                  className="w-full rounded-lg border border-[var(--sakhi-border)] bg-white px-1 py-1 text-center font-mono text-[12px] font-bold text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:outline-none"
                />
                <div className="mt-1 text-[10px] text-[var(--sakhi-muted)]">
                  {formatINR(row.unitsSold * marginPerUnit)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Historical Summary Strip */}
        <div className="grid gap-3 sm:grid-cols-3 pt-1">
          <div className="rounded-lg bg-white/80 border border-[var(--sakhi-border)] px-4 py-3 flex items-center justify-between">
            <span className="text-[12.5px] text-[var(--sakhi-muted)]">Verified Avg Sales ({historyWindow}m)</span>
            <span className="font-mono text-[13.5px] font-bold text-[var(--sakhi-slate)]">
              {historicalStats.avgUnits} {ue.unitLabel}/mo ({formatINR(historicalStats.avgMargin)} margin)
            </span>
          </div>
          <div className="rounded-lg bg-amber-50/80 border border-amber-200 px-4 py-3 flex items-center justify-between">
            <span className="text-[12.5px] text-amber-800">Lean Month ({historicalStats.leanMonth.month})</span>
            <span className="font-mono text-[13.5px] font-bold text-amber-900">
              {formatINR(historicalStats.leanMargin)} ({leanMonthDscr.toFixed(2)}x EMI)
            </span>
          </div>
          <div className="rounded-lg bg-emerald-50/80 border border-emerald-200 px-4 py-3 flex items-center justify-between">
            <span className="text-[12.5px] text-emerald-800">Peak Month ({historicalStats.peakMonth.month})</span>
            <span className="font-mono text-[13.5px] font-bold text-emerald-900">
              {historicalStats.peakMonth.unitsSold} {ue.unitLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Scenario & Loan Terms Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center rounded-lg border border-[var(--sakhi-border)] bg-white p-1">
          {(["conservative", "base", "optimistic"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={cn(
                "rounded-lg px-4 py-2 text-[13px] font-medium capitalize transition-all",
                scenario === s
                  ? "bg-[var(--sakhi-forest)] text-white "
                  : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
              )}
            >
              {s} Post-Loan
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#DFDBD0] bg-white px-4 py-2 text-[12.5px]">
          <label className="flex items-center gap-2">
            <span className="text-[var(--sakhi-muted)] font-medium">Rate (% p.a.):</span>
            <input
              type="number"
              step={0.1}
              min={4}
              max={24}
              value={annualRatePct}
              onChange={(e) => setAnnualRatePct(Number(e.target.value) || 10)}
              className="w-16 rounded-lg border border-[var(--sakhi-border)] bg-white px-2 py-1 font-mono font-bold text-[var(--sakhi-slate)]"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-[var(--sakhi-muted)] font-medium">Tenor:</span>
            <select
              value={tenorMonths}
              onChange={(e) => setTenorMonths(Number(e.target.value))}
              className="rounded-lg border border-[var(--sakhi-border)] bg-white px-2 py-1 font-mono font-bold text-[var(--sakhi-slate)]"
            >
              <option value={24}>24 mo</option>
              <option value={36}>36 mo</option>
              <option value={48}>48 mo</option>
              <option value={60}>60 mo</option>
            </select>
          </label>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#DFDBD0] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Projected Revenue</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(monthlyRevenue)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">{projectedUnits} {ue.unitLabel}/mo</div>
        </div>
        <div className="rounded-lg border border-[#DFDBD0] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Projected Margin</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-forest)] tabular-nums">{formatINR(monthlyMargin)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">₹{marginPerUnit}/{ue.unitLabel} net margin</div>
        </div>
        <div className="rounded-lg border border-[#DFDBD0] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Natural Loan EMI</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(illustrativeEMI)}</div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">{annualRatePct}% p.a. / {tenorMonths} mo on {formatINR(externalNeed)}</div>
        </div>
        <div className={cn(
          "rounded-lg border p-5",
          dscr >= 1.5 ? "border-emerald-200 bg-emerald-50" : dscr >= 1.2 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"
        )}>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Post-Loan / Hist. DSCR</div>
          <div className={cn(
            "mt-2 text-[24px] font-bold tabular-nums",
            dscr >= 1.5 ? "text-emerald-700" : dscr >= 1.2 ? "text-amber-700" : "text-red-700"
          )}>
            {dscr.toFixed(2)}x <span className="text-[14px] font-medium text-[var(--sakhi-muted)]">({historicalDscr.toFixed(2)}x hist.)</span>
          </div>
          <div className="text-[12px] text-[var(--sakhi-muted)]">Target ≥ 1.25x for bank comfort</div>
        </div>
      </div>

      {/* Unit Economics */}
      <div className="rounded-lg border border-[#DFDBD0] bg-white p-6">
        <h3 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)] mb-5">
          <FileSpreadsheet className="h-4 w-4 text-[var(--sakhi-forest)]" />
          Unit Economics — {ue.primaryProduct}
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            {[
              { label: "Selling Price", value: `₹${ue.sellingPricePerUnit}/${ue.unitLabel}`, color: "text-[var(--sakhi-slate)]" },
              { label: "Direct Cost", value: `₹${ue.directCostPerUnit}/${ue.unitLabel}`, color: "text-red-600" },
              { label: "Overhead", value: `₹${ue.overheadPerUnit}/${ue.unitLabel}`, color: "text-amber-600" },
              { label: "Net Margin", value: `₹${marginPerUnit}/${ue.unitLabel}`, color: "text-emerald-600" },
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
          <div className="space-y-3 rounded-lg bg-white/75 border border-[var(--sakhi-border)] p-5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              Seasonality &amp; Repayment Fit
            </div>
            <div className="text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--sakhi-muted)]">Peak Window:</span> <span className="font-medium text-[var(--sakhi-forest)]">{ue.peakMonths}</span></div>
              <div className="flex justify-between mt-1"><span className="text-[var(--sakhi-muted)]">Lean Window:</span> <span className="font-medium text-amber-600">{ue.leanMonths}</span></div>
            </div>
            <div className="border-t border-[var(--sakhi-border)] pt-3 text-[13px]">
              <div className="flex justify-between"><span className="text-[var(--sakhi-muted)]">{historyWindow}-Month Avg:</span> <span className="font-medium">{historicalStats.avgUnits} {ue.unitLabel}/mo</span></div>
              <div className="flex justify-between mt-1"><span className="text-[var(--sakhi-muted)]">Post-Capex Target:</span> <span className="font-bold text-[var(--sakhi-forest)]">{projectedUnits} {ue.unitLabel}/mo</span></div>
            </div>
          </div>
        </div>
      </div>

      <GovernanceNotice
        title="Illustrative Projections"
        body="EMI and DSCR figures are calculated from the entered 6–12 month sales ledger using a standard reducing-balance formula. Final sanction terms and repayment schedules are determined solely by the lending bank."
        tone="caution"
      />
    </div>
  );
};
