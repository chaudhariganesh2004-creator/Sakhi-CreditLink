import React, { useState } from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { ColdEmailCrowdHero, type Reach } from "@/components/ui/cold-email-crowd-hero";
import DemoOne from "@/components/ui/demo";
import type { NavScreenId } from "@/data/sakhi-data";

const SAKHI_SIGNAL_DATA: Reach[] = [
  {
    tag: "Demand",
    tc: "caution",
    signal: "Ujjwal Mahila SHG · Anand requests ₹2.15L expansion",
    lab: "Sakhi · Blueprint",
    line: "Capex ₹1.35L + Working Capital ₹1.15L separated —",
    rtag: "Pack Ready",
    rc: "route",
    reply: "Matched DAY-NRLM & PMFME Capex checklist",
  },
  {
    tag: "Readiness",
    tc: "route",
    signal: "Narmada Dairy SHG · Panchasutra 5/5 verified",
    lab: "Sakhi · Passport",
    line: "Consent recorded for SBI Petlad Branch pack —",
    rtag: "Submitted",
    rc: "route",
    reply: "Branch inspection scheduled for Thursday",
  },
  {
    tag: "Bottleneck",
    tc: "caution",
    signal: "Surbhi Khadi SHG · Cashbook backlog 13 days",
    lab: "GLPC · Queue",
    line: "Assigned Bank Sakhi visit to reconcile Sep–Nov —",
    rtag: "Follow-up",
    rc: "caution",
    reply: "Cluster visit logged for tomorrow 10am",
  },
];

export const HeroComponentScreen: React.FC<{
  onNavigate: (screen: NavScreenId) => void;
}> = ({ onNavigate }) => {
  const [variant, setVariant] = useState<"default" | "sakhi">("default");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#DFDBD0] bg-[#FCFBF8] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("command-centre")}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#D8D3C8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#141A23] hover:bg-[#F5F2EA]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sakhi Command Centre
          </button>
          <div className="text-[12.5px] text-[#4E5968]">
            Integrated shadcn component:{" "}
            <code className="rounded bg-[#EFECE4] px-1.5 py-0.5 font-mono text-[11.5px] text-[#141A23]">
              @/components/ui/cold-email-crowd-hero
            </code>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-[#D8D3C8] bg-white p-1 text-[12px]">
          <Layers className="ml-1.5 h-3.5 w-3.5 text-[#0F5E4E]" />
          <button
            onClick={() => setVariant("default")}
            className={`rounded px-2.5 py-1 font-medium ${
              variant === "default" ? "bg-[#0F1D30] text-white" : "text-[#4E5968]"
            }`}
          >
            Default DemoOne
          </button>
          <button
            onClick={() => setVariant("sakhi")}
            className={`rounded px-2.5 py-1 font-medium ${
              variant === "sakhi" ? "bg-[#0F5E4E] text-white" : "text-[#4E5968]"
            }`}
          >
            Sakhi Signal Data Props
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DFDBD0] shadow-sm">
        {variant === "default" ? (
          <DemoOne />
        ) : (
          <ColdEmailCrowdHero brand="Sakhi CreditLink" data={SAKHI_SIGNAL_DATA} />
        )}
      </div>
    </div>
  );
};
