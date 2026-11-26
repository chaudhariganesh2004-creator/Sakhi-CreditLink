import React from "react";
import { CheckCircle2, ChevronRight, Scale } from "lucide-react";
import {
  getDemoOffersForCase,
  type NavScreenId,
  type SHGCase,
} from "@/data/sakhi-data";
import {
  GovernanceNotice,
  SectionHeader,
} from "@/components/shared/ui-primitives";
import { cn, formatINR } from "@/lib/utils";

interface OfferComparisonProps {
  shg: SHGCase;
  selectedLenderId: string;
  onSelectLender: (offerId: string) => void;
  onNavigate: (screen: NavScreenId) => void;
}

export const OfferComparisonScreen: React.FC<OfferComparisonProps> = ({
  shg,
  selectedLenderId,
  onSelectLender,
  onNavigate,
}) => {
  const offers = getDemoOffersForCase(shg);

  return (
    <div className="space-y-6 " >
      <SectionHeader
        eyebrow={`Offer Comparison · ${shg.caseCode}`}
        title="Regulated Lender Terms"
        subtitle="Alphabetical, unbiased comparison of SHG credit linkage products with standardized KFS fields."
        rightSlot={
          <button
            onClick={() => onNavigate("application-pack")}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 py-2.5 text-[13px] font-semibold text-white  transition-all hover:bg-[var(--sakhi-forest-deep)]"
          >
            Build Application Pack <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        }
      />

      <GovernanceNotice
        title="RBI Fair-Lending Disclosure"
        body="Products are ordered alphabetically with zero paid ranking. Disbursal and repayment occur strictly between the SHG and the sanctioning Regulated Entity."
        tone="neutral"
      />

      {/* Side-by-side Aligned Comparison Matrix */}
      <div className="overflow-hidden rounded-lg border border-[var(--sakhi-border)] bg-white ">
        <div className="flex items-center justify-between border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-6 py-4">
          <div className="flex items-center gap-2.5 text-[15px] font-bold text-[var(--sakhi-slate)]">
            <Scale className="h-4 w-4 text-[var(--sakhi-forest)]" />
            <span>Side-by-Side Terms Matrix</span>
          </div>
          <span className="rounded-full border border-[var(--sakhi-border)] bg-white px-3 py-1 text-[11px] font-medium text-[var(--sakhi-muted)]">
            Alphabetical Order · {offers.length} Lenders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]/60 text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
              <tr>
                <th className="w-48 px-6 py-4">Comparison Field</th>
                {offers.map((off) => {
                  const isSelected = selectedLenderId === off.id;
                  return (
                    <th
                      key={off.id}
                      className={cn(
                        "min-w-[230px] px-5 py-4 transition-colors",
                        isSelected && "bg-[var(--sakhi-mint)]/40"
                      )}
                    >
                      <div className="text-[14px] font-bold normal-case text-[var(--sakhi-slate)]">
                        {off.lenderName.replace(" (DEMO)", "")}
                      </div>
                      <div className="mt-0.5 text-[12px] font-normal normal-case text-[var(--sakhi-muted)]">
                        {off.branchOrChannel}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sakhi-border)]">
              {[
                { label: "Product Name", render: (o: typeof offers[0]) => <span className="font-medium text-[var(--sakhi-slate)]">{o.productName.replace(" (Illustrative)", "")}</span> },
                { label: "Borrower Type", render: (o: typeof offers[0]) => <span className="text-[var(--sakhi-muted)]">{o.borrowerType}</span> },
                { label: "Indicative Amount", highlight: true, render: (o: typeof offers[0]) => <span className="font-mono font-bold tabular-nums text-[var(--sakhi-forest)]">{formatINR(o.indicativeAmountINR)}</span> },
                { label: "Tenor", render: (o: typeof offers[0]) => <span className="font-mono tabular-nums text-[var(--sakhi-slate)]">{o.tenorMonths} months</span> },
                { label: "APR / Interest Basis", render: (o: typeof offers[0]) => <span className="text-[12.5px] text-[var(--sakhi-slate)]">{o.aprBasis}</span> },
                { label: "Est. Monthly Instalment", highlight: true, render: (o: typeof offers[0]) => <span className="font-mono font-bold tabular-nums text-[var(--sakhi-slate)]">{formatINR(o.estimatedMonthlyInstalmentINR)} / mo</span> },
                { label: "Processing & Fees", render: (o: typeof offers[0]) => <span className="text-[12.5px] text-[var(--sakhi-muted)]">{o.processingFee}</span> },
                { label: "Penal Charges", render: (o: typeof offers[0]) => <span className="text-[12.5px] text-[var(--sakhi-muted)]">{o.penalChargeBasis}</span> },
                { label: "Security / Margin", render: (o: typeof offers[0]) => <span className="text-[12.5px] text-[var(--sakhi-muted)]">{o.securityMargin}</span> },
                {
                  label: "KFS & Source Date",
                  render: (o: typeof offers[0]) => (
                    <div className="text-[12px] text-[var(--sakhi-muted)]">
                      <div>{o.kfsStatus}</div>
                      <div className="mt-1 font-mono text-[11px]">{o.sourceDate}</div>
                    </div>
                  ),
                },
              ].map((row) => (
                <tr key={row.label} className={row.highlight ? "bg-[var(--sakhi-surface)]/50" : undefined}>
                  <td className="px-6 py-3.5 font-medium text-[var(--sakhi-muted)]">{row.label}</td>
                  {offers.map((o) => (
                    <td
                      key={o.id}
                      className={cn(
                        "px-5 py-3.5 transition-colors",
                        selectedLenderId === o.id && "bg-[var(--sakhi-mint)]/20"
                      )}
                    >
                      {row.render(o)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-[var(--sakhi-surface)]">
                <td className="px-6 py-4 font-semibold text-[var(--sakhi-slate)]">Borrower Selection</td>
                {offers.map((o) => {
                  const selected = selectedLenderId === o.id;
                  return (
                    <td
                      key={o.id}
                      className={cn(
                        "px-5 py-4 transition-colors",
                        selected && "bg-[var(--sakhi-mint)]/30"
                      )}
                    >
                      <button
                        onClick={() => onSelectLender(o.id)}
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all",
                          selected
                            ? "bg-[var(--sakhi-forest)] text-white "
                            : "border border-[var(--sakhi-border)] bg-white text-[var(--sakhi-slate)] hover:border-[var(--sakhi-forest)]/30 hover:bg-[var(--sakhi-mint)]/30"
                        )}
                      >
                        {selected ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Selected for Pack
                          </>
                        ) : (
                          "Choose for Application Pack"
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
