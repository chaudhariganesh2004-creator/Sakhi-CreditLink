import type { BuyerOpportunity, ExchangeSHG } from "../data/opportunityExchangeData";

export interface MatchWeights {
  product: number;
  capacity: number;
  location: number;
  delivery: number;
}

export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  product: 40,
  capacity: 30,
  location: 15,
  delivery: 15,
};

export interface MatchCriterionBreakdown {
  key: keyof MatchWeights;
  label: string;
  weightPct: number;
  rawScore: number; // 0..100
  weightedPoints: number;
  reason: string;
}

export interface ScoredSHGMatch {
  shg: ExchangeSHG;
  matchPct: number;
  breakdown: MatchCriterionBreakdown[];
}

/**
 * Normalize the 4 transparent scoring sliders so weights always total 100%.
 * Default rule weights: Product 40%, Capacity 30%, Location 15%, Delivery 15%.
 */
export function normalizeMatchWeights(weights: MatchWeights): MatchWeights {
  const safe = {
    product: Math.max(0, Number.isFinite(weights.product) ? weights.product : 0),
    capacity: Math.max(0, Number.isFinite(weights.capacity) ? weights.capacity : 0),
    location: Math.max(0, Number.isFinite(weights.location) ? weights.location : 0),
    delivery: Math.max(0, Number.isFinite(weights.delivery) ? weights.delivery : 0),
  };
  const total = safe.product + safe.capacity + safe.location + safe.delivery;
  if (total <= 0) {
    return { ...DEFAULT_MATCH_WEIGHTS };
  }
  const product = Math.round((safe.product / total) * 100);
  const capacity = Math.round((safe.capacity / total) * 100);
  const location = Math.round((safe.location / total) * 100);
  const delivery = Math.max(0, 100 - (product + capacity + location));
  return { product, capacity, location, delivery };
}

/**
 * Pure transparent rule-based SHG matching engine (zero black-box scoring).
 */
export function scoreShgMatches(
  opportunity: BuyerOpportunity,
  allShgs: ExchangeSHG[],
  customWeights: MatchWeights = DEFAULT_MATCH_WEIGHTS
): ScoredSHGMatch[] {
  const weights = normalizeMatchWeights(customWeights);
  const categoryShgs = allShgs.filter((s) => s.category === opportunity.category);
  const maxCategoryCap = Math.max(
    1,
    ...categoryShgs.map((s) => s.availableCapacity)
  );

  return categoryShgs
    .map((shg) => {
      const productRaw = Math.max(0, Math.min(100, shg.productCompatibilityRaw));

      // Capacity fit compares SHG batch contribution relative to ideal 5-group pool slice
      const targetSlice = Math.max(1, opportunity.quantity / Math.max(1, categoryShgs.length));
      const capacityRatio = Math.min(1.15, shg.availableCapacity / targetSlice);
      const capacityRaw = Math.min(
        100,
        Math.round(
          ((shg.availableCapacity / maxCategoryCap) * 45) +
            (Math.min(1, capacityRatio) * 55)
        )
      );

      // Location proximity: 0km => 100, 60km+ => 40 (same district gets bonus)
      const districtBonus = shg.district === opportunity.district ? 8 : 0;
      const distanceScore = Math.max(
        40,
        Math.min(100, Math.round(100 - shg.distanceKm * 1.15 + districtBonus))
      );

      // Delivery feasibility: buffer days before buyer deadline
      const bufferDays = opportunity.deadlineDays - shg.maxDeliveryDays;
      const deliveryRaw =
        bufferDays >= 5
          ? 96
          : bufferDays >= 2
          ? 88
          : bufferDays >= 0
          ? 76
          : Math.max(30, 60 + bufferDays * 6);

      const productPts = Number(((productRaw * weights.product) / 100).toFixed(1));
      const capacityPts = Number(((capacityRaw * weights.capacity) / 100).toFixed(1));
      const locationPts = Number(((distanceScore * weights.location) / 100).toFixed(1));
      const deliveryPts = Number(((deliveryRaw * weights.delivery) / 100).toFixed(1));

      const matchPct = Math.min(
        99,
        Math.round(productPts + capacityPts + locationPts + deliveryPts)
      );

      const breakdown: MatchCriterionBreakdown[] = [
        {
          key: "product",
          label: "Product compatibility",
          weightPct: weights.product,
          rawScore: productRaw,
          weightedPoints: productPts,
          reason: `${shg.productExpertise} aligns with ${opportunity.productName}`,
        },
        {
          key: "capacity",
          label: "Capacity fit",
          weightPct: weights.capacity,
          rawScore: capacityRaw,
          weightedPoints: capacityPts,
          reason: `${shg.availableCapacity.toLocaleString("en-IN")} ${opportunity.unitLabel} pooled batch capacity`,
        },
        {
          key: "location",
          label: "Location / distance",
          weightPct: weights.location,
          rawScore: distanceScore,
          weightedPoints: locationPts,
          reason: `${shg.distanceKm} km from ${opportunity.location}`,
        },
        {
          key: "delivery",
          label: "Delivery feasibility",
          weightPct: weights.delivery,
          rawScore: deliveryRaw,
          weightedPoints: deliveryPts,
          reason: `Ready in ~${shg.maxDeliveryDays}d (within ${opportunity.deadlineDays}d deadline)`,
        },
      ];

      return { shg, matchPct, breakdown };
    })
    .sort((a, b) => b.matchPct - a.matchPct);
}

