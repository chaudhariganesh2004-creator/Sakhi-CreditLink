import type { AltDataSignals, SHGCase } from "../data/sakhi-data";

export const RBI_FIRST_DOSE_CITATION = "RBI Master Circular on SHG-BLP";

export interface DoseConfigEntry {
  dose: 1 | 2 | 3;
  label: string;
  labelGu: string;
  multiplier: number | null;
  minimumINR: number;
  verified: boolean;
  note: string;
}

/* illustrative, bank-policy dependent (except Dose 1 first-linkage norm) */
export const DOSE_CONFIG: Record<1 | 2 | 3, DoseConfigEntry> = {
  1: {
    dose: 1,
    label: "Dose 1 · First Linkage",
    labelGu: "ડોઝ ૧ · પ્રથમ બેંક જોડાણ",
    multiplier: 6,
    minimumINR: 150000,
    verified: true,
    note: "Verified rule: max(6 × corpus, ₹1,50,000) per RBI Master Circular on SHG-BLP",
  },
  2: {
    dose: 2,
    label: "Dose 2 · Enhanced Linkage",
    labelGu: "ડોઝ ૨ · વધારાનું ધિરાણ",
    multiplier: 8,
    minimumINR: 300000,
    verified: false,
    note: "Illustrative, bank-policy dependent",
  },
  3: {
    dose: 3,
    label: "Dose 3 · MCP Enterprise Scale",
    labelGu: "ડોઝ ૩ · MCP આધારિત વિસ્તરણ",
    multiplier: null,
    minimumINR: 600000,
    verified: false,
    note: "Illustrative, bank-policy dependent (minimum ₹6,00,000 per MCP)",
  },
};

/**
 * Verified RBI norm: First-year drawing power is 6× corpus or ₹1,50,000, whichever is higher.
 * Source: RBI Master Circular on SHG-BLP.
 */
export function drawingPowerFirstDose(corpus: number): number {
  const safeCorpus = Math.max(0, Number.isFinite(corpus) ? corpus : 0);
  return Math.max(6 * Math.round(safeCorpus), 150000);
}

export interface BooksCheckResult {
  passed: boolean;
  recordedMonths: number;
  requiredMonths: 6;
  missingMonths: number;
  savingsActive: boolean;
  internalLendingActive: boolean;
  booksUpdated: boolean;
  summary: string;
}

/**
 * Requires at least 6 months of active savings and internal-lending records per books of accounts.
 */
export function booksCheck(shg: SHGCase): BooksCheckResult {
  const requiredMonths = 6 as const;
  const savingsActive = Boolean(shg.panchasutraChecks.regularSavings);
  const internalLendingActive = Boolean(shg.panchasutraChecks.internalLending);
  const booksUpdated = Boolean(shg.panchasutraChecks.updatedBooks);

  const inferredAgeMonths = shg.formationYear >= 2026 ? 4 : 12;
  const rawMonths =
    typeof shg.activeBookMonths === "number"
      ? Math.max(0, Math.round(shg.activeBookMonths))
      : inferredAgeMonths;

  const effectiveMonths =
    savingsActive && internalLendingActive && booksUpdated
      ? rawMonths
      : Math.min(rawMonths, 4);

  const missingMonths = Math.max(0, requiredMonths - effectiveMonths);
  const passed =
    effectiveMonths >= requiredMonths &&
    savingsActive &&
    internalLendingActive &&
    booksUpdated;

  const summary = passed
    ? `${effectiveMonths} months of savings & internal-lending records verified`
    : missingMonths > 0
    ? `${missingMonths} month(s) of updated savings/internal-lending books still needed`
    : "Update savings and internal-lending register entries to meet 6-month requirement";

  return {
    passed,
    recordedMonths: effectiveMonths,
    requiredMonths,
    missingMonths,
    savingsActive,
    internalLendingActive,
    booksUpdated,
    summary,
  };
}

export interface IndicativeGradeResult {
  grade: "A" | "B" | "C";
  score: number;
  disclaimer: string;
}

export function indicativeGrade(shg: SHGCase): IndicativeGradeResult {
  const p = shg.panchasutraChecks;
  const books = booksCheck(shg);
  let score = 0;
  if (p.regularMeetings) score += 20;
  if (p.regularSavings) score += 20;
  if (p.internalLending) score += 20;
  if (p.timelyRepayment) score += 20;
  if (p.updatedBooks) score += 20;

  let grade: "A" | "B" | "C" = "C";
  if (score >= 85 && books.passed) {
    grade = "A";
  } else if (score >= 60) {
    grade = "B";
  }

  return {
    grade,
    score,
    disclaimer: "Indicative grade, not official NABARD/GLPC grading",
  };
}

