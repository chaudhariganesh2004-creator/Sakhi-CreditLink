import React, { useEffect } from "react";
import { AlertTriangle, Printer, ShieldCheck, X } from "lucide-react";
import {
  EXCHANGE_SHGS,
  OPPORTUNITY_SIMULATED_NOTICE,
} from "@/data/opportunityExchangeData";
import { useOpportunityExchange } from "@/context/OpportunityExchangeContext";
import {
  computeCollectivePlan,
  computeFinancingMetrics,
} from "@/lib/opportunity-engine";
import { Button } from "@/components/ui/button";
import { SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { formatINR } from "@/lib/utils";

export const FinancingProposalModal: React.FC = () => {
  const {
    selectedOpportunity,
    selectedShgIds,
    networkBuilt,
    leadCoordinatorId,
    productionCostINR,
    availableCapitalINR,
    proposalModalOpen,
    closeProposalModal,
  } = useOpportunityExchange();

  useEffect(() => {
    if (!proposalModalOpen) return;
    document.body.classList.add("printing-proposal");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProposalModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("printing-proposal");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [proposalModalOpen, closeProposalModal]);

  if (!proposalModalOpen) return null;

  const poolShgs = EXCHANGE_SHGS.filter(
    (s) => s.category === selectedOpportunity.category
  );
  const plan = computeCollectivePlan(selectedOpportunity, poolShgs, selectedShgIds);
  const metrics = computeFinancingMetrics(
    productionCostINR,
    availableCapitalINR,
    selectedOpportunity.budgetINR
  );

  const leadGroup =
    poolShgs.find((s) => s.id === leadCoordinatorId) ??
    plan.allocations[0]?.shg ??
    poolShgs[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#141A23]/55 p-3 sm:p-6 print:static print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div className="my-4 w-full max-w-4xl rounded-lg border border-[#C9C3B4] bg-white shadow-[0_12px_32px_rgba(20,26,35,0.2)] print:my-0 print:border-0 print:shadow-none">
        {/* Top Modal Action Bar (hidden when printing) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDBD0] bg-[#F2EFE8] px-5 py-3.5 rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[14px] text-[#141A23]">
              Demand-Backed SHG Financing Proposal Preview
            </span>
            <SimulatedBadge label="Simulated demonstration data" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print / Download PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeProposalModal}
              aria-label="Close proposal preview"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-8 space-y-6 text-[#141A23]">
          {/* Prominent Watermark / Demonstration Banner */}
          <div className="flex items-start gap-2.5 rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] font-semibold text-[#92400E]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
            <span>{OPPORTUNITY_SIMULATED_NOTICE}</span>
          </div>

          {/* Masthead */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DFDBD0] pb-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/sakhi-logo.jpg"
                alt="Sakhi CreditLink"
                width={42}
                height={42}
                className="h-10 w-10 rounded-md border border-[#DFDBD0] object-contain p-0.5"
              />
              <div>
                <h2
                  id="proposal-modal-title"
                  className="font-serif text-[22px] font-semibold text-[#141A23]"
                >
                  Sakhi Opportunity Exchange · Collective Credit Proposal
                </h2>
                <p className="text-[12.5px] text-[#475467]">
                  Demand-Backed SHG Working Capital &amp; Order Fulfilment Dossier (PS000311)
                </p>
              </div>
            </div>
            <div className="text-right text-[12px] text-[#475467] font-mono">
              <div>Proposal Ref: SOE-{selectedOpportunity.id.toUpperCase()}</div>
              <div>Draft Status: For Bank &amp; Group Review</div>
            </div>
          </div>

          {/* Buyer & Requirement Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                Buyer &amp; Market Opportunity (Simulated)
              </div>
              <div className="text-[15.5px] font-semibold text-[#141A23]">
                {selectedOpportunity.buyerName}
              </div>
              <div className="text-[13px] text-[#141A23]">
                Product: <strong>{selectedOpportunity.productName}</strong>
              </div>
              <div className="text-[12.5px] text-[#475467]">
                Order Volume:{" "}
                <strong className="font-mono text-[#141A23]">
                  {selectedOpportunity.quantity.toLocaleString("en-IN")}{" "}
                  {selectedOpportunity.unitLabel}
                </strong>{" "}
                · Delivery Window:{" "}
                <strong className="font-mono text-[#141A23]">
                  {selectedOpportunity.deadlineDays} days
                </strong>
              </div>
              <div className="text-[12.5px] text-[#475467]">
                Location: {selectedOpportunity.location}
              </div>
            </div>

            <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                Cluster Coordination &amp; Readiness
              </div>
              <div className="text-[14px] font-semibold text-[#141A23]">
                Lead Group: {leadGroup?.name ?? "Cluster Coordinator"}
              </div>
              <div className="text-[12.5px] text-[#475467]">
                Participating SHGs:{" "}
                <strong className="font-mono text-[#141A23]">
                  {plan.allocations.length}
                </strong>{" "}
                · Combined Capacity:{" "}
                <strong className="font-mono text-[#0F5E4E]">
                  {plan.combinedCapacity.toLocaleString("en-IN")}{" "}
                  {selectedOpportunity.unitLabel}
                </strong>
              </div>
              <div className="pt-1">
                <StatusChip tone={plan.isFullyCovered ? "success" : "warning"}>
                  {networkBuilt ? "Network Built · " : ""}
                  {plan.statusLabel}
                </StatusChip>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Strip */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475467] mb-2.5">
              Order Economics &amp; Credit Requirement (Simulated)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-md border border-[#DFDBD0] bg-white p-3">
                <div className="text-[11px] text-[#475467]">Total Project Cost</div>
                <div className="mt-1 font-mono text-[16px] font-bold text-[#141A23] tabular-nums">
                  {formatINR(metrics.totalCostINR)}
                </div>
              </div>
              <div className="rounded-md border border-[#DFDBD0] bg-white p-3">
                <div className="text-[11px] text-[#475467]">SHG Working Capital</div>
                <div className="mt-1 font-mono text-[16px] font-bold text-[#141A23] tabular-nums">
                  {formatINR(metrics.availableWorkingCapitalINR)}
                </div>
              </div>
              <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3">
                <div className="text-[11px] font-semibold text-[#92400E]">
                  Required Funding Gap
                </div>
                <div className="mt-1 font-mono text-[16px] font-bold text-[#B45309] tabular-nums">
                  {formatINR(metrics.requiredFundingINR)}
                </div>
              </div>
              <div className="rounded-md border border-[#DFDBD0] bg-white p-3">
                <div className="text-[11px] text-[#475467]">Expected Revenue</div>
                <div className="mt-1 font-mono text-[16px] font-bold text-[#141A23] tabular-nums">
                  {formatINR(metrics.expectedRevenueINR)}
                </div>
              </div>
              <div className="rounded-md border border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="text-[11px] font-semibold text-[#047857]">
                  Expected Net Margin
                </div>
                <div className="mt-1 font-mono text-[16px] font-bold text-[#047857] tabular-nums">
                  {formatINR(metrics.expectedNetMarginINR)} ({metrics.marginPct}%)
                </div>
              </div>
            </div>
          </div>

          {/* Collective Production Split Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#475467]">
                Collective Production &amp; Revenue Allocation Plan
              </h3>
              <span className="text-[11.5px] font-medium text-[#B45309]">
                Draft for group discussion
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[#DFDBD0]">
              <table className="w-full text-left text-[12.5px]">
                <thead className="border-b border-[#DFDBD0] bg-[#F2EFE8] text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                  <tr>
                    <th className="px-4 py-2.5">SHG Partner</th>
                    <th className="px-3 py-2.5">Shared Resource</th>
                    <th className="px-3 py-2.5 text-right">Allocated Units</th>
                    <th className="px-3 py-2.5 text-right">Order Share</th>
                    <th className="px-4 py-2.5 text-right">Proportional Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE8DE] tabular-nums">
                  {plan.allocations.map((row) => (
                    <tr key={row.shg.id}>
                      <td className="px-4 py-2.5 font-semibold text-[#141A23]">
                        {row.shg.name}
                        {row.shg.id === leadGroup?.id && (
                          <span className="ml-1.5 rounded bg-[#ECFDF5] px-1.5 py-0.5 text-[10px] font-semibold text-[#047857]">
                            Lead
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[#475467]">
                        {row.shg.sharedResourceRole}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold">
                        {row.allocatedUnits.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono">
                        {row.sharePct}%
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-[#0F5E4E]">
                        {formatINR(row.revenueShareINR)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DFDBD0] pt-4 text-[11.5px] text-[#475467]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#0F5E4E]" />
              Final credit eligibility, sanction, and disbursement remain strictly with authorised lending institutions.
            </span>
            <span>Repayment Capacity: {metrics.repaymentStatus} ({metrics.repaymentCapacityRatio}× cover)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