export interface ShgAllocationRow {
  shg: ExchangeSHG;
  allocatedUnits: number;
  sharePct: number;
  revenueShareINR: number;
  utilizationPct: number;
}

export interface SharedResourceNode {
  resourceLabel: string;
  ownerShgId: string;
  ownerShgCode: string;
  ownerShgName: string;
  isCritical: boolean;
  available: boolean;
  warningMessage: string | null;
}

export interface CollectivePlanResult {
  orderQuantity: number;
  combinedCapacity: number;
  totalAllocatedUnits: number;
  shortfallUnits: number;
  surplusUnits: number;
  fulfilmentPct: number;
  isFullyCovered: boolean;
  statusLabel: string;
  verdictMessage: string;
  allocations: ShgAllocationRow[];
  totalSelectedWorkingCapitalINR: number;
  bestSingleShgCapacity: number;
  bestSingleShgPct: number;
  sharedResources: SharedResourceNode[];
  criticalAlerts: string[];
}

/**
 * Compute dynamic collective production allocation and shared-resource dependencies.
 * Automatically flags offline critical shared resources (e.g., Food Processing Machine if SHG A is deselected).
 */
export function computeCollectivePlan(
  opportunity: BuyerOpportunity,
  poolShgs: ExchangeSHG[],
  selectedIds: string[]
): CollectivePlanResult {
  const selectedSet = new Set(selectedIds);
  const selectedShgs = poolShgs.filter((s) => selectedSet.has(s.id));

  const orderQuantity = Math.max(0, opportunity.quantity);
  const combinedCapacity = selectedShgs.reduce((sum, s) => sum + s.availableCapacity, 0);
  const totalSelectedWorkingCapitalINR = selectedShgs.reduce(
    (sum, s) => sum + s.workingCapitalINR,
    0
  );

  const shortfallUnits = Math.max(0, orderQuantity - combinedCapacity);
  const surplusUnits = Math.max(0, combinedCapacity - orderQuantity);
  const fulfilmentPct =
    orderQuantity > 0
      ? Math.min(100, Math.round((combinedCapacity / orderQuantity) * 100))
      : 100;
  const isFullyCovered = combinedCapacity >= orderQuantity && orderQuantity > 0;

  // Allocate units cleanly against order target (proportional scaling when combinedCapacity > order)
  const targetFill = Math.min(orderQuantity, combinedCapacity);
  let remainingToAllocate = targetFill;

  const allocations: ShgAllocationRow[] = selectedShgs.map((shg, index) => {
    const isLast = index === selectedShgs.length - 1;
    let allocatedUnits = 0;

    if (combinedCapacity <= orderQuantity) {
      allocatedUnits = shg.availableCapacity;
    } else if (isLast) {
      allocatedUnits = Math.max(0, Math.min(shg.availableCapacity, remainingToAllocate));
    } else {
      const proportional = Math.round((shg.availableCapacity / combinedCapacity) * targetFill);
      allocatedUnits = Math.min(shg.availableCapacity, proportional, remainingToAllocate);
    }
    remainingToAllocate = Math.max(0, remainingToAllocate - allocatedUnits);

    const sharePct =
      orderQuantity > 0 ? Math.round((allocatedUnits / orderQuantity) * 100) : 0;
    const revenueShareINR =
      orderQuantity > 0
        ? Math.round((allocatedUnits / orderQuantity) * opportunity.budgetINR)
        : 0;
    const utilizationPct =
      shg.availableCapacity > 0
        ? Math.min(100, Math.round((allocatedUnits / shg.availableCapacity) * 100))
        : 0;

    return {
      shg,
      allocatedUnits,
      sharePct,
      revenueShareINR,
      utilizationPct,
    };
  });

  const totalAllocatedUnits = allocations.reduce((sum, r) => sum + r.allocatedUnits, 0);

  // Best single SHG from entire category pool for Individual vs Collective comparison
  const bestSingleShgCapacity = Math.max(
    0,
    ...poolShgs.map((s) => s.availableCapacity)
  );
  const bestSingleShgPct =
    orderQuantity > 0
      ? Math.min(100, Math.round((bestSingleShgCapacity / orderQuantity) * 100))
      : 0;

  // Shared Resource Dependency Mapping across the pool
  const sharedResources: SharedResourceNode[] = poolShgs.map((shg) => {
    const available = selectedSet.has(shg.id);
    const label = shg.criticalResourceName || `${shg.sharedResourceRole} (${shg.code})`;
    const warningMessage =
      !available && shg.isCriticalResource
        ? `Warning: ${label} is offline — production halted unless replaced`
        : null;
    return {
      resourceLabel: label,
      ownerShgId: shg.id,
      ownerShgCode: shg.code,
      ownerShgName: shg.name,
      isCritical: shg.isCriticalResource,
      available,
      warningMessage,
    };
  });

  const criticalAlerts = sharedResources
    .map((r) => r.warningMessage)
    .filter((msg): msg is string => Boolean(msg));

  const statusLabel = isFullyCovered
    ? "Fully covered"
    : `Shortfall of ${shortfallUnits.toLocaleString("en-IN")} ${opportunity.unitLabel}`;

  const verdictMessage = isFullyCovered
    ? criticalAlerts.length > 0
      ? `Capacity covers ${orderQuantity.toLocaleString("en-IN")} ${opportunity.unitLabel}, but a critical shared resource is offline.`
      : `Fully covered: ${selectedShgs.length} SHGs supply ${combinedCapacity.toLocaleString("en-IN")} ${opportunity.unitLabel} within ${opportunity.deadlineDays} days.`
    : `Short by ${shortfallUnits.toLocaleString("en-IN")} ${opportunity.unitLabel}. Add one group or extend the deadline.`;

  return {
    orderQuantity,
    combinedCapacity,
    totalAllocatedUnits,
    shortfallUnits,
    surplusUnits,
    fulfilmentPct,
    isFullyCovered,
    statusLabel,
    verdictMessage,
    allocations,
    totalSelectedWorkingCapitalINR,
    bestSingleShgCapacity,
    bestSingleShgPct,
    sharedResources,
    criticalAlerts,
  };
}

