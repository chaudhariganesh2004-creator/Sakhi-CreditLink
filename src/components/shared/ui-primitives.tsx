import React from "react";
import { AlertTriangle, CheckCircle2, Clock, FileCheck2, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunnelStage, ProvenanceLevel } from "@/data/sakhi-data";
import {
  SimulatedBadge,
  StatusChip,
  SectionHeader as BaseSectionHeader,
} from "@/components/ui/primitives";

export {
  Card,
  EmptyState,
  Field,
  SimulatedBadge,
  StatusChip,
} from "@/components/ui/primitives";

export const SectionHeader = BaseSectionHeader;

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return <SimulatedBadge compact={compact} />;
}

export function ProvenanceBadge({ level }: { level: ProvenanceLevel }) {
  const toneMap: Record<ProvenanceLevel, "neutral" | "info" | "success"> = {
    "Self-declared": "neutral",
    "Document-supported": "info",
    "Field-verified": "success",
    "Lender-verified": "info",
  };
  const icon =
    level === "Field-verified" || level === "Lender-verified" ? (
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    ) : level === "Document-supported" ? (
      <FileCheck2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    ) : (
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    );

  return (
    <StatusChip tone={toneMap[level]} icon={icon}>
      {level}
    </StatusChip>
  );
}

export function StageChip({ stage }: { stage: FunnelStage }) {
  const map: Record<FunnelStage, { tone: "neutral" | "info" | "warning" | "success"; icon: React.ReactNode }> = {
    "Demand identified": { tone: "neutral", icon: <Info className="h-3 w-3" /> },
    "Profile verified": { tone: "info", icon: <ShieldCheck className="h-3 w-3" /> },
    "Need validated": { tone: "warning", icon: <Clock className="h-3 w-3" /> },
    "Route matched": { tone: "info", icon: <FileCheck2 className="h-3 w-3" /> },
    "Finance plan ready": { tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
    "Pack complete": { tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
    Submitted: { tone: "info", icon: <Clock className="h-3 w-3" /> },
    Sanctioned: { tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
    Disbursed: { tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
    "Enterprise active": { tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
  };
  const cfg = map[stage];
  return (
    <StatusChip tone={cfg.tone} icon={cfg.icon}>
      {stage}
    </StatusChip>
  );
}

export function TaskStatusChip({
  status,
}: {
  status: "Completed" | "Due Today" | "Overdue" | "Pending";
}) {
  if (status === "Overdue") {
    return (
      <StatusChip tone="danger" icon={<AlertTriangle className="h-3 w-3" />}>
        Overdue
      </StatusChip>
    );
  }
  if (status === "Due Today") {
    return (
      <StatusChip tone="warning" icon={<Clock className="h-3 w-3" />}>
        Due Today
      </StatusChip>
    );
  }
  if (status === "Completed") {
    return (
      <StatusChip tone="success" icon={<CheckCircle2 className="h-3 w-3" />}>
        Completed
      </StatusChip>
    );
  }
  return <StatusChip tone="neutral">Pending</StatusChip>;
}

export function GovernanceNotice({
  title,
  body,
  tone = "neutral",
}: {
  title: string;
  body: string;
  tone?: "neutral" | "caution" | "danger";
}) {
  const toneStyles = {
    neutral: "border-[#DFDBD0] bg-[#FAF8F4] text-[#475467]",
    caution: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
    danger: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
  };
  return (
    <div className={cn("flex items-start gap-2.5 rounded-lg border px-4 py-3 text-[13px] leading-relaxed", toneStyles[tone])}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        <span className="font-semibold">{title}: </span>
        <span>{body}</span>
      </div>
    </div>
  );
}
