import React from "react";
import { Building2, Clock } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { Card, SectionHeader, SimulatedBadge, StageChip } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

interface BankQueuePlaceholderProps {
  cases: SHGCase[];
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const BankQueuePlaceholderScreen: React.FC<BankQueuePlaceholderProps> = ({
  cases,
  onNavigate,
}) => {
  const sorted = [...cases].sort((a, b) => b.readinessScore - a.readinessScore);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Bank Branch Appraisal Workspace"
        title="Branch Appraisal Queue"
        subtitle="Prioritised queue of SHG credit packs ranked by readiness score. Full Approve / Query / Reject decision controls arrive in Phase 4."
        rightSlot={
          <div className="flex items-center gap-2">
            <SimulatedBadge />
            <Button variant="primary" onClick={() => onNavigate("offer-comparison")}>
              View Product Terms
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#DFDBD0] bg-[#F2EFE8] px-5 py-3">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#141A23]">
            <Building2 className="h-4 w-4 text-[#0F5E4E]" />
            <span>SHG Packs Queued for Appraisal</span>
          </div>
          <span className="font-mono text-[12px] text-[#475467]">{sorted.length} packs</span>
        </div>
        <div className="divide-y divide-[#DFDBD0]">
          {sorted.map((c) => {
            const totalCost = c.costLines.reduce((s, l) => s + l.amount, 0);
            const need = Math.max(0, totalCost - c.ownContribution);
            return (
              <div key={c.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#141A23] text-[14.5px]">{c.shgName}</span>
                    <StageChip stage={c.stage} />
                  </div>
                  <div className="mt-1 text-[12.5px] text-[#475467]">
                    {c.caseCode} · {c.linkedBranch} · Panchasutra {c.panchasutraScore}/5
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono text-[14px] font-semibold text-[#141A23] tabular-nums">{formatINR(need)}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-[#475467]">
                      <Clock className="h-3 w-3" /> {c.daysInStage}d in stage · {c.readinessScore}% ready
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => onNavigate("offer-comparison")}>
                    Compare Terms
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
