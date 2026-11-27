import { SHG_CASES_DEMO } from "../data/sakhi-data.ts";
import {
  DOSE_CONFIG,
  REASON_CODES,
  alternativeDataCredibility,
  booksCheck,
  drawingPowerFirstDose,
  indicativeGrade,
  readinessScore,
  repeatLinkage,
  slaStatus,
  ticketGap,
} from "./access-engine.ts";

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

// 1. Verified RBI first-dose rule checks
assertEqual(drawingPowerFirstDose(20000), 150000, "corpus 20,000 must floor at 150,000");
assertEqual(drawingPowerFirstDose(50000), 300000, "corpus 50,000 must yield 300,000 (6x)");
assertEqual(drawingPowerFirstDose(164000), 984000, "corpus 164,000 must yield 984,000 (6x)");
assertEqual(drawingPowerFirstDose(0), 150000, "corpus 0 must floor at 150,000");

// 2. Dose config check (Dose 3 min 6,00,000)
assertEqual(DOSE_CONFIG[3].minimumINR, 600000, "Dose 3 min must be 600,000");
assertEqual(DOSE_CONFIG[2].verified, false, "Dose 2 must be flagged illustrative");

// 3. Books check on Ujjwal (complete) vs Surbhi (updatedBooks=false)
const ujjwal = SHG_CASES_DEMO[0];
const surbhi = SHG_CASES_DEMO[2];
assertEqual(booksCheck(ujjwal).passed, true, "Ujjwal books must pass");
assertEqual(booksCheck(surbhi).passed, false, "Surbhi books must fail");
assertOk(booksCheck(surbhi).missingMonths > 0, "Surbhi must report missing months");

// 4. Indicative grade
assertEqual(indicativeGrade(ujjwal).grade, "A", "Ujjwal indicative grade A");
assertEqual(indicativeGrade(surbhi).grade, "B", "Surbhi indicative grade B");

// 5. Ticket gap
const gap = ticketGap(215000, drawingPowerFirstDose(ujjwal.corpusBalance));
assertEqual(gap.eligibleINR, 984000, "Ujjwal eligible 984,000");
assertEqual(gap.gapINR, 769000, "Ujjwal gap 769,000");
assertEqual(gap.isUnderEligible, true, "Ujjwal under-eligible true");

// 6. Explainable readiness score (0..100)
const ujjwalReadiness = readinessScore(ujjwal);
assertOk(ujjwalReadiness.score > 0 && ujjwalReadiness.score <= 100, "readiness score 1..100");
assertEqual(
  ujjwalReadiness.breakdown.reduce((s, b) => s + b.max, 0),
  100,
  "readiness breakdown max points must total 100"
);

// 7. Reason codes & SLA & Repeat linkage
assertOk(
  REASON_CODES.some((r) => r.code === "KYC-MEMBER-ACCOUNT"),
  "REASON_CODES must include KYC-MEMBER-ACCOUNT"
);
assertEqual(
  slaStatus({ ...ujjwal, daysInStage: 16 }, ujjwal.stage, 14).state,
  "breached",
  "16 days > 14 SLA must breach"
);
assertEqual(repeatLinkage(ujjwal).nextDose, 2, "Ujjwal nextDose must be 2");

// 8. Alternative-data ML credibility checks
const altUjjwal = alternativeDataCredibility(ujjwal);
const altSurbhiBase = alternativeDataCredibility(surbhi, {
  upiSupplierReceipts: false,
  dairyOrCoopSupplySync: false,
});
const altSurbhiBoosted = alternativeDataCredibility(surbhi, {
  upiSupplierReceipts: true,
  dairyOrCoopSupplySync: true,
});
assertOk(
  altUjjwal.credibilityScore >= 75 && altUjjwal.features.length === 6,
  "Ujjwal alt-data credibility must score high with 6 features"
);
assertOk(
  altSurbhiBoosted.credibilityScore > altSurbhiBase.credibilityScore,
  "Adding UPI & co-op alt-data signals must improve ML credibility score"
);

console.log(
  JSON.stringify(
    {
      corpus50k: drawingPowerFirstDose(50000),
      corpus164k: drawingPowerFirstDose(164000),
      ujjwalBooks: booksCheck(ujjwal),
      surbhiBooks: booksCheck(surbhi),
      ujjwalGrade: indicativeGrade(ujjwal),
      ujjwalTicketGap: gap,
      ujjwalReadinessScore: ujjwalReadiness.score,
      repeatDose2Eligible: repeatLinkage(ujjwal).nextEligibleAmountINR,
    },
    null,
    2
  )
);
