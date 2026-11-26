import React, { useState } from "react";
import { PackageCheck, Plus } from "lucide-react";
import type { BuyerEvidenceItem, SHGCase } from "@/data/sakhi-data";
import {
  ProvenanceBadge,
  SectionHeader,
} from "@/components/shared/ui-primitives";
import { formatINR } from "@/lib/utils";

interface LivelihoodEvidenceProps {
  shg: SHGCase;
  onUpdateCase: (updated: SHGCase) => void;
}

export const LivelihoodEvidenceScreen: React.FC<LivelihoodEvidenceProps> = ({
  shg,
  onUpdateCase,
}) => {
  const [buyerName, setBuyerName] = useState("");
  const [monthlyVal, setMonthlyVal] = useState("");

  const ue = shg.unitEconomics;
  const contributionMargin = ue.sellingPricePerUnit - ue.directCostPerUnit;
  const netUnitMargin = contributionMargin - ue.overheadPerUnit;
  const capacityPct = Math.min(
    100,
    Math.round((ue.currentMonthlyUnits / ue.projectedMonthlyUnits) * 100)
  );

  const addBuyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;
    const item: BuyerEvidenceItem = {
      id: `be-${Date.now()}`,
      buyerName: buyerName.trim(),
      channel: "Local Retail Cooperative",
      evidenceType: "Written Purchase Order",
      monthlyVolumeKg: 100,
      monthlyValueINR: Number(monthlyVal) || 18000,
      provenance: "Document-supported",
    };
    onUpdateCase({
      ...shg,
      buyerEvidence: [item, ...shg.buyerEvidence],
    });
    setBuyerName("");
    setMonthlyVal("");
  };

  return (
    <div className="space-y-6 " >
      <SectionHeader
        eyebrow={`Market & Livelihood · ${shg.caseCode}`}
        title="Livelihood Evidence & Capacity"
        subtitle="Grounds loan sizing in verified buyer demand, unit margin, and seasonal production capacity."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Unit Economics Breakdown */}
        <section className="lg:col-span-6 rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <div className="border-b border-[var(--sakhi-border)] pb-3.5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-[var(--sakhi-slate)]">
              <PackageCheck className="h-4 w-4 text-[var(--sakhi-forest)]" />
              Unit Economics ({ue.primaryProduct})
            </h2>
          </div>

          <dl className="space-y-3 text-[13.5px] tabular-nums">
            <div className="flex justify-between">
              <dt className="text-[var(--sakhi-muted)]">Average Realised Price / {ue.unitLabel}</dt>
              <dd className="font-mono font-bold text-[var(--sakhi-slate)]">
                {formatINR(ue.sellingPricePerUnit)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--sakhi-muted)]">Direct Input Cost (raw material + pouch)</dt>
              <dd className="font-mono text-red-600">− {formatINR(ue.directCostPerUnit)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--sakhi-border)] pt-2.5">
              <dt className="font-medium text-[var(--sakhi-slate)]">Gross Contribution / {ue.unitLabel}</dt>
              <dd className="font-mono font-semibold text-[var(--sakhi-slate)]">
                {formatINR(contributionMargin)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--sakhi-muted)]">Utilities, Freight &amp; Overhead</dt>
              <dd className="font-mono text-amber-600">− {formatINR(ue.overheadPerUnit)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--sakhi-border)] pt-3 text-[15px] font-bold">
              <dt className="text-[var(--sakhi-forest)]">Net Operating Margin / {ue.unitLabel}</dt>
              <dd className="font-mono text-[var(--sakhi-forest)]">
                {formatINR(netUnitMargin)} ({Math.round((netUnitMargin / ue.sellingPricePerUnit) * 100)}%)
              </dd>
            </div>
          </dl>
        </section>

        {/* Capacity & Seasonality */}
        <section className="lg:col-span-6 rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-5">
          <div className="border-b border-[var(--sakhi-border)] pb-3.5">
            <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
              Production Capacity &amp; Seasonality
            </h2>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-[13.5px] tabular-nums">
              <span className="text-[var(--sakhi-muted)]">
                Current Output: <strong className="text-[var(--sakhi-slate)]">{ue.currentMonthlyUnits} {ue.unitLabel}/mo</strong>
              </span>
              <span className="font-semibold text-[var(--sakhi-forest)]">
                Post-Capex Target: {ue.projectedMonthlyUnits} {ue.unitLabel}/mo
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--sakhi-surface)]">
              <div
                className="h-full rounded-full bg-[#0F5E4E] transition-all duration-700"
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <p className="text-[12px] text-[var(--sakhi-muted)]">
              Current utilisation represents {capacityPct}% of projected post-machinery capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
                Peak Demand Window
              </div>
              <div className="mt-1 text-[13.5px] font-semibold text-[var(--sakhi-slate)]">{ue.peakMonths}</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                Lean / Moisture Risk
              </div>
              <div className="mt-1 text-[13.5px] font-semibold text-[var(--sakhi-slate)]">{ue.leanMonths}</div>
            </div>
          </div>
        </section>
      </div>

      {/* Buyer Offtake Evidence Ledger */}
      <section className="overflow-hidden rounded-lg border border-[var(--sakhi-border)] bg-white">
        <div className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[var(--sakhi-slate)]">
            Verified Buyer &amp; Channel Offtake Evidence
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]/50 text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <tr>
                <th className="px-6 py-3">Buyer / Channel</th>
                <th className="px-4 py-3">Channel Type</th>
                <th className="px-4 py-3">Evidence Document</th>
                <th className="px-4 py-3">Provenance</th>
                <th className="px-6 py-3 text-right">Est. Monthly Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sakhi-border)]">
              {shg.buyerEvidence.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--sakhi-muted)]">
                    No buyer offtake evidence logged yet.
                  </td>
                </tr>
              ) : (
                shg.buyerEvidence.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-[var(--sakhi-surface)]">
                    <td className="px-6 py-3.5 font-semibold text-[var(--sakhi-slate)]">{b.buyerName}</td>
                    <td className="px-4 py-3.5 text-[var(--sakhi-muted)]">{b.channel}</td>
                    <td className="px-4 py-3.5 text-[var(--sakhi-slate)]">{b.evidenceType}</td>
                    <td className="px-4 py-3.5">
                      <ProvenanceBadge level={b.provenance} />
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold tabular-nums text-[var(--sakhi-forest)]">
                      {formatINR(b.monthlyValueINR)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={addBuyer}
          className="flex flex-col gap-2.5 border-t border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 sm:flex-row"
        >
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Log additional buyer PO or GLPC Saras demand channel..."
            className="h-10 flex-1 rounded-lg border border-[var(--sakhi-border)] bg-white px-3.5 text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:outline-none"
          />
          <input
            type="number"
            value={monthlyVal}
            onChange={(e) => setMonthlyVal(e.target.value)}
            placeholder="Monthly ₹ value"
            className="h-10 w-44 rounded-lg border border-[var(--sakhi-border)] bg-white px-3.5 font-mono text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--sakhi-forest-deep)]"
          >
            <Plus className="h-4 w-4" /> Attach Evidence
          </button>
        </form>
      </section>
    </div>
  );
};
