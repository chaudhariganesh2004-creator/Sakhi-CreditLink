import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Scale,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { AppLanguage, NavScreenId, SHGCase } from "@/data/sakhi-data";
import {
  REASON_CODES,
  RBI_FIRST_DOSE_CITATION,
  alternativeDataCredibility,
  booksCheck,
  drawingPowerFirstDose,
  estimateMonthlyMarginAndEmi,
  getCaseExternalNeed,
  indicativeGrade,
  readinessScore,
  slaStatus,
  ticketGap,
} from "@/lib/access-engine";
import { StageChip } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { Card, Field, SectionHeader, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface BankBranchQueueScreenProps {
  cases: SHGCase[];
  activeCaseId: string;
  language: AppLanguage;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onUpdateCase: (updated: SHGCase) => void;
  onNavigate: (screen: NavScreenId) => void;
}

type QueueFilter = "all" | "action-needed" | "sla-risk" | "decided";

const DecisionPanel: React.FC<{
  shg: SHGCase;
  slaDays: number;
  language: AppLanguage;
  onSelectCase: (caseId: string, navigateTo?: NavScreenId) => void;
  onUpdateCase: (updated: SHGCase) => void;
}> = ({ shg, slaDays, language, onSelectCase, onUpdateCase }) => {
  const isGu = language === "gu";
  const requestedINR = getCaseExternalNeed(shg);
  const eligibleINR = drawingPowerFirstDose(shg.corpusBalance);
  const gap = ticketGap(requestedINR, eligibleINR);
  const readiness = readinessScore(shg);
  const altCred = alternativeDataCredibility(shg);
  const books = booksCheck(shg);
  const grade = indicativeGrade(shg);
  const sla = slaStatus(shg, shg.stage, slaDays);
  const cashflow = estimateMonthlyMarginAndEmi(shg);

  const capexTotal = shg.costLines
    .filter((c) => c.category === "Capex")
    .reduce((sum, c) => sum + c.amount, 0);
  const wcTotal = shg.costLines
    .filter((c) => c.category === "Working Capital")
    .reduce((sum, c) => sum + c.amount, 0);

  const [decisionMode, setDecisionMode] = useState<"approve" | "query" | "reject">("approve");
  const [sanctionAmount, setSanctionAmount] = useState<number>(requestedINR);
  const [reasonCode, setReasonCode] = useState<string>(REASON_CODES[0].code);
  const [note, setNote] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const selectedReasonObj = REASON_CODES.find((r) => r.code === reasonCode) ?? REASON_CODES[0];

  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    const nowLabel = "Just now (Simulated)";

    if (decisionMode === "approve") {
      const amount = Math.max(0, Math.round(sanctionAmount) || requestedINR);
      const decisionNote =
        note.trim() || `Sanctioned ${formatINR(amount)} via Bank Branch Appraisal Queue`;
      onUpdateCase({
        ...shg,
        stage: "Sanctioned",
        daysInStage: 0,
        bottleneckReason: undefined,
        branchDecision: {
          status: "Approved",
          sanctionedAmountINR: amount,
          note: decisionNote,
          decidedAt: nowLabel,
        },
        timeline: [
          {
            id: `ev-branch-${Date.now()}`,
            stage: "Sanctioned",
            actor: `${shg.linkedBranch} (Simulated)`,
            timestamp: nowLabel,
            note: decisionNote,
          },
          ...shg.timeline,
        ],
      });
      setFeedback(`Sanctioned ${formatINR(amount)} for ${shg.shgName}.`);
      setNote("");
      return;
    }

    if (decisionMode === "query") {
      const queryText =
        note.trim() ||
        `${selectedReasonObj.code}: ${selectedReasonObj.labelEn}`;
      onUpdateCase({
        ...shg,
        bottleneckReason: `[${selectedReasonObj.code}] ${selectedReasonObj.labelEn}`,
        branchDecision: {
          status: "Query Raised",
          reasonCode: selectedReasonObj.code,
          note: queryText,
          decidedAt: nowLabel,
        },
        queries: [
          {
            id: `bq-${Date.now()}`,
            raisedBy: shg.linkedBranch,
            raisedOn: "Today",
            reasonCode: selectedReasonObj.code,
            question: queryText,
            status: "Open",
          },
          ...shg.queries,
        ],
        timeline: [
          {
            id: `ev-query-${Date.now()}`,
            stage: shg.stage,
            actor: `${shg.linkedBranch} (Simulated)`,
            timestamp: nowLabel,
            note: `Query raised [${selectedReasonObj.code}]: ${queryText}`,
          },
          ...shg.timeline,
        ],
      });
      setFeedback(`Query [${selectedReasonObj.code}] logged to SHG & District analytics.`);
      setNote("");
      return;
    }

    // Reject with mandatory standardized reason code
    const rejectReason =
      note.trim() ||
      `Rejected under ${selectedReasonObj.code}: ${selectedReasonObj.labelEn}`;
    onUpdateCase({
      ...shg,
      bottleneckReason: `Rejected [${selectedReasonObj.code}]: ${selectedReasonObj.labelEn}`,
      branchDecision: {
        status: "Rejected",
        reasonCode: selectedReasonObj.code,
        note: rejectReason,
        decidedAt: nowLabel,
      },
      timeline: [
        {
          id: `ev-reject-${Date.now()}`,
          stage: shg.stage,
          actor: `${shg.linkedBranch} (Simulated)`,
          timestamp: nowLabel,
          note: `Rejected [${selectedReasonObj.code}]: ${rejectReason}`,
        },
        ...shg.timeline,
      ],
    });
    setFeedback(`Rejection [${selectedReasonObj.code}] recorded and synced to District analytics.`);
    setNote("");
  };

  const decisionChipTone =
    shg.branchDecision?.status === "Approved" || shg.stage === "Sanctioned" || shg.stage === "Disbursed"
      ? "success"
      : shg.branchDecision?.status === "Rejected"
      ? "danger"
      : shg.branchDecision?.status === "Query Raised"
      ? "warning"
      : "info";

  const slaTone =
    sla.state === "ok" ? "success" : sla.state === "warning" ? "warning" : "danger";

  return (
    <Card className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-[20px] font-semibold text-[#141A23]">
              {isGu ? shg.shgNameGu : shg.shgName}
            </h2>
            <StageChip stage={shg.stage} />
            <StatusChip tone={decisionChipTone}>
              {shg.branchDecision?.status ??
                (shg.stage === "Sanctioned" || shg.stage === "Disbursed"
                  ? "Approved"
                  : "Pending Appraisal")}
            </StatusChip>
          </div>
          <div className="mt-1 text-[12.5px] text-[#475467]">
            <span className="font-mono">{shg.caseCode}</span> · {shg.linkedBranch} · {shg.village},{" "}
            {shg.district}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusChip tone={slaTone} icon={<Clock className="h-3.5 w-3.5" />}>
            {sla.elapsedDays}d / {sla.slaDays}d ({sla.label})
          </StatusChip>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelectCase(shg.id, "application-pack")}
          >
            <FileText className="h-3.5 w-3.5" />
            Open Full Pack / MCP
          </Button>
        </div>
      </div>

      {/* 1-Click Appraisal Summary Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
            Readiness &amp; Panchasutra
          </div>
          <div className="mt-1 font-mono text-[20px] font-semibold text-[#141A23] tabular-nums">
            {readiness.score}/100
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#475467]">
            Panchasutra {shg.panchasutraScore}/5 · Grade {grade.grade} (Indicative)
          </div>
        </div>

        <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#047857]">
            RBI 6× Drawing Power
          </div>
          <div className="mt-1 font-mono text-[20px] font-semibold text-[#047857] tabular-nums">
            {formatINR(eligibleINR)}
          </div>
          <div className="mt-0.5 text-[11px] text-[#047857]">
            max(6× {formatINR(shg.corpusBalance)}, ₹1.5L) · {RBI_FIRST_DOSE_CITATION}
          </div>
        </div>

        <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
            Requested vs Capex/WC
          </div>
          <div className="mt-1 font-mono text-[20px] font-semibold text-[#141A23] tabular-nums">
            {formatINR(requestedINR)}
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#475467]">
            Capex {formatINR(capexTotal)} · WC {formatINR(wcTotal)}
          </div>
        </div>

        <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
            Post-Loan DSCR &amp; Books
          </div>
          <div className="mt-1 font-mono text-[20px] font-semibold text-[#0F5E4E] tabular-nums">
            {cashflow.coverageRatio.toFixed(2)}×
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#475467]">
            6-Mo Books: {books.recordedMonths}/6 ({books.passed ? "Pass" : "Short"}) ·{" "}
            {shg.buyerEvidence.length} buyer proof(s)
          </div>
        </div>
      </div>

      {/* Appraisal Notes: Indicative grade disclaimer + ticket gap notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#DFDBD0] bg-[#F2EFE8] px-3.5 py-2 text-[12px] text-[#475467]">
        <span>
          <Scale className="mr-1.5 inline h-3.5 w-3.5 text-[#0F5E4E]" />
          {grade.disclaimer}
        </span>
        <span className="font-mono text-[#0F5E4E] font-semibold">
          Alt-Data ML Signal: {altCred.credibilityScore}/100 ({altCred.tier} · Illustrative)
        </span>
        {gap.isUnderEligible && (
          <span className="font-medium text-[#B45309]">
            Requested is {gap.gapPct}% below RBI 6× eligibility ({formatINR(gap.gapINR)} headroom)
          </span>
        )}
      </div>

      {/* Active Open Queries */}
      {shg.queries.some((q) => q.status === "Open") && (
        <div className="space-y-2">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[#475467]">
            Open Branch Queries ({shg.queries.filter((q) => q.status === "Open").length})
          </div>
          {shg.queries
            .filter((q) => q.status === "Open")
            .map((q) => (
              <div
                key={q.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-2.5 text-[12.5px]"
              >
                <div>
                  {q.reasonCode && (
                    <span className="mr-2 rounded bg-[#FEF3C7] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#92400E]">
                      {q.reasonCode}
                    </span>
                  )}
                  <span className="text-[#141A23]">{q.question}</span>
                </div>
                <span className="text-[11px] text-[#475467]">{q.raisedOn}</span>
              </div>
            ))}
        </div>
      )}

      {/* Simulated Branch Decision Console */}
      <form
        onSubmit={handleSubmitDecision}
        className="space-y-4 rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[13.5px] font-semibold text-[#141A23]">
            Branch Appraisal Decision (Simulated Workflow)
          </div>
          <span className="text-[11.5px] text-[#475467]">
            Standard codes: Proposed standard codes · Authority stays with lending bank
          </span>
        </div>

        {/* Decision Mode Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDecisionMode("approve")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
              decisionMode === "approve"
                ? "border-[#047857] bg-[#ECFDF5] text-[#047857]"
                : "border-[#DFDBD0] bg-white text-[#475467] hover:bg-[#F2EFE8]"
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            Sanction / Approve
          </button>
          <button
            type="button"
            onClick={() => setDecisionMode("query")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
              decisionMode === "query"
                ? "border-[#B45309] bg-[#FFFBEB] text-[#B45309]"
                : "border-[#DFDBD0] bg-white text-[#475467] hover:bg-[#F2EFE8]"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            Raise Query
          </button>
          <button
            type="button"
            onClick={() => setDecisionMode("reject")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
              decisionMode === "reject"
                ? "border-[#B91C1C] bg-[#FEF2F2] text-[#B91C1C]"
                : "border-[#DFDBD0] bg-white text-[#475467] hover:bg-[#F2EFE8]"
            )}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>

        {decisionMode === "approve" ? (
          <div className="grid gap-3 sm:grid-cols-12">
            <Field
              htmlFor="sanction-amount"
              label="Sanction Limit (₹)"
              hint={`RBI 6× ceiling: ${formatINR(eligibleINR)}`}
              className="sm:col-span-4"
            >
              <input
                id="sanction-amount"
                type="number"
                min={10000}
                step={5000}
                value={sanctionAmount}
                onChange={(e) => setSanctionAmount(Number(e.target.value) || 0)}
                className="min-h-[42px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 font-mono text-[14px] font-semibold text-[#141A23] tabular-nums"
              />
            </Field>
            <Field
              htmlFor="decision-note"
              label="Sanction Note (Optional)"
              className="sm:col-span-8"
            >
              <input
                id="decision-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Approved under DAY-NRLM SHG Term+CCL subject to machinery invoice"
                className="min-h-[42px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-12">
              <Field
                htmlFor="reason-code-select"
                label="Standardized Reason Code (Proposed standard codes)"
                className="sm:col-span-6"
              >
                <select
                  id="reason-code-select"
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="min-h-[42px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13px]"
                >
                  {REASON_CODES.map((rc) => (
                    <option key={rc.code} value={rc.code}>
                      {rc.code} — {isGu ? rc.labelGu : rc.labelEn}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                htmlFor="reason-note"
                label={decisionMode === "query" ? "Query Details for Bank Sakhi" : "Rejection Remarks"}
                className="sm:col-span-6"
              >
                <input
                  id="reason-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={selectedReasonObj.labelEn}
                  className="min-h-[42px] w-full rounded-md border border-[#C9C3B4] bg-white px-3 text-[13.5px]"
                />
              </Field>
            </div>

            {reasonCode === "KYC-MEMBER-ACCOUNT" && (
              <div className="flex items-start gap-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-2.5 text-[12.5px] text-[#92400E]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <strong>RBI Policy Guardrail:</strong> Opening individual savings accounts for
                  all members is not a prerequisite for SHG credit linkage under RBI SHG-BLP norms.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {feedback ? (
            <span className="text-[12.5px] font-medium text-[#047857]">{feedback}</span>
          ) : (
            <span className="text-[12px] text-[#475467]">
              Actions update SHG timeline &amp; District Target-vs-Access analytics immediately.
            </span>
          )}

          <Button
            type="submit"
            variant={decisionMode === "reject" ? "destructive" : "primary"}
          >
            {decisionMode === "approve"
              ? "Confirm Sanction (Simulated)"
              : decisionMode === "query"
              ? `Log Query [${reasonCode}]`
              : `Confirm Reject [${reasonCode}]`}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const BankBranchQueueScreen: React.FC<BankBranchQueueScreenProps> = ({
  cases,
  activeCaseId,
  language,
  onSelectCase,
  onUpdateCase,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [slaDays, setSlaDays] = useState<number>(14);
  const [selectedId, setSelectedId] = useState<string>(activeCaseId || cases[0]?.id || "");

  const enrichedSorted = useMemo(() => {
    return [...cases]
      .map((c) => ({
        c,
        score: readinessScore(c).score,
        sla: slaStatus(c, c.stage, slaDays),
        requestedINR: getCaseExternalNeed(c),
        eligibleINR: drawingPowerFirstDose(c.corpusBalance),
      }))
      .sort((a, b) => {
        // Put breached/warning SLA or open pending ahead, then highest readiness
        const aUrgent = a.sla.state === "breached" ? 2 : a.sla.state === "warning" ? 1 : 0;
        const bUrgent = b.sla.state === "breached" ? 2 : b.sla.state === "warning" ? 1 : 0;
        if (bUrgent !== aUrgent) return bUrgent - aUrgent;
        return b.score - a.score;
      });
  }, [cases, slaDays]);

  const filtered = useMemo(() => {
    return enrichedSorted.filter(({ c, sla }) => {
      if (filter === "sla-risk") return sla.state === "breached" || sla.state === "warning";
      if (filter === "decided") return Boolean(c.branchDecision);
      if (filter === "action-needed") {
        return !c.branchDecision || c.branchDecision.status === "Query Raised";
      }
      return true;
    });
  }, [enrichedSorted, filter]);

  const selectedCase =
    cases.find((c) => c.id === selectedId) ?? filtered[0]?.c ?? cases[0];

  const handlePickCase = (caseId: string) => {
    setSelectedId(caseId);
    onSelectCase(caseId);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Bank Branch Appraisal Workspace"
        title="Branch Appraisal Queue & Decisions"
        subtitle="Prioritised SHG credit packs with 1-click RBI 6× verification, DSCR check, and standardized Query/Reject codes."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <SimulatedBadge />
            <label className="flex items-center gap-1.5 rounded-md border border-[#DFDBD0] bg-white px-2.5 py-1.5 text-[12px] text-[#475467]">
              <span>Proposed SLA (configurable):</span>
              <select
                value={slaDays}
                onChange={(e) => setSlaDays(Number(e.target.value))}
                className="font-mono font-semibold text-[#141A23] bg-transparent focus:outline-none"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
              </select>
            </label>
            <Button variant="secondary" size="sm" onClick={() => onNavigate("offer-comparison")}>
              Product Terms
            </Button>
          </div>
        }
      />

      {/* Filter strip */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "all", label: `All Packs (${cases.length})` },
            { id: "action-needed", label: "Needs Branch Decision" },
            { id: "sla-risk", label: "SLA Warning / Breached" },
            { id: "decided", label: "Decided" },
          ] as { id: QueueFilter; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              filter === tab.id
                ? "border-[#0F5E4E] bg-[#0F5E4E] text-white"
                : "border-[#DFDBD0] bg-white text-[#475467] hover:bg-[#F2EFE8]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Queue List */}
        <Card className="overflow-hidden lg:col-span-5 self-start">
          <div className="flex items-center justify-between border-b border-[#DFDBD0] bg-[#F2EFE8] px-4 py-3">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold text-[#141A23]">
              <Building2 className="h-4 w-4 text-[#0F5E4E]" />
              <span>Queued SHG Packs</span>
            </div>
            <span className="font-mono text-[12px] text-[#475467]">{filtered.length} shown</span>
          </div>

          <div className="divide-y divide-[#DFDBD0]">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#475467]">
                No packs match this filter.
              </div>
            ) : (
              filtered.map(({ c, score, sla, requestedINR, eligibleINR }) => {
                const isSelected = selectedCase?.id === c.id;
                const slaBadgeTone =
                  sla.state === "breached"
                    ? "danger"
                    : sla.state === "warning"
                    ? "warning"
                    : "success";
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handlePickCase(c.id)}
                    className={cn(
                      "w-full px-4 py-3.5 text-left transition-colors",
                      isSelected
                        ? "bg-[#ECFDF5] border-l-4 border-l-[#0F5E4E]"
                        : "bg-white hover:bg-[#FAF8F4]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[14px] text-[#141A23]">
                          {c.shgName}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[#475467]">
                          {c.linkedBranch}
                        </div>
                      </div>
                      <StatusChip tone={slaBadgeTone}>
                        {sla.elapsedDays}d / {sla.slaDays}d
                      </StatusChip>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px]">
                      <div className="flex items-center gap-2">
                        <StageChip stage={c.stage} />
                        {c.branchDecision && (
                          <span className="font-medium text-[#141A23]">
                            · {c.branchDecision.status}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[#141A23] tabular-nums">
                        {formatINR(requestedINR)}{" "}
                        <span className="text-[#475467]">
                          (6×: {formatINR(eligibleINR)}) · {score}%
                        </span>
                      </div>
                    </div>

                    {sla.state === "breached" && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-[#B91C1C]">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Proposed SLA exceeded ({Math.abs(sla.daysLeft)}d overdue)
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Right: 1-Click Appraisal & Decision Drawer */}
        <div className="lg:col-span-7">
          {selectedCase && (
            <DecisionPanel
              key={selectedCase.id}
              shg={selectedCase}
              slaDays={slaDays}
              language={language}
              onSelectCase={onSelectCase}
              onUpdateCase={onUpdateCase}
            />
          )}
        </div>
      </div>
    </div>
  );
};
