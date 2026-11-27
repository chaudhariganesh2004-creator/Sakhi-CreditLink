import React from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  MapPin,
  ReceiptIndianRupee,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";
import type { AltDataSignals, AppLanguage, NavScreenId, SHGCase } from "@/data/sakhi-data";
import { alternativeDataCredibility, readinessScore } from "@/lib/access-engine";
import { GovernanceNotice } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

interface AltDataCredibilityScreenProps {
  shg: SHGCase;
  language: AppLanguage;
  onUpdateCase: (updated: SHGCase) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const AltDataCredibilityScreen: React.FC<AltDataCredibilityScreenProps> = ({
  shg,
  language,
  onUpdateCase,
  onNavigate,
}) => {
  const isGu = language === "gu";
  const ml = alternativeDataCredibility(shg);
  const complianceReadiness = readinessScore(shg);

  const handleToggleSignal = (key: keyof AltDataSignals) => {
    const nextSignals: AltDataSignals = {
      ...ml.signals,
      [key]: !ml.signals[key],
    };
    const nextMl = alternativeDataCredibility({
      ...shg,
      altDataSignals: nextSignals,
    });
    onUpdateCase({
      ...shg,
      altDataSignals: nextSignals,
      timeline: [
        {
          id: `alt-${Date.now()}`,
          stage: shg.stage,
          actor: "Alt-Data ML Signal Preview (Simulated)",
          timestamp: "Just now",
          note: `Updated consent alt-data signal (${key}: ${nextSignals[key] ? "Connected" : "Disconnected"}) → ML credibility ${nextMl.credibilityScore}/100.`,
        },
        ...shg.timeline,
      ],
    });
  };

  const tierTone =
    ml.credibilityScore >= 78
      ? "success"
      : ml.credibilityScore >= 58
      ? "warning"
      : "danger";

  const signalToggles: {
    key: keyof AltDataSignals;
    titleEn: string;
    titleGu: string;
    descEn: string;
    descGu: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "upiSupplierReceipts",
      titleEn: "UPI Sales & Supplier Payment Trail",
      titleGu: "UPI વેચાણ અને સપ્લાયર ચુકવણી રેકોર્ડ",
      descEn: "Digital vendor invoices & monthly cashless inflow stability (no individual personal bank scraping).",
      descGu: "માસિક ડિજિટલ ચુકવણી અને વેપાર વ્યવહાર સ્થિરતા (માત્ર સંમતિ આધારિત).",
      icon: ReceiptIndianRupee,
    },
    {
      key: "dairyOrCoopSupplySync",
      titleEn: "Dairy Union / Co-op / GLPC Supply Passbook",
      titleGu: "દૂધ મંડળી / સહકારી સપ્લાય પાસબુક",
      descEn: "Consistent bulk delivery cadence via milk unions, FPOs, or institutional buyer ledgers.",
      descGu: "દૂધ મંડળી, FPO અથવા સંસ્થાકીય ખરીદદારોને નિયમિત સપ્લાય.",
      icon: Store,
    },
    {
      key: "utilityAndTelecomRegularity",
      titleEn: "Utility Bill & Sakhi Mobile Cadence",
      titleGu: "વીજળી બિલ અને મોબાઇલ નિયમિતતા",
      descEn: "On-time unit electricity / recharge consistency paired with regular meeting attendance.",
      descGu: "યુનિટ વીજળી બિલ અને બેઠક હાજરીની નિયમિતતા.",
      icon: Smartphone,
    },
    {
      key: "geoTaggedWorkshopVerified",
      titleEn: "Geo-Tagged Enterprise & Stock Check",
      titleGu: "જિયો-ટેગ કરેલ વર્કશોપ અને સ્ટોક ચકાસણી",
      descEn: "Bank Sakhi verified physical enterprise presence & equipment photograph.",
      descGu: "બેંક સખી દ્વારા સ્થળ પર જઈને લીધેલ ફોટો અને ચકાસણી.",
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={
          isGu
            ? "વૈકલ્પિક ડેટા આધારિત ML વિશ્વસનીયતા મોડેલ"
            : "Alternative-Data ML Credibility Signal (Decision Support)"
        }
        title={
          isGu
            ? "SHG વૈકલ્પિક ડેટા ક્રેડિબિલિટી"
            : "ML Alternative-Data Credibility"
        }
        subtitle={
          isGu
            ? `${shg.shgNameGu} · ઔપચારિક CIBIL ઇતિહાસ વગર પણ રોજિંદા વ્યવહાર અને બચત ડેટાથી વિશ્વસનીયતા`
            : `${shg.shgName} · Surfaces repayment credibility from non-bureau rural signals when members have thin/no CIBIL history.`
        }
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <SimulatedBadge />
            <Button variant="secondary" size="sm" onClick={() => onNavigate("readiness-hub")}>
              {isGu ? "તૈયારી હબ પર પાછા જાઓ" : "Back to Readiness Hub"}
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate("application-pack")}>
              {isGu ? "અરજી પેકમાં ઉમેરો" : "Open Application Pack"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Top Comparison Strip: ML Credibility vs Compliance Readiness */}
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#0F5E4E]">
                <BrainCircuit className="h-4 w-4" />
                {isGu ? "વૈકલ્પિક ડેટા વિશ્વસનીયતા આંક" : "ML Alternative-Data Credibility Index"}
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[40px] font-bold leading-none text-[#141A23] tabular-nums">
                  {ml.credibilityScore}
                </span>
                <span className="font-mono text-[16px] text-[#475467]">/ 100</span>
                <StatusChip tone={tierTone}>
                  {isGu ? ml.tierGu : ml.tier}
                </StatusChip>
              </div>
              <p className="mt-2 text-[12.5px] text-[#475467]">
                {ml.modelLabel} · Logistic Repayment Confidence:{" "}
                <strong className="font-mono text-[#141A23]">{ml.probabilityPct}%</strong> (Illustrative)
              </p>
            </div>

            <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] px-4 py-3 text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                Rule Readiness (Docs)
              </div>
              <div className="mt-0.5 font-mono text-[22px] font-bold text-[#141A23] tabular-nums">
                {complianceReadiness.score}/100
              </div>
              <div className="text-[11px] text-[#475467]">Checklist vs Behavior</div>
            </div>
          </div>

          {/* Explainable Feature Contribution Bars */}
          <div className="mt-5 border-t border-[#ECE8DE] pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[14px] font-semibold text-[#141A23]">
                {isGu
                  ? "ML સ્કોરમાં દરેક વૈકલ્પિક ડેટાનું યોગદાન (પારદર્શક વજન)"
                  : "Explainable Feature Contributions (Zero Black-Box)"}
              </h2>
              <span className="text-[11.5px] text-[#475467]">
                6 non-bureau behavioral &amp; livelihood signals
              </span>
            </div>

            <div className="space-y-3">
              {ml.features.map((feat) => {
                const barWidth = Math.max(6, Math.round(feat.normalizedValue * 100));
                return (
                  <div key={feat.id} className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                      <div>
                        <span className="font-medium text-[#141A23]">
                          {isGu ? feat.labelGu : feat.label}
                        </span>
                        <span className="ml-2 rounded bg-[#F2EFE8] px-1.5 py-0.5 text-[10.5px] text-[#475467]">
                          {feat.source}
                        </span>
                      </div>
                      <span className="font-mono text-[12px] font-semibold text-[#0F5E4E] tabular-nums">
                        +{feat.contributionLogit.toFixed(2)} logit ({feat.sharePct}% share · w={feat.weight})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F2EFE8]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-150",
                            feat.normalizedValue >= 0.7
                              ? "bg-[#0F5E4E]"
                              : feat.normalizedValue >= 0.35
                              ? "bg-[#B45309]"
                              : "bg-[#B91C1C]"
                          )}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="w-44 truncate text-right text-[11px] text-[#475467]">
                        {feat.rawSummary}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Interactive Consent-Based Alt-Data Connectors */}
        <Card className="p-5 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="border-b border-[#ECE8DE] pb-3">
              <div className="flex items-center gap-2 text-[14.5px] font-semibold text-[#141A23]">
                <Database className="h-4 w-4 text-[#0F5E4E]" />
                {isGu
                  ? "વૈકલ્પિક ડેટા સિગ્નલ જોડો (DPDP સંમતિ)"
                  : "Consent-Based Alt-Data Signals"}
              </div>
              <p className="mt-1 text-[12px] text-[#475467]">
                {isGu
                  ? "દરેક સિગ્નલ ચાલુ/બંધ કરીને જુઓ કે ML વિશ્વસનીયતા સ્કોર કેવી રીતે બદલાય છે."
                  : "Toggle alternative rural data sources to see live ML credibility uplift for thin-file groups."}
              </p>
            </div>

            <div className="space-y-2.5">
              {signalToggles.map((item) => {
                const active = ml.signals[item.key];
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleSignal(item.key)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-[#0F5E4E] bg-[#ECFDF5]"
                        : "border-[#DFDBD0] bg-[#FAF8F4] hover:bg-white"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <Icon
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            active ? "text-[#0F5E4E]" : "text-[#475467]"
                          )}
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-[#141A23]">
                            {isGu ? item.titleGu : item.titleEn}
                          </div>
                          <p className="mt-0.5 text-[11.5px] text-[#475467]">
                            {isGu ? item.descGu : item.descEn}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold",
                          active
                            ? "bg-[#0F5E4E] text-white"
                            : "border border-[#C9C3B4] bg-white text-[#475467]"
                        )}
                      >
                        {active ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </span>
                        ) : (
                          "Connect"
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-3.5 py-2.5 text-[12px] text-[#475467]">
            <ShieldCheck className="mr-1.5 inline h-4 w-4 text-[#0F5E4E]" />
            <strong>DPDP Guardrail:</strong> Group-level business &amp; co-op signals only; no personal phone contact scraping or unconsented credit pulls.
          </div>
        </Card>
      </div>

      <GovernanceNotice
        title="How This Fits Existing Banking Appraisal (Illustrative ML)"
        body={ml.disclaimer}
        tone="caution"
      />
    </div>
  );
};
