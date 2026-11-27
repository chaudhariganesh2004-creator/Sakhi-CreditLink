import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_MAP: Record<StatusTone, { cls: string; icon: React.ReactNode }> = {
  success: {
    cls: "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]",
    icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  warning: {
    cls: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
    icon: <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  danger: {
    cls: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
    icon: <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  info: {
    cls: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
    icon: <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  neutral: {
    cls: "border-[#DFDBD0] bg-[#F2EFE8] text-[#475467]",
    icon: <FileCheck2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
};

export function StatusChip({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: StatusTone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const entry = TONE_MAP[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap",
        entry.cls,
        className
      )}
    >
      {icon ?? entry.icon}
      <span>{children}</span>
    </span>
  );
}

export function SimulatedBadge({
  compact = false,
  label = "Simulated data",
}: {
  compact?: boolean;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-[#FDE68A] bg-[#FFFBEB] font-medium text-[#B45309] whitespace-nowrap",
        compact ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-[11.5px]"
      )}
      title="Simulated sample data — not live bank or NRLM data"
    >
      <Info className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-[#DFDBD0] bg-white", className)}>
      {children}
    </div>
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
    <div className="flex flex-col gap-3 border-b border-[#DFDBD0] pb-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <div className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#475467]">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 font-serif text-[26px] md:text-[30px] font-semibold tracking-tight text-[#141A23] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[#475467]">
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot && <div className="flex shrink-0 flex-wrap items-center gap-2">{rightSlot}</div>}
    </div>
  );
}

export function Field({
  htmlFor,
  label,
  hint,
  error,
  children,
  className,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-semibold text-[#141A23]"
      >
        {label}
      </label>
      {hint && <p className="text-[12px] text-[#475467]">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[12px] font-medium text-[#B91C1C]" role="alert">
          <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
}: {
  icon?: React.ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#C9C3B4] bg-[#FAF8F4] px-6 py-8 text-center">
      <div className="text-[#475467]">
        {icon ?? <ShieldCheck className="h-6 w-6" aria-hidden="true" />}
      </div>
      <p className="max-w-md text-[13.5px] text-[#475467]">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
