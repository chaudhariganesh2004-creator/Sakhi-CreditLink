import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ExternalLink,
  Globe,
  Scale,
  ShieldCheck,
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
  resolveAltDataSignals,
} from "@/lib/access-engine";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { Button } from "@/components/ui/button";
import { Card, Field, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
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

  const initialCase = cases.find((c) => c.id === activeCaseId) ?? cases[0];
  const [selectedId, setSelectedId] = useState<string>(initialCase.id);
  const [applicantName, setApplicantName] = useState<string>(initialCase.shgName);
  const [corpusBalance, setCorpusBalance] = useState<number>(initialCase.corpusBalance);
  const [requestedAmount, setRequestedAmount] = useState<number>(
    getCaseExternalNeed(initialCase)
  );
  const [signals, setSignals] = useState<AltDataSignals>(() =>
    resolveAltDataSignals(initialCase)
  );
  const [showIndividualResult, setShowIndividualResult] = useState<boolean>(false);

  const selectedCase = cases.find((c) => c.id === selectedId) ?? cases[0];

  const handleApplicantChange = (id: string) => {
    const found = cases.find((c) => c.id === id) ?? cases[0];
    setSelectedId(found.id);
    setApplicantName(found.shgName);
    setCorpusBalance(found.corpusBalance);
    setRequestedAmount(getCaseExternalNeed(found));
    setSignals(resolveAltDataSignals(found));
    setShowIndividualResult(false);
    onSelectCase?.(found.id);
  };

  const handleToggleSignal = (key: keyof AltDataSignals) => {
    setSignals((prev) => ({ ...prev, [key]: !prev[key] }));
    setShowIndividualResult(false);
  };

  const evaluatedCase: SHGCase = {
    ...selectedCase,
    shgName: applicantName.trim() || selectedCase.shgName,
    corpusBalance: Math.max(0, corpusBalance),
    altDataSignals: signals,
  };

  const ml = alternativeDataCredibility(evaluatedCase);
  const eligibleINR = drawingPowerFirstDose(evaluatedCase.corpusBalance);

  const handleCheckCreditworthiness = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectCase?.(selectedCase.id);
    onUpdateCase?.(evaluatedCase);
    setShowIndividualResult(true);
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

      {/* ─── Place Application & Check Individual SHG Creditworthiness ─── */}
      <section
        id="individual-credit-check"
        className="border-t border-[#DFDBD0] bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 md:px-6 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-1 text-[11.5px] font-semibold text-[#047857]">
                <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
                {isGu
                  ? "વૈકલ્પિક ડેટા આધારિત ક્રેડિટ પાત્રતા"
                  : "Alternative-Data ML Creditworthiness Check"}
              </div>
              <h2 className="font-serif text-[28px] md:text-[34px] font-semibold leading-tight text-[#141A23]">
                {isGu
                  ? "તમારી લોન અરજી મૂકો અને વ્યક્તિગત વિશ્વસનીયતા જુઓ"
                  : "Place SHG Application & Check Individual Creditworthiness"}
              </h2>
            </div>
            <SimulatedBadge />
          </div>

          <Card className="bg-[#FAF8F4] p-6 md:p-8">
            <form onSubmit={handleCheckCreditworthiness} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  htmlFor="home-shg-select"
                  label={isGu ? "સખી મંડળ પસંદ કરો" : "Select Sakhi Mandal (SHG)"}
                >
                  <select
                    id="home-shg-select"
                    value={selectedId}
                    onChange={(e) => handleApplicantChange(e.target.value)}
                    className="min-h-[44px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px] font-medium text-[#141A23] focus:border-[#0F5E4E] focus:outline-none"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isGu ? c.shgNameGu : c.shgName} ({c.district})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  htmlFor="home-shg-name"
                  label={isGu ? "અરજદાર જૂથનું નામ" : "Applicant SHG Name"}
                >
                  <input
                    id="home-shg-name"
                    type="text"
                    value={applicantName}
                    onChange={(e) => {
                      setApplicantName(e.target.value);
                      setShowIndividualResult(false);
                    }}
                    className="min-h-[44px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px] text-[#141A23] focus:border-[#0F5E4E] focus:outline-none"
                  />
                </Field>

                <Field
                  htmlFor="home-corpus"
                  label={isGu ? "કુલ કોર્પસ બચત (₹)" : "SHG Corpus Balance (₹)"}
                >
                  <input
                    id="home-corpus"
                    type="number"
                    min={0}
                    step={5000}
                    value={corpusBalance}
                    onChange={(e) => {
                      setCorpusBalance(Number(e.target.value) || 0);
                      setShowIndividualResult(false);
                    }}
                    className="min-h-[44px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 font-mono text-[14px] font-semibold text-[#141A23] tabular-nums focus:border-[#0F5E4E] focus:outline-none"
                  />
                </Field>

                <Field
                  htmlFor="home-requested"
                  label={isGu ? "માંગેલ લોન રકમ (₹)" : "Requested Loan Amount (₹)"}
                >
                  <input
                    id="home-requested"
                    type="number"
                    min={10000}
                    step={5000}
                    value={requestedAmount}
                    onChange={(e) => {
                      setRequestedAmount(Number(e.target.value) || 0);
                      setShowIndividualResult(false);
                    }}
                    className="min-h-[44px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 font-mono text-[14px] font-semibold text-[#141A23] tabular-nums focus:border-[#0F5E4E] focus:outline-none"
                  />
                </Field>
              </div>

              {/* Alternative-Data Consent Checkboxes */}
              <div className="space-y-2.5 border-t border-[#DFDBD0] pt-5">
                <div className="text-[12.5px] font-semibold text-[#141A23]">
                  {isGu
                    ? "વૈકલ્પિક ડેટા સંમતિ (સંમતિ હોય તે પસંદ કરો):"
                    : "Alternative Data Signals (DPDP Consent-Based):"}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        key: "upiSupplierReceipts",
                        label: isGu ? "UPI વેચાણ અને સપ્લાયર રસીદ" : "UPI Sales & Supplier Receipts",
                      },
                      {
                        key: "dairyOrCoopSupplySync",
                        label: isGu ? "દૂધ મંડળી / સહકારી પાસબુક" : "Dairy / Co-op Supply Passbook",
                      },
                      {
                        key: "utilityAndTelecomRegularity",
                        label: isGu ? "વીજળી બિલ અને મોબાઇલ નિયમિતતા" : "Utility & Mobile Regularity",
                      },
                      {
                        key: "geoTaggedWorkshopVerified",
                        label: isGu ? "જિયો-ટેગ યુનિટ ચકાસણી" : "Geo-Tagged Enterprise Proof",
                      },
                    ] as { key: keyof AltDataSignals; label: string }[]
                  ).map((sig) => {
                    const checked = signals[sig.key];
                    return (
                      <label
                        key={sig.key}
                        className={cn(
                          "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-md border px-3.5 py-2 text-[13px] font-medium transition-colors",
                          checked
                            ? "border-[#0F5E4E] bg-[#ECFDF5] text-[#0F5E4E]"
                            : "border-[#DFDBD0] bg-white text-[#475467] hover:bg-[#F2EFE8]"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleSignal(sig.key)}
                          className="h-4 w-4 accent-[#0F5E4E]"
                        />
                        <span>{sig.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#DFDBD0] pt-5">
                <span className="text-[12px] text-[#475467]">
                  <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#0F5E4E]" />
                  {isGu
                    ? "ફક્ત પસંદ કરેલ મંડળનો વ્યક્તિગત સ્કોર બતાવશે (અનુમાનિત ML)."
                    : "Computes individual SHG creditworthiness only (Illustrative ML · decision support)."}
                </span>

                <Button type="submit" variant="primary" size="lg">
                  <BrainCircuit className="h-4 w-4" />
                  {isGu
                    ? "વ્યક્તિગત ક્રેડિટ વિશ્વસનીયતા જાણો"
                    : "Know Individual SHG Creditworthiness"}
                </Button>
              </div>
            </form>

            {/* Revealed Individual Result Only After User Clicks Button */}
            {showIndividualResult && (
              <div className="mt-6 rounded-lg border border-[#A7F3D0] bg-white p-5 md:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                      {evaluatedCase.shgName} · Individual Creditworthiness (Illustrative ML)
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-3">
                      <span className="font-mono text-[40px] font-bold leading-none text-[#0F5E4E] tabular-nums">
                        {ml.credibilityScore}
                      </span>
                      <span className="font-mono text-[15px] text-[#475467]">/ 100</span>
                      <StatusChip tone={scoreTone}>
                        {isGu ? ml.tierGu : ml.tier}
                      </StatusChip>
                    </div>
                  </div>

                  <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                      <Scale className="h-3.5 w-3.5 text-[#0F5E4E]" />
                      {isGu ? "RBI ૬× લોન મર્યાદા" : "RBI 6× Eligible Limit"}
                    </div>
                    <div className="mt-1 font-mono text-[20px] font-bold text-[#141A23] tabular-nums">
                      {formatINR(eligibleINR)}
                    </div>
                    <div className="text-[11px] text-[#475467]">{RBI_FIRST_DOSE_CITATION}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECE8DE] pt-4">
                  <span className="text-[12.5px] text-[#475467]">
                    {isGu
                      ? "તમે આ અરજી સાથે સંપૂર્ણ બેંક પેક અને વિગતવાર વિશ્લેષણમાં આગળ વધી શકો છો."
                      : "Individual check complete. Proceed into the portal for full pack & bank submission."}
                  </span>
                  <Button variant="secondary" onClick={() => onEnterPortal("shg-sakhi")}>
                    {isGu ? "અરજી સાથે આગળ વધો" : "Proceed to Application Pack"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* ─── Government Websites / Official Portals (Transformed to Tilted Marquee Style) ─── */}
      <section id="govt-portals" className="border-t border-[#DFDBD0] bg-[#FAF8F4] overflow-hidden py-16 md:py-20">
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
                className="group flex w-72 sm:w-80 flex-shrink-0 flex-col justify-between rounded-lg border border-[#DFDBD0] bg-white p-5 transition-colors hover:border-[#0F5E4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]"
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
      <section className="border-t border-[#DFDBD0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
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
              <Card key={stat.label} className="bg-[#FAF8F4] p-4">
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
      <section className="border-t border-[#DFDBD0] bg-[#FAF8F4]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2 className="font-serif text-[26px] font-semibold text-[#141A23]">
            How Sakhi CreditLink Works in 3 Steps
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
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
              <Card key={item.step} className="bg-white p-5">
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