export interface TicketGapResult {
  requestedINR: number;
  eligibleINR: number;
  gapINR: number;
  gapPct: number;
  adequacyPct: number;
  isUnderEligible: boolean;
}

export function ticketGap(requested: number, eligible: number): TicketGapResult {
  const safeReq = Math.max(0, Math.round(requested));
  const safeElig = Math.max(0, Math.round(eligible));
  const gapINR = Math.max(0, safeElig - safeReq);
  const gapPct = safeElig > 0 ? Math.round((gapINR / safeElig) * 100) : 0;
  const adequacyPct =
    safeElig > 0 ? Math.min(100, Math.round((safeReq / safeElig) * 100)) : 100;

  return {
    requestedINR: safeReq,
    eligibleINR: safeElig,
    gapINR,
    gapPct,
    adequacyPct,
    isUnderEligible: safeReq < safeElig,
  };
}

export type ReadinessFixAction =
  | "fix-panchasutra"
  | "fix-books"
  | "fix-documents"
  | "fix-consent"
  | "open-cashflow";

export interface ReadinessBreakdownItem {
  id: string;
  label: string;
  labelGu: string;
  points: number;
  max: number;
  fix: string | null;
  fixAction: ReadinessFixAction | null;
}

export interface ReadinessScoreResult {
  score: number;
  breakdown: ReadinessBreakdownItem[];
}

export function getCaseExternalNeed(shg: SHGCase): number {
  const totalCost = shg.costLines.reduce((sum, line) => sum + line.amount, 0);
  return Math.max(0, totalCost - shg.ownContribution);
}

export function estimateMonthlyMarginAndEmi(shg: SHGCase): {
  monthlyMarginINR: number;
  estimatedEmiINR: number;
  coverageRatio: number;
} {
  const ue = shg.unitEconomics;
  const unitMargin = Math.max(
    0,
    ue.sellingPricePerUnit - ue.directCostPerUnit - ue.overheadPerUnit
  );
  const monthlyMarginINR = Math.round(ue.projectedMonthlyUnits * unitMargin);

  const principal = getCaseExternalNeed(shg);
  const tenor = Math.max(1, shg.timelineMonths || 36);
  const monthlyRate = 10.2 / 12 / 100;
  const estimatedEmiINR =
    principal === 0
      ? 0
      : Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, tenor)) /
            (Math.pow(1 + monthlyRate, tenor) - 1)
        );
  const coverageRatio =
    estimatedEmiINR > 0 ? monthlyMarginINR / estimatedEmiINR : 2;

  return { monthlyMarginINR, estimatedEmiINR, coverageRatio };
}

