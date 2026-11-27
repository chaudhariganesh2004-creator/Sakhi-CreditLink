import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { EXCHANGE_SHGS } from "@/data/opportunityExchangeData";
import { useOpportunityExchange } from "@/context/OpportunityExchangeContext";
import {
  DEFAULT_MATCH_WEIGHTS,
  computeCollectivePlan,
  computeFinancingMetrics,
  normalizeMatchWeights,
  scoreShgMatches,
  type MatchWeights,
} from "@/lib/opportunity-engine";
import { ConsultancyLayerSection } from "@/components/exchange/ConsultancyLayerSection";
import { Button } from "@/components/ui/button";
import { Card, Field, SectionHeader, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface OpportunityDiscoveryScreenProps {
  onProceedToCollective: () => void;
}

export const OpportunityDiscoveryScreen: React.FC<OpportunityDiscoveryScreenProps> = ({
  onProceedToCollective,
}) => {
  const {
    opportunities,
    selectedOpportunity,
    hasExplicitSelection,
    selectOpportunity,
    matchesRevealed,
    revealMatches,
    weights,
    setWeights,
    selectedShgIds,
    productionCostINR,
    setProductionCostINR,
    availableCapitalINR,
    setAvailableCapitalINR,
    openProposalModal,
  } = useOpportunityExchange();

  const [expandedShgId, setExpandedShgId] = useState<string | null>(null);
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);

  const normalizedWeights = useMemo(() => normalizeMatchWeights(weights), [weights]);

  const scoredMatches = useMemo(
    () => scoreShgMatches(selectedOpportunity, EXCHANGE_SHGS, weights),
    [selectedOpportunity, weights]
  );

  const poolShgs = useMemo(
    () => EXCHANGE_SHGS.filter((s) => s.category === selectedOpportunity.category),
    [selectedOpportunity.category]
  );

  const collectivePlan = useMemo(
    () => computeCollectivePlan(selectedOpportunity, poolShgs, selectedShgIds),
    [selectedOpportunity, poolShgs, selectedShgIds]
  );

  const financing = useMemo(
    () =>
      computeFinancingMetrics(
        productionCostINR,
        availableCapitalINR,
        selectedOpportunity.budgetINR
      ),
    [productionCostINR, availableCapitalINR, selectedOpportunity.budgetINR]
  );

  const handleWeightSlider = (key: keyof MatchWeights, value: number) => {
    setWeights({
      ...weights,
      [key]: Math.max(0, Math.min(100, value)),
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Sakhi Opportunity Exchange · Step 1"
        title="Buyer Opportunity Discovery & SHG Matching"
        subtitle="Select an open buyer order, run transparent rule-based SHG matching, and calculate demand-backed working-capital financing."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <SimulatedBadge label="Simulated demonstration data" />
            <Button
              variant="primary"
              disabled={!hasExplicitSelection}
              onClick={revealMatches}
            >
              <Search className="h-4 w-4" />
              Find Suitable SHGs
            </Button>
          </div>
        }
      />

      {/* Buyer Opportunity Cards */}
      <section aria-label="Buyer opportunities" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-[#141A23]">
            1. Select a Buyer Opportunity (Simulated Market Orders)
          </h2>
          {!hasExplicitSelection && (
            <span className="text-[12px] font-medium text-[#B45309]">
              Click any card below to unlock SHG matching &amp; financial calculator
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {opportunities.map((opp) => {
            const isSelected = hasExplicitSelection && selectedOpportunity.id === opp.id;
            return (
              <button
                key={opp.id}
                type="button"
                onClick={() => selectOpportunity(opp.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col justify-between rounded-lg border p-5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]",
                  isSelected
                    ? "border-[#0F5E4E] bg-[#ECFDF5] ring-1 ring-[#0F5E4E]"
                    : "border-[#DFDBD0] bg-white hover:border-[#0F5E4E] hover:bg-[#FAF8F4]"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
                      Status: {opp.status}
                    </span>
                    <span className="rounded bg-[#F2EFE8] px-2 py-0.5 text-[10.5px] font-medium text-[#475467]">
                      Simulated demonstration data
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#475467]">
                      <Building2 className="h-3.5 w-3.5 text-[#0F5E4E]" />
                      <span>{opp.buyerName}</span>
                    </div>
                    <h3 className="mt-1 font-serif text-[19px] font-semibold text-[#141A23]">
                      {opp.productName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 rounded-md border border-[#DFDBD0] bg-white p-3 text-[12.5px]">
                    <div>
                      <div className="text-[11px] text-[#475467]">Order Quantity</div>
                      <div className="font-mono font-bold text-[#141A23] tabular-nums">
                        {opp.quantity.toLocaleString("en-IN")} {opp.unitLabel}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#475467]">Buyer Budget</div>
                      <div className="font-mono font-bold text-[#0F5E4E] tabular-nums">
                        {formatINR(opp.budgetINR)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#DFDBD0] pt-3 text-[12px] text-[#475467]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#0F5E4E]" />
                    {opp.location}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#141A23]">
                    <Clock className="h-3.5 w-3.5 text-[#B45309]" />
                    {opp.deadlineDays} days
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Prompt CTA bar when selected but matching not yet clicked */}
      {hasExplicitSelection && !matchesRevealed && (
        <Card className="border-[#A7F3D0] bg-[#ECFDF5] p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[14.5px] font-semibold text-[#141A23]">
              Selected: {selectedOpportunity.buyerName} —{" "}
              {selectedOpportunity.quantity.toLocaleString("en-IN")}{" "}
              {selectedOpportunity.productName}
            </div>
            <p className="text-[12.5px] text-[#475467]">
              Click <strong>Find Suitable SHGs</strong> to score matching Sakhi Mandals and unlock the Financing Calculator.
            </p>
          </div>
          <Button variant="primary" onClick={revealMatches}>
            <Search className="h-4 w-4" />
            Find Suitable SHGs
          </Button>
        </Card>
      )}

      {/* Unlocked Matching & Financial Calculator Section */}
      {hasExplicitSelection && matchesRevealed && (
        <>
          {/* SHG Matching Section */}
          <Card className="p-5 md:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-[#141A23]">
                    2. Suitable SHGs Matched for {selectedOpportunity.productName} ({scoredMatches.length} Groups)
                  </h2>
                  <SimulatedBadge label="Simulated demonstration data" />
                </div>
                <p className="mt-1 text-[12.5px] text-[#475467]">
                  Transparent rule-based scoring — Product ({normalizedWeights.product}%), Capacity ({normalizedWeights.capacity}%), Location ({normalizedWeights.location}%), Delivery ({normalizedWeights.delivery}%).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowWeightSliders((v) => !v)}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Adjust Scoring Weights
                </Button>
                <Button variant="primary" size="sm" onClick={onProceedToCollective}>
                  Proceed to Collective Production
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Optional Auto-Normalizing Weight Sliders */}
            {showWeightSliders && (
              <div className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[12.5px] font-semibold text-[#141A23]">
                    Customize Matching Weights (Auto-normalized to 100%)
                  </span>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => setWeights({ ...DEFAULT_MATCH_WEIGHTS })}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset 40/30/15/15
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      { key: "product", label: "Product Compatibility" },
                      { key: "capacity", label: "Capacity Fit" },
                      { key: "location", label: "Location / Distance" },
                      { key: "delivery", label: "Delivery Feasibility" },
                    ] as { key: keyof MatchWeights; label: string }[]
                  ).map((item) => (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between text-[12px]">
                        <span className="font-medium text-[#141A23]">{item.label}</span>
                        <span className="font-mono font-bold text-[#0F5E4E]">
                          {normalizedWeights[item.key]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={80}
                        value={weights[item.key]}
                        onChange={(e) =>
                          handleWeightSlider(item.key, Number(e.target.value))
                        }
                        aria-label={`${item.label} weight`}
                        className="w-full accent-[#0F5E4E]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched SHG List */}
            <div className="space-y-3">
              {scoredMatches.map(({ shg, matchPct, breakdown }) => {
                const isExpanded = expandedShgId === shg.id;
                return (
                  <div
                    key={shg.id}
                    className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[15px] text-[#141A23]">
                            {shg.name}
                          </span>
                          <StatusChip tone={matchPct >= 88 ? "success" : "info"}>
                            Match: {matchPct}%
                          </StatusChip>
                        </div>
                        <div className="mt-1 text-[12.5px] text-[#475467]">
                          {shg.location} ({shg.distanceKm} km) · {shg.productExpertise}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-left sm:text-right">
                          <div className="text-[11px] text-[#475467]">Available Capacity</div>
                          <div className="font-mono text-[14px] font-bold text-[#141A23] tabular-nums">
                            {shg.availableCapacity.toLocaleString("en-IN")}{" "}
                            {selectedOpportunity.unitLabel}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-[11px] text-[#475467]">Working Capital</div>
                          <div className="font-mono text-[14px] font-bold text-[#0F5E4E] tabular-nums">
                            {formatINR(shg.workingCapitalINR)}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setExpandedShgId(isExpanded ? null : shg.id)
                          }
                          aria-expanded={isExpanded}
                        >
                          Why this match?
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 grid gap-2.5 border-t border-[#DFDBD0] pt-3 sm:grid-cols-2 lg:grid-cols-4">
                        {breakdown.map((b) => (
                          <div
                            key={b.key}
                            className="rounded-md border border-[#DFDBD0] bg-white p-3 text-[12px]"
                          >
                            <div className="flex items-center justify-between font-semibold text-[#141A23]">
                              <span>
                                {b.label} ({b.weightPct}%)
                              </span>
                              <span className="font-mono text-[#0F5E4E]">
                                +{b.weightedPoints} pts
                              </span>
                            </div>
                            <p className="mt-1 text-[11.5px] text-[#475467]">{b.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Financial Calculator Card */}
          <Card className="p-5 md:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#0F5E4E]" />
                  <h2 className="text-[16px] font-semibold text-[#141A23]">
                    3. Demand-Backed Financing Calculator
                  </h2>
                  <SimulatedBadge label="Simulated demonstration data" />
                </div>
                <p className="mt-1 text-[12.5px] text-[#475467]">
                  Dynamically computes Required Funding = max(0, Total Cost − Available Working Capital) and Expected Net Margin.
                </p>
              </div>
              <Button variant="secondary" onClick={openProposalModal}>
                <FileText className="h-4 w-4" />
                Generate Financing Proposal
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Field
                htmlFor="opp-total-cost"
                label="Total Production Cost (₹)"
                className="bg-[#FAF8F4] rounded-md border border-[#DFDBD0] p-3"
              >
                <input
                  id="opp-total-cost"
                  type="number"
                  min={0}
                  step={5000}
                  value={productionCostINR}
                  onChange={(e) => setProductionCostINR(Number(e.target.value) || 0)}
                  className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[15px] font-bold text-[#141A23] tabular-nums"
                />
              </Field>

              <Field
                htmlFor="opp-avail-cap"
                label="Available Working Capital (₹)"
                className="bg-[#FAF8F4] rounded-md border border-[#DFDBD0] p-3"
              >
                <input
                  id="opp-avail-cap"
                  type="number"
                  min={0}
                  step={5000}
                  value={availableCapitalINR}
                  onChange={(e) => setAvailableCapitalINR(Number(e.target.value) || 0)}
                  className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[15px] font-bold text-[#141A23] tabular-nums"
                />
              </Field>

              <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#92400E]">
                  Required Funding Gap
                </div>
                <div className="mt-2 font-mono text-[22px] font-bold text-[#B45309] tabular-nums">
                  {formatINR(financing.requiredFundingINR)}
                </div>
                <div className="text-[11px] text-[#92400E]">Working-capital loan need</div>
              </div>

              <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                  Expected Buyer Revenue
                </div>
                <div className="mt-2 font-mono text-[22px] font-bold text-[#141A23] tabular-nums">
                  {formatINR(financing.expectedRevenueINR)}
                </div>
                <div className="text-[11px] text-[#475467]">
                  {selectedOpportunity.quantity.toLocaleString("en-IN")} {selectedOpportunity.unitLabel}
                </div>
              </div>

              <div className="rounded-md border border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#047857]">
                  Expected Net Margin
                </div>
                <div className="mt-2 font-mono text-[22px] font-bold text-[#047857] tabular-nums">
                  {formatINR(financing.expectedNetMarginINR)}
                </div>
                <div className="text-[11px] text-[#047857]">
                  {financing.marginPct}% · Repayment: {financing.repaymentStatus} ({financing.repaymentCapacityRatio}×)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECE8DE] pt-4">
              <div className="flex items-center gap-2 text-[13px] text-[#475467]">
                <CheckCircle2 className="h-4 w-4 text-[#047857]" />
                <span>
                  Note: Single SHG max capacity is{" "}
                  <strong className="text-[#141A23]">
                    {collectivePlan.bestSingleShgCapacity.toLocaleString("en-IN")}{" "}
                    {selectedOpportunity.unitLabel}
                  </strong>
                  — pool all {poolShgs.length} SHGs in Collective Production to meet 100% of this order.
                </span>
              </div>
              <Button variant="primary" onClick={onProceedToCollective}>
                Proceed to Collective Production
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Step 8 Consultancy Layer */}
          <ConsultancyLayerSection
            opportunity={selectedOpportunity}
            plan={collectivePlan}
            financing={financing}
            activeStageIndex={2}
          />
        </>
      )}
    </div>
  );
};
