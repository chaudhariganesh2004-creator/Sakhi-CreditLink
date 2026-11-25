import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, AlertTriangle, XCircle, Shield, FileText } from "lucide-react";
import type { NavScreenId, SHGCase } from "@/data/sakhi-data";
import { getSchemeMatchesForCase } from "@/data/sakhi-data";
import { SectionHeader, GovernanceNotice } from "@/components/shared/ui-primitives";
import { cn } from "@/lib/utils";

interface Props {
  shg: SHGCase;
  onNavigate: (s: NavScreenId) => void;
}

export const SchemeMatchScreen: React.FC<Props> = ({ shg, onNavigate }) => {
  const matches = getSchemeMatchesForCase(shg);
  const [expanded, setExpanded] = useState<string | null>(matches[0]?.id ?? null);

  const statusIcon = (status: string) => {
    if (status.includes("Strong")) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    if (status.includes("Conditional")) return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-slate-400" />;
  };

  const statusBg = (status: string) => {
    if (status.includes("Strong")) return "border-emerald-200 bg-emerald-50/50";
    if (status.includes("Conditional")) return "border-amber-200 bg-amber-50/50";
    return "border-slate-200 bg-slate-50/50";
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={shg.caseCode}
        title="Scheme Match"
        subtitle={`Rule-based matching for ${shg.shgName} · ${shg.activity}`}
        rightSlot={
          <button
            onClick={() => onNavigate("offer-comparison")}
            className="group flex items-center gap-1.5 rounded-xl bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Compare Offers <ChevronRight className="h-4 w-4" />
          </button>
        }
      />

      <GovernanceNotice
        title="Transparency"
        body="Schemes are matched using versioned rules against official guidelines. All conditions and exclusions are shown for verification. No paid ranking. Banks retain full sanction authority."
        tone="neutral"
      />

      <div className="space-y-3">
        {matches.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} className={cn("rounded-2xl border overflow-hidden transition-all", statusBg(m.fitStatus))}>
              <button
                onClick={() => setExpanded(isOpen ? null : m.id)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  {statusIcon(m.fitStatus)}
                  <div>
                    <div className="text-[16px] font-bold text-[var(--sakhi-slate)]">{m.schemeName}</div>
                    <div className="mt-0.5 text-[13px] text-[var(--sakhi-muted)]">{m.instrumentType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "rounded-full border px-3 py-1 text-[12px] font-semibold",
                    m.fitStatus.includes("Strong") ? "border-emerald-200 bg-emerald-100 text-emerald-700" :
                    m.fitStatus.includes("Conditional") ? "border-amber-200 bg-amber-100 text-amber-700" :
                    "border-slate-200 bg-slate-100 text-slate-600"
                  )}>
                    {m.fitStatus}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-[var(--sakhi-muted)] transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-[var(--sakhi-border)]/50 p-5 space-y-5 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
                  {m.indicativeEligibilityAmount && (
                    <div className="rounded-xl bg-white/80 border border-[var(--sakhi-border)] p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">Indicative Eligibility</div>
                      <div className="mt-1 text-[15px] font-semibold text-[var(--sakhi-slate)]">{m.indicativeEligibilityAmount}</div>
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
                      <XCircle className="h-4 w-4" /> Exclusions
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/80 border border-[var(--sakhi-border)] p-4">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--sakhi-slate)] mb-2">
                        <FileText className="h-4 w-4" /> Required Documents
                      </div>
                      <ul className="space-y-1">
                        {m.requiredDocuments.map((d, i) => (
                          <li key={i} className="text-[13px] text-[var(--sakhi-muted)]">• {d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-[var(--sakhi-border)] p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--sakhi-slate)]">
                        <Shield className="h-4 w-4" /> Source & Version
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
