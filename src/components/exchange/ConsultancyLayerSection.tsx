import React from "react";
import {
  CheckCircle2,
  CircleDot,
  Compass,
  Lightbulb,
  Package,
  ShieldCheck,
  Tag,
  TrendingUp,
} from "lucide-react";
import type { BuyerOpportunity } from "@/data/opportunityExchangeData";
import {
  computeConsultancyAdvice,
  type CollectivePlanResult,
  type FinancingProposalMetrics,
} from "@/lib/opportunity-engine";
import { Card, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface ConsultancyLayerSectionProps {
  opportunity: BuyerOpportunity;
  plan: CollectivePlanResult;
  financing: FinancingProposalMetrics;
  activeStageIndex: 0 | 1 | 2 | 3 | 4;
}

const STAGES = [
  "Assess",
  "Advise",
  "Connect to Market",
  "Finance",
  "Track",
] as const;

export const ConsultancyLayerSection: React.FC<ConsultancyLayerSectionProps> = ({
  opportunity,
  plan,
  financing,
  activeStageIndex,
}) => {
  const advice = computeConsultancyAdvice(opportunity, plan, financing);

  const readinessTone =
    advice.readinessLabel === "Bank-Ready Demand"
      ? "success"
      : advice.readinessLabel === "Strengthen Before Bank Visit"
      ? "warning"
      : "danger";

  return (
    <Card className="p-5 md:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="h-4 w-4 text-[#0F5E4E]" />
            <h2 className="text-[16px] font-semibold text-[#141A23]">
              SHG Business Consultancy &amp; Readiness Layer
            </h2>
            <SimulatedBadge />
          </div>
          <p className="mt-1 text-[12.5px] text-[#475467]">
            Actionable pricing, quality, packaging &amp; market guidance tailored to {opportunity.productName}.
          </p>
        </div>

        <StatusChip tone={readinessTone}>
          {advice.readinessLabel} ({advice.readinessScorePct}%)
        </StatusChip>
      </div>

      {/* 5-Stage Consultancy Tracker */}
      <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
          Consultancy Lifecycle Tracker
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {STAGES.map((stage, idx) => {
            const done = idx < activeStageIndex;
            const current = idx === activeStageIndex;
            return (
              <div
                key={stage}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold",
                  current
                    ? "border-[#0F5E4E] bg-[#ECFDF5] text-[#0F5E4E]"
                    : done
                    ? "border-[#A7F3D0] bg-white text-[#047857]"
                    : "border-[#DFDBD0] bg-white text-[#475467]"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#047857]" />
                ) : (
                  <CircleDot
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      current ? "text-[#0F5E4E]" : "text-[#C9C3B4]"
                    )}
                  />
                )}
                <span>
                  {idx + 1}. {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Growth Advice Grid + Financing Readiness Checklist */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {[
            { icon: Tag, title: "Pricing Strategy", body: advice.pricingTip },
            { icon: ShieldCheck, title: "Quality Standard", body: advice.qualityTip },
            { icon: Package, title: "Packaging & Branding", body: advice.packagingTip },
            { icon: TrendingUp, title: "Market Access", body: advice.marketAccessTip },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5"
            >
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F5E4E]">
                <tip.icon className="h-3.5 w-3.5" />
                {tip.title}
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#475467]">
                {tip.body}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4 space-y-2.5">
            <div className="text-[12.5px] font-semibold text-[#141A23]">
              Financing Readiness Checklist
            </div>
            {advice.checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-2 text-[12.5px]"
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    item.done ? "text-[#047857]" : "text-[#C9C3B4]"
                  )}
                />
                <span className={item.done ? "text-[#141A23]" : "text-[#B45309] font-medium"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#92400E]">
              <Lightbulb className="h-3.5 w-3.5" />
              Next Concrete Actions
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[12px] text-[#141A23]">
              {advice.nextActions.map((act) => (
                <li key={act}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