export interface FinancingProposalMetrics {
  totalCostINR: number;
  availableWorkingCapitalINR: number;
  requiredFundingINR: number;
  expectedRevenueINR: number;
  expectedNetMarginINR: number;
  marginPct: number;
  repaymentCapacityRatio: number;
  repaymentStatus: "Comfortable" | "Moderate" | "Tight";
}

/**
 * Dynamic Financing Calculator:
 * Required Funding = max(0, Total Cost - Available Working Capital)
 * Expected Net Margin = Expected Revenue - Total Cost
 */
export function computeFinancingMetrics(
  totalCostINR: number,
  availableWorkingCapitalINR: number,
  expectedRevenueINR: number
): FinancingProposalMetrics {
  const safeCost = Math.max(0, Number.isFinite(totalCostINR) ? Math.round(totalCostINR) : 0);
  const safeCap = Math.max(
    0,
    Number.isFinite(availableWorkingCapitalINR) ? Math.round(availableWorkingCapitalINR) : 0
  );
  const safeRev = Math.max(
    0,
    Number.isFinite(expectedRevenueINR) ? Math.round(expectedRevenueINR) : 0
  );

  const requiredFundingINR = Math.max(0, safeCost - safeCap);
  const expectedNetMarginINR = safeRev - safeCost;
  const marginPct = safeRev > 0 ? Math.round((expectedNetMarginINR / safeRev) * 100) : 0;

  // Compare expected gross surplus against funded principal (assuming 6-month revolving working capital cycle)
  const repaymentCapacityRatio =
    requiredFundingINR > 0
      ? Number(((safeRev - safeCost * 0.45) / requiredFundingINR).toFixed(2))
      : 2.5;

  const repaymentStatus: FinancingProposalMetrics["repaymentStatus"] =
    expectedNetMarginINR > 0 && marginPct >= 20
      ? "Comfortable"
      : expectedNetMarginINR > 0
      ? "Moderate"
      : "Tight";

  return {
    totalCostINR: safeCost,
    availableWorkingCapitalINR: safeCap,
    requiredFundingINR,
    expectedRevenueINR: safeRev,
    expectedNetMarginINR,
    marginPct,
    repaymentCapacityRatio,
    repaymentStatus,
  };
}

