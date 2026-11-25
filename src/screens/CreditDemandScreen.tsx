import React from "react";
import { ChevronRight } from "lucide-react";
import type { AppLanguage, CostLineItem, NavScreenId, SHGCase, UserRole } from "@/data/sakhi-data";
import { GovernanceNotice, ProvenanceBadge, SectionHeader } from "@/components/shared/ui-primitives";
import { formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  role: UserRole;
  language: AppLanguage;
  onUpdateCase: (c: SHGCase) => void;
  onNavigate: (s: NavScreenId) => void;
}

export const CreditDemandScreen: React.FC<Props> = ({ shg, language, onNavigate }) => {
  const showGu = language === "en-gu";
  const capex = shg.costLines.filter((c) => c.category === "Capex");
  const wc = shg.costLines.filter((c) => c.category === "Working Capital");
  const capexTotal = capex.reduce((s, c) => s + c.amount, 0);
  const wcTotal = wc.reduce((s, c) => s + c.amount, 0);
  const totalCost = capexTotal + wcTotal;
  const externalNeed = totalCost - shg.ownContribution;

  const renderTable = (lines: CostLineItem[], label: string) => (
    <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-5 py-3">
        <span className="text-[14px] font-bold text-[var(--sakhi-slate)]">{label}</span>
        <span className="text-[14px] font-bold text-[var(--sakhi-forest)] tabular-nums">{formatINR(lines.reduce((s, c) => s + c.amount, 0))}</span>
      </div>
      <div className="divide-y divide-[var(--sakhi-border)]">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="flex-1">
              <div className="text-[14px] font-medium text-[var(--sakhi-slate)]">
                {showGu ? line.labelGu : line.label}
              </div>
              {line.note && <div className="mt-0.5 text-[12px] text-[var(--sakhi-muted)]">{line.note}</div>}
            </div>
            <div className="flex items-center gap-3">
              <ProvenanceBadge level={line.provenance} />
              <span className="text-[15px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(line.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Credit Demand"
        subtitle={`${showGu ? shg.purposeSummaryGu : shg.purposeSummary}`}
        rightSlot={
          <button
            onClick={() => onNavigate("financing-blueprint")}
            className="group flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Financing Blueprint <ChevronRight className="h-4 w-4" />
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Capex</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(capexTotal)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Working Capital</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(wcTotal)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Own Contribution</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(shg.ownContribution)}</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">External Need</div>
          <div className="mt-2 text-[24px] font-bold text-emerald-700 tabular-nums">{formatINR(externalNeed)}</div>
        </div>
      </div>

      <GovernanceNotice
        title="Capex / Working Capital Separation"
        body="PMFME capital subsidy applies only to eligible fixed capital (machinery/equipment). Working capital items are strictly excluded from subsidy calculation and routed to Cash Credit / Working Capital facilities."
        tone="caution"
      />

      {renderTable(capex, "Capital Expenditure (Capex)")}
      {renderTable(wc, "Working Capital")}

      {/* Visual cost split */}
      <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-6">
        <div className="text-[14px] font-bold text-[var(--sakhi-slate)] mb-4">Cost Composition</div>
        <div className="flex h-6 overflow-hidden rounded-full">
          <div
            className="bg-[var(--sakhi-forest)] transition-all"
            style={{ width: `${(capexTotal / totalCost) * 100}%` }}
            title={`Capex: ${formatINR(capexTotal)}`}
          />
          <div
            className="bg-[var(--sakhi-gold)] transition-all"
            style={{ width: `${(wcTotal / totalCost) * 100}%` }}
            title={`Working Capital: ${formatINR(wcTotal)}`}
          />
        </div>
        <div className="mt-3 flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[var(--sakhi-forest)]" />
            <span className="text-[var(--sakhi-muted)]">Capex ({Math.round((capexTotal / totalCost) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[var(--sakhi-gold)]" />
            <span className="text-[var(--sakhi-muted)]">Working Capital ({Math.round((wcTotal / totalCost) * 100)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