export function readinessScore(shg: SHGCase): ReadinessScoreResult {
  const books = booksCheck(shg);
  const gradeRes = indicativeGrade(shg);
  const { coverageRatio } = estimateMonthlyMarginAndEmi(shg);

  // 1. Panchasutra Discipline (25 max)
  const pScore = Object.values(shg.panchasutraChecks).filter(Boolean).length;
  const panchasutraPts = Math.round((pScore / 5) * 25);

  // 2. 6-Month Books Check (15 max)
  const booksPts = books.passed
    ? 15
    : Math.min(10, Math.round((books.recordedMonths / 6) * 10));

  // 3. Indicative Group Grade (15 max)
  const gradePts = gradeRes.grade === "A" ? 15 : gradeRes.grade === "B" ? 10 : 5;

  // 4. Mandatory Documents (20 max)
  const verifiedDocs = shg.documents.filter((d) => d.status === "Verified").length;
  const docsPts =
    shg.documents.length === 0
      ? 0
      : Math.round((verifiedDocs / shg.documents.length) * 20);

  // 5. Consent & Office-Bearer Verification (15 max)
  const hasActiveConsent = shg.consents.some((c) => c.status === "Active");
  const allBearersVerified =
    shg.officeBearers.length > 0 && shg.officeBearers.every((ob) => ob.verified);
  const consentPts = (hasActiveConsent ? 8 : 0) + (allBearersVerified ? 7 : 0);

  // 6. Cash-Flow Repayment Coverage (10 max)
  const cashflowPts = coverageRatio >= 1.25 ? 10 : coverageRatio >= 1.0 ? 6 : 3;

  const breakdown: ReadinessBreakdownItem[] = [
    {
      id: "panchasutra",
      label: "Panchasutra Habits (5 core norms)",
      labelGu: "પંચસૂત્ર પાલન (૫ નિયમો)",
      points: panchasutraPts,
      max: 25,
      fix: pScore < 5 ? "Complete remaining Panchasutra checks" : null,
      fixAction: pScore < 5 ? "fix-panchasutra" : null,
    },
    {
      id: "books",
      label: "6-Month Savings & Internal Lending Books",
      labelGu: "૬ મહિનાની બચત અને આંતરિક ધિરાણ બુક",
      points: booksPts,
      max: 15,
      fix: books.passed ? null : "Verify 6+ months updated books",
      fixAction: books.passed ? null : "fix-books",
    },
    {
      id: "grade",
      label: `Indicative Grade (${gradeRes.grade})`,
      labelGu: `સૂચક ગ્રેડ (${gradeRes.grade})`,
      points: gradePts,
      max: 15,
      fix: gradeRes.grade === "A" ? null : "Update books & repayment checks for Grade A",
      fixAction: gradeRes.grade === "A" ? null : "fix-books",
    },
    {
      id: "documents",
      label: `Verified Documents (${verifiedDocs}/${shg.documents.length})`,
      labelGu: `ચકાસાયેલ દસ્તાવેજો (${verifiedDocs}/${shg.documents.length})`,
      points: docsPts,
      max: 20,
      fix:
        shg.documents.length === 0 || verifiedDocs < shg.documents.length
          ? "Mark / attach pending document"
          : null,
      fixAction:
        shg.documents.length === 0 || verifiedDocs < shg.documents.length
          ? "fix-documents"
          : null,
    },
    {
      id: "consent",
      label: "Group Consent & 3-Bearer Verification",
      labelGu: "જૂથ સંમતિ અને હોદ્દેદાર ચકાસણી",
      points: consentPts,
      max: 15,
      fix:
        !hasActiveConsent || !allBearersVerified
          ? "Record group consent & bearer check"
          : null,
      fixAction: !hasActiveConsent || !allBearersVerified ? "fix-consent" : null,
    },
    {
      id: "cashflow",
      label: "Repayment Coverage from Monthly Sales",
      labelGu: "માસિક વેચાણમાંથી હપ્તાની ક્ષમતા",
      points: cashflowPts,
      max: 10,
      fix: coverageRatio < 1.25 ? "Improve sales/cost mix in Cash-flow blueprint" : null,
      fixAction: coverageRatio < 1.25 ? "open-cashflow" : null,
    },
  ];

  const score = Math.min(
    100,
    breakdown.reduce((sum, item) => sum + item.points, 0)
  );

  return { score, breakdown };
}

export type ReasonCategory =
  | "documentation"
  | "appraisal"
  | "branch-process"
  | "policy";

export interface StandardReasonCode {
  code: string;
  labelEn: string;
  labelGu: string;
  category: ReasonCategory;
}

/* Proposed standard codes */
export const REASON_CODES: StandardReasonCode[] = [
  {
    code: "DOC-QUOTE",
    labelEn: "Machinery or asset vendor quotation missing/unclear",
    labelGu: "મશીનરી અથવા સાધનનું ક્વોટેશન અધૂરું/ગેરહાજર",
    category: "documentation",
  },
  {
    code: "DOC-FSSAI",
    labelEn: "FSSAI or Udyam registration verification pending",
    labelGu: "FSSAI અથવા ઉદ્યમ નોંધણી ચકાસણી બાકી",
    category: "documentation",
  },
  {
    code: "MCP-MISMATCH",
    labelEn: "Micro Credit Plan totals do not match cost breakdown",
    labelGu: "MCP અને ખર્ચના આંકડાઓમાં તફાવત",
    category: "appraisal",
  },
  {
    code: "BUYER-PROOF",
    labelEn: "Buyer offtake or market demand evidence insufficient",
    labelGu: "ખરીદદાર અથવા બજાર માંગના પુરાવા અપૂરતા",
    category: "appraisal",
  },
  {
    code: "KYC-MEMBER-ACCOUNT",
    labelEn: "Branch asked for individual SB accounts for all members",
    labelGu: "બેંકે બધા સભ્યોના વ્યક્તિગત બચત ખાતા માંગ્યા",
    category: "policy",
  },
  {
    code: "CIBIL-MISMATCH",
    labelEn: "Prior loan or bureau record mismatch on office bearer",
    labelGu: "હોદ્દેદારના જૂના લોન/બ્યુરો રેકોર્ડમાં વિસંગતતા",
    category: "appraisal",
  },
  {
    code: "INSPECTION-DELAY",
    labelEn: "Branch field inspection pending beyond proposed SLA",
    labelGu: "બેંક શાખાની સ્થળ તપાસ નિર્ધારિત સમયથી વિલંબિત",
    category: "branch-process",
  },
  {
    code: "TICKET-BELOW-ELIGIBLE",
    labelEn: "Sanctioned limit significantly below RBI 6× corpus eligibility",
    labelGu: "મંજૂર રકમ RBI ૬× કોર્પસ પાત્રતા કરતાં ઘણી ઓછી",
    category: "policy",
  },
  {
    code: "OTHER",
    labelEn: "Other branch appraisal query or clarification",
    labelGu: "અન્ય બેંક તપાસ અથવા સ્પષ્ટતા",
    category: "branch-process",
  },
];