export interface WhatIfInputs {
  orderQuantity: number;
  numberOfShgs: number;
  avgCapacityPerShg: number;
  availableWorkingCapitalINR: number;
  totalProductionCostINR: number;
}

export interface WhatIfResult {
  orderQuantity: number;
  numberOfShgs: number;
  avgCapacityPerShg: number;
  combinedCapacity: number;
  shgsRequired: number;
  shortfallUnits: number;
  financingGapINR: number;
  singleShgCapacity: number;
  singleShgFulfilmentPct: number;
  collectiveFulfilmentPct: number;
  isFulfilled: boolean;
  verdict: string;
}

/**
 * Interactive What-If Simulator logic with strict NaN / negative guards.
 */
export function computeWhatIfSimulation(inputs: WhatIfInputs): WhatIfResult {
  const orderQuantity = Math.max(
    0,
    Number.isFinite(inputs.orderQuantity) ? Math.round(inputs.orderQuantity) : 0
  );
  const numberOfShgs = Math.max(
    0,
    Number.isFinite(inputs.numberOfShgs) ? Math.round(inputs.numberOfShgs) : 0
  );
  const avgCapacityPerShg = Math.max(
    1,
    Number.isFinite(inputs.avgCapacityPerShg) ? Math.round(inputs.avgCapacityPerShg) : 1
  );
  const availableWorkingCapitalINR = Math.max(
    0,
    Number.isFinite(inputs.availableWorkingCapitalINR)
      ? Math.round(inputs.availableWorkingCapitalINR)
      : 0
  );
  const totalProductionCostINR = Math.max(
    0,
    Number.isFinite(inputs.totalProductionCostINR)
      ? Math.round(inputs.totalProductionCostINR)
      : 0
  );

  const combinedCapacity = numberOfShgs * avgCapacityPerShg;
  const shgsRequired = orderQuantity > 0 ? Math.ceil(orderQuantity / avgCapacityPerShg) : 0;
  const shortfallUnits = Math.max(0, orderQuantity - combinedCapacity);
  const financingGapINR = Math.max(0, totalProductionCostINR - availableWorkingCapitalINR);

  const singleShgCapacity = avgCapacityPerShg;
  const singleShgFulfilmentPct =
    orderQuantity > 0
      ? Math.min(100, Math.round((singleShgCapacity / orderQuantity) * 100))
      : 100;
  const collectiveFulfilmentPct =
    orderQuantity > 0
      ? Math.min(100, Math.round((combinedCapacity / orderQuantity) * 100))
      : 100;
  const isFulfilled = combinedCapacity >= orderQuantity && orderQuantity > 0;

  const verdict = isFulfilled
    ? `Order covered: ${numberOfShgs} SHG(s) provide ${combinedCapacity.toLocaleString("en-IN")} units (${financingGapINR === 0 ? "self-funded" : `₹${financingGapINR.toLocaleString("en-IN")} working-capital financing needed`}).`
    : `Short by ${shortfallUnits.toLocaleString("en-IN")} units — need at least ${shgsRequired} SHG(s) at ${avgCapacityPerShg.toLocaleString("en-IN")} units/SHG or extend timeline.`;

  return {
    orderQuantity,
    numberOfShgs,
    avgCapacityPerShg,
    combinedCapacity,
    shgsRequired,
    shortfallUnits,
    financingGapINR,
    singleShgCapacity,
    singleShgFulfilmentPct,
    collectiveFulfilmentPct,
    isFulfilled,
    verdict,
  };
}

