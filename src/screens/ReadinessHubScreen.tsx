import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Scale,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { AppLanguage, NavScreenId, SHGCase } from "@/data/sakhi-data";
import {
  DOSE_CONFIG,
  RBI_FIRST_DOSE_CITATION,
  booksCheck,
  drawingPowerFirstDose,
  estimateMonthlyMarginAndEmi,
  getCaseExternalNeed,
  indicativeGrade,
  readinessScore,
  repeatLinkage,
  slaStatus,
  ticketGap,
  type ReadinessFixAction,
} from "@/lib/access-engine";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface ReadinessHubScreenProps {
  shg: SHGCase;
  language: AppLanguage;
  onUpdateCase: (updated: SHGCase) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const ReadinessHubScreen: React.FC<ReadinessHubScreenProps> = ({
  shg,
  language,
  onUpdateCase,
  onNavigate,
}) => {
  const [showWhyScore, setShowWhyScore] = useState(true);
  const [showRightsScript, setShowRightsScript] = useState(false);

  const isGu = language === "gu";

  const readiness = readinessScore(shg);
  const books = booksCheck(shg);
  const grade = indicativeGrade(shg);
  const requestedINR = getCaseExternalNeed(shg);
  const eligibleFirstDoseINR = drawingPowerFirstDose(shg.corpusBalance);
  const gap = ticketGap(requestedINR, eligibleFirstDoseINR);
  const sla = slaStatus(shg);
  const repeat = repeatLinkage(shg);
  const cashflow = estimateMonthlyMarginAndEmi(shg);

  const assetsToBuyINR = shg.costLines
    .filter((c) => c.category === "Capex")
    .reduce((sum, c) => sum + c.amount, 0);
  const runningMoneyINR = shg.costLines
    .filter((c) => c.category === "Working Capital")
    .reduce((sum, c) => sum + c.amount, 0);

  const stampTimeline = (base: SHGCase, note: string): SHGCase => {
    const score = readinessScore(base).score;
    return {
      ...base,
      readinessScore: score,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          stage: base.stage,
          actor: base.bankSakhiName,
          timestamp: "Just now",
          note,
        },
        ...base.timeline,
      ],
    };
  };

  const handleQuickFix = (action: ReadinessFixAction | null) => {
    if (!action) return;
    if (action === "open-cashflow") {
      onNavigate("cashflow-blueprint");
      return;
    }

    if (action === "fix-panchasutra") {
      const updated = stampTimeline(
        {
          ...shg,
          panchasutraScore: 5,
          panchasutraChecks: {
            regularMeetings: true,
            regularSavings: true,
            internalLending: true,
            timelyRepayment: true,
            updatedBooks: true,
          },
          activeBookMonths: Math.max(6, shg.activeBookMonths ?? (shg.formationYear >= 2026 ? 6 : 12)),
        },
        "Panchasutra norms verified by Bank Sakhi"
      );
      onUpdateCase(updated);
      return;
    }

    if (action === "fix-books") {
      const updated = stampTimeline(
        {
          ...shg,
          panchasutraScore: Math.max(
            shg.panchasutraScore,
            Object.values({
              ...shg.panchasutraChecks,
              regularSavings: true,
              internalLending: true,
              updatedBooks: true,
            }).filter(Boolean).length
          ),
          panchasutraChecks: {
            ...shg.panchasutraChecks,
            regularSavings: true,
            internalLending: true,
            updatedBooks: true,
          },
          activeBookMonths: Math.max(6, shg.activeBookMonths ?? 6),
        },
        "6+ months savings & internal-lending register verified"
      );
      onUpdateCase(updated);
      return;
    }

    if (action === "fix-documents") {
      const updated = stampTimeline(
        {
          ...shg,
          documents: shg.documents.map((doc) => ({
            ...doc,
            status: "Verified",
            provenance: doc.provenance === "Self-declared" ? "Document-supported" : doc.provenance,
            updatedAt: "Updated today",
          })),
        },
        "Pending checklist documents marked verified"
      );
      onUpdateCase(updated);
      return;
    }

    if (action === "fix-consent") {
      const hasActive = shg.consents.some((c) => c.status === "Active");
      const updated = stampTimeline(
        {
          ...shg,
          officeBearers: shg.officeBearers.map((ob) => ({ ...ob, verified: true })),
          consents: hasActive
            ? shg.consents
            : [
                ...shg.consents,
                {
                  id: `con-${Date.now()}`,
                  purpose: "SHG Credit Linkage Pack Sharing",
                  recipient: shg.linkedBranch,
                  scope: "Panchasutra, Cash-Flow & Enterprise Evidence",
                  grantedBy: shg.officeBearers[0]?.name || shg.bankSakhiName,
                  grantedOn: "Today",
                  expiresOn: "12 months",
                  status: "Active",
                },
              ],
        },
        "Group consent and office-bearer checks recorded"
      );
      onUpdateCase(updated);
    }
  };

  const firstPendingFix = readiness.breakdown.find((item) => item.fixAction !== null);

  const nextBestAction = (() => {
    if (!books.passed) {
      return {
        title: isGu
          ? `૬ મહિનાની બચત અને આંતરિક ધિરાણ નોંધ પૂરી કરો (${books.missingMonths} મહિના બાકી)`
          : `Complete 6-month savings & lending books (${books.missingMonths} mo short)`,
        detail: isGu
          ? "પ્રથમ બેંક લિંકેજ પહેલાં ૬ મહિનાનો નિયમિત બચત અને આંતરિક ધિરાણ રેકોર્ડ જરૂરી છે."
          : "Banks look for at least 6 months of updated savings and internal-lending records before first credit linkage.",
        ctaLabel: isGu ? "૬ મહિનાના રજિસ્ટર અપડેટ કરો" : "Verify 6-Month Books",
        onRun: () => handleQuickFix("fix-books"),
      };
    }
    if (firstPendingFix && firstPendingFix.fixAction) {
      return {
        title: firstPendingFix.fix || "Complete pending readiness check",
        detail: firstPendingFix.label,
        ctaLabel: firstPendingFix.fix || "Fix now",
        onRun: () => handleQuickFix(firstPendingFix.fixAction),
      };
    }
    if (gap.isUnderEligible && gap.gapPct >= 40) {
      return {
        title: isGu
          ? `પાત્રતા (${formatINR(eligibleFirstDoseINR)}) કરતાં માંગ (${formatINR(requestedINR)}) ઓછી છે`
          : `Review requested amount (${formatINR(requestedINR)}) vs RBI ceiling (${formatINR(eligibleFirstDoseINR)})`,
        detail: isGu
          ? "સખી મંડળની વાસ્તવિક જરૂરિયાત મુજબ સાધનો અને કાર્યકારી મૂડી ચકાસો."
          : "Check if the group actually needs only this amount or under-asked out of caution. Confirm assets to buy + running money.",
        ctaLabel: isGu ? "જરૂરિયાત અને રોકડ પ્રવાહ જુઓ" : "Review Cash-flow Blueprint",
        onRun: () => onNavigate("cashflow-blueprint"),
      };
    }
    return {
      title: isGu
        ? "મંડળ બેંક અરજી માટે તૈયાર છે"
        : "SHG pack is ready for bank branch submission",
      detail: isGu
        ? "તમામ પંચસૂત્ર, બુક અને દસ્તાવેજ ચકાસણી પૂર્ણ છે."
        : "Panchasutra habits, 6-month books, and repayment check are all verified.",
      ctaLabel: isGu ? "અરજી પેક તૈયાર કરો" : "Open Application Pack",
      onRun: () => onNavigate("application-pack"),
    };
  })();

  const scoreTone =
    readiness.score >= 80 ? "success" : readiness.score >= 60 ? "warning" : "danger";

  const slaTone =
    sla.state === "ok" ? "success" : sla.state === "warning" ? "warning" : "danger";

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={isGu ? "સખી મંડળ / બેંક સખી પોર્ટલ" : "SHG / Bank Sakhi Home"}
        title={isGu ? "સખી મંડળ ધિરાણ તૈયારી હબ" : "SHG Credit Readiness & Action Hub"}
        subtitle={
          isGu
            ? `${shg.shgNameGu} · ${shg.village}, ${shg.district} · ${shg.linkedBranch}`
            : `${shg.shgName} · ${shg.village}, ${shg.district} · ${shg.linkedBranch}`
        }
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <SimulatedBadge />
            <Button variant="primary" onClick={() => onNavigate("application-pack")}>
              {isGu ? "અરજી પેક જુઓ" : "Prepare Application Pack"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Row 1: Readiness Score + Next Best Action */}
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="p-5 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                {isGu ? "બેંક ધિરાણ તૈયારી સ્કોર" : "Bank Readiness Score"}
              </div>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-mono text-[38px] font-bold leading-none text-[#141A23] tabular-nums">
                  {readiness.score}
                </span>
                <span className="font-mono text-[16px] text-[#475467]">/ 100</span>
                <StatusChip
                  tone={scoreTone}
                  icon={
                    readiness.score >= 80 ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )
                  }
                >
                  {readiness.score >= 80
                    ? isGu
                      ? "તૈયાર"
                      : "Branch Ready"
                    : readiness.score >= 60
                    ? isGu
                      ? "સુધારા સાથે તૈયાર"
                      : "Needs Minor Fixes"
                    : isGu
                    ? "જરૂરી તૈયારી બાકી"
                    : "Not Ready Yet"}
                </StatusChip>
              </div>
              <p className="mt-1.5 text-[12.5px] text-[#475467]">
                {isGu
                  ? "દરેક ગુણનું સ્પષ્ટ કારણ અને ૧-ટૅપ સુધારો નીચે આપેલ છે."
                  : "Rule-based score from LokOS books, group consent, documents & repayment margin — no black box."}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWhyScore((v) => !v)}
              aria-expanded={showWhyScore}
            >
              {isGu ? "આ સ્કોર કેમ?" : "Why this score?"}
              {showWhyScore ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showWhyScore && (
            <div className="mt-4 divide-y divide-[#ECE8DE] border-t border-[#ECE8DE] pt-2">
              {readiness.breakdown.map((item) => {
                const isFull = item.points >= item.max;
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-[200px] flex-1">
                      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#141A23]">
                        {isFull ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#047857]" />
                        ) : (
                          <Wrench className="h-4 w-4 shrink-0 text-[#B45309]" />
                        )}
                        <span>{isGu ? item.labelGu : item.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] font-semibold text-[#141A23] tabular-nums">
                        {item.points}/{item.max}
                      </span>
                      {item.fix && item.fixAction && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuickFix(item.fixAction)}
                        >
                          {item.fix}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Next Best Action + SLA Card */}
        <Card className="flex flex-col justify-between p-5 lg:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#0F5E4E]">
                <Sparkles className="h-4 w-4" />
                {isGu ? "આગળનું શ્રેષ્ઠ પગલું" : "Next Best Action"}
              </div>
              <StatusChip tone={slaTone} icon={<Clock className="h-3.5 w-3.5" />}>
                {sla.elapsedDays}d / {sla.slaDays}d ({sla.label})
              </StatusChip>
            </div>

            <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4">
              <div className="text-[15px] font-semibold text-[#141A23]">
                {nextBestAction.title}
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#475467]">
                {nextBestAction.detail}
              </p>
              <div className="mt-3">
                <Button variant="secondary" size="sm" onClick={nextBestAction.onRun}>
                  {nextBestAction.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-[#ECE8DE] pt-3 text-[12px] text-[#475467]">
            <div className="flex items-center justify-between">
              <span>{isGu ? "હાલનો તબક્કો" : "Current Stage"}:</span>
              <span className="font-semibold text-[#141A23]">{shg.stage}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>{isGu ? "સૂચિત સમયમર્યાદા (વૈકલ્પિક)" : "SLA Benchmark"}:</span>
              <span>
                Proposed SLA (configurable ·{" "}
                {sla.daysLeft >= 0
                  ? `${sla.daysLeft}d left`
                  : `${Math.abs(sla.daysLeft)}d overdue`}
                )
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: RBI Drawing Power Check + Books + Indicative Grade */}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#141A23]">
              <Scale className="h-4 w-4 text-[#0F5E4E]" />
              {isGu
                ? "RBI પ્રથમ લિંકેજ પાત્રતા અને લોન કદ તપાસ"
                : "RBI First-Linkage Drawing Power Check"}
            </div>
            <p className="mt-1 text-[12.5px] text-[#475467]">
              Rule: <span className="font-mono font-medium">max(6 × corpus, ₹1,50,000)</span> ·{" "}
              <span className="font-medium text-[#141A23]">{RBI_FIRST_DOSE_CITATION}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone={books.passed ? "success" : "warning"}>
              6-Mo Books: {books.recordedMonths}/6 mo {books.passed ? "Pass" : "Short"}
            </StatusChip>
            <StatusChip tone={grade.grade === "A" ? "success" : "info"}>
              Grade {grade.grade} (Indicative)
            </StatusChip>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              {isGu ? "મંડળનું કુલ કોર્પસ" : "SHG Corpus Balance"}
            </div>
            <div className="mt-1 font-mono text-[20px] font-semibold text-[#141A23] tabular-nums">
              {formatINR(shg.corpusBalance)}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[#475467]">LokOS verified savings &amp; RF</div>
          </div>

          <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#047857]">
              {isGu ? "RBI પ્રથમ વર્ષ મર્યાદા" : "RBI Eligible Limit (6× / ₹1.5L)"}
            </div>
            <div className="mt-1 font-mono text-[20px] font-semibold text-[#047857] tabular-nums">
              {formatINR(eligibleFirstDoseINR)}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[#047857]">Verified rule · {RBI_FIRST_DOSE_CITATION}</div>
          </div>

          <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              {isGu ? "માંગેલ લોન રકમ" : "Requested Bank Credit"}
            </div>
            <div className="mt-1 font-mono text-[20px] font-semibold text-[#141A23] tabular-nums">
              {formatINR(requestedINR)}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[#475467]">
              {gap.adequacyPct}% of eligible limit
            </div>
          </div>

          <div
            className={cn(
              "rounded-lg border p-3.5",
              gap.isUnderEligible
                ? "border-[#FDE68A] bg-[#FFFBEB]"
                : "border-[#A7F3D0] bg-[#ECFDF5]"
            )}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              {isGu ? "વણવપરાયેલ લોન ક્ષમતા" : "Untapped Ticket Gap"}
            </div>
            <div className="mt-1 font-mono text-[20px] font-semibold text-[#B45309] tabular-nums">
              {formatINR(gap.gapINR)}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[#475467]">
              {gap.isUnderEligible
                ? `${gap.gapPct}% below RBI 6× eligibility`
                : "Requested meets/exceeds 6× corpus"}
            </div>
          </div>
        </div>

        {/* Plain-language finance summary + Grade/Books notes */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-[#ECE8DE] bg-white px-3.5 py-2.5">
            <div className="text-[11.5px] text-[#475467]">
              {isGu ? "ખરીદવાના સાધનો (મશીન/ઓજાર)" : "Assets to buy"}
            </div>
            <div className="font-mono text-[15px] font-semibold text-[#141A23] tabular-nums">
              {formatINR(assetsToBuyINR)}
            </div>
          </div>
          <div className="rounded-md border border-[#ECE8DE] bg-white px-3.5 py-2.5">
            <div className="text-[11.5px] text-[#475467]">
              {isGu ? "કામ ચલાવવા માટેની રકમ (કાચો માલ)" : "Money for running the work"}
            </div>
            <div className="font-mono text-[15px] font-semibold text-[#141A23] tabular-nums">
              {formatINR(runningMoneyINR)}
            </div>
          </div>
          <div className="rounded-md border border-[#ECE8DE] bg-white px-3.5 py-2.5">
            <div className="text-[11.5px] text-[#475467]">
              {isGu ? "શું મંડળ આરામથી હપ્તો ભરી શકશે?" : "Can the group repay comfortably?"}
            </div>
            <div className="font-mono text-[15px] font-semibold text-[#0F5E4E] tabular-nums">
              {cashflow.coverageRatio >= 1.25 ? "Yes · " : "Tight · "}
              {cashflow.coverageRatio.toFixed(2)}× ({formatINR(cashflow.monthlyMarginINR)} margin vs{" "}
              {formatINR(cashflow.estimatedEmiINR)} EMI)
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#475467]">
          <span>
            <BookOpen className="mr-1 inline h-3.5 w-3.5 text-[#0F5E4E]" />
            {books.summary}
          </span>
          <span className="font-medium text-[#475467]">{grade.disclaimer}</span>
        </div>
      </Card>

      {/* Row 3: Know Your Rights + Repeat Linkage Strip */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Know your rights */}
        <Card className="p-5 lg:col-span-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0F5E4E]" />
              <div>
                <h2 className="text-[15px] font-semibold text-[#141A23]">
                  {isGu ? "તમારા અધિકારો જાણો (RBI નિયમ)" : "Know Your Rights"}
                </h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[#141A23]">
                  {isGu
                    ? "બધા સભ્યોના વ્યક્તિગત બચત ખાતા ખોલવા એ SHG બેંક ધિરાણ માટે ફરજિયાત પૂર્વશરત નથી (RBI)."
                    : "Opening individual savings accounts for all members is not a prerequisite for SHG credit linkage (RBI)."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRightsScript((v) => !v)}
              aria-expanded={showRightsScript}
            >
              {isGu
                ? "બેંક શાખાએ બધા સભ્યોના ખાતા માંગ્યા?"
                : "Branch asked for member accounts?"}
              {showRightsScript ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showRightsScript && (
              <div className="mt-3 space-y-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-3.5 text-[13px] text-[#141A23]">
                <div>
                  <div className="font-semibold text-[#92400E]">
                    Polite response at branch (EN / ગુજરાતી):
                  </div>
                  <p className="mt-1">
                    “Sir/Madam, under the RBI Master Circular on SHG-BLP, the SHG group account
                    and KYC of the 3 office bearers suffice for credit linkage; individual savings
                    accounts for every member are not required upfront.”
                  </p>
                  <p className="mt-1.5 text-[#475467]">
                    “સાહેબ/મેડમ, RBI SHG-BLP માર્ગદર્શિકા મુજબ જૂથનું બચત ખાતું અને ૩ મુખ્ય
                    હોદ્દેદારોની KYC પૂરતી છે; દરેક સભ્યનું અલગ ખાતું ફરજિયાત નથી.”
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#FDE68A] pt-2.5 text-[12px]">
                  <span>
                    Code: <code className="font-mono font-semibold">KYC-MEMBER-ACCOUNT</code>{" "}
                    (Proposed standard code) · Escalation: <strong>BLBC / LDM (Proposed)</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Repeat Linkage Dose 1 -> 2 -> 3 */}
        <Card className="p-5 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-semibold text-[#141A23]">
              {isGu ? "પુનરાવર્તિત ધિરાણ માર્ગ (ડોઝ ૧ → ૨ → ૩)" : "Repeat Linkage Progression"}
            </h2>
            <span className="rounded bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-medium text-[#B45309] border border-[#FDE68A]">
              Dose 2 &amp; 3: Illustrative
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-[#475467]">
            {repeat.earliestEligibleDate}
          </p>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {([1, 2, 3] as const).map((doseNum) => {
              const cfg = DOSE_CONFIG[doseNum];
              const isCurrent = repeat.currentDose === doseNum;
              const estAmount =
                cfg.multiplier !== null
                  ? Math.max(cfg.multiplier * shg.corpusBalance, cfg.minimumINR)
                  : Math.max(cfg.minimumINR, shg.corpusBalance * 8);

              return (
                <div
                  key={doseNum}
                  className={cn(
                    "rounded-lg border p-3",
                    isCurrent
                      ? "border-[#0F5E4E] bg-[#ECFDF5]"
                      : "border-[#DFDBD0] bg-[#FAF8F4]"
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] font-semibold text-[#141A23]">
                      Dose {doseNum}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        cfg.verified
                          ? "bg-[#D1FAE5] text-[#047857]"
                          : "bg-[#FEF3C7] text-[#B45309]"
                      )}
                    >
                      {cfg.verified ? "Verified RBI" : "Illustrative"}
                    </span>
                  </div>
                  <div className="mt-1.5 font-mono text-[15px] font-bold text-[#141A23] tabular-nums">
                    {formatINR(estAmount)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#475467]">
                    {cfg.multiplier ? `${cfg.multiplier}× corpus / ` : ""}min {formatINR(cfg.minimumINR)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
