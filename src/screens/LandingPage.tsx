import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  Globe,
  MapPin,
  ReceiptIndianRupee,
  Scale,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";
import {
  SHG_CASES_DEMO,
  type AltDataSignals,
  type AppLanguage,
  type PortalRole,
  type SHGCase,
} from "@/data/sakhi-data";
import {
  RBI_FIRST_DOSE_CITATION,
  alternativeDataCredibility,
  drawingPowerFirstDose,
  getCaseExternalNeed,
} from "@/lib/access-engine";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { Button } from "@/components/ui/button";
import { Card, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface LandingPageProps {
  language: AppLanguage;
  cases?: SHGCase[];
  activeCaseId?: string;
  onSelectCase?: (caseId: string) => void;
  onUpdateCase?: (updated: SHGCase) => void;
  onChangeLanguage: (lang: AppLanguage) => void;
  onEnterPortal: (targetRole?: PortalRole) => void;
}

const SHG_GROUP_PHOTOS = [
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
];

const GOVT_PORTALS = [
  {
    name: "DAY-NRLM / Aajeevika",
    tag: "SHG Bank Linkage",
    desc: "National Rural Livelihoods Mission portal for Sakhi Mandal CCL, interest subvention, and LokOS norms.",
    url: "https://aajeevika.gov.in/",
  },
  {
    name: "PMFME Portal (MoFPI)",
    tag: "35% Capital Subsidy",
    desc: "Micro Food Processing Enterprises portal for machinery and fixed-capital subsidy applications.",
    url: "https://pmfme.mofpi.gov.in/",
  },
  {
    name: "JanSamarth Portal",
    tag: "Credit-Linked Schemes",
    desc: "Unified Government of India portal to check eligibility across credit-linked schemes.",
    url: "https://www.jansamarth.in/",
  },
  {
    name: "PM MUDRA Yojana",
    tag: "Micro-Enterprise Loans",
    desc: "Official PMMY guidelines for Shishu, Kishore, and Tarun non-farm micro-enterprise loans.",
    url: "https://www.mudra.org.in/",
  },
  {
    name: "Udyam Registration",
    tag: "MSME Identity",
    desc: "Zero-cost Government of India MSME registration required by banks and PMFME workflows.",
    url: "https://udyamregistration.gov.in/",
  },
  {
    name: "GLPC Mission Mangalam",
    tag: "Gujarat State Nodal",
    desc: "Gujarat Livelihood Promotion Company portal for district cluster federations and Bank Sakhis.",
    url: "https://glpc.gujarat.gov.in/",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  cases = SHG_CASES_DEMO,
  activeCaseId,
  onSelectCase,
  onUpdateCase,
  onChangeLanguage,
  onEnterPortal,
}) => {
  const isGu = language === "gu";
  const duplicatedPortals = [...GOVT_PORTALS, ...GOVT_PORTALS];

  const [fallbackSelectedId, setFallbackSelectedId] = useState<string>(cases[0]?.id ?? "");
  const [localSignalsById, setLocalSignalsById] = useState<Record<string, AltDataSignals>>({});

  const currentId = activeCaseId || fallbackSelectedId || cases[0]?.id;
  const rawCase = cases.find((c) => c.id === currentId) ?? cases[0];
  const selectedCase: SHGCase = localSignalsById[rawCase.id]
    ? { ...rawCase, altDataSignals: localSignalsById[rawCase.id] }
    : rawCase;

  const ml = alternativeDataCredibility(selectedCase);
  const eligibleINR = drawingPowerFirstDose(selectedCase.corpusBalance);
  const requestedINR = getCaseExternalNeed(selectedCase);

  const handleSelectShg = (id: string) => {
    setFallbackSelectedId(id);
    onSelectCase?.(id);
  };

  const handleToggleAltSignal = (key: keyof AltDataSignals) => {
    const nextSignals: AltDataSignals = {
      ...ml.signals,
      [key]: !ml.signals[key],
    };
    setLocalSignalsById((prev) => ({ ...prev, [selectedCase.id]: nextSignals }));
    onUpdateCase?.({
      ...selectedCase,
      altDataSignals: nextSignals,
    });
  };

  const scoreTone =
    ml.credibilityScore >= 78
      ? "success"
      : ml.credibilityScore >= 58
      ? "warning"
      : "danger";

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#141A23]">
      {/* ─── Clean Single-Row Institutional Header ─── */}
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
              <SimulatedBadge compact />
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
                  language === "en" ? "bg-[#0F5E4E] text-white" : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage("gu")}
                className={`min-h-[32px] rounded px-2.5 font-medium transition-colors duration-150 ${
                  language === "gu" ? "bg-[#0F5E4E] text-white" : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            <Button variant="primary" size="sm" onClick={() => onEnterPortal("shg-sakhi")}>
              {isGu ? "પોર્ટલ ખોલો" : "Open Live Demo"}
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Animated Marquee Hero with SHG Group Photos (hero-3) ─── */}
      <AnimatedMarqueeHero
        tagline="SEVA First Innovation · PS000311 · Gujarat Sakhi Mandal Gateway"
        title={
          isGu ? (
            <>
              સખી મંડળોને લક્ષ્યાંકથી
              <br />
              <span className="text-[#0F5E4E]">વાસ્તવિક બેંક ધિરાણ સુધી</span>
            </>
          ) : (
            <>
              From Credit Targets
              <br />
              <span className="text-[#0F5E4E]">to Real Bank Access</span>
            </>
          )
        }
        description={
          isGu
            ? "લોકOS ચકાસણી, ૬× કોર્પસ નિયમ, ૬–૧૨ મહિનાના વેચાણ આધારિત રોકડ પ્રવાહ અને ૦% વ્યાજ સબવેન્શન ટ્રેકિંગ સાથે બેંક-તૈયાર અરજી પેક."
            : "Verify NRLM LokOS identity, size Working Capital vs Capex against RBI's 6× corpus norm, match Gujarat & GLPC schemes, and track bank SLAs."
        }
        ctaText={isGu ? "સખી મંડળ / બેંક સખી તરીકે દાખલ થાઓ" : "Enter as SHG / Bank Sakhi"}
        images={SHG_GROUP_PHOTOS}
        onCtaClick={() => onEnterPortal("shg-sakhi")}
        secondaryActions={
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Button variant="secondary" size="sm" onClick={() => onEnterPortal("bank-branch")}>
              Enter as Bank Branch
            </Button>
            <Button variant="tertiary" size="sm" onClick={() => onEnterPortal("district-official")}>
              District Official View
            </Button>
          </div>
        }
      />

      {/* ─── Direct Home Screen Feature: Instant ML Alternative-Data Credit Score ─── */}
      <section
        id="alt-data-credit-score"
        className="border-t border-[#DFDBD0] bg-[#FAF8F4] py-12"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-[11.5px] font-semibold text-[#047857]">
                <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
                {isGu
                  ? "CIBIL વગર વૈકલ્પિક ડેટા ML ક્રેડિટ વિશ્વસનીયતા"
                  : "Instant ML Credit Credibility via Alternative Data · Zero CIBIL Required"}
              </div>
              <h2 className="font-serif text-[28px] md:text-[32px] font-semibold leading-tight text-[#141A23]">
                {isGu
                  ? "સખી મંડળનો વૈકલ્પિક ડેટા ક્રેડિટ સ્કોર તરત જુઓ"
                  : "Direct SHG Credit Score from Alternative Data"}
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#475467]">
                {isGu
                  ? "કોઈ પણ સખી મંડળ પસંદ કરો અને UPI રસીદ, સહકારી સપ્લાય, વીજળી બિલ અને પંચસૂત્ર જેવા વૈકલ્પિક ડેટાથી વિશ્વસનીયતા સ્કોર અને RBI ૬× મર્યાદા તરત તપાસો."
                  : "Select any Sakhi Mandal and toggle consent-based rural alternative data signals to compute an explainable ML credibility index alongside RBI 6× corpus eligibility."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SimulatedBadge />
            </div>
          </div>

          {/* SHG Group Quick-Select Bar */}
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Select SHG to inspect alternative-data credit score"
          >
            {cases.map((c) => {
              const isActive = c.id === selectedCase.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectShg(c.id)}
                  className={cn(
                    "min-h-[40px] rounded-md border px-3.5 py-2 text-left text-[12.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]",
                    isActive
                      ? "border-[#0F5E4E] bg-[#0F5E4E] text-white"
                      : "border-[#DFDBD0] bg-white text-[#141A23] hover:bg-[#F2EFE8]"
                  )}
                >
                  <span>{isGu ? c.shgNameGu : c.shgName}</span>
                  <span
                    className={cn(
                      "ml-2 font-mono text-[11px]",
                      isActive ? "text-[#D1FAE5]" : "text-[#475467]"
                    )}
                  >
                    ({c.district})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Structured 2-Column Credibility Workbench */}
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Left: ML Score + Eligibility KPIs + 6 Explainable Feature Weights */}
            <Card className="p-5 md:p-6 lg:col-span-7 space-y-5">
              {/* Top Metric Strip */}
              <div className="grid gap-4 sm:grid-cols-3 border-b border-[#ECE8DE] pb-5">
                <div className="sm:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                    {isGu ? "ML વૈકલ્પિક ડેટા ક્રેડિટ સ્કોર" : "ML Alt-Data Credit Score"}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-2.5">
                    <span className="font-mono text-[42px] font-bold leading-none text-[#0F5E4E] tabular-nums">
                      {ml.credibilityScore}
                    </span>
                    <span className="font-mono text-[16px] text-[#475467]">/ 100</span>
                    <StatusChip tone={scoreTone}>
                      {isGu ? ml.tierGu : ml.tier}
                    </StatusChip>
                  </div>
                  <div className="mt-1.5 text-[12px] text-[#475467]">
                    {ml.modelLabel} · {selectedCase.village}, {selectedCase.district}
                  </div>
                </div>

                <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
                  <div className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-[#047857]">
                    <Scale className="h-3.5 w-3.5" />
                    {isGu ? "RBI ૬× પાત્રતા" : "RBI 6× Limit"}
                  </div>
                  <div className="mt-1 font-mono text-[20px] font-bold text-[#047857] tabular-nums">
                    {formatINR(eligibleINR)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#047857] tabular-nums">
                    Asked: {formatINR(requestedINR)}
                  </div>
                </div>
              </div>

              {/* 6 Transparent ML Features */}
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[14px] font-semibold text-[#141A23]">
                    {isGu
                      ? "૬ વૈકલ્પિક ડેટા પરિબળોનું યોગદાન (પારદર્શક ML)"
                      : "How This Score Is Calculated (6 Non-Bureau Alt-Data Features)"}
                  </h3>
                  <span className="font-mono text-[11.5px] text-[#475467]">
                    Zero Black Box
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ml.features.map((feat) => {
                    const pct = Math.max(8, Math.round(feat.normalizedValue * 100));
                    return (
                      <div
                        key={feat.id}
                        className="rounded-md border border-[#ECE8DE] bg-[#FAF8F4] px-3.5 py-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-[#141A23]">
                              {isGu ? feat.labelGu : feat.label}
                            </span>
                            <span className="rounded bg-white px-1.5 py-0.5 text-[10.5px] text-[#475467] border border-[#DFDBD0]">
                              {feat.source}
                            </span>
                          </div>
                          <span className="font-mono text-[12px] font-semibold text-[#0F5E4E] tabular-nums">
                            {feat.sharePct}% share (w={feat.weight})
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white border border-[#DFDBD0]">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-150",
                                feat.normalizedValue >= 0.7
                                  ? "bg-[#0F5E4E]"
                                  : feat.normalizedValue >= 0.35
                                  ? "bg-[#B45309]"
                                  : "bg-[#B91C1C]"
                              )}
                              style={{ width: `${pct}%` }}
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

            {/* Right: Interactive Consent Alt-Data Switches + Action Box */}
            <Card className="p-5 md:p-6 lg:col-span-5 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="border-b border-[#ECE8DE] pb-3">
                  <h3 className="text-[15px] font-semibold text-[#141A23]">
                    {isGu
                      ? "તમારો વૈકલ્પિક ડેટા જોડો (DPDP સંમતિ)"
                      : "Connect Alternative Data Signals Live"}
                  </h3>
                  <p className="mt-1 text-[12.5px] text-[#475467]">
                    {isGu
                      ? "સંમતિ આધારિત ડેટા સ્ત્રોત ચાલુ કરીને સ્કોરમાં તરત ફેરફાર જુઓ."
                      : "Toggle any signal below to test real-time ML credibility uplift before visiting a bank branch."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {(
                    [
                      {
                        key: "upiSupplierReceipts",
                        title: isGu ? "UPI વેચાણ અને સપ્લાયર રસીદ" : "UPI Sales & Supplier Receipts",
                        sub: isGu ? "માસિક ડિજિટલ રોકડ પ્રવાહ પુરાવો" : "Consistent digital inflow & vendor bills",
                        icon: ReceiptIndianRupee,
                      },
                      {
                        key: "dairyOrCoopSupplySync",
                        title: isGu ? "દૂધ મંડળી / સહકારી પાસબુક" : "Dairy / Co-op Supply Passbook",
                        sub: isGu ? "સહકારી મંડળી અથવા FPO સપ્લાય રેકોર્ડ" : "Verified bulk delivery cadence",
                        icon: Store,
                      },
                      {
                        key: "utilityAndTelecomRegularity",
                        title: isGu ? "વીજળી બિલ અને મોબાઇલ નિયમિતતા" : "Utility & Mobile Cadence",
                        sub: isGu ? "સમયસર બિલ અને બેઠક હાજરી" : "On-time unit bills & meeting discipline",
                        icon: Smartphone,
                      },
                      {
                        key: "geoTaggedWorkshopVerified",
                        title: isGu ? "જિયો-ટેગ યુનિટ ચકાસણી" : "Geo-Tagged Enterprise Proof",
                        sub: isGu ? "સ્થળ ચકાસણી અને મશીનરી ફોટો" : "Physical unit & stock photo verified",
                        icon: MapPin,
                      },
                    ] as {
                      key: keyof AltDataSignals;
                      title: string;
                      sub: string;
                      icon: React.ComponentType<{ className?: string }>;
                    }[]
                  ).map((sig) => {
                    const active = ml.signals[sig.key];
                    const Icon = sig.icon;
                    return (
                      <button
                        key={sig.key}
                        type="button"
                        onClick={() => handleToggleAltSignal(sig.key)}
                        aria-pressed={active}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]",
                          active
                            ? "border-[#0F5E4E] bg-[#ECFDF5]"
                            : "border-[#DFDBD0] bg-[#FAF8F4] hover:bg-white"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <Icon
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0",
                                active ? "text-[#0F5E4E]" : "text-[#475467]"
                              )}
                            />
                            <div>
                              <div className="text-[13px] font-semibold text-[#141A23]">
                                {sig.title}
                              </div>
                              <div className="text-[11.5px] text-[#475467]">{sig.sub}</div>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded px-2 py-0.5 font-mono text-[11px] font-semibold",
                              active
                                ? "bg-[#0F5E4E] text-white"
                                : "border border-[#C9C3B4] bg-white text-[#475467]"
                            )}
                          >
                            {active ? "Connected ✓" : "+ Add"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 border-t border-[#ECE8DE] pt-4">
                <p className="text-[11.5px] leading-relaxed text-[#475467]">
                  <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#0F5E4E]" />
                  <strong>{RBI_FIRST_DOSE_CITATION}:</strong> Decision-support signal only (Illustrative ML). Banks retain full sanction authority.
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => onEnterPortal("shg-sakhi")}
                >
                  {isGu
                    ? `${selectedCase.shgNameGu} નો સંપૂર્ણ રિપોર્ટ ખોલો`
                    : `Open Full Readiness & Loan Pack for ${selectedCase.shgName.split(" ")[0]}`}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Government Websites / Official Portals (Transformed to Tilted Marquee Style) ─── */}
      <section id="govt-portals" className="border-t border-[#DFDBD0] bg-white overflow-hidden py-14">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#DFDBD0] bg-[#FAF8F4] px-4 py-1 text-[12px] font-medium text-[#0F5E4E]">
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            Official Gujarat &amp; Central Government Portals
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#141A23]">
            Direct Access to Government Scheme Websites
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-[14.5px] leading-relaxed text-[#475467]">
            Sakhi CreditLink prepares your Sakhi Mandal&apos;s pre-application dossier and links
            directly to official government portals for submission.
          </p>
        </div>

        {/* Continuous Tilted Government Website Cards Marquee */}
        <div className="relative mt-10 w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            className="flex gap-5 w-max px-4"
            animate={{
              x: ["0%", "-50%"],
              transition: {
                ease: "linear",
                duration: 42,
                repeat: Infinity,
              },
            }}
            whileHover={{ transition: { duration: 140 } }}
          >
            {duplicatedPortals.map((portal, idx) => (
              <motion.a
                key={`${portal.name}-${idx}`}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                style={{ rotate: `${idx % 2 === 0 ? -1.8 : 2.2}deg` }}
                className="group flex w-72 sm:w-80 flex-shrink-0 flex-col justify-between rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-5 transition-colors hover:border-[#0F5E4E] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
                      {portal.tag}
                    </span>
                    <ExternalLink className="h-4 w-4 text-[#475467] group-hover:text-[#0F5E4E]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#141A23] group-hover:text-[#0F5E4E]">
                    {portal.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#475467]">{portal.desc}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0F5E4E]">
                  Open official website <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Simulated Pilot Metrics Strip ─── */}
      <section className="border-t border-[#DFDBD0] bg-[#FAF8F4]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#475467]">
              Anand &amp; Kheda Illustrative Pilot Snapshot
            </span>
            <SimulatedBadge />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "148", label: "SHGs Identified (Simulated)", sub: "Anand & Kheda blocks" },
              { value: "₹3.62 Cr", label: "Indicative Demand (Simulated)", sub: "Capex + WC separated" },
              { value: "61", label: "Lender-Ready Packs (Simulated)", sub: "Verified checklist" },
              { value: "29", label: "Sanctioned Packs (Simulated)", sub: "Branch tracking" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="font-mono text-[26px] font-semibold text-[#141A23] tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-[#141A23]">{stat.label}</div>
                <div className="mt-0.5 text-[12px] text-[#475467]">{stat.sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (3 Crisp Steps) ─── */}
      <section className="border-t border-[#DFDBD0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className="font-serif text-[26px] font-semibold text-[#141A23]">
            How Sakhi CreditLink Works in 3 Steps
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Verify LokOS & RBI 6× Corpus",
                desc: "Pull Sakhi Mandal identity from GLPC snapshot and check RBI first-dose eligibility: max(6× corpus, ₹1.5L) with 6-month active books.",
              },
              {
                step: "02",
                title: "Build Cash-Flow Blueprint",
                desc: "Separate Capex from Working Capital, attach 6–12 month sales ledger, and check lean-month EMI coverage.",
              },
              {
                step: "03",
                title: "Match, Submit & Guard 0%",
                desc: "Match 9 Gujarat/GLPC schemes, send bank-ready dossier, track branch SLA timers, and protect 0% interest subvention.",
              },
            ].map((item) => (
              <Card key={item.step} className="bg-[#FAF8F4] p-5">
                <div className="font-mono text-[12px] font-semibold text-[#0F5E4E]">STEP {item.step}</div>
                <h3 className="mt-2 text-[16px] font-semibold text-[#141A23]">{item.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#475467]">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust & DPDP Act 2023 Footer ─── */}
      <footer className="border-t border-[#DFDBD0] bg-[#F2EFE8]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 text-[12.5px] text-[#475467] md:flex-row md:items-center md:px-6">
          <div className="flex items-center gap-2 font-semibold text-[#141A23]">
            <ShieldCheck className="h-4 w-4 text-[#0F5E4E]" aria-hidden="true" />
            <span>Sakhi CreditLink · Gujarat Pilot Prototype</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" /> Banks retain sanction authority
            </span>
            <span>Purpose-specific consent (DPDP Act 2023)</span>
            <span>Zero paid lender ranking</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