export interface ConsultancyAdvice {
  pricingTip: string;
  qualityTip: string;
  packagingTip: string;
  marketAccessTip: string;
  nextActions: string[];
  readinessLabel: "Bank-Ready Demand" | "Strengthen Before Bank Visit" | "Capacity Gap";
  readinessScorePct: number;
  checklist: { label: string; done: boolean }[];
}

export function computeConsultancyAdvice(
  opportunity: BuyerOpportunity,
  plan: CollectivePlanResult,
  financing: FinancingProposalMetrics
): ConsultancyAdvice {
  const unitPrice =
    opportunity.quantity > 0
      ? Math.round(opportunity.budgetINR / opportunity.quantity)
      : 0;
  const unitCost =
    opportunity.quantity > 0
      ? Math.round(financing.totalCostINR / opportunity.quantity)
      : 0;

  const capacityOk = plan.isFullyCovered;
  const resourcesOk = plan.criticalAlerts.length === 0;
  const marginOk = financing.marginPct >= 20;
  const fundingReasonable = financing.repaymentStatus !== "Tight";

  const checklist = [
    {
      label: `Combined SHG capacity covers ${opportunity.quantity.toLocaleString("en-IN")} ${opportunity.unitLabel}`,
      done: capacityOk,
    },
    {
      label: "All critical shared machinery/facilities online in network",
      done: resourcesOk,
    },
    {
      label: `Healthy net margin (${financing.marginPct}% · target >= 20%)`,
      done: marginOk,
    },
    {
      label: `Working-capital gap sized (₹${financing.requiredFundingINR.toLocaleString("en-IN")})`,
      done: fundingReasonable,
    },
  ];

  const doneCount = checklist.filter((c) => c.done).length;
  const readinessScorePct = Math.round((doneCount / checklist.length) * 100);
  const readinessLabel: ConsultancyAdvice["readinessLabel"] =
    !capacityOk || !resourcesOk
      ? "Capacity Gap"
      : doneCount === checklist.length
      ? "Bank-Ready Demand"
      : "Strengthen Before Bank Visit";

  return {
    pricingTip: `Quoted buyer price averages ₹${unitPrice.toLocaleString("en-IN")}/${opportunity.unitLabel.replace(/s$/, "")} vs ~₹${unitCost.toLocaleString("en-IN")} production cost (${financing.marginPct}% net margin). Lock input bulk rates early.`,
    qualityTip: `${opportunity.qualitySpec}. Assign one quality-lead Sakhi across the cluster to reduce batch rejections.`,
    packagingTip: `${opportunity.packagingSpec}. Pooling packaging procurement across SHGs cuts unit carton cost.`,
    marketAccessTip: `Treat ${opportunity.buyerName} as a repeat seasonal anchor—document timely delivery to support future Dose 2/3 bank limits.`,
    nextActions: [
      capacityOk && resourcesOk
        ? "Sign draft collective production split & nominate cluster lead SHG."
        : "Restore missing SHG or critical shared resource before committing buyer delivery date.",
      `Obtain written purchase intent / LOI from ${opportunity.buyerName} before branch visit.`,
      `Submit Financing Proposal (₹${financing.requiredFundingINR.toLocaleString("en-IN")} gap) alongside 6-month SHG books.`,
    ],
    readinessLabel,
    readinessScorePct,
    checklist,
  };
}
