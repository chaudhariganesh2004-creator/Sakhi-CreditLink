import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { AppLanguage, NavScreenId, SHGCase, UserRole } from "@/data/sakhi-data";
import { CreditDemandScreen } from "@/screens/CreditDemandScreen";
import { LivelihoodEvidenceScreen } from "@/screens/LivelihoodEvidenceScreen";
import { FinancingBlueprintScreen } from "@/screens/FinancingBlueprintScreen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CashFlowBlueprintStepperProps {
  shg: SHGCase;
  role: UserRole;
  language: AppLanguage;
  onUpdateCase: (updated: SHGCase) => void;
  onNavigate: (screen: NavScreenId) => void;
  initialSubStep?: 1 | 2 | 3;
}

const STEPS: { id: 1 | 2 | 3; label: string; hint: string }[] = [
  { id: 1, label: "1. Credit Demand", hint: "Capex vs Working Capital" },
  { id: 2, label: "2. Livelihood Evidence", hint: "Unit margin & buyer orders" },
  { id: 3, label: "3. Cash-Flow Blueprint", hint: "6–12m sales & EMI sizing" },
];

export const CashFlowBlueprintStepper: React.FC<CashFlowBlueprintStepperProps> = ({
  shg,
  role,
  language,
  onUpdateCase,
  onNavigate,
  initialSubStep = 1,
}) => {
  const [subStep, setSubStep] = useState<1 | 2 | 3>(initialSubStep);

  const isBankView = role === "bank-officer";

  const stepItems = STEPS.map((step) =>
    step.id === 1 && !isBankView
      ? { ...step, hint: "Assets to buy vs money for running the work" }
      : step
  );

  return (
    <div className="space-y-6">
      {/* Unified Stepper Bar */}
      <nav aria-label="Cash-flow blueprint steps" className="rounded-lg border border-[#DFDBD0] bg-white p-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {stepItems.map((step) => {
            const active = subStep === step.id;
            const done = subStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setSubStep(step.id)}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]",
                  active
                    ? "border-[#0F5E4E] bg-[#ECFDF5] text-[#0F5E4E]"
                    : done
                    ? "border-[#A7F3D0] bg-white text-[#141A23]"
                    : "border-transparent bg-[#FAF8F4] text-[#475467] hover:bg-[#F2EFE8]"
                )}
              >
                <div>
                  <div className="text-[13px] font-semibold">{step.label}</div>
                  <div className="text-[11.5px] text-[#475467]">{step.hint}</div>
                </div>
                {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-[#047857]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Render the three individual screens under one sequenced stepper */}
      {subStep === 1 && (
        <CreditDemandScreen
          shg={shg}
          role={role}
          language={language}
          onUpdateCase={onUpdateCase}
          onNavigate={onNavigate}
          embeddedInStepper
          onStepNext={() => setSubStep(2)}
        />
      )}
      {subStep === 2 && (
        <LivelihoodEvidenceScreen shg={shg} onUpdateCase={onUpdateCase} />
      )}
      {subStep === 3 && (
        <FinancingBlueprintScreen shg={shg} role={role} onNavigate={onNavigate} />
      )}

      {/* Stepper Footer Navigation */}
      <div className="flex items-center justify-between border-t border-[#DFDBD0] pt-4">
        <div>
          {subStep > 1 ? (
            <Button variant="secondary" onClick={() => setSubStep((s) => (s - 1) as 1 | 2 | 3)}>
              <ArrowLeft className="h-4 w-4" /> Previous Step
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => onNavigate("finance-passport")}>
              <ArrowLeft className="h-4 w-4" /> Back to Passport
            </Button>
          )}
        </div>
        <div>
          {subStep < 3 ? (
            <Button variant="primary" onClick={() => setSubStep((s) => (s + 1) as 1 | 2 | 3)}>
              Continue to Step {subStep + 1} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onNavigate("scheme-match")}>
              Proceed to Scheme Match <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
