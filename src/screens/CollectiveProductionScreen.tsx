import React, { useMemo } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
  Layers,
  Network,
  RotateCcw,
  Sliders,
  Users,
  Wrench,
} from "lucide-react";
import { EXCHANGE_SHGS } from "@/data/opportunityExchangeData";
import { useOpportunityExchange } from "@/context/OpportunityExchangeContext";
import {
  computeCollectivePlan,
  computeFinancingMetrics,
  computeWhatIfSimulation,
} from "@/lib/opportunity-engine";
import { ConsultancyLayerSection } from "@/components/exchange/ConsultancyLayerSection";
import { Button } from "@/components/ui/button";
import { Card, Field, SectionHeader, SimulatedBadge, StatusChip } from "@/components/ui/primitives";
import { cn, formatINR } from "@/lib/utils";

interface CollectiveProductionScreenProps {
  onBackToDiscovery: () => void;
}

export const CollectiveProductionScreen: React.FC<CollectiveProductionScreenProps> = ({
  onBackToDiscovery,
}) => {
  const {
    opportunities,
    selectedOpportunity,
    selectOpportunity,
    selectedShgIds,
    toggleShgSelection,
    networkBuilt,
    buildCollectiveNetwork,
    leadCoordinatorId,
    setLeadCoordinatorId,
    productionCostINR,
    availableCapitalINR,
    whatIfInputs,
    setWhatIfInputs,
    resetWhatIfInputs,
    openProposalModal,
  } = useOpportunityExchange();

  const poolShgs = useMemo(
    () => EXCHANGE_SHGS.filter((s) => s.category === selectedOpportunity.category),
    [selectedOpportunity.category]
  );

  const plan = useMemo(
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

  const simResult = useMemo(
    () => computeWhatIfSimulation(whatIfInputs),
    [whatIfInputs]
  );

  const maxChartCap = Math.max(
    1,
    selectedOpportunity.quantity,
    plan.combinedCapacity,
    ...poolShgs.map((s) => s.availableCapacity)
  );

  const allocationById = useMemo(
    () => new Map(plan.allocations.map((a) => [a.shg.id, a])),
    [plan.allocations]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Sakhi Opportunity Exchange · Step 2"
        title="Collective SHG Production & Resource Network"
        subtitle={`${selectedOpportunity.buyerName} · ${selectedOpportunity.productName} (${selectedOpportunity.quantity.toLocaleString("en-IN")} ${selectedOpportunity.unitLabel} in ${selectedOpportunity.deadlineDays} days)`}
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <SimulatedBadge label="Simulated demonstration data" />
            <Button variant="secondary" size="sm" onClick={onBackToDiscovery}>
              Change Opportunity
            </Button>
            <Button variant="primary" onClick={buildCollectiveNetwork}>
              <Network className="h-4 w-4" />
              Build Collective SHG Network
            </Button>
          </div>
        }
      />

      {/* Quick Opportunity Selector Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#DFDBD0] bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#475467]">
            Active Order:
          </span>
          {opportunities.map((opp) => (
            <button
              key={opp.id}
              type="button"
              onClick={() => selectOpportunity(opp.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                opp.id === selectedOpportunity.id
                  ? "border-[#0F5E4E] bg-[#ECFDF5] text-[#0F5E4E]"
                  : "border-[#DFDBD0] bg-[#FAF8F4] text-[#475467] hover:bg-white"
              )}
            >
              {opp.productName} ({opp.quantity.toLocaleString("en-IN")})
            </button>
          ))}
        </div>

        <Button variant="secondary" size="sm" onClick={openProposalModal}>
          <FileText className="h-4 w-4" />
          Generate Financing Proposal
        </Button>
      </div>

      {/* Live Critical Shared Resource Alert Banner */}
      {plan.criticalAlerts.length > 0 && (
        <div
          role="alert"
          className="space-y-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 text-[#B91C1C]"
        >
          {plan.criticalAlerts.map((msg) => (
            <div key={msg} className="flex items-start gap-2 text-[13.5px] font-semibold">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Verdict & Top Allocation Dashboard KPIs */}
      <Card
        className={cn(
          "p-5 space-y-4",
          plan.isFullyCovered && plan.criticalAlerts.length === 0
            ? "border-[#A7F3D0] bg-[#ECFDF5]"
            : "border-[#FDE68A] bg-[#FFFBEB]"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {plan.isFullyCovered && plan.criticalAlerts.length === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-[#047857]" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-[#B45309]" />
            )}
            <div>
              <div className="text-[15px] font-semibold text-[#141A23]">
                {plan.verdictMessage}
              </div>
              <div className="text-[12px] text-[#475467]">
                {networkBuilt
                  ? "Collective network active — toggle any SHG below to test capacity & shared-resource impact."
                  : "Toggle SHGs below or click 'Build Collective SHG Network' to pool full capacity."}
              </div>
            </div>
          </div>

          <StatusChip tone={plan.isFullyCovered ? "success" : "warning"}>
            {plan.statusLabel} ({plan.fulfilmentPct}%)
          </StatusChip>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[12px] font-semibold text-[#141A23] tabular-nums">
            <span>
              Combined Capacity: {plan.combinedCapacity.toLocaleString("en-IN")} /{" "}
              {plan.orderQuantity.toLocaleString("en-IN")} {selectedOpportunity.unitLabel}
            </span>
            <span>
              {plan.shortfallUnits > 0
                ? `Shortage: ${plan.shortfallUnits.toLocaleString("en-IN")} ${selectedOpportunity.unitLabel}`
                : `Surplus buffer: ${plan.surplusUnits.toLocaleString("en-IN")} ${selectedOpportunity.unitLabel}`}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-[#DFDBD0] bg-white">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-150",
                plan.isFullyCovered ? "bg-[#0F5E4E]" : "bg-[#B45309]"
              )}
              style={{ width: `${plan.fulfilmentPct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Main 2-Column Grid: Dynamic SHG Toggles + Shared Resource Dependency Matrix */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Dynamic Capacity Pooling Checkboxes & Per-SHG Allocation */}
        <Card className="p-5 lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE8DE] pb-3">
            <div className="flex items-center gap-2 text-[15.5px] font-semibold text-[#141A23]">
              <Users className="h-4 w-4 text-[#0F5E4E]" />
              <span>Dynamic Capacity Pooling ({poolShgs.length} SHGs)</span>
            </div>
            <span className="font-mono text-[12px] text-[#475467]">
              {plan.allocations.length} selected · {formatINR(plan.totalSelectedWorkingCapitalINR)} WC
            </span>
          </div>

          <div className="space-y-2.5">
            {poolShgs.map((shg) => {
              const checked = selectedShgIds.includes(shg.id);
              const alloc = allocationById.get(shg.id);
              return (
                <label
                  key={shg.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-2 rounded-lg border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between",
                    checked
                      ? "border-[#0F5E4E] bg-[#FAF8F4]"
                      : "border-[#FECACA] bg-[#FEF2F2]/60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleShgSelection(shg.id)}
                      aria-label={`Include ${shg.name}`}
                      className="mt-1 h-4 w-4 accent-[#0F5E4E]"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[14px] text-[#141A23]">
                          {shg.name}
                        </span>
                        {shg.isCriticalResource && (
                          <span className="rounded bg-[#F2EFE8] px-1.5 py-0.5 text-[10.5px] font-medium text-[#475467]">
                            {shg.sharedResourceRole}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#475467]">
                        Capacity: <strong className="font-mono">{shg.availableCapacity.toLocaleString("en-IN")}</strong>{" "}
                        {selectedOpportunity.unitLabel} · {shg.location} · WC {formatINR(shg.workingCapitalINR)}
                      </div>
                    </div>
                  </div>

                  <div className="pl-7 sm:pl-0 sm:text-right font-mono tabular-nums">
                    {checked && alloc ? (
                      <>
                        <div className="text-[14px] font-bold text-[#0F5E4E]">
                          {alloc.allocatedUnits.toLocaleString("en-IN")} allocated
                        </div>
                        <div className="text-[11px] text-[#475467]">
                          {alloc.sharePct}% share · {formatINR(alloc.revenueShareINR)}
                        </div>
                      </>
                    ) : (
                      <span className="text-[12px] font-semibold text-[#B91C1C]">
                        Excluded (0 units)
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </Card>

        {/* Shared Resource Discovery & BottleNeck Matrix */}
        <Card className="p-5 lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECE8DE] pb-3">
            <div className="flex items-center gap-2 text-[15.5px] font-semibold text-[#141A23]">
              <Wrench className="h-4 w-4 text-[#0F5E4E]" />
              <span>Shared Resource Discovery</span>
            </div>
            <span className="text-[11.5px] text-[#475467]">Cluster Node Map</span>
          </div>

          <div className="space-y-2.5">
            {plan.sharedResources.map((node) => (
              <div
                key={node.ownerShgId}
                className={cn(
                  "rounded-lg border px-3.5 py-3 flex items-center justify-between gap-2",
                  node.available
                    ? "border-[#A7F3D0] bg-[#ECFDF5]"
                    : node.isCritical
                    ? "border-[#FECACA] bg-[#FEF2F2]"
                    : "border-[#FDE68A] bg-[#FFFBEB]"
                )}
              >
                <div>
                  <div className="text-[13px] font-semibold text-[#141A23]">
                    {node.resourceLabel}
                  </div>
                  <div className="text-[11.5px] text-[#475467]">
                    Owner: {node.ownerShgCode} · {node.isCritical ? "Critical Step" : "Pool Labor"}
                  </div>
                </div>
                <StatusChip
                  tone={
                    node.available ? "success" : node.isCritical ? "danger" : "warning"
                  }
                >
                  {node.available ? "Available" : "Unavailable"}
                </StatusChip>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-3.5 py-2.5 text-[12px] text-[#475467]">
            Deselecting any critical resource owner (such as <strong>SHG A</strong>) immediately flags the production bottleneck across the shared cluster.
          </div>
        </Card>
      </div>

      {/* Production Bar Chart + Individual vs Collective Comparison */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Capacity Bar Chart (Clean CSS/SVG Bars) */}
        <Card className="p-5 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ECE8DE] pb-3">
            <div className="flex items-center gap-2 text-[15.5px] font-semibold text-[#141A23]">
              <BarChart3 className="h-4 w-4 text-[#0F5E4E]" />
              <span>Capacity &amp; Allocation Comparison Chart</span>
            </div>
            <SimulatedBadge compact label="Simulated demonstration data" />
          </div>

          <div className="space-y-3">
            {/* Order Target Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[12.5px] font-semibold text-[#141A23] tabular-nums">
                <span>Buyer Order Target</span>
                <span className="font-mono">
                  {plan.orderQuantity.toLocaleString("en-IN")} {selectedOpportunity.unitLabel}
                </span>
              </div>
              <div className="h-3 w-full rounded bg-[#F2EFE8]">
                <div
                  className="h-full rounded bg-[#141A23]"
                  style={{ width: `${Math.round((plan.orderQuantity / maxChartCap) * 100)}%` }}
                />
              </div>
            </div>

            {/* Combined Pool Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[12.5px] font-semibold text-[#0F5E4E] tabular-nums">
                <span>Combined Selected SHG Network</span>
                <span className="font-mono">
                  {plan.combinedCapacity.toLocaleString("en-IN")} {selectedOpportunity.unitLabel}
                </span>
              </div>
              <div className="h-3 w-full rounded bg-[#F2EFE8]">
                <div
                  className={cn(
                    "h-full rounded transition-all",
                    plan.isFullyCovered ? "bg-[#0F5E4E]" : "bg-[#B45309]"
                  )}
                  style={{ width: `${Math.round((plan.combinedCapacity / maxChartCap) * 100)}%` }}
                />
              </div>
            </div>

            {/* Per-SHG Bars */}
            <div className="pt-2 border-t border-[#ECE8DE] space-y-2">
              {poolShgs.map((shg) => {
                const active = selectedShgIds.includes(shg.id);
                const width = Math.max(
                  4,
                  Math.round((shg.availableCapacity / maxChartCap) * 100)
                );
                return (
                  <div key={shg.id} className="grid grid-cols-12 items-center gap-2 text-[12px]">
                    <span className="col-span-4 truncate font-medium text-[#141A23]">
                      {shg.code}
                    </span>
                    <div className="col-span-6 h-2.5 rounded bg-[#F2EFE8]">
                      <div
                        className={cn(
                          "h-full rounded transition-all",
                          active ? "bg-[#0F5E4E]/80" : "bg-[#C9C3B4]"
                        )}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="col-span-2 text-right font-mono tabular-nums text-[#475467]">
                      {active ? shg.availableCapacity.toLocaleString("en-IN") : "0"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Individual vs Collective Comparison Card */}
        <Card className="p-5 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#ECE8DE] pb-3 text-[15.5px] font-semibold text-[#141A23]">
            <Layers className="h-4 w-4 text-[#0F5E4E]" />
            <span>Individual vs. Collective Fulfilment</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B91C1C]">
                Individual SHG Alone
              </div>
              <div className="font-mono text-[24px] font-bold text-[#B91C1C] tabular-nums">
                {plan.bestSingleShgCapacity.toLocaleString("en-IN")}
              </div>
              <div className="text-[12px] text-[#141A23]">
                Best single group covers only <strong>{plan.bestSingleShgPct}%</strong> — cannot fulfil{" "}
                {plan.orderQuantity.toLocaleString("en-IN")} units alone.
              </div>
            </div>

            <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] p-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#047857]">
                Collective ({plan.allocations.length} SHGs)
              </div>
              <div className="font-mono text-[24px] font-bold text-[#047857] tabular-nums">
                {plan.combinedCapacity.toLocaleString("en-IN")}
              </div>
              <div className="text-[12px] text-[#141A23]">
                Reaches <strong>{plan.fulfilmentPct}%</strong> of order with pooled machinery &amp; storage.
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] px-3.5 py-2.5 text-[12.5px] text-[#475467]">
            Active SHGs: <strong className="font-mono text-[#141A23]">{plan.allocations.length}/{poolShgs.length}</strong> · Pooled Working Capital:{" "}
            <strong className="font-mono text-[#0F5E4E]">{formatINR(plan.totalSelectedWorkingCapitalINR)}</strong>
          </div>
        </Card>
      </div>

      {/* Collective Agreement Summary ("Draft for group discussion") */}
      <Card className="p-5 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECE8DE] pb-3.5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#141A23]">
                Collective Agreement &amp; Revenue Split Summary
              </h2>
              <span className="rounded border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
                Draft for group discussion
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-[#475467]">
              Proportional allocation of {formatINR(selectedOpportunity.budgetINR)} buyer contract across participating SHGs.
            </p>
          </div>

          <Field
            htmlFor="lead-coordinator-select"
            label="Lead Group / Coordinator"
            className="min-w-[240px]"
          >
            <select
              id="lead-coordinator-select"
              value={leadCoordinatorId}
              onChange={(e) => setLeadCoordinatorId(e.target.value)}
              className="h-9 w-full rounded-md border border-[#C9C3B4] bg-white px-2.5 text-[13px] font-medium text-[#141A23]"
            >
              {poolShgs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#DFDBD0]">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#DFDBD0] bg-[#F2EFE8] text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              <tr>
                <th className="px-4 py-2.5">Participating SHG</th>
                <th className="px-4 py-2.5 text-right">Allocated {selectedOpportunity.unitLabel}</th>
                <th className="px-4 py-2.5 text-right">Capacity Utilisation</th>
                <th className="px-4 py-2.5 text-right">Order Share</th>
                <th className="px-4 py-2.5 text-right">Proportional Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8DE] tabular-nums">
              {plan.allocations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#475467]">
                    No SHGs selected in network. Select at least one SHG above.
                  </td>
                </tr>
              ) : (
                plan.allocations.map((row) => (
                  <tr key={row.shg.id} className="hover:bg-[#FAF8F4]">
                    <td className="px-4 py-3 font-semibold text-[#141A23]">
                      {row.shg.name}
                      {row.shg.id === leadCoordinatorId && (
                        <span className="ml-2 rounded bg-[#ECFDF5] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#047857]">
                          Lead Coordinator
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {row.allocatedUnits.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#475467]">
                      {row.utilizationPct}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {row.sharePct}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#0F5E4E]">
                      {formatINR(row.revenueShareINR)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* High-Priority Demo Feature: Interactive What-If Simulator */}
      <Card className="p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECE8DE] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Sliders className="h-4 w-4 text-[#0F5E4E]" />
              <h2 className="text-[16px] font-semibold text-[#141A23]">
                What-If Capacity &amp; Financing Simulator
              </h2>
              <SimulatedBadge label="Simulated demonstration data" />
            </div>
            <p className="mt-1 text-[12.5px] text-[#475467]">
              Adjust order size, SHG count, capacity per SHG, working capital, or cost to preview live fulfilment &amp; credit gap.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={resetWhatIfInputs}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Simulator
          </Button>
        </div>

        {/* Inputs & Sliders */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field htmlFor="sim-order-qty" label="Buyer Order Qty">
            <input
              id="sim-order-qty"
              type="number"
              min={0}
              step={250}
              value={whatIfInputs.orderQuantity}
              onChange={(e) =>
                setWhatIfInputs({
                  ...whatIfInputs,
                  orderQuantity: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[14px] font-bold"
            />
          </Field>

          <Field
            htmlFor="sim-shg-count"
            label={`Number of SHGs (${whatIfInputs.numberOfShgs})`}
          >
            <input
              id="sim-shg-count"
              type="range"
              min={1}
              max={10}
              value={whatIfInputs.numberOfShgs}
              onChange={(e) =>
                setWhatIfInputs({
                  ...whatIfInputs,
                  numberOfShgs: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="mt-2 w-full accent-[#0F5E4E]"
            />
          </Field>

          <Field htmlFor="sim-avg-cap" label="Avg Capacity / SHG">
            <input
              id="sim-avg-cap"
              type="number"
              min={1}
              step={100}
              value={whatIfInputs.avgCapacityPerShg}
              onChange={(e) =>
                setWhatIfInputs({
                  ...whatIfInputs,
                  avgCapacityPerShg: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[14px] font-bold"
            />
          </Field>

          <Field htmlFor="sim-avail-cap" label="Working Capital (₹)">
            <input
              id="sim-avail-cap"
              type="number"
              min={0}
              step={5000}
              value={whatIfInputs.availableWorkingCapitalINR}
              onChange={(e) =>
                setWhatIfInputs({
                  ...whatIfInputs,
                  availableWorkingCapitalINR: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[14px] font-bold"
            />
          </Field>

          <Field htmlFor="sim-total-cost" label="Production Cost (₹)">
            <input
              id="sim-total-cost"
              type="number"
              min={0}
              step={5000}
              value={whatIfInputs.totalProductionCostINR}
              onChange={(e) =>
                setWhatIfInputs({
                  ...whatIfInputs,
                  totalProductionCostINR: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="h-9 w-full rounded border border-[#C9C3B4] bg-white px-2.5 font-mono text-[14px] font-bold"
            />
          </Field>
        </div>

        {/* Live Simulator Output Strip */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              Combined Capacity
            </div>
            <div className="mt-1 font-mono text-[20px] font-bold text-[#141A23] tabular-nums">
              {simResult.combinedCapacity.toLocaleString("en-IN")} units
            </div>
            <div className="text-[11.5px] text-[#475467]">
              {simResult.collectiveFulfilmentPct}% of order (1 SHG = {simResult.singleShgFulfilmentPct}%)
            </div>
          </div>

          <div className="rounded-md border border-[#DFDBD0] bg-[#FAF8F4] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              SHGs Required
            </div>
            <div className="mt-1 font-mono text-[20px] font-bold text-[#141A23] tabular-nums">
              {simResult.shgsRequired} SHGs
            </div>
            <div className="text-[11.5px] text-[#475467]">
              At {simResult.avgCapacityPerShg.toLocaleString("en-IN")} units each
            </div>
          </div>

          <div
            className={cn(
              "rounded-md border p-3.5",
              simResult.shortfallUnits > 0
                ? "border-[#FECACA] bg-[#FEF2F2]"
                : "border-[#A7F3D0] bg-[#ECFDF5]"
            )}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
              Production Shortfall
            </div>
            <div
              className={cn(
                "mt-1 font-mono text-[20px] font-bold tabular-nums",
                simResult.shortfallUnits > 0 ? "text-[#B91C1C]" : "text-[#047857]"
              )}
            >
              {simResult.shortfallUnits.toLocaleString("en-IN")} units
            </div>
            <div className="text-[11.5px] text-[#475467]">
              {simResult.isFulfilled ? "Fully fulfilled" : "Capacity deficit"}
            </div>
          </div>

          <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#92400E]">
              Simulated Financing Gap
            </div>
            <div className="mt-1 font-mono text-[20px] font-bold text-[#B45309] tabular-nums">
              {formatINR(simResult.financingGapINR)}
            </div>
            <div className="text-[11.5px] text-[#92400E]">
              Cost − Working Capital
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div
          className={cn(
            "rounded-md border px-4 py-3 text-[13.5px] font-semibold",
            simResult.isFulfilled
              ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]"
              : "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]"
          )}
        >
          {simResult.verdict}
        </div>
      </Card>

      {/* Step 8 Consultancy Layer */}
      <ConsultancyLayerSection
        opportunity={selectedOpportunity}
        plan={plan}
        financing={financing}
        activeStageIndex={3}
      />
    </div>
  );
};
