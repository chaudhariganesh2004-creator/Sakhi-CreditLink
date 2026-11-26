import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { getDemoOffersForCase, getSchemeMatchesForCase } from "@/data/sakhi-data";
import { SectionHeader, GovernanceNotice } from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  selectedLenderId: string;
  onSelectLender: (offerId: string) => void;
  onNavigate: (s: NavScreenId) => void;
}

export const SchemeMatchScreen: React.FC<Props> = ({
  shg,
  selectedLenderId,
  onSelectLender,
  onNavigate,
}) => {
  const matches = useMemo(() => getSchemeMatchesForCase(shg), [shg]);
  const offers = useMemo(() => getDemoOffersForCase(shg), [shg]);
  const [filter, setFilter] = useState<"all" | "glpc" | "matched">("all");
  const [expanded, setExpanded] = useState<string | null>(matches[0]?.id ?? null);
  const [applyingSchemeId, setApplyingSchemeId] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    if (filter === "glpc") return matches.filter((m) => m.isGlpcCore);
    if (filter === "matched") return matches.filter((m) => !m.fitStatus.includes("Excluded"));
    return matches;
  }, [matches, filter]);

  const absoluteCount = matches.filter((m) => m.fitStatus === "Absolute Match" || m.fitStatus.includes("Strong")).length;
  const nearCount = matches.filter((m) => m.fitStatus.includes("Near Match")).length;
  const glpcCount = matches.filter((m) => m.isGlpcCore && !m.fitStatus.includes("Excluded")).length;

  const statusIcon = (status: string) => {
    if (status === "Absolute Match" || status.includes("Strong")) return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    if (status.includes("Near Match") || status.includes("Conditional")) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-slate-400" />;
  };

  const statusBg = (status: string) => {
    if (status === "Absolute Match" || status.includes("Strong")) return "border-emerald-200 bg-emerald-50/45";
    if (status.includes("Near Match") || status.includes("Conditional")) return "border-amber-200 bg-amber-50/45";
    return "border-slate-200 bg-slate-50/45 opacity-80";
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
      <SectionHeader
        eyebrow={`Gujarat & GLPC Scheme Engine · ${shg.caseCode}`}
        title="Deep Scheme Eligibility & Matching"
        subtitle={`Analysed ${matches.length} Gujarat State, GLPC Mission Mangalam & Central schemes for ${shg.shgName}, ranked from Absolute Match to Excluded.`}
        rightSlot={
          <button
            onClick={() => onNavigate("offer-comparison")}
            className="group flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Compare Offers <ChevronRight className="h-4 w-4" />
          </button>
        }
      />

      {/* Summary & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl ios-glass p-4">
        <div className="flex flex-wrap items-center gap-3 text-[13px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> {absoluteCount} Strong / Absolute Matches
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">
            {nearCount} Near Matches
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sakhi-mint)] px-3 py-1 font-semibold text-[var(--sakhi-forest)]">
            {glpcCount} Active GLPC Schemes
          </span>
        </div>

        <div className="flex items-center rounded-xl border border-[var(--sakhi-border)] bg-white p-1 text-[12.5px]">
          {[
            { id: "all", label: `All (${matches.length})` },
            { id: "glpc", label: "GLPC Focus" },
            { id: "matched", label: "Eligible Only" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "all" | "glpc" | "matched")}
              className={cn(
                "rounded-lg px-3 py-1.5 font-semibold transition-all",
                filter === tab.id
                  ? "bg-[var(--sakhi-forest)] text-white"
                  : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <GovernanceNotice
        title="Rule-Engine Transparency"
        body="Every Gujarat State & GLPC scheme is evaluated rule-by-rule against SHG profile, Panchasutra score, Capex/WC split, and unit economics. Exclusions and conditions are surfaced upfront."
        tone="neutral"
      />

      <div className="space-y-3">
        {filteredMatches.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} className={cn("rounded-2xl border overflow-hidden transition-all", statusBg(m.fitStatus))}>
              <button
                onClick={() => setExpanded(isOpen ? null : m.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">{statusIcon(m.fitStatus)}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[16px] font-bold text-[var(--sakhi-slate)]">{m.schemeName}</span>
                      {m.isGlpcCore && (
                        <span className="rounded-full bg-[var(--sakhi-forest)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          GLPC Core
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[12.5px] text-[var(--sakhi-muted)]">
                      {m.agency} · {m.instrumentType}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <div className="font-mono text-[13px] font-bold text-[var(--sakhi-slate)]">{m.matchScore}%</div>
                    <div className="text-[10.5px] text-[var(--sakhi-muted)]">Match</div>
                  </div>
                  <span className={cn(
                    "rounded-full border px-3 py-1 text-[12px] font-semibold whitespace-nowrap",
                    m.fitStatus === "Absolute Match" || m.fitStatus.includes("Strong")
                      ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                      : m.fitStatus.includes("Near") || m.fitStatus.includes("Conditional")
                      ? "border-amber-200 bg-amber-100 text-amber-800"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  )}>
                    {m.fitStatus}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-[var(--sakhi-muted)] transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[var(--sakhi-border)]/60 p-5 space-y-5 animate-fade-in-up" style={{ animationDuration: "0.25s" }}>
                  {/* Rule-by-rule eligibility checklist */}
                  <div>
                    <div className="text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)] mb-2.5">
                      Eligibility Rule Check
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {m.eligibilityChecklist.map((chk, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2 text-[12.5px] font-medium",
                            chk.passed
                              ? "border-emerald-200 bg-white text-emerald-800"
                              : "border-red-200 bg-red-50/70 text-red-700"
                          )}
                        >
                          {chk.passed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                          )}
                          <span>{chk.rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {m.indicativeEligibilityAmount && (
                    <div className="rounded-xl bg-white/90 border border-[var(--sakhi-border)] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Indicative Eligibility &amp; Benefit</div>
                      <div className="mt-1 text-[14.5px] font-semibold text-[var(--sakhi-slate)]">{m.indicativeEligibilityAmount}</div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-700 mb-2">
                      <CheckCircle2 className="h-4 w-4" /> Why Matched
                    </div>
                    <ul className="space-y-1.5">
                      {m.whyMatched.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--sakhi-muted)]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-amber-700 mb-2">
                      <AlertTriangle className="h-4 w-4" /> Conditions to Verify
                    </div>
                    <ul className="space-y-1.5">
                      {m.conditionsToVerify.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--sakhi-muted)]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-red-600 mb-2">
                      <XCircle className="h-4 w-4" /> Exclusions &amp; Boundaries
                    </div>
                    <ul className="space-y-1.5">
                      {m.exclusions.map((e, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--sakhi-muted)]">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply & Choose Bank Flow for Absolute / Strong Matches */}
                  {(m.fitStatus === "Absolute Match" || m.fitStatus.includes("Strong")) && (
                    <div className="rounded-2xl border border-[var(--sakhi-forest)]/25 bg-white p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-[13.5px] font-bold text-[var(--sakhi-slate)]">
                            Ready to apply under {m.schemeName}
                          </div>
                          <div className="text-[12px] text-[var(--sakhi-muted)]">
                            Choose your preferred regulated bank to assemble the application dossier.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setApplyingSchemeId(applyingSchemeId === m.id ? null : m.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-[var(--sakhi-forest-deep)]"
                        >
                          {applyingSchemeId === m.id ? "Hide Bank Options" : "Apply & Choose Bank →"}
                        </button>
                      </div>

                      {applyingSchemeId === m.id && (
                        <div className="space-y-3 border-t border-[var(--sakhi-border)] pt-4">
                          <div className="text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
                            Select Bank Branch (Alphabetical · Unbiased)
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {offers.map((off) => {
                              const isSelected = selectedLenderId === off.id;
                              return (
                                <button
                                  key={off.id}
                                  type="button"
                                  onClick={() => onSelectLender(off.id)}
                                  className={cn(
                                    "rounded-xl border p-3.5 text-left transition-all",
                                    isSelected
                                      ? "border-[var(--sakhi-forest)] bg-[var(--sakhi-mint)]/55 ring-1 ring-[var(--sakhi-forest)]/20"
                                      : "border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] hover:bg-white"
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[13.5px] font-bold text-[var(--sakhi-slate)]">
                                      {off.lenderName.replace(" (DEMO)", "")}
                                    </span>
                                    {isSelected && (
                                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--sakhi-forest)]" />
                                    )}
                                  </div>
                                  <div className="mt-1 text-[11.5px] text-[var(--sakhi-muted)]">
                                    {off.branchOrChannel}
                                  </div>
                                  <div className="mt-2 font-mono text-[12.5px] font-bold text-[var(--sakhi-forest)]">
                                    Est. EMI: {formatINR(off.estimatedMonthlyInstalmentINR)}/mo
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => onNavigate("application-pack")}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-[var(--sakhi-forest-deep)]"
                            >
                              Proceed to Application Pack <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/90 border border-[var(--sakhi-border)] p-4">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--sakhi-slate)] mb-2">
                        <FileText className="h-4 w-4" /> Required Documents
                      </div>
                      <ul className="space-y-1">
                        {m.requiredDocuments.map((d, i) => (
                          <li key={i} className="text-[13px] text-[var(--sakhi-muted)]">• {d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white/90 border border-[var(--sakhi-border)] p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--sakhi-slate)]">
                        <Shield className="h-4 w-4" /> Source &amp; Version
                      </div>
                      <div className="text-[12px] text-[var(--sakhi-muted)]">{m.sourceAnchor}</div>
                      <div className="text-[12px] text-[var(--sakhi-muted)]">Rule: {m.ruleVersion} · Verified: {m.lastVerifiedDate}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