export interface SLAStatusResult {
  stage: string;
  elapsedDays: number;
  slaDays: number;
  daysLeft: number;
  state: "ok" | "warning" | "breached";
  label: string;
}

export function slaStatus(
  shg: SHGCase,
  stage: string = shg.stage,
  slaDays = 14
): SLAStatusResult {
  const safeSla = Math.max(1, Math.round(slaDays));
  const elapsedDays = Math.max(0, Math.round(shg.daysInStage || 0));
  const daysLeft = safeSla - elapsedDays;

  let state: "ok" | "warning" | "breached" = "ok";
  if (elapsedDays > safeSla) {
    state = "breached";
  } else if (elapsedDays >= Math.ceil(safeSla * 0.7)) {
    state = "warning";
  }

  return {
    stage,
    elapsedDays,
    slaDays: safeSla,
    daysLeft,
    state,
    label: "Proposed SLA",
  };
}

export interface RepeatLinkageResult {
  currentDose: 1 | 2 | 3;
  nextDose: 2 | 3;
  nextDoseConfig: DoseConfigEntry;
  nextEligibleAmountINR: number;
  repaymentGatePassed: boolean;
  earliestEligibleDate: string;
  isIllustrative: boolean;
}

export function repeatLinkage(shg: SHGCase): RepeatLinkageResult {
  let currentDose: 1 | 2 | 3 = shg.currentDose ?? 1;
  if (!shg.currentDose) {
    if (shg.existingDebt >= 250000) currentDose = 2;
    else if (shg.stage === "Enterprise active" && shg.corpusBalance >= 180000) currentDose = 2;
    else currentDose = 1;
  }

  const nextDose: 2 | 3 = currentDose === 1 ? 2 : 3;
  const nextCfg = DOSE_CONFIG[nextDose];
  const nextEligibleAmountINR =
    nextCfg.multiplier !== null
      ? Math.max(nextCfg.multiplier * shg.corpusBalance, nextCfg.minimumINR)
      : Math.max(nextCfg.minimumINR, shg.corpusBalance * 8);

  const repaymentGatePassed =
    Boolean(shg.panchasutraChecks.timelyRepayment) && shg.panchasutraScore >= 4;

  const isActiveOrSanctioned = ["Sanctioned", "Disbursed", "Enterprise active"].includes(
    shg.stage
  );

  const earliestEligibleDate =
    repaymentGatePassed && isActiveOrSanctioned
      ? "After 6–12 timely EMIs on current dose (Illustrative)"
      : "After current dose sanction + consistent on-time repayment (Illustrative)";

  return {
    currentDose,
    nextDose,
    nextDoseConfig: nextCfg,
    nextEligibleAmountINR,
    repaymentGatePassed,
    earliestEligibleDate,
    isIllustrative: true,
  };
}

export interface AltDataFeatureContribution {
  id: string;
  label: string;
  labelGu: string;
  source: string;
  rawSummary: string;
  weight: number;
  normalizedValue: number;
  contributionLogit: number;
  sharePct: number;
}

export interface AltDataCredibilityResult {
  credibilityScore: number;
  probabilityPct: number;
  tier: "High Credibility" | "Moderate Credibility" | "Needs More Alt-Data";
  tierGu: string;
  signals: AltDataSignals;
  features: AltDataFeatureContribution[];
  modelLabel: string;
  disclaimer: string;
  isIllustrative: true;
}

