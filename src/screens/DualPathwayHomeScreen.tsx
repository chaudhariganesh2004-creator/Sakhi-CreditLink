import React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { AppLanguage, PortalRole } from "@/data/sakhi-data";
import { Button } from "@/components/ui/button";
import { Card, SimulatedBadge } from "@/components/ui/primitives";

interface DualPathwayHomeScreenProps {
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onOpenLoanPortal: () => void;
  onOpenRoleDirect: (role: PortalRole) => void;
  onOpenOpportunityExchange: () => void;
}

export const DualPathwayHomeScreen: React.FC<DualPathwayHomeScreenProps> = ({
  language,
  onChangeLanguage,
  onOpenLoanPortal,
  onOpenRoleDirect,
  onOpenOpportunityExchange,
}) => {
  const isGu = language === "gu";

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#141A23] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#DFDBD0] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/images/sakhi-logo.jpg"
              alt="Sakhi CreditLink logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-md border border-[#DFDBD0] bg-white object-contain p-0.5"
            />
            <div className="truncate">
              <span className="text-[15px] font-bold tracking-tight text-[#141A23]">
                Sakhi CreditLink
              </span>
              <span className="ml-2 hidden sm:inline font-mono text-[11px] text-[#475467]">
                Gujarat · PS000311
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block">
              <SimulatedBadge compact label="Simulated demonstration data" />
            </div>

            <div
              className="inline-flex rounded-md border border-[#C9C3B4] bg-[#FAF8F4] p-0.5 text-[12px]"
              role="group"
              aria-label="Language selector"
            >
              <button
                type="button"
                onClick={() => onChangeLanguage("en")}
                className={`min-h-[32px] rounded px-2.5 font-medium transition-colors duration-150 ${
                  language === "en"
                    ? "bg-[#0F5E4E] text-white"
                    : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage("gu")}
                className={`min-h-[32px] rounded px-2.5 font-medium transition-colors duration-150 ${
                  language === "gu"
                    ? "bg-[#0F5E4E] text-white"
                    : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero + Dual-Pathway Cards */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-1 text-[12px] font-semibold text-[#047857]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Seva First Innovation Challenge · Gujarat SHG-Bank Linkage (PS000311)
            </div>

            <h1 className="font-serif text-[34px] sm:text-[44px] font-semibold leading-[1.12] tracking-tight text-[#141A23]">
              {isGu ? (
                <>
                  નાના જૂથો. સહિયારી શક્તિ.{" "}
                  <span className="text-[#0F5E4E]">મોટી તકો.</span>
                </>
              ) : (
                <>
                  Small Groups. Shared Strength.{" "}
                  <span className="text-[#0F5E4E]">Bigger Opportunities.</span>
                </>
              )}
            </h1>

            <p className="text-[15.5px] leading-relaxed text-[#475467]">
              {isGu
                ? "સખી મંડળોને લોન-તૈયાર બનાવવાથી લઈને ખરીદદાર માંગ શોધવા, સંયુક્ત ઉત્પાદન ક્ષમતા જોડવા અને માંગ-આધારિત ધિરાણ મેળવવા સુધીનું એક સંકલિત પ્લેટફોર્મ."
                : "Sakhi Opportunity Exchange transforms isolated Self-Help Groups into a coordinated production network by discovering market opportunities, combining their capacities, and connecting financing to productive demand."}
            </p>
          </div>

          {/* Two Equal-Weight Pathway Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Option 1: Existing SHG Loan Application & Credit Portal */}
            <Card className="flex flex-col justify-between p-6 md:p-7 transition-colors hover:border-[#0F5E4E]">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] text-[#0F5E4E]">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-2.5 py-1 text-[11px] font-semibold text-[#475467]">
                    Core Credit Portal
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-[22px] font-semibold text-[#141A23]">
                    {isGu
                      ? "વિકલ્પ ૧: SHG લોન અરજી અને ક્રેડિટ પોર્ટલ"
                      : "Option 1: SHG Loan Application & Credit Portal"}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">
                    {isGu
                      ? "SHG-બેંક લિંકેજ લોન માટે અરજી કરો, યોજના પાત્રતા તપાસો અને અરજીની સ્થિતિ ટ્રૅક કરો."
                      : "Apply for SHG-Bank linkage loans, check scheme eligibility, and track credit applications."}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-[#ECE8DE] pt-4 text-[13.5px] text-[#141A23]">
                  {[
                    "Existing Loan Application & RBI 6× Corpus Readiness",
                    "9 Gujarat / GLPC Scheme Matching & Application Pack",
                    "Bank Branch Appraisal Queue & District Command Centre",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F5E4E]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 pt-4 border-t border-[#ECE8DE]">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={onOpenLoanPortal}
                >
                  {isGu ? "લોન પોર્ટલ પર જાઓ" : "Proceed to Loan Application"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[12px]">
                  <button
                    type="button"
                    onClick={() => onOpenRoleDirect("shg-sakhi")}
                    className="font-medium text-[#0F5E4E] hover:underline"
                  >
                    SHG / Sakhi Hub
                  </button>
                  <span className="text-[#C9C3B4]">·</span>
                  <button
                    type="button"
                    onClick={() => onOpenRoleDirect("bank-branch")}
                    className="font-medium text-[#0F5E4E] hover:underline"
                  >
                    Bank Branch
                  </button>
                  <span className="text-[#C9C3B4]">·</span>
                  <button
                    type="button"
                    onClick={() => onOpenRoleDirect("district-official")}
                    className="font-medium text-[#0F5E4E] hover:underline"
                  >
                    District Command Centre
                  </button>
                </div>
              </div>
            </Card>

            {/* Option 2: Sakhi Opportunity Exchange */}
            <Card className="flex flex-col justify-between border-[#0F5E4E] p-6 md:p-7 transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#0F5E4E] bg-[#0F5E4E] text-white">
                    <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#B45309]">
                    NEW INNOVATION
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-[22px] font-semibold text-[#141A23]">
                    {isGu
                      ? "વિકલ્પ ૨: બિઝનેસ કન્સલ્ટન્સી અને ઓપોર્ચ્યુનિટી એક્સચેન્જ"
                      : "Option 2: Business Consultancy & Opportunity Exchange"}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">
                    {isGu
                      ? "ખરીદદારની માંગ શોધો, સખી મંડળોની ઉત્પાદન ક્ષમતા એકત્રિત કરો અને માંગ-આધારિત ધિરાણ દરખાસ્ત તૈયાર કરો."
                      : "Explore buyer demand, pool SHG production capacity, and generate demand-backed financing proposals."}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-[#ECE8DE] pt-4 text-[13.5px] text-[#141A23]">
                  {[
                    "Buyer Opportunity Discovery & Transparent Rule-Based SHG Matching",
                    "Collective SHG Production Pooling & Shared-Resource Bottleneck Alerts",
                    "Interactive What-If Simulator & Demand-Backed Financing Proposal",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F5E4E]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 pt-4 border-t border-[#ECE8DE]">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={onOpenOpportunityExchange}
                >
                  {isGu ? "બજાર તકો જુઓ" : "Explore Opportunities"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="text-center text-[12px] font-medium text-[#475467]">
                  1. Opportunity Discovery → 2. Collective Production → 3. Financing Proposal
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DFDBD0] bg-[#F2EFE8]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-6 text-[12.5px] text-[#475467] md:flex-row md:items-center md:px-6">
          <div className="flex items-center gap-2 font-semibold text-[#141A23]">
            <ShieldCheck className="h-4 w-4 text-[#0F5E4E]" aria-hidden="true" />
            <span>Sakhi CreditLink &amp; Sakhi Opportunity Exchange · Gujarat Pilot</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Simulated demonstration data</span>
            <span>·</span>
            <span>Banks retain full sanction authority</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
