import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck,
  MessageSquare,
  Printer,
  Send,
} from "lucide-react";
import {
  getDemoOffersForCase,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import {
  GovernanceNotice,
  SectionHeader,
  StageChip,
  TaskStatusChip,
} from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface ApplicationPackProps {
  shg: SHGCase;
  role: UserRole;
  selectedLenderId: string;
  onUpdateCase: (updated: SHGCase) => void;
}

export const ApplicationPackScreen: React.FC<ApplicationPackProps> = ({
  shg,
  role,
  selectedLenderId,
  onUpdateCase,
}) => {
  const [packPrepared, setPackPrepared] = useState(false);
  const [newQueryText, setNewQueryText] = useState("");
  const [showPackModal, setShowPackModal] = useState(false);

  const offers = getDemoOffersForCase(shg);
  const chosenOffer = offers.find((o) => o.id === selectedLenderId) ?? offers[0];

  const verifiedDocsCount = shg.documents.filter((d) => d.status === "Verified").length;
  const missingDocs = shg.documents.filter((d) => d.status === "Missing");
  const openQueries = shg.queries.filter((q) => q.status === "Open");

  const capex = shg.costLines
    .filter((c) => c.category === "Capex")
    .reduce((s, c) => s + c.amount, 0);
  const wc = shg.costLines
    .filter((c) => c.category === "Working Capital")
    .reduce((s, c) => s + c.amount, 0);
  const externalNeed = Math.max(0, capex + wc - shg.ownContribution);

  const handlePreparePack = () => {
    setPackPrepared(true);
    onUpdateCase({
      ...shg,
      stage: missingDocs.length === 0 ? "Pack complete" : shg.stage,
      timeline: [
        {
          id: `ev-${Date.now()}`,
          stage: "Pack prepared (Internal)",
          actor: `Assisted Workspace (${role})`,
          timestamp: "26 Nov 2026 · Just now",
          note: `Prepared downloadable dossier for ${chosenOffer.lenderName.replace(" (DEMO)", "")}. Official submission remains manual/authorised branch handoff.`,
        },
        ...shg.timeline,
      ],
    });
  };

  const handleDownloadPack = () => {
    const payload = {
      disclaimer: "ILLUSTRATIVE APPLICATION PACK — NOT A LIVE BANK SUBMISSION OR SANCTION",
      caseCode: shg.caseCode,
      shgName: shg.shgName,
      lokosId: shg.lokosId,
      district: shg.district,
      block: shg.block,
      selectedRoute: chosenOffer.lenderName.replace(" (DEMO)", "") + " — " + chosenOffer.productName.replace(" (Illustrative)", ""),
      capitalSummary: {
        capexINR: capex,
        workingCapitalINR: wc,
        totalProjectCostINR: capex + wc,
        ownContributionINR: shg.ownContribution,
        indicativeExternalNeedINR: externalNeed,
      },
      documents: shg.documents.map((d) => ({ name: d.name, status: d.status, provenance: d.provenance })),
      consentsActive: shg.consents.filter((c) => c.status === "Active"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shg.caseCode}-application-pack.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRaiseQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQueryText.trim()) return;
    onUpdateCase({
      ...shg,
      queries: [
        {
          id: `qry-${Date.now()}`,
          raisedBy: role === "bank-officer" ? "Branch Appraisal Officer" : "Pre-Pack Reviewer",
          raisedOn: "26 Nov 2026",
          question: newQueryText.trim(),
          status: "Open",
        },
        ...shg.queries,
      ],
    });
    setNewQueryText("");
  };

  const resolveQuery = (qid: string) => {
    onUpdateCase({
      ...shg,
      queries: shg.queries.map((q) =>
        q.id === qid
          ? {
              ...q,
              status: "Resolved",
              response: "Supporting evidence verified by Bank Sakhi & attached to dossier.",
            }
          : q
      ),
    });
  };

  return (
    <div className="space-y-6 " >
      <SectionHeader
        eyebrow={`Application Pack · ${shg.caseCode}`}
        title="Application Pack & Timeline"
        subtitle="Assemble lender-specific dossiers with completeness checks, query resolution, and ownership history."
        rightSlot={<StageChip stage={shg.stage} />}
      />

      <GovernanceNotice
        title="Branch Handoff Boundary"
        body="Sakhi CreditLink prepares a complete downloadable dossier for submission by the SHG or Bank Sakhi at the branch or authorised portal. Banks retain full sanction authority."
        tone="neutral"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Target Dossier & Completeness */}
        <section className="lg:col-span-7 rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--sakhi-border)] pb-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
                Target Submission Dossier
              </div>
              <h2 className="mt-1 font-serif font-semibold text-[24px] text-[var(--sakhi-slate)]">
                {chosenOffer.lenderName.replace(" (DEMO)", "")}
              </h2>
              <p className="mt-0.5 text-[13.5px] text-[var(--sakhi-muted)]">
                {chosenOffer.productName.replace(" (Illustrative)", "")} · Indicative Need{" "}
                <strong className="font-mono text-[var(--sakhi-forest)]">{formatINR(externalNeed)}</strong>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold",
                  packPrepared
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                {packPrepared ? "Pack Prepared" : "Pre-Check Drafting"}
              </span>
              <span className="text-[11.5px] text-[var(--sakhi-muted)]">
                Awaiting branch handoff
              </span>
            </div>
          </div>

          {/* Completeness Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--sakhi-slate)]">
              <span className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[var(--sakhi-forest)]" />
                Pre-Submission Completeness Check
              </span>
              <span className="font-mono text-[12px] text-[var(--sakhi-muted)]">
                {verifiedDocsCount}/{shg.documents.length} verified docs · {openQueries.length} open queries
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-4 py-3 text-[13px]">
                <span className="text-[var(--sakhi-slate)]">1. Capex &amp; Working Capital separated in Blueprint</span>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Complete
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-4 py-3 text-[13px]">
                <span className="text-[var(--sakhi-slate)]">2. Purpose-specific SHG Consent Record active</span>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> {shg.consents.filter((c) => c.status === "Active").length} Active
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-4 py-3 text-[13px]">
                <span className="text-[var(--sakhi-slate)]">3. Mandatory Documents Verified</span>
                {missingDocs.length === 0 ? (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> All Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-600">
                    <AlertTriangle className="h-4 w-4" /> {missingDocs.length} Missing ({missingDocs[0].name})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--sakhi-border)] pt-4">
            <button
              onClick={handlePreparePack}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--sakhi-forest)] px-5 py-2.5 text-[13px] font-semibold text-white  transition-all hover:bg-[var(--sakhi-forest-deep)]"
            >
              <FileCheck className="h-4 w-4" /> Prepare Handoff Pack
            </button>
            <button
              onClick={() => setShowPackModal(!showPackModal)}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--sakhi-border)] bg-white px-4 py-2.5 text-[13px] font-medium text-[var(--sakhi-slate)] transition-colors hover:bg-[var(--sakhi-surface)]"
            >
              {showPackModal ? "Hide Preview" : "Preview Summary"}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--sakhi-border)] bg-white px-4 py-2.5 text-[13px] font-medium text-[var(--sakhi-slate)] transition-colors hover:bg-[var(--sakhi-surface)] no-print"
            >
              <Printer className="h-4 w-4 text-[var(--sakhi-forest)]" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadPack}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--sakhi-border)] bg-white px-4 py-2.5 text-[13px] font-medium text-[var(--sakhi-slate)] transition-colors hover:bg-[var(--sakhi-surface)] no-print"
            >
              <Download className="h-4 w-4 text-[var(--sakhi-forest)]" /> Download JSON
            </button>
          </div>

          {showPackModal && (
            <div className="rounded-lg border border-[var(--sakhi-forest)]/20 bg-[var(--sakhi-mint)]/30 p-5 text-[13px] space-y-2">
              <div className="flex items-center justify-between border-b border-[var(--sakhi-border)] pb-2.5">
                <span className="font-mono text-[11px] font-semibold text-[var(--sakhi-forest)]">
                  DOSSIER PREVIEW · {shg.caseCode}
                </span>
                <span className="font-mono text-[11px] text-[var(--sakhi-muted)]">
                  Assisted by {shg.bankSakhiName}
                </span>
              </div>
              <p className="text-[var(--sakhi-slate)]">
                <strong>Applicant:</strong> {shg.shgName} ({shg.membersCount} members, {shg.village})
              </p>
              <p className="text-[var(--sakhi-slate)]">
                <strong>Capital Split:</strong> Capex {formatINR(capex)} + Working Capital{" "}
                {formatINR(wc)} = Total {formatINR(capex + wc)} · Contribution{" "}
                {formatINR(shg.ownContribution)} · External Request{" "}
                <strong className="text-[var(--sakhi-forest)]">{formatINR(externalNeed)}</strong>
              </p>
              <p className="text-[12px] text-[var(--sakhi-muted)]">
                For official submission by SHG / Bank Sakhi at {chosenOffer.branchOrChannel}.
              </p>
            </div>
          )}
        </section>

        {/* Case Timeline */}
        <section className="lg:col-span-5 rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <h2 className="border-b border-[var(--sakhi-border)] pb-3.5 text-[16px] font-bold text-[var(--sakhi-slate)]">
            Case Timeline &amp; Ownership
          </h2>
          <ol className="relative ml-2.5 space-y-5 border-l-2 border-[var(--sakhi-border)] pl-5">
            {shg.timeline.map((ev) => (
              <li key={ev.id} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[var(--sakhi-forest)]" />
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-semibold text-[var(--sakhi-slate)]">{ev.stage}</span>
                  <span className="font-mono text-[11px] text-[var(--sakhi-muted)]">{ev.timestamp}</span>
                </div>
                <div className="text-[12px] font-medium text-[var(--sakhi-forest)]">{ev.actor}</div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sakhi-muted)]">{ev.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Queries & Open Tasks Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-[15px] font-bold text-[var(--sakhi-slate)]">
            <MessageSquare className="h-4 w-4 text-amber-600" />
            Appraisal &amp; Pre-Pack Queries
          </h2>
          <div className="space-y-3">
            {shg.queries.length === 0 ? (
              <p className="text-[13px] text-[var(--sakhi-muted)]">No queries raised on this case.</p>
            ) : (
              shg.queries.map((q) => (
                <div key={q.id} className="rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 text-[13px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--sakhi-slate)]">{q.raisedBy}</span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        q.status === "Resolved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[var(--sakhi-slate)]">{q.question}</p>
                  {q.response && (
                    <p className="mt-2.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-[12.5px] text-emerald-800">
                      <strong>Resolution:</strong> {q.response}
                    </p>
                  )}
                  {q.status === "Open" && (
                    <button
                      onClick={() => resolveQuery(q.id)}
                      className="mt-2.5 text-[12px] font-semibold text-[var(--sakhi-forest)] hover:underline"
                    >
                      Mark Query Resolved →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleRaiseQuery} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newQueryText}
              onChange={(e) => setNewQueryText(e.target.value)}
              placeholder="Raise clarification or query..."
              className="h-10 flex-1 rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--sakhi-forest-deep)]"
            >
              <Send className="h-3.5 w-3.5" /> Log
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-[var(--sakhi-border)] bg-white p-6 space-y-4">
          <h2 className="text-[15px] font-bold text-[var(--sakhi-slate)]">
            Assigned Action Tasks
          </h2>
          <div className="space-y-2.5">
            {shg.tasks.length === 0 ? (
              <p className="text-[13px] text-[var(--sakhi-muted)]">No pending tasks assigned.</p>
            ) : (
              shg.tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 text-[13px]"
                >
                  <div>
                    <div className="font-medium text-[var(--sakhi-slate)]">{t.title}</div>
                    <div className="mt-1 text-[12px] text-[var(--sakhi-muted)]">
                      Owner: {t.owner} · Due: {t.dueDate}
                    </div>
                  </div>
                  <TaskStatusChip status={t.status} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
