import React, { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { SectionHeader, StageChip } from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface DirectoryProps {
  cases: SHGCase[];
  activeCaseId: string;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
}

export const DirectoryScreen: React.FC<DirectoryProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
}) => {
  const [search, setSearch] = useState("");
  const filtered = cases.filter(
    (c) =>
      !search ||
      c.shgName.toLowerCase().includes(search.toLowerCase()) ||
      c.caseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.block.toLowerCase().includes(search.toLowerCase()) ||
      c.activity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="SHG Directory"
        title="All SHG Cases"
        subtitle={`${cases.length} cases across the pilot programme`}
        rightSlot={
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sakhi-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, block, activity..."
              className="h-10 w-full rounded-xl border border-[var(--sakhi-border)] bg-white pl-10 pr-4 text-[14px] text-[var(--sakhi-slate)] placeholder:text-[var(--sakhi-muted)] focus:border-[var(--sakhi-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--sakhi-forest)]/10"
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const totalCost = c.costLines.reduce((s, x) => s + x.amount, 0);
          const externalNeed = totalCost - c.ownContribution;
          const isActive = c.id === activeCaseId;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id, "finance-passport")}
              className={cn(
                "group relative rounded-2xl border p-5 text-left transition-all hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5",
                isActive
                  ? "border-[var(--sakhi-forest)]/30 bg-[var(--sakhi-mint)]/50 ring-1 ring-[var(--sakhi-forest)]/10"
                  : "border-[var(--sakhi-border)] bg-white"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[16px] font-bold text-[var(--sakhi-slate)]">{c.shgName}</div>
                  <div className="mt-1 text-[13px] text-[var(--sakhi-muted)]">
                    {c.activity} · {c.block}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--sakhi-muted)] opacity-0 transition-all group-hover:opacity-100" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <StageChip stage={c.stage} />
                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--sakhi-muted)]">Readiness</div>
                  <div className="mt-0.5 text-[18px] font-bold tabular-nums text-[var(--sakhi-forest)]">{c.readinessScore}%</div>
                </div>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sakhi-surface)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--sakhi-forest)] to-[var(--sakhi-emerald)]"
                  style={{ width: `${c.readinessScore}%` }}
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[var(--sakhi-muted)]">
                <div>
                  <div className="font-medium text-[var(--sakhi-slate)]">{c.membersCount}</div>
                  <div>Members</div>
                </div>
                <div>
                  <div className="font-medium text-[var(--sakhi-slate)] tabular-nums">{formatINR(externalNeed)}</div>
                  <div>Ext. Need</div>
                </div>
                <div>
                  <div className="font-medium text-[var(--sakhi-slate)]">{c.panchasutraScore}/5</div>
                  <div>Panchasutra</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-[var(--sakhi-border)]/50 text-[12px] text-[var(--sakhi-muted)]">
                <span className="font-mono">{c.caseCode}</span>
                <span>{c.daysInStage}d in stage</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