export function resolveAltDataSignals(
  shg: SHGCase,
  overrides?: Partial<AltDataSignals>
): AltDataSignals {
  const hasBuyerLedger = shg.buyerEvidence.some(
    (b) => b.evidenceType === "Monthly Supply Ledger" || b.evidenceType === "Written Purchase Order"
  );
  const hasCoopChannel = shg.buyerEvidence.some(
    (b) =>
      b.channel === "FPO / Wholesale" ||
      b.channel === "Local Retail Cooperative" ||
      b.channel === "GLPC Saras / Catalogue"
  );
  const hasUtilityHabits =
    shg.panchasutraChecks.regularMeetings && shg.panchasutraChecks.regularSavings;
  const hasGeoStage =
    shg.officeBearers.length > 0 &&
    shg.officeBearers.every((ob) => ob.verified) &&
    shg.stage !== "Demand identified";

  return {
    upiSupplierReceipts:
      overrides?.upiSupplierReceipts ??
      shg.altDataSignals?.upiSupplierReceipts ??
      hasBuyerLedger,
    dairyOrCoopSupplySync:
      overrides?.dairyOrCoopSupplySync ??
      shg.altDataSignals?.dairyOrCoopSupplySync ??
      hasCoopChannel,
    utilityAndTelecomRegularity:
      overrides?.utilityAndTelecomRegularity ??
      shg.altDataSignals?.utilityAndTelecomRegularity ??
      hasUtilityHabits,
    geoTaggedWorkshopVerified:
      overrides?.geoTaggedWorkshopVerified ??
      shg.altDataSignals?.geoTaggedWorkshopVerified ??
      hasGeoStage,
  };
}

/**
 * Illustrative explainable logistic-weighted ML credibility index utilizing
 * consent-based non-bureau alternative data (LokOS behavior, buyer/co-op supply
 * ledgers, UPI digital receipts, utility regularity & geo-verification).
 * Decision-support only — never substitutes bank appraisal or auto-approves loans.
 */
