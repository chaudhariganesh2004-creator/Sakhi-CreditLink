import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, FileCheck2, Info, ShieldCheck } from "lucide-react";
import type { FunnelStage, ProvenanceLevel } from "@/data/sakhi-data";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  if (compact) return null; // Hide in compact mode for cleaner UI
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700"
      title="Illustrative demo data — not live bank or NRLM data"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Prototype
    </span>
  );
}

export function ProvenanceBadge({ level }: { level: ProvenanceLevel }) {
  const styles: Record<ProvenanceLevel, string> = {
    "Self-declared": "border-slate-200 bg-slate-50 text-slate-600",
    "Document-supported": "border-sky-200 bg-sky-50 text-sky-700",
    "Field-verified": "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Lender-verified": "border-indigo-200 bg-indigo-50 text-indigo-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        styles[level]
      )}
    >
      {level === "Field-verified" || level === "Lender-verified" ? (
        <ShieldCheck className="h-3 w-3 shrink-0" />
      ) : level === "Document-supported" ? (
        <FileCheck2 className="h-3 w-3 shrink-0" />
      ) : (
        <Info className="h-3 w-3 shrink-0" />
      )}
      {level}
    </span>
  );
}

export function StageChip({ stage }: { stage: FunnelStage }) {
  const map: Record<FunnelStage, string> = {
    "Demand identified": "bg-slate-100 text-slate-700 border-slate-200",
    "Profile verified": "bg-teal-50 text-teal-700 border-teal-200",
    "Need validated": "bg-amber-50 text-amber-700 border-amber-200",
    "Route matched": "bg-blue-50 text-blue-700 border-blue-200",
    "Finance plan ready": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Pack complete": "bg-green-100 text-green-800 border-green-200",
    Submitted: "bg-[var(--sakhi-forest)] text-white border-[var(--sakhi-forest)]",
    Sanctioned: "bg-[var(--sakhi-forest-deep)] text-white border-[var(--sakhi-forest-deep)]",
    Disbursed: "bg-emerald-900 text-white border-emerald-900",
    "Enterprise active": "bg-emerald-950 text-white border-emerald-950",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        map[stage]
      )}
    >
      {stage}
    </span>
  );
}

export function TaskStatusChip({
  status,
}: {
  status: "Completed" | "Due Today" | "Overdue" | "Pending";
}) {
  if (status === "Overdue") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
        <AlertTriangle className="h-3 w-3" /> Overdue
      </span>
    );
  }
  if (status === "Due Today") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
        <Clock className="h-3 w-3" /> Due Today
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
      Pending
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  rightSlot,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pb-2 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--sakhi-muted)]">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 font-display text-[28px] tracking-tight text-[var(--sakhi-slate)] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[var(--sakhi-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot && <div className="flex shrink-0 flex-wrap items-center gap-2">{rightSlot}</div>}
    </div>
  );
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
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    caution: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <div className={cn("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] leading-relaxed", toneStyles[tone])}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 opacity-75" />
      <div>
        <span className="font-semibold">{title}: </span>
        <span>{body}</span>
      </div>
    </div>
  );
}
