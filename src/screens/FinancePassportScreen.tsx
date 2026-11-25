import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  Lock,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import type {
  AppLanguage,
  NavScreenId,
  SHGCase,
  UserRole,
} from "@/data/sakhi-data";
import {
  GovernanceNotice,
  ProvenanceBadge,
  SectionHeader,
} from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  role: UserRole;
  language: AppLanguage;
  onUpdateCase: (c: SHGCase) => void;
  onNavigate: (s: NavScreenId) => void;
}

export const FinancePassportScreen: React.FC<Props> = ({
  shg,
  language,
  onNavigate,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("identity");
  const showGu = language === "en-gu";
  const totalCost = shg.costLines.reduce((s, c) => s + c.amount, 0);
  const externalNeed = totalCost - shg.ownContribution;

  const toggle = (section: string) => setExpandedSection(expandedSection === section ? null : section);

  const docsByCategory = shg.documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof shg.documents>);

  const sections = [
    {
      id: "identity",
      title: "SHG Identity & Governance",
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--sakhi-surface)] p-4 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Group Details</div>
              {[
                ["Name", showGu ? `${shg.shgName} (${shg.shgNameGu})` : shg.shgName],
                ["Activity", showGu ? `${shg.activity} (${shg.activityGu})` : shg.activity],
                ["Location", `${shg.village}, ${shg.block}, ${shg.district}`],
                ["LokOS ID", shg.lokosId],
                ["Formation", String(shg.formationYear)],
                ["Members", String(shg.membersCount)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[var(--sakhi-muted)]">{label}</span>
                  <span className="font-medium text-[var(--sakhi-slate)] text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-[var(--sakhi-surface)] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Office Bearers</div>
                <div className="mt-3 space-y-2.5">
                  {shg.officeBearers.map((ob) => (
                    <div key={ob.name} className="flex items-center justify-between text-[13px]">
                      <div>
                        <span className="font-medium text-[var(--sakhi-slate)]">{ob.name}</span>
                        <span className="ml-2 text-[var(--sakhi-muted)]">{ob.role}</span>
                      </div>
                      {ob.verified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--sakhi-surface)] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Bank Sakhi</div>
                <div className="mt-2 text-[14px] font-semibold text-[var(--sakhi-slate)]">{shg.bankSakhiName}</div>
                <div className="text-[13px] text-[var(--sakhi-muted)]">{shg.linkedBranch}</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "panchasutra",
      title: "Panchasutra Compliance",
      icon: ShieldCheck,
      content: (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--sakhi-forest)]">
              <span className="font-display text-[28px] text-white">{shg.panchasutraScore}/5</span>
            </div>
            <div>
              <div className="text-[16px] font-bold text-[var(--sakhi-slate)]">
                {shg.panchasutraScore === 5 ? "Full Compliance" : `${shg.panchasutraScore} of 5 criteria met`}
              </div>
              <div className="text-[13px] text-[var(--sakhi-muted)]">DAY-NRLM Panchasutra Assessment</div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { key: "regularMeetings", label: "Regular Meetings" },
              { key: "regularSavings", label: "Regular Savings" },
              { key: "internalLending", label: "Internal Lending" },
              { key: "timelyRepayment", label: "Timely Repayment" },
              { key: "updatedBooks", label: "Updated Books" },
            ].map((p) => {
              const met = shg.panchasutraChecks[p.key as keyof typeof shg.panchasutraChecks];
              return (
                <div
                  key={p.key}
                  className={cn(
                    "rounded-xl border p-4 text-center",
                    met ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
                  )}
                >
                  {met ? (
                    <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500" />
                  ) : (
                    <XCircle className="mx-auto h-6 w-6 text-amber-500" />
                  )}
                  <div className={cn("mt-2 text-[12px] font-semibold", met ? "text-emerald-700" : "text-amber-700")}>
                    {p.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-[var(--sakhi-surface)] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Existing Debt</div>
              <div className="mt-1 text-[20px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(shg.existingDebt)}</div>
            </div>
            <div className="rounded-xl bg-[var(--sakhi-surface)] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Savings / Member</div>
              <div className="mt-1 text-[20px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(shg.monthlySavingsPerMember)}/mo</div>
            </div>
            <div className="rounded-xl bg-[var(--sakhi-surface)] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Corpus Balance</div>
              <div className="mt-1 text-[20px] font-bold text-[var(--sakhi-forest)] tabular-nums">{formatINR(shg.corpusBalance)}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "documents",
      title: "Document Checklist",
      icon: FileCheck2,
      content: (
        <div className="space-y-5">
          {Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category}>
              <div className="text-[12px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)] mb-3">{category}</div>
              <div className="space-y-2">
                {docs.map((doc) => {
                  const statusColors: Record<string, string> = {
                    Verified: "text-emerald-600 bg-emerald-50 border-emerald-200",
                    "Uploaded — Pending Check": "text-amber-600 bg-amber-50 border-amber-200",
                    Missing: "text-red-600 bg-red-50 border-red-200",
                    Expired: "text-slate-500 bg-slate-50 border-slate-200",
                  };
                  return (
                    <div key={doc.id} className="flex items-center justify-between rounded-xl border border-[var(--sakhi-border)] bg-white p-3.5">
                      <div className="flex items-center gap-3">
                        {doc.status === "Verified" ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        ) : doc.status === "Missing" ? (
                          <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                        ) : (
                          <FileCheck2 className="h-5 w-5 shrink-0 text-amber-400" />
                        )}
                        <div>
                          <div className="text-[14px] font-medium text-[var(--sakhi-slate)]">
                            {showGu ? doc.nameGu : doc.name}
                          </div>
                          <div className="text-[12px] text-[var(--sakhi-muted)]">Updated: {doc.updatedAt}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProvenanceBadge level={doc.provenance} />
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", statusColors[doc.status])}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "consent",
      title: "Purpose-Specific Consent",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <GovernanceNotice
            title="Consent Policy"
            body="Only purpose-specific consent records are captured. No blanket data sharing. SHG leader can revoke at any time."
            tone="neutral"
          />
          {shg.consents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-8 text-center text-[14px] text-[var(--sakhi-muted)]">
              No consent records yet. Consent will be captured during the finance planning stage.
            </div>
          ) : (
            shg.consents.map((con) => (
              <div key={con.id} className="rounded-xl border border-[var(--sakhi-border)] bg-white p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="text-[15px] font-semibold text-[var(--sakhi-slate)]">{con.purpose}</div>
                  <span className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    con.status === "Active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
                  )}>
                    {con.status}
                  </span>
                </div>
                <div className="grid gap-2 text-[13px] sm:grid-cols-2">
                  <div><span className="text-[var(--sakhi-muted)]">Recipient:</span> <span className="font-medium text-[var(--sakhi-slate)]">{con.recipient}</span></div>
                  <div><span className="text-[var(--sakhi-muted)]">Scope:</span> <span className="font-medium text-[var(--sakhi-slate)]">{con.scope}</span></div>
                  <div><span className="text-[var(--sakhi-muted)]">Granted:</span> <span className="font-medium text-[var(--sakhi-slate)]">{con.grantedOn}</span></div>
                  <div><span className="text-[var(--sakhi-muted)]">Expires:</span> <span className="font-medium text-[var(--sakhi-slate)]">{con.expiresOn}</span></div>
                </div>
                <div className="text-[12px] text-[var(--sakhi-muted)]">
                  Granted by: {con.grantedBy}
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Finance Passport"
        subtitle={`${shg.shgName} · ${shg.activity} · ${shg.block}, ${shg.district}`}
        rightSlot={
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--sakhi-forest)] px-4 py-2 text-center">
              <div className="text-[24px] font-bold text-white tabular-nums">{shg.readinessScore}%</div>
              <div className="text-[11px] font-medium text-white/70">Ready</div>
            </div>
            <button
              onClick={() => onNavigate("credit-demand")}
              className="group flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[var(--sakhi-forest-deep)]"
            >
              Credit Demand <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {/* Quick overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Total Cost</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(totalCost)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Own Contribution</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{formatINR(shg.ownContribution)}</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">External Need</div>
          <div className="mt-2 text-[24px] font-bold text-emerald-700 tabular-nums">{formatINR(externalNeed)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Timeline</div>
          <div className="mt-2 text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">{shg.timelineMonths} mo</div>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = expandedSection === section.id;
          return (
            <div key={section.id} className="rounded-2xl border border-[var(--sakhi-border)] bg-white overflow-hidden">
              <button
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[var(--sakhi-surface)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sakhi-surface)]">
                    <Icon className="h-5 w-5 text-[var(--sakhi-forest)]" />
                  </div>
                  <span className="text-[16px] font-bold text-[var(--sakhi-slate)]">{section.title}</span>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-[var(--sakhi-muted)] transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="border-t border-[var(--sakhi-border)] p-5 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