export function alternativeDataCredibility(
  shg: SHGCase,
  overrides?: Partial<AltDataSignals>
): AltDataCredibilityResult {
  const signals = resolveAltDataSignals(shg, overrides);
  const { coverageRatio } = estimateMonthlyMarginAndEmi(shg);

  const internalLendingVal =
    (shg.panchasutraChecks.internalLending ? 0.5 : 0) +
    (shg.panchasutraChecks.timelyRepayment ? 0.5 : 0);

  const debtBase = Math.max(100000, shg.corpusBalance + shg.existingDebt);
  const corpusDebtVal =
    shg.corpusBalance > 0 ? Math.min(1, shg.corpusBalance / debtBase) : 0;

  const verifiedBuyerCount = shg.buyerEvidence.filter(
    (b) => b.provenance !== "Self-declared"
  ).length;
  const buyerOfftakeVal =
    shg.buyerEvidence.length > 0
      ? Math.min(1, 0.4 + verifiedBuyerCount * 0.35 + (shg.buyerEvidence.length > 1 ? 0.2 : 0))
      : 0;

  const digitalUpiCoopVal =
    (signals.upiSupplierReceipts ? 0.55 : 0) +
    (signals.dairyOrCoopSupplySync ? 0.45 : 0);

  const cashflowResilienceVal =
    coverageRatio >= 1.5 ? 1 : coverageRatio >= 1.2 ? 0.7 : 0.3;

  const activeConsent = shg.consents.some((c) => c.status === "Active");
  const consentGeoUtilVal =
    (signals.utilityAndTelecomRegularity ? 0.4 : 0) +
    (signals.geoTaggedWorkshopVerified ? 0.35 : 0) +
    (activeConsent ? 0.25 : 0);

  const rawFeatures = [
    {
      id: "internal-lending",
      label: "Internal Lending & Recovery Velocity",
      labelGu: "આંતરિક ધિરાણ અને વસૂલાત વેગ",
      source: "LokOS Panchasutra Ledger",
      rawSummary: `${shg.panchasutraChecks.internalLending ? "Active rotation" : "Low rotation"} · ${shg.panchasutraChecks.timelyRepayment ? "Timely internal recovery" : "Recovery pending"}`,
      weight: 1.15,
      normalizedValue: internalLendingVal,
    },
    {
      id: "corpus-cushion",
      label: "Savings Corpus vs. Existing Debt Cushion",
      labelGu: "બચત કોર્પસ અને જૂના દેવાનું રક્ષણ",
      source: "SHG Savings & Corpus Ledger",
      rawSummary: `Corpus ₹${Math.round(shg.corpusBalance).toLocaleString("en-IN")} vs Debt ₹${Math.round(shg.existingDebt).toLocaleString("en-IN")}`,
      weight: 0.85,
      normalizedValue: corpusDebtVal,
    },
    {
      id: "buyer-offtake",
      label: "Buyer PO & Cooperative Supply Offtake",
      labelGu: "ખરીદદાર ઓર્ડર અને સહકારી સપ્લાય રેકોર્ડ",
      source: "Market Offtake Evidence",
      rawSummary:
        shg.buyerEvidence.length > 0
          ? `${shg.buyerEvidence.length} buyer proof(s) (${verifiedBuyerCount} verified)`
          : "No written buyer/co-op proof linked yet",
      weight: 0.95,
      normalizedValue: buyerOfftakeVal,
    },
    {
      id: "digital-upi-coop",
      label: "UPI Supplier Trail & Co-op Passbook Sync",
      labelGu: "UPI ડિજિટલ ચુકવણી અને સહકારી પાસબુક",
      source: "Consent Alt-Data Connector",
      rawSummary:
        signals.upiSupplierReceipts && signals.dairyOrCoopSupplySync
          ? "UPI receipts + Co-op supply sync active"
          : signals.upiSupplierReceipts
          ? "UPI supplier trail active"
          : signals.dairyOrCoopSupplySync
          ? "Dairy/Co-op supply sync active"
          : "Digital transaction trail not connected",
      weight: 0.9,
      normalizedValue: digitalUpiCoopVal,
    },
    {
      id: "cashflow-stability",
      label: "Seasonal Unit Margin & EMI Coverage",
      labelGu: "મોસમી આવક સ્થિરતા અને હપ્તા ક્ષમતા",
      source: "6–12m Enterprise Sales Ledger",
      rawSummary: `${coverageRatio.toFixed(2)}× estimated EMI coverage`,
      weight: 0.75,
      normalizedValue: cashflowResilienceVal,
    },
    {
      id: "consent-utility-geo",
      label: "Utility Cadence, Geo-Proof & DPDP Consent",
      labelGu: "વીજળી/મોબાઇલ નિયમિતતા અને જિયો-ચકાસણી",
      source: "Field Geo-Tag & Utility Signal",
      rawSummary: `${signals.utilityAndTelecomRegularity ? "Utility regular" : "No utility signal"} · ${signals.geoTaggedWorkshopVerified ? "Geo verified" : "Geo pending"}`,
      weight: 0.65,
      normalizedValue: consentGeoUtilVal,
    },
  ];

  const intercept = -1.65;
  const totalPositiveLogit = rawFeatures.reduce(
    (sum, f) => sum + f.weight * f.normalizedValue,
    0
  );
  const z = intercept + totalPositiveLogit;
  const prob = 1 / (1 + Math.exp(-z));
  const credibilityScore = Math.max(1, Math.min(99, Math.round(prob * 100)));

  const features: AltDataFeatureContribution[] = rawFeatures.map((f) => {
    const contributionLogit = Number((f.weight * f.normalizedValue).toFixed(3));
    const sharePct =
      totalPositiveLogit > 0
        ? Math.round((contributionLogit / totalPositiveLogit) * 100)
        : 0;
    return {
      ...f,
      contributionLogit,
      sharePct,
    };
  });

  const tier: AltDataCredibilityResult["tier"] =
    credibilityScore >= 78
      ? "High Credibility"
      : credibilityScore >= 58
      ? "Moderate Credibility"
      : "Needs More Alt-Data";

  const tierGu =
    credibilityScore >= 78
      ? "ઉચ્ચ વૈકલ્પિક વિશ્વસનીયતા"
      : credibilityScore >= 58
      ? "મધ્યમ વિશ્વસનીયતા (વધુ પુરાવા ઉમેરો)"
      : "ઓછો વૈકલ્પિક ડેટા — વધુ સંકેતો જોડો";

  return {
    credibilityScore,
    probabilityPct: credibilityScore,
    tier,
    tierGu,
    signals,
    features,
    modelLabel: "Explainable Logistic Feature Model (Illustrative ML)",
    disclaimer:
      "Illustrative ML decision-support signal using synthetic feature weights & consent-based alternative data. Not an automated loan approval or bureau score.",
    isIllustrative: true,
  };
}
