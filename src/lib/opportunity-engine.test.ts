import { BUYER_OPPORTUNITIES, EXCHANGE_SHGS } from "../data/opportunityExchangeData.ts";
import {
  computeCollectivePlan,
  computeConsultancyAdvice,
  computeFinancingMetrics,
  computeWhatIfSimulation,
  scoreShgMatches,
} from "./opportunity-engine.ts";

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertOk(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const milletOpp = BUYER_OPPORTUNITIES[0];
const milletPool = EXCHANGE_SHGS.filter((s) => s.category === "millet");

// 1. Matching engine
const matches = scoreShgMatches(milletOpp, EXCHANGE_SHGS);
assertEqual(matches.length, 5, "Millet opportunity must match 5 SHGs");
assertEqual(matches[0].breakdown.length, 4, "Breakdown must contain 4 weighted criteria");

// 2. Full collective network = 5,000 units (100%)
const allMilletIds = milletPool.map((s) => s.id);
const fullPlan = computeCollectivePlan(milletOpp, milletPool, allMilletIds);
assertEqual(fullPlan.combinedCapacity, 5000, "5 millet SHGs must total 5,000 units");
assertEqual(fullPlan.shortfallUnits, 0, "Zero shortfall when all 5 SHGs selected");
assertEqual(fullPlan.isFullyCovered, true, "Order must be fully covered");
assertEqual(fullPlan.criticalAlerts.length, 0, "Zero resource alerts when all SHGs active");
assertEqual(fullPlan.bestSingleShgCapacity, 1200, "Best single millet SHG is 1,200 units");

// 3. Deselect SHG A (1,000 units) => 1,000 shortfall + Food Processing Machine offline alert
const withoutA = allMilletIds.filter((id) => id !== "shg-millet-a");
const missingAPlan = computeCollectivePlan(milletOpp, milletPool, withoutA);
assertEqual(missingAPlan.combinedCapacity, 4000, "Combined capacity drops to 4,000");
assertEqual(missingAPlan.shortfallUnits, 1000, "Shortfall must be 1,000 units");
assertEqual(missingAPlan.isFullyCovered, false, "Order must not be covered without SHG A");
assertOk(
  missingAPlan.criticalAlerts.some((msg) => msg.includes("Food Processing Machine")),
  "Must trigger Food Processing Machine offline alert"
);

// 4. Financial calculator for Millet: 175k cost - 55k working capital = 120k funding; 75k margin (30%)
const fin = computeFinancingMetrics(175000, 55000, 250000);
assertEqual(fin.requiredFundingINR, 120000, "Funding gap must be ₹1,20,000");
assertEqual(fin.expectedNetMarginINR, 75000, "Net margin must be ₹75,000");
assertEqual(fin.marginPct, 30, "Margin % must be 30%");

// 5. What-If simulator validation
const sim = computeWhatIfSimulation({
  orderQuantity: 5000,
  numberOfShgs: 4,
  avgCapacityPerShg: 1000,
  availableWorkingCapitalINR: 55000,
  totalProductionCostINR: 175000,
});
assertEqual(sim.combinedCapacity, 4000, "Simulator combined capacity 4,000");
assertEqual(sim.shgsRequired, 5, "Simulator requires 5 SHGs");
assertEqual(sim.shortfallUnits, 1000, "Simulator shortfall 1,000");
assertEqual(sim.financingGapINR, 120000, "Simulator financing gap 120,000");

// 6. Consultancy advice
const advice = computeConsultancyAdvice(milletOpp, fullPlan, fin);
assertEqual(advice.readinessLabel, "Bank-Ready Demand", "Full millet plan is Bank-Ready");

console.log(
  JSON.stringify(
    {
      milletMatchesCount: matches.length,
      fullCombinedCapacity: fullPlan.combinedCapacity,
      withoutAShortfall: missingAPlan.shortfallUnits,
      withoutAAlerts: missingAPlan.criticalAlerts,
      requiredFundingINR: fin.requiredFundingINR,
      netMarginINR: fin.expectedNetMarginINR,
      adviceStatus: advice.readinessLabel,
    },
    null,
    2
  )
);
