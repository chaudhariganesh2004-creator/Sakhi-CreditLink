export type NavScreenId =
  | "readiness-hub"
  | "shg-intake"
  | "cashflow-blueprint"
  | "bank-queue"
  | "role-profit-dashboard"
  | "command-centre"
  | "shg-directory"
  | "finance-passport"
  | "credit-demand"
  | "financing-blueprint"
  | "scheme-match"
  | "offer-comparison"
  | "application-pack"
  | "post-disbursement"
  | "livelihood-evidence"
  | "field-followups"
  | "programme-insights";

export type PortalRole = "shg-sakhi" | "bank-branch" | "district-official";

export type UserRole =
  | "bank-sakhi"
  | "glpc-officer"
  | "shg-leader"
  | "bank-officer"
  | "admin";

export type AppLanguage = "en" | "gu";

export type ProvenanceLevel =
  | "Self-declared"
  | "Document-supported"
  | "Field-verified"
  | "Lender-verified";

export type FunnelStage =
  | "Demand identified"
  | "Profile verified"
  | "Need validated"
  | "Route matched"
  | "Finance plan ready"
  | "Pack complete"
  | "Submitted"
  | "Sanctioned"
  | "Disbursed"
  | "Enterprise active";

export interface CostLineItem {
  id: string;
  label: string;
  labelGu: string;
  category: "Capex" | "Working Capital";
  amount: number;
  provenance: ProvenanceLevel;
  note: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  nameGu: string;
  category: "Identity & Governance" | "Financial Books" | "Enterprise & Market" | "Scheme Specific";
  status: "Verified" | "Uploaded — Pending Check" | "Missing" | "Expired";
  provenance: ProvenanceLevel;
  updatedAt: string;
  requiredFor: string[];
}

export interface ConsentRecord {
  id: string;
  purpose: string;
  recipient: string;
  scope: string;
  grantedBy: string;
  grantedOn: string;
  expiresOn: string;
  status: "Active" | "Revoked";
}

export interface BuyerEvidenceItem {
  id: string;
  buyerName: string;
  channel: "GLPC Saras / Catalogue" | "Local Retail Cooperative" | "FPO / Wholesale" | "Institutional Canteen";
  evidenceType: "Written Purchase Order" | "Monthly Supply Ledger" | "Verbal Commitment";
  monthlyVolumeKg: number;
  monthlyValueINR: number;
  provenance: ProvenanceLevel;
}

export interface CaseTask {
  id: string;
  title: string;
  owner: string;
  ownerRole: UserRole;
  dueDate: string;
  status: "Completed" | "Due Today" | "Overdue" | "Pending";
  priority: "High" | "Standard";
}

export interface CaseQuery {
  id: string;
  raisedBy: string;
  raisedOn: string;
  reasonCode?: string;
  question: string;
  response?: string;
  status: "Open" | "Resolved";
}

export interface BranchDecisionRecord {
  status: "Pending" | "Approved" | "Query Raised" | "Rejected";
  reasonCode?: string;
  note?: string;
  decidedAt: string;
  sanctionedAmountINR?: number;
}

export interface StatusEvent {
  id: string;
  stage: string;
  actor: string;
  timestamp: string;
  note: string;
}

export interface SHGCase {
  id: string;
  caseCode: string;
  shgName: string;
  shgNameGu: string;
  lokosId: string;
  district: string;
  block: string;
  cluster: string;
  village: string;
  activity: string;
  activityGu: string;
  membersCount: number;
  formationYear: number;
  bankSakhiName: string;
  bankSakhiPhone: string;
  linkedBranch: string;
  stage: FunnelStage;
  daysInStage: number;
  readinessScore: number;
  panchasutraScore: number;
  panchasutraChecks: {
    regularMeetings: boolean;
    regularSavings: boolean;
    internalLending: boolean;
    timelyRepayment: boolean;
    updatedBooks: boolean;
  };
  officeBearers: { role: string; name: string; verified: boolean }[];
  existingDebt: number;
  monthlySavingsPerMember: number;
  corpusBalance: number;
  applicantType: "SHG Group Enterprise" | "Member Micro-Enterprise" | "Federation / FPO";
  purposeSummary: string;
  purposeSummaryGu: string;
  timelineMonths: number;
  ownContribution: number;
  costLines: CostLineItem[];
  documents: DocumentItem[];
  consents: ConsentRecord[];
  buyerEvidence: BuyerEvidenceItem[];
  unitEconomics: {
    primaryProduct: string;
    unitLabel: string;
    sellingPricePerUnit: number;
    directCostPerUnit: number;
    overheadPerUnit: number;
    currentMonthlyUnits: number;
    projectedMonthlyUnits: number;
    peakMonths: string;
    leanMonths: string;
  };
  tasks: CaseTask[];
  queries: CaseQuery[];
  timeline: StatusEvent[];
  bottleneckReason?: string;
  branchDecision?: BranchDecisionRecord;
  ldmEscalated?: boolean;
  activeBookMonths?: number;
  currentDose?: 1 | 2 | 3;
  isPrimaryDemo?: boolean;
}

export interface SchemeMatchItem {
  id: string;
  schemeName: string;
  agency: string;
  isGlpcCore?: boolean;
  instrumentType:
    | "Bank Loan (CCL / Term)"
    | "Capital Subsidy (Credit-Linked)"
    | "SHG Seed Capital"
    | "Micro-Enterprise Term/WC"
    | "State 0% Interest Loan"
    | "Federation Corpus (CIF)"
    | "Grant / Revolving Fund";
  fitStatus: "Absolute Match" | "Strong Fit — Verify Conditions" | "Near Match — Conditional" | "Not Applicable / Excluded";
  matchScore: number;
  eligibilityChecklist: { rule: string; passed: boolean }[];
  indicativeEligibilityAmount?: string;
  whyMatched: string[];
  conditionsToVerify: string[];
  exclusions: string[];
  requiredDocuments: string[];
  sourceAnchor: string;
  ruleVersion: string;
  lastVerifiedDate: string;
}

export interface DemoLenderOffer {
  id: string;
  lenderName: string;
  branchOrChannel: string;
  productName: string;
  borrowerType: string;
  indicativeAmountINR: number;
  tenorMonths: number;
  aprBasis: string;
  estimatedMonthlyInstalmentINR: number;
  processingFee: string;
  penalChargeBasis: string;
  securityMargin: string;
  requiredDocsCount: number;
  kfsStatus: string;
  sourceDate: string;
  rankingNote: string;
}

export interface DistrictMatrixRow {
  district: string;
  block: string;
  activeBankSakhis: number;
  demandIdentified: number;
  profileVerified: number;
  routeMatched: number;
  packComplete: number;
  submitted: number;
  sanctioned: number;
  avgDaysToPack: number;
  topBottleneck: string;
}

export const ROLE_META: Record<
  UserRole,
  {
    label: string;
    shortLabel: string;
    userName: string;
    scopeNote: string;
  }
> = {
  "bank-sakhi": {
    label: "Bank Sakhi (Field Facilitator)",
    shortLabel: "Bank Sakhi",
    userName: "Meenaben Patel · Anand Cluster",
    scopeNote: "Assisted data entry, document capture, readiness review & pack preparation for assigned cluster SHGs.",
  },
  "glpc-officer": {
    label: "GLPC / Mission Mangalam Officer",
    shortLabel: "GLPC Officer",
    userName: "R. K. Jadeja · DMMU Anand",
    scopeNote: "District/block funnel intelligence, stage ageing, bottleneck resolution & Bank Sakhi task assignment.",
  },
  "shg-leader": {
    label: "SHG Leader (Ujjwal Mahila)",
    shortLabel: "SHG Leader",
    userName: "Hansaben Parmar · President",
    scopeNote: "Review enterprise details, inspect estimates, grant or revoke purpose-specific consent, and choose route.",
  },
  "bank-officer": {
    label: "Bank / Lender Appraisal Officer",
    shortLabel: "Bank Officer",
    userName: "V. Mehta · BoB Rural Branch",
    scopeNote: "View only consent-authorised application packs, cash-flow evidence, and raise appraisal queries.",
  },
  admin: {
    label: "Programme Administrator",
    shortLabel: "Admin",
    userName: "System Governance · Gandhinagar",
    scopeNote: "Manage versioned scheme rules, verified product catalogue, RBAC boundaries & audit logs.",
  },
};

export const FUNNEL_METRICS_DEMO: { stage: FunnelStage; count: number; amountCr: number; avgDays: number }[] = [
  { stage: "Demand identified", count: 148, amountCr: 3.62, avgDays: 2.4 },
  { stage: "Profile verified", count: 131, amountCr: 3.24, avgDays: 3.1 },
  { stage: "Need validated", count: 112, amountCr: 2.81, avgDays: 4.5 },
  { stage: "Route matched", count: 96, amountCr: 2.45, avgDays: 2.0 },
  { stage: "Finance plan ready", count: 78, amountCr: 2.04, avgDays: 5.8 },
  { stage: "Pack complete", count: 61, amountCr: 1.62, avgDays: 3.6 },
  { stage: "Submitted", count: 44, amountCr: 1.18, avgDays: 9.4 },
  { stage: "Sanctioned", count: 29, amountCr: 0.78, avgDays: 14.2 },
  { stage: "Disbursed", count: 23, amountCr: 0.61, avgDays: 6.5 },
  { stage: "Enterprise active", count: 19, amountCr: 0.52, avgDays: 0 },
];

export const DISTRICT_MATRIX_DEMO: DistrictMatrixRow[] = [
  {
    district: "Anand",
    block: "Anand Rural",
    activeBankSakhis: 14,
    demandIdentified: 46,
    profileVerified: 42,
    routeMatched: 34,
    packComplete: 24,
    submitted: 18,
    sanctioned: 12,
    avgDaysToPack: 11.2,
    topBottleneck: "Machinery quotation & FSSAI proof pending",
  },
  {
    district: "Anand",
    block: "Petlad",
    activeBankSakhis: 11,
    demandIdentified: 34,
    profileVerified: 30,
    routeMatched: 23,
    packComplete: 15,
    submitted: 10,
    sanctioned: 7,
    avgDaysToPack: 14.8,
    topBottleneck: "MCP ledger backlog (Panchasutra audit)",
  },
  {
    district: "Anand",
    block: "Borsad",
    activeBankSakhis: 9,
    demandIdentified: 28,
    profileVerified: 24,
    routeMatched: 17,
    packComplete: 10,
    submitted: 7,
    sanctioned: 5,
    avgDaysToPack: 16.4,
    topBottleneck: "Branch appraisal query turnaround > 12d",
  },
  {
    district: "Kheda",
    block: "Nadiad",
    activeBankSakhis: 10,
    demandIdentified: 24,
    profileVerified: 21,
    routeMatched: 14,
    packComplete: 8,
    submitted: 6,
    sanctioned: 4,
    avgDaysToPack: 13.5,
    topBottleneck: "Buyer purchase order documentation",
  },
  {
    district: "Kheda",
    block: "Kapadvanj",
    activeBankSakhis: 7,
    demandIdentified: 16,
    profileVerified: 14,
    routeMatched: 8,
    packComplete: 4,
    submitted: 3,
    sanctioned: 1,
    avgDaysToPack: 19.1,
    topBottleneck: "Missing GST/Udyam clarity for capex line",
  },
];

export const SHG_CASES_DEMO: SHGCase[] = [
  {
    id: "case-ujjwal",
    caseCode: "SCL-AND-2026-0104",
    shgName: "Ujjwal Mahila SHG",
    shgNameGu: "ઉજ્જવળ મહિલા સ્વ-સહાય જૂથ",
    lokosId: "GJ-AND-042-SHG-1189 (DEMO)",
    district: "Anand",
    block: "Anand Rural",
    cluster: "Chikhodra Cluster",
    village: "Chikhodra",
    activity: "Papad & Spice Processing",
    activityGu: "પાપડ અને મસાલા ઉત્પાદન",
    membersCount: 12,
    formationYear: 2021,
    bankSakhiName: "Meenaben Patel",
    bankSakhiPhone: "+91 98XXX XX412",
    linkedBranch: "Bank of Baroda — Chikhodra Rural",
    stage: "Finance plan ready",
    daysInStage: 4,
    readinessScore: 84,
    panchasutraScore: 5,
    panchasutraChecks: {
      regularMeetings: true,
      regularSavings: true,
      internalLending: true,
      timelyRepayment: true,
      updatedBooks: true,
    },
    officeBearers: [
      { role: "President (પ્રમુખ)", name: "Hansaben Parmar", verified: true },
      { role: "Secretary (મંત્રી)", name: "Kaviben Gohil", verified: true },
      { role: "Treasurer (ખજાનચી)", name: "Ramilaben Solanki", verified: true },
    ],
    existingDebt: 48000,
    monthlySavingsPerMember: 200,
    corpusBalance: 164000,
    applicantType: "SHG Group Enterprise",
    purposeSummary: "Semi-automated papad rolling & spice pulverizer unit expansion",
    purposeSummaryGu: "પાપડ રોલિંગ અને મસાલા ગ્રાઇન્ડીંગ યુનિટ વિસ્તરણ",
    timelineMonths: 36,
    ownContribution: 35000,
    costLines: [
      {
        id: "cl-1",
        label: "Machinery (Papad roller & spice pulverizer)",
        labelGu: "મશીનરી (પાપડ રોલર અને મસાલા ગ્રાઇન્ડર)",
        category: "Capex",
        amount: 120000,
        provenance: "Document-supported",
        note: "Vendor quotation attached (Patel Agro Machinery, Anand — illustrative)",
      },
      {
        id: "cl-2",
        label: "Raw materials (Urad dal, turmeric, chilli, cumin)",
        labelGu: "કાચો માલ (અડદ દાળ, હળદર, મરચું, જીરું)",
        category: "Working Capital",
        amount: 45000,
        provenance: "Field-verified",
        note: "45-day production cycle stock estimate",
      },
      {
        id: "cl-3",
        label: "Food-grade packaging & sealing pouches",
        labelGu: "ફૂડ-ગ્રેડ પેકેજિંગ અને સીલિંગ પાઉચ",
        category: "Working Capital",
        amount: 20000,
        provenance: "Document-supported",
        note: "Quote from Anand FlexiPack (illustrative)",
      },
      {
        id: "cl-4",
        label: "Training, hygiene & FSSAI quality setup",
        labelGu: "તાલીમ, સ્વચ્છતા અને FSSAI ગુણવત્તા વ્યવસ્થા",
        category: "Capex",
        amount: 15000,
        provenance: "Self-declared",
        note: "Food safety kit, weighing scale & stainless prep tables",
      },
      {
        id: "cl-5",
        label: "Working capital buffer (utilities, freight, wages)",
        labelGu: "કાર્યકારી મૂડી અનામત (વીજળી, ભાડું, મજૂરી)",
        category: "Working Capital",
        amount: 50000,
        provenance: "Field-verified",
        note: "Two-month operating cycle buffer",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "SHG Resolution & Inter-se Agreement (Tharav)",
        nameGu: "જૂથ ઠરાવ અને આંતરિક કરાર",
        category: "Identity & Governance",
        status: "Verified",
        provenance: "Field-verified",
        updatedAt: "18 Nov 2026",
        requiredFor: ["DAY-NRLM", "PMFME", "Bank Pack"],
      },
      {
        id: "doc-2",
        name: "Panchasutra Register & Bank Passbook (12 Months)",
        nameGu: "પંચસૂત્ર રજિસ્ટર અને બેંક પાસબુક",
        category: "Financial Books",
        status: "Verified",
        provenance: "Field-verified",
        updatedAt: "20 Nov 2026",
        requiredFor: ["DAY-NRLM", "Bank Pack"],
      },
      {
        id: "doc-3",
        name: "Machinery Vendor Quotation (₹1,20,000)",
        nameGu: "મશીનરી વેન્ડર ક્વોટેશન",
        category: "Scheme Specific",
        status: "Verified",
        provenance: "Document-supported",
        updatedAt: "22 Nov 2026",
        requiredFor: ["PMFME", "Term Loan"],
      },
      {
        id: "doc-4",
        name: "FSSAI Basic Registration Certificate",
        nameGu: "FSSAI નોંધણી પ્રમાણપત્ર",
        category: "Enterprise & Market",
        status: "Uploaded — Pending Check",
        provenance: "Document-supported",
        updatedAt: "24 Nov 2026",
        requiredFor: ["PMFME", "GLPC Saras"],
      },
      {
        id: "doc-5",
        name: "Written Buyer Offtake Letter (Anand Mahila Co-op)",
        nameGu: "ખરીદદાર તરફથી ઓર્ડર પત્ર",
        category: "Enterprise & Market",
        status: "Missing",
        provenance: "Self-declared",
        updatedAt: "Pending",
        requiredFor: ["Bank Appraisal Strengthening"],
      },
      {
        id: "doc-6",
        name: "Micro Credit Plan (MCP) Group Endorsement",
        nameGu: "માઇક્રો ક્રેડિટ પ્લાન (MCP)",
        category: "Financial Books",
        status: "Verified",
        provenance: "Field-verified",
        updatedAt: "21 Nov 2026",
        requiredFor: ["DAY-NRLM", "Bank Pack"],
      },
    ],
    consents: [
      {
        id: "con-1",
        purpose: "GLPC / Bank Sakhi assisted readiness & blueprint preparation",
        recipient: "GLPC DMMU Anand & Bank Sakhi (Meenaben Patel)",
        scope: "SHG identity, Panchasutra summary, cost breakdown & enterprise ledger",
        grantedBy: "Hansaben Parmar (President) & Kaviben Gohil (Secretary)",
        grantedOn: "16 Nov 2026",
        expiresOn: "16 May 2027",
        status: "Active",
      },
      {
        id: "con-2",
        purpose: "Illustrative lender comparison & pre-application pack routing",
        recipient: "Selected Regulated Lender (Pending SHG final confirmation)",
        scope: "Finance Passport summary, Financing Blueprint & verified document checklist",
        grantedBy: "Ujjwal Mahila SHG Quorum (10/12 members present)",
        grantedOn: "22 Nov 2026",
        expiresOn: "22 Feb 2027",
        status: "Active",
      },
    ],
    buyerEvidence: [
      {
        id: "be-1",
        buyerName: "GLPC Gram Haat & Saras Mela Channel",
        channel: "GLPC Saras / Catalogue",
        evidenceType: "Monthly Supply Ledger",
        monthlyVolumeKg: 320,
        monthlyValueINR: 57600,
        provenance: "Field-verified",
      },
      {
        id: "be-2",
        buyerName: "Anand District Consumer Co-op Store (3 outlets)",
        channel: "Local Retail Cooperative",
        evidenceType: "Written Purchase Order",
        monthlyVolumeKg: 210,
        monthlyValueINR: 37800,
        provenance: "Document-supported",
      },
      {
        id: "be-3",
        buyerName: "Charotar Tiffin & Hostel Kitchen Supply",
        channel: "Institutional Canteen",
        evidenceType: "Verbal Commitment",
        monthlyVolumeKg: 140,
        monthlyValueINR: 25200,
        provenance: "Self-declared",
      },
    ],
    unitEconomics: {
      primaryProduct: "Hand-rolled & semi-automated Urad Papad + Blended Spices (1 kg pack)",
      unitLabel: "kg",
      sellingPricePerUnit: 185,
      directCostPerUnit: 122,
      overheadPerUnit: 21,
      currentMonthlyUnits: 410,
      projectedMonthlyUnits: 670,
      peakMonths: "Oct–Nov (Diwali), Mar–May (Summer drying & wedding season)",
      leanMonths: "Jul–Aug (Peak monsoon humidity)",
    },
    tasks: [
      {
        id: "tsk-1",
        title: "Upload signed offtake confirmation from Anand Consumer Co-op",
        owner: "Meenaben Patel",
        ownerRole: "bank-sakhi",
        dueDate: "28 Nov 2026",
        status: "Due Today",
        priority: "High",
      },
      {
        id: "tsk-2",
        title: "Verify FSSAI certificate registration number on FoSCoS",
        owner: "R. K. Jadeja",
        ownerRole: "glpc-officer",
        dueDate: "29 Nov 2026",
        status: "Pending",
        priority: "Standard",
      },
      {
        id: "tsk-3",
        title: "Confirm SHG quorum sign-off on PMFME vs DAY-NRLM route choice",
        owner: "Hansaben Parmar",
        ownerRole: "shg-leader",
        dueDate: "30 Nov 2026",
        status: "Pending",
        priority: "High",
      },
    ],
    queries: [
      {
        id: "qry-1",
        raisedBy: "Bank Sakhi Readiness Check",
        raisedOn: "22 Nov 2026",
        question: "Clarify whether ₹50,000 working capital buffer is excluded from PMFME capital subsidy base.",
        response:
          "Confirmed: Only ₹1,20,000 machinery (+ eligible quality setup if approved) is mapped as Capex; working capital (₹1,15,000 total incl. raw material & packaging) is strictly routed to Cash Credit / Working Capital facility.",
        status: "Resolved",
      },
      {
        id: "qry-2",
        raisedBy: "DMMU Pre-Pack Reviewer",
        raisedOn: "25 Nov 2026",
        reasonCode: "BUYER-PROOF",
        question: "Attach buyer PO for Anand Consumer Co-op to move buyer evidence from self-declared to document-supported.",
        status: "Open",
      },
    ],
    timeline: [
      {
        id: "ev-1",
        stage: "Demand identified",
        actor: "Meenaben Patel (Bank Sakhi)",
        timestamp: "14 Nov 2026 · 10:40",
        note: "Captured ₹2,50,000 expansion demand during Chikhodra cluster meeting.",
      },
      {
        id: "ev-2",
        stage: "Profile verified",
        actor: "GLPC Master Sync (DEMO)",
        timestamp: "18 Nov 2026 · 15:15",
        note: "12 active members, Panchasutra 5/5 score & existing ₹48,000 CCL balance verified.",
      },
      {
        id: "ev-3",
        stage: "Need validated",
        actor: "Meenaben Patel (Bank Sakhi)",
        timestamp: "21 Nov 2026 · 11:20",
        note: "Separated ₹1,35,000 Capex from ₹1,15,000 Working Capital items.",
      },
      {
        id: "ev-4",
        stage: "Route matched",
        actor: "Rule Engine v2026.1 (Illustrative)",
        timestamp: "23 Nov 2026 · 09:05",
        note: "Matched DAY-NRLM SHG Term+CCL & flagged PMFME Capex eligibility verification.",
      },
      {
        id: "ev-5",
        stage: "Finance plan ready",
        actor: "Financing Blueprint Engine",
        timestamp: "25 Nov 2026 · 16:30",
        note: "3-scenario monthly cash flow generated; awaiting buyer PO for Pack Complete.",
      },
    ],
    bottleneckReason: "Awaiting written buyer PO & FSSAI verification before Pack Complete",
    isPrimaryDemo: true,
  },
  {
    id: "case-narmada",
    caseCode: "SCL-AND-2026-0098",
    shgName: "Narmada Dairy Sakhi Mandal",
    shgNameGu: "નર્મદા ડેરી સખી મંડળ",
    lokosId: "GJ-AND-019-SHG-0842 (DEMO)",
    district: "Anand",
    block: "Petlad",
    cluster: "Dharmaj Cluster",
    village: "Dharmaj",
    activity: "Ghee & Cultured Dairy",
    activityGu: "ઘી અને ડેરી ઉત્પાદન",
    membersCount: 10,
    formationYear: 2019,
    bankSakhiName: "Ritaben Solanki",
    bankSakhiPhone: "+91 97XXX XX218",
    linkedBranch: "SBI — Petlad Agri Branch",
    stage: "Submitted",
    daysInStage: 11,
    readinessScore: 93,
    panchasutraScore: 5,
    panchasutraChecks: {
      regularMeetings: true,
      regularSavings: true,
      internalLending: true,
      timelyRepayment: true,
      updatedBooks: true,
    },
    officeBearers: [
      { role: "President", name: "Shardaben Patel", verified: true },
      { role: "Secretary", name: "Bhavnaben Desai", verified: true },
      { role: "Treasurer", name: "Manjulaben Amin", verified: true },
    ],
    existingDebt: 0,
    monthlySavingsPerMember: 300,
    corpusBalance: 245000,
    applicantType: "SHG Group Enterprise",
    purposeSummary: "Milk cream separator & stainless ghee boiling kettle",
    purposeSummaryGu: "ક્રીમ સેપરેટર અને સ્ટેનલેસ ઘી બોઇલિંગ યુનિટ",
    timelineMonths: 36,
    ownContribution: 55000,
    costLines: [
      { id: "n1", label: "Cream separator & SS kettle", labelGu: "ક્રીમ સેપરેટર", category: "Capex", amount: 180000, provenance: "Document-supported", note: "Dairy equipment vendor invoice" },
      { id: "n2", label: "Glass jars & batch labels", labelGu: "કાચની બરણી", category: "Working Capital", amount: 35000, provenance: "Document-supported", note: "Packaging stock" },
      { id: "n3", label: "Raw milk & cream buffer", labelGu: "દૂધ અને મલાઈ", category: "Working Capital", amount: 85000, provenance: "Field-verified", note: "30-day cycle" },
    ],
    documents: [
      { id: "nd1", name: "SHG Resolution", nameGu: "જૂથ ઠરાવ", category: "Identity & Governance", status: "Verified", provenance: "Field-verified", updatedAt: "04 Nov 2026", requiredFor: ["DAY-NRLM"] },
      { id: "nd2", name: "Milk Union Supply Record", nameGu: "દૂધ મંડળી રેકોર્ડ", category: "Enterprise & Market", status: "Verified", provenance: "Document-supported", updatedAt: "07 Nov 2026", requiredFor: ["Bank Pack"] },
    ],
    consents: [
      { id: "nc1", purpose: "SBI Petlad official assisted submission", recipient: "SBI Petlad Agri Branch", scope: "Complete application pack", grantedBy: "Shardaben Patel", grantedOn: "10 Nov 2026", expiresOn: "10 Feb 2027", status: "Active" },
    ],
    buyerEvidence: [
      { id: "nb1", buyerName: "Dharmaj Milk Cooperative", channel: "FPO / Wholesale", evidenceType: "Monthly Supply Ledger", monthlyVolumeKg: 420, monthlyValueINR: 189000, provenance: "Document-supported" },
    ],
    unitEconomics: {
      primaryProduct: "A2 Cultured Ghee (500 ml jar)",
      unitLabel: "jar",
      sellingPricePerUnit: 460,
      directCostPerUnit: 330,
      overheadPerUnit: 35,
      currentMonthlyUnits: 340,
      projectedMonthlyUnits: 520,
      peakMonths: "Oct–Feb",
      leanMonths: "May–Jun",
    },
    tasks: [
      { id: "nt1", title: "Follow up on SBI branch field inspection visit date", owner: "Ritaben Solanki", ownerRole: "bank-sakhi", dueDate: "24 Nov 2026", status: "Overdue", priority: "High" },
    ],
    queries: [
      {
        id: "nq-1",
        raisedBy: "SBI — Petlad Agri Branch",
        raisedOn: "20 Nov 2026",
        reasonCode: "INSPECTION-DELAY",
        question: "Field inspection visit awaited by branch officer before final limit sanction.",
        status: "Open",
      },
    ],
    timeline: [
      { id: "nev1", stage: "Submitted", actor: "Ritaben Solanki (Assisted Handoff)", timestamp: "14 Nov 2026 · 14:00", note: "Physical + PDF pack handed over at SBI Petlad branch; awaiting appraisal visit." },
    ],
    bottleneckReason: "Branch field inspection pending for 11 days",
  },
  {
    id: "case-surbhi",
    caseCode: "SCL-AND-2026-0112",
    shgName: "Surbhi Khadi & Tailoring SHG",
    shgNameGu: "સુરભિ ખાદી અને ટેલરિંગ જૂથ",
    lokosId: "GJ-AND-087-SHG-2031 (DEMO)",
    district: "Anand",
    block: "Borsad",
    cluster: "Bhadran Cluster",
    village: "Bhadran",
    activity: "School Uniform & Garments",
    activityGu: "શાળા યુનિફોર્મ અને સિલાઈ",
    membersCount: 15,
    formationYear: 2022,
    bankSakhiName: "Kajalben Chauhan",
    bankSakhiPhone: "+91 96XXX XX709",
    linkedBranch: "Bank of Baroda — Bhadran",
    stage: "Need validated",
    daysInStage: 13,
    readinessScore: 68,
    panchasutraScore: 4,
    panchasutraChecks: {
      regularMeetings: true,
      regularSavings: true,
      internalLending: true,
      timelyRepayment: true,
      updatedBooks: false,
    },
    officeBearers: [
      { role: "President", name: "Kailashben Chauhan", verified: true },
      { role: "Secretary", name: "Nainaben Vaghela", verified: true },
      { role: "Treasurer", name: "Sonalben Parmar", verified: false },
    ],
    existingDebt: 72000,
    monthlySavingsPerMember: 150,
    corpusBalance: 112000,
    applicantType: "SHG Group Enterprise",
    purposeSummary: "6 motorized lockstitch machines & cutting table",
    purposeSummaryGu: "૬ મોટરાઇઝ્ડ સિલાઈ મશીન અને કટીંગ ટેબલ",
    timelineMonths: 24,
    ownContribution: 25000,
    costLines: [
      { id: "s1", label: "6 Industrial Sewing Machines", labelGu: "૬ સિલાઈ મશીન", category: "Capex", amount: 114000, provenance: "Document-supported", note: "Dealer quote" },
      { id: "s2", label: "Cotton fabric rolls & thread", labelGu: "કાપડ અને દોરા", category: "Working Capital", amount: 61000, provenance: "Self-declared", note: "Uniform season stock" },
    ],
    documents: [
      { id: "sd1", name: "Updated Cashbook (Last 3 Months)", nameGu: "છેલ્લા ૩ મહિનાની કેશબુક", category: "Financial Books", status: "Missing", provenance: "Self-declared", updatedAt: "Pending", requiredFor: ["DAY-NRLM", "Bank Pack"] },
    ],
    consents: [],
    buyerEvidence: [],
    unitEconomics: {
      primaryProduct: "Primary School Uniform Set",
      unitLabel: "set",
      sellingPricePerUnit: 340,
      directCostPerUnit: 225,
      overheadPerUnit: 30,
      currentMonthlyUnits: 180,
      projectedMonthlyUnits: 360,
      peakMonths: "May–Jul (School reopening)",
      leanMonths: "Aug–Oct",
    },
    tasks: [
      { id: "st1", title: "Update Panchasutra cashbook entries for Sep–Nov", owner: "Kajalben Chauhan", ownerRole: "bank-sakhi", dueDate: "22 Nov 2026", status: "Overdue", priority: "High" },
    ],
    queries: [
      {
        id: "sq-1",
        raisedBy: "Bank of Baroda — Bhadran",
        raisedOn: "19 Nov 2026",
        reasonCode: "MCP-MISMATCH",
        question: "Cashbook and Micro Credit Plan (MCP) working capital figures need reconciliation.",
        status: "Open",
      },
    ],
    timeline: [
      { id: "sev1", stage: "Need validated", actor: "Kajalben Chauhan", timestamp: "12 Nov 2026 · 12:15", note: "Stalled: cashbook reconciliation pending." },
    ],
    bottleneckReason: "Incomplete Panchasutra ledger (updatedBooks = false)",
  },
  {
    id: "case-prerna",
    caseCode: "SCL-KHD-2026-0076",
    shgName: "Prerna Millet Bakery Unit",
    shgNameGu: "પ્રેરણા મિલેટ બેકરી યુનિટ",
    lokosId: "GJ-KHD-011-SHG-0591 (DEMO)",
    district: "Kheda",
    block: "Nadiad",
    cluster: "Uttarsanda Cluster",
    village: "Uttarsanda",
    activity: "Ragi & Bajra Cookies (Food)",
    activityGu: "રાગી અને બાજરી બિસ્કિટ",
    membersCount: 11,
    formationYear: 2020,
    bankSakhiName: "Pritiben Shah",
    bankSakhiPhone: "+91 99XXX XX881",
    linkedBranch: "Union Bank — Uttarsanda",
    stage: "Sanctioned",
    daysInStage: 5,
    readinessScore: 96,
    panchasutraScore: 5,
    panchasutraChecks: {
      regularMeetings: true,
      regularSavings: true,
      internalLending: true,
      timelyRepayment: true,
      updatedBooks: true,
    },
    officeBearers: [
      { role: "President", name: "Dakshaben Patel", verified: true },
      { role: "Secretary", name: "Jignaben Joshi", verified: true },
      { role: "Treasurer", name: "Alka Patel", verified: true },
    ],
    existingDebt: 20000,
    monthlySavingsPerMember: 250,
    corpusBalance: 198000,
    applicantType: "SHG Group Enterprise",
    purposeSummary: "Rotary convection oven & millet flour mill",
    purposeSummaryGu: "રોટરી ઓવન અને મિલેટ ફ્લોર મિલ",
    timelineMonths: 48,
    ownContribution: 60000,
    costLines: [
      { id: "p1", label: "Convection oven & flour mill", labelGu: "ઓવન અને મિલ", category: "Capex", amount: 240000, provenance: "Lender-verified", note: "Appraised by Union Bank" },
      { id: "p2", label: "Millet grain, jaggery & packaging", labelGu: "મિલેટ અને પેકેજિંગ", category: "Working Capital", amount: 90000, provenance: "Document-supported", note: "60-day cycle" },
    ],
    documents: [],
    consents: [],
    buyerEvidence: [],
    unitEconomics: {
      primaryProduct: "Millet Cookies (250g box)",
      unitLabel: "box",
      sellingPricePerUnit: 85,
      directCostPerUnit: 48,
      overheadPerUnit: 12,
      currentMonthlyUnits: 1200,
      projectedMonthlyUnits: 2100,
      peakMonths: "Oct–Mar",
      leanMonths: "Jul",
    },
    tasks: [],
    queries: [],
    branchDecision: {
      status: "Approved",
      note: "Sanctioned for rotary convection oven & millet flour mill after inspection.",
      decidedAt: "21 Nov 2026",
      sanctionedAmountINR: 270000,
    },
    timeline: [],
  },
  {
    id: "case-ambika",
    caseCode: "SCL-KHD-2026-0119",
    shgName: "Ambika Vermicompost Collective",
    shgNameGu: "અંબિકા વર્મીકમ્પોસ્ટ જૂથ",
    lokosId: "GJ-KHD-034-SHG-1402 (DEMO)",
    district: "Kheda",
    block: "Kapadvanj",
    cluster: "Antroli Cluster",
    village: "Antroli",
    activity: "Bio-fertilizer & Nursery",
    activityGu: "વર્મીકમ્પોસ્ટ અને નર્સરી",
    membersCount: 14,
    formationYear: 2023,
    bankSakhiName: "Hemlataben Rathod",
    bankSakhiPhone: "+91 94XXX XX330",
    linkedBranch: "Bank of Baroda — Kapadvanj",
    stage: "Route matched",
    daysInStage: 9,
    readinessScore: 71,
    panchasutraScore: 5,
    panchasutraChecks: {
      regularMeetings: true,
      regularSavings: true,
      internalLending: true,
      timelyRepayment: true,
      updatedBooks: true,
    },
    officeBearers: [
      { role: "President", name: "Ranjanben Rathod", verified: true },
      { role: "Secretary", name: "Geetaben Zala", verified: true },
      { role: "Treasurer", name: "Ushaben Parmar", verified: true },
    ],
    existingDebt: 0,
    monthlySavingsPerMember: 150,
    corpusBalance: 89000,
    applicantType: "SHG Group Enterprise",
    purposeSummary: "24 HDPE vermibeds, shade net & sieving machine",
    purposeSummaryGu: "૨૪ વર્મીબેડ અને શેડ નેટ",
    timelineMonths: 24,
    ownContribution: 20000,
    costLines: [
      { id: "a1", label: "Shade net & HDPE beds", labelGu: "શેડ નેટ અને બેડ", category: "Capex", amount: 95000, provenance: "Document-supported", note: "Agri supplier quote" },
      { id: "a2", label: "Sacks, culture & transport", labelGu: "બારદાન અને ટ્રાન્સપોર્ટ", category: "Working Capital", amount: 45000, provenance: "Self-declared", note: "Seasonal stock" },
    ],
    documents: [],
    consents: [],
    buyerEvidence: [],
    unitEconomics: {
      primaryProduct: "Enriched Vermicompost (50 kg bag)",
      unitLabel: "bag",
      sellingPricePerUnit: 320,
      directCostPerUnit: 175,
      overheadPerUnit: 35,
      currentMonthlyUnits: 140,
      projectedMonthlyUnits: 290,
      peakMonths: "Jun–Jul, Nov–Dec (Sowing)",
      leanMonths: "Apr–May",
    },
    tasks: [],
    queries: [
      {
        id: "aq-1",
        raisedBy: "Bank of Baroda — Kapadvanj",
        raisedOn: "21 Nov 2026",
        reasonCode: "BUYER-PROOF",
        question: "Submit block FPO buyer offtake letter to validate vermicompost demand.",
        status: "Open",
      },
    ],
    timeline: [],
    bottleneckReason: "Awaiting block FPO buyer letter for cash-flow validation",
  },
];

export function getSchemeMatchesForCase(shg: SHGCase): SchemeMatchItem[] {
  const capex = shg.costLines
    .filter((c) => c.category === "Capex")
    .reduce((sum, c) => sum + c.amount, 0);
  const wc = shg.costLines
    .filter((c) => c.category === "Working Capital")
    .reduce((sum, c) => sum + c.amount, 0);
  const totalCost = capex + wc;
  const externalNeed = Math.max(0, totalCost - shg.ownContribution);
  const isGujarat = shg.district === "Anand" || shg.district === "Kheda" || shg.district === "Vadodara" || shg.district === "Mehsana";
  const isGroupSHG = shg.applicantType === "SHG Group Enterprise" || shg.applicantType === "Federation / FPO";
  const isFoodProcessing =
    shg.activity.toLowerCase().includes("papad") ||
    shg.activity.toLowerCase().includes("spice") ||
    shg.activity.toLowerCase().includes("dairy") ||
    shg.activity.toLowerCase().includes("food") ||
    shg.activity.toLowerCase().includes("millet");

  const machineryItem = shg.costLines.find((c) =>
    c.label.toLowerCase().includes("machinery") ||
    c.label.toLowerCase().includes("oven") ||
    c.label.toLowerCase().includes("separator") ||
    c.label.toLowerCase().includes("sewing") ||
    c.label.toLowerCase().includes("beds")
  );
  const machineryAmt = machineryItem ? machineryItem.amount : Math.round(capex * 0.85);
  const illustrativePMFME = Math.round(machineryAmt * 0.35);

  const ue = shg.unitEconomics;
  const netMarginUnit = Math.max(0, ue.sellingPricePerUnit - ue.directCostPerUnit - ue.overheadPerUnit);
  const projectedAnnualSurplus = ue.projectedMonthlyUnits * netMarginUnit * 12;
  const annualIncomePerMember = Math.round(projectedAnnualSurplus / Math.max(1, shg.membersCount));
  const shgAgeYears = 2026 - shg.formationYear;

  const schemes: SchemeMatchItem[] = [
    {
      id: "sch-glpc-nrlm",
      schemeName: "GLPC Mission Mangalam — Sakhi Mandal Bank Linkage (0% State Subvention)",
      agency: "GLPC · DAY-NRLM Gujarat",
      isGlpcCore: true,
      instrumentType: "Bank Loan (CCL / Term)",
      fitStatus:
        shg.panchasutraScore >= 4 && isGroupSHG && externalNeed <= 2000000
          ? "Absolute Match"
          : isGroupSHG
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (isGroupSHG ? 40 : 0) +
        (shg.panchasutraScore >= 4 ? 30 : 10) +
        (isGujarat ? 15 : 0) +
        (externalNeed <= 2000000 ? 15 : 0),
      eligibilityChecklist: [
        { rule: "Registered Sakhi Mandal / SHG Group", passed: isGroupSHG },
        { rule: "Panchasutra Score ≥ 4/5", passed: shg.panchasutraScore >= 4 },
        { rule: "Gujarat District (0% State Subvention + Stamp Waiver)", passed: isGujarat },
        { rule: "External Credit Within ₹20L CCL/Term Norm", passed: externalNeed <= 2000000 },
      ],
      indicativeEligibilityAmount: `Up to ₹${externalNeed.toLocaleString("en-IN")} (0% effective interest on timely repayment; stamp duty waived up to ₹10L)`,
      whyMatched: [
        `Active Sakhi Mandal (${shg.membersCount} members, formed ${shg.formationYear}) with ${shg.panchasutraScore}/5 Panchasutra compliance.`,
        `Gujarat State Interest Subvention bridges the gap over DAY-NRLM 7%/4% rates down to 0% effective interest for regular repayers.`,
        `Supports blended Capex (₹${capex.toLocaleString("en-IN")}) + Working Capital CCL (₹${wc.toLocaleString("en-IN")}) up to ₹20L.`,
      ],
      conditionsToVerify: [
        "Confirm bank branch grading against current RBI Master Circular on DAY-NRLM.",
        "Verify whether existing SHG debt (₹" + shg.existingDebt.toLocaleString("en-IN") + ") is closed or rolled into enhanced CCL.",
        "Timely monthly repayment is mandatory to retain 0% effective state interest subvention.",
      ],
      exclusions: [
        "Not a capital grant; full principal is repayable to the lending bank.",
        "Stamp duty waiver applies up to ₹10,00,000 limit per Gujarat norms.",
      ],
      requiredDocuments: [
        "SHG Resolution & Inter-se Agreement (Tharav)",
        "12-month Panchasutra Register & Bank Passbook",
        "Endorsed Micro Credit Plan (MCP)",
        "KYC of 3 authorised office bearers",
      ],
      sourceAnchor: "GLPC Mission Mangalam & RBI Master Circular — DAY-NRLM",
      ruleVersion: "RULE-GLPC-NRLM-2026.2",
      lastVerifiedDate: "15 Nov 2026",
    },
    {
      id: "sch-glpc-cif",
      schemeName: "GLPC — Community Investment Fund (CIF) via Cluster Federation",
      agency: "GLPC · CLF / VO Channel",
      isGlpcCore: true,
      instrumentType: "Federation Corpus (CIF)",
      fitStatus:
        isGroupSHG && shg.panchasutraScore >= 4 && externalNeed <= 250000
          ? "Strong Fit — Verify Conditions"
          : isGroupSHG
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (isGroupSHG ? 35 : 0) +
        (shg.panchasutraScore >= 4 ? 25 : 10) +
        (externalNeed <= 250000 ? 20 : 8) +
        (isGujarat ? 10 : 0),
      eligibilityChecklist: [
        { rule: "Member of GLPC Village Org / CLF", passed: isGroupSHG },
        { rule: "Panchasutra Books & MCP Updated", passed: shg.panchasutraScore >= 4 },
        { rule: "Ideal Ticket Size (≤ ₹2.5L Tranche)", passed: externalNeed <= 250000 },
      ],
      indicativeEligibilityAmount: `₹50,000 – ₹2,50,000 federation tranche (can co-fund working capital / margin share)`,
      whyMatched: [
        "CIF is a perpetual community corpus routed by GLPC through Cluster Level Federations (CLFs) for SHG livelihoods.",
        "Can bridge working capital or SHG own-contribution gap faster than retail bank term loans.",
      ],
      conditionsToVerify: [
        `Confirm active CIF liquidity in ${shg.cluster} (${shg.block} block).`,
        "Verify whether the SHG has already availed a prior CIF tranche and its repayment status.",
      ],
      exclusions: [
        "Repayable to the Village Organisation / CLF at federation-approved interest (typically 6–12% p.a.).",
        "Subject to CLF executive committee prioritization.",
      ],
      requiredDocuments: [
        "Endorsed Micro Credit Plan (MCP)",
        "CLF / VO Recommendation Letter",
        "Internal Lending Ledger",
      ],
      sourceAnchor: "GLPC Mission Mangalam — CIF & Federation Guidelines",
      ruleVersion: "RULE-GLPC-CIF-2026.1",
      lastVerifiedDate: "14 Nov 2026",
    },
    {
      id: "sch-guj-mmuy",
      schemeName: "Mukhyamantri Mahila Utkarsh Yojana (MMUY) — 0% Interest Loan",
      agency: "Government of Gujarat (Urban & Rural)",
      isGlpcCore: true,
      instrumentType: "State 0% Interest Loan",
      fitStatus:
        isGroupSHG && shg.membersCount >= 10 && externalNeed <= 100000
          ? "Absolute Match"
          : isGroupSHG && shg.membersCount >= 10
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (isGroupSHG && shg.membersCount >= 10 ? 40 : 10) +
        (isGujarat ? 20 : 0) +
        (externalNeed <= 100000 ? 35 : 15),
      eligibilityChecklist: [
        { rule: "Women SHG / JLEG (≥ 10 Women Members)", passed: isGroupSHG && shg.membersCount >= 10 },
        { rule: "Gujarat Resident Group", passed: isGujarat },
        { rule: "Loan Within ₹1,00,000 Ceiling", passed: externalNeed <= 100000 },
      ],
      indicativeEligibilityAmount:
        externalNeed <= 100000
          ? `₹${externalNeed.toLocaleString("en-IN")} at 0% Interest (up to ₹1,00,000 ceiling)`
          : `Partial cap: Up to ₹1,00,000 at 0% interest (remaining ₹${(externalNeed - 100000).toLocaleString("en-IN")} requires Bank Linkage)`,
      whyMatched: [
        `Group has ${shg.membersCount} women members (meets ≥ 10 member MMUY norm) in ${shg.district}, Gujarat.`,
        "Collateral-free bank loan with 100% interest borne by the Government of Gujarat.",
      ],
      conditionsToVerify: [
        "Confirm group is not simultaneously availing another state 0% interest subsidy for the same loan account.",
        "Verify bank participation under MMUY district allocation.",
      ],
      exclusions: [
        "STRICT CEILING: Maximum ₹1,00,000 per SHG/JLEG under MMUY; larger expansion needs must route to DAY-NRLM CCL.",
      ],
      requiredDocuments: [
        "10-Member Group KYC & Aadhaar",
        "MMUY Joint Liability / SHG Resolution",
        "Bank Account Passbook",
      ],
      sourceAnchor: "Government of Gujarat — MMUY Guidelines",
      ruleVersion: "RULE-GUJ-MMUY-2026.1",
      lastVerifiedDate: "15 Nov 2026",
    },
    {
      id: "sch-glpc-lakhpati",
      schemeName: "GLPC — Lakhpati Didi Enterprise Convergence Support",
      agency: "GLPC · MoRD Convergence",
      isGlpcCore: true,
      instrumentType: "Bank Loan (CCL / Term)",
      fitStatus:
        isGroupSHG && annualIncomePerMember >= 100000
          ? "Absolute Match"
          : isGroupSHG && annualIncomePerMember >= 60000
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (isGroupSHG ? 30 : 0) +
        (annualIncomePerMember >= 100000 ? 40 : annualIncomePerMember >= 60000 ? 22 : 5) +
        (shg.buyerEvidence.length > 0 ? 15 : 5) +
        (shg.panchasutraScore >= 4 ? 10 : 0),
      eligibilityChecklist: [
        { rule: "Active Sakhi Mandal Member Collective", passed: isGroupSHG },
        { rule: "Projected Net Income ≥ ₹1,00,000 / Member / Yr", passed: annualIncomePerMember >= 100000 },
        { rule: "Verified Market / Saras Buyer Linkage", passed: shg.buyerEvidence.length > 0 },
      ],
      indicativeEligibilityAmount: `Projected ₹${annualIncomePerMember.toLocaleString("en-IN")}/member/yr net surplus + GLPC Saras / Packaging & Skill convergence`,
      whyMatched: [
        `Projected enterprise surplus generates ~₹${annualIncomePerMember.toLocaleString("en-IN")} per member annually.`,
        "Unlocks priority GLPC Bank Sakhi handholding, Saras Mela / Garvi market access, and multi-scheme convergence.",
      ],
      conditionsToVerify: [
        "Validate projected unit volume against written buyer purchase orders.",
        "Tag individual SHG members in GLPC Lakhpati Didi MIS tracker.",
      ],
      exclusions: [
        "Not a standalone cash loan—acts as a convergence wrapper combining Bank Linkage, CIF, and PMFME/skill grants.",
      ],
      requiredDocuments: [
        "Unit Economics & 6–12 Month Sales Ledger",
        "Buyer Offtake / GLPC Saras Linkage Proof",
      ],
      sourceAnchor: "GLPC Mission Mangalam — Lakhpati Didi Framework",
      ruleVersion: "RULE-GLPC-LD-2026.1",
      lastVerifiedDate: "15 Nov 2026",
    },
    {
      id: "sch-pmfme-cap",
      schemeName: "PMFME — Credit-Linked Capital Subsidy (Micro Food Processing)",
      agency: "MoFPI · Gujarat Agro SNA",
      isGlpcCore: false,
      instrumentType: "Capital Subsidy (Credit-Linked)",
      fitStatus:
        isFoodProcessing && capex > 0
          ? "Strong Fit — Verify Conditions"
          : "Not Applicable / Excluded",
      matchScore: isFoodProcessing && capex > 0 ? 88 : 10,
      eligibilityChecklist: [
        { rule: "Food-Processing Sector Activity", passed: isFoodProcessing },
        { rule: "Eligible Fixed Capex (Machinery > ₹0)", passed: capex > 0 },
        { rule: "Capex Separated from Working Capital", passed: true },
      ],
      indicativeEligibilityAmount: isFoodProcessing
        ? `Illustrative 35% on eligible machinery (₹${machineryAmt.toLocaleString("en-IN")}) = ₹${illustrativePMFME.toLocaleString("en-IN")} (NOT guaranteed)`
        : "Excluded — non-food enterprise",
      whyMatched: isFoodProcessing
        ? [
            `Enterprise activity (${shg.activity}) falls under micro food-processing category.`,
            `Capex machinery line of ₹${machineryAmt.toLocaleString("en-IN")} is separated from working capital for clean eligible-cost assessment.`,
            "35% credit-linked capital subsidy (up to ₹10 lakh ceiling) subject to active window and bank term-loan sanction.",
          ]
        : [
            `Activity (${shg.activity}) is outside food-processing scope under PMFME guidelines.`,
          ],
      conditionsToVerify: isFoodProcessing
        ? [
            "Confirm current PMFME application window with MoFPI portal & Gujarat State Nodal Agency.",
            "Confirm SHG group holds valid Udyam & FSSAI registration.",
            "Only bank-appraised eligible fixed capital (machinery/equipment) qualifies.",
          ]
        : ["N/A — route excluded based on sector rule."],
      exclusions: [
        "STRICT EXCLUSION: Working capital (₹" + wc.toLocaleString("en-IN") + " raw material, packaging, wages) is NOT eligible for PMFME capital subsidy.",
        "Do NOT double-finance machinery cost across multiple capital subsidies.",
      ],
      requiredDocuments: [
        "Detailed Project Report (DPR) separating Capex & Working Capital",
        "Vendor quotation for eligible food-processing machinery",
        "FSSAI Registration & Udyam Registration",
        "Bank Term Loan appraisal concurrence",
      ],
      sourceAnchor: "MoFPI PMFME Official Portal (pmfme.mofpi.gov.in) & Gujarat SNA",
      ruleVersion: "RULE-PMFME-CAP-2026.1",
      lastVerifiedDate: "12 Nov 2026",
    },
    {
      id: "sch-guj-vby",
      schemeName: "Shri Vajpayee Bankable Yojana (VBY) — Women Artisan & Enterprise Subsidy",
      agency: "Commissionerate of Cottage & Rural Industries, Gujarat",
      isGlpcCore: false,
      instrumentType: "Capital Subsidy (Credit-Linked)",
      fitStatus:
        shg.applicantType === "Member Micro-Enterprise" && externalNeed <= 2500000
          ? "Strong Fit — Verify Conditions"
          : isGujarat && externalNeed <= 2500000
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (shg.applicantType === "Member Micro-Enterprise" ? 45 : 20) +
        (isGujarat ? 25 : 0) +
        (externalNeed <= 2500000 ? 20 : 0),
      eligibilityChecklist: [
        { rule: "Individual / Artisan / Proprietor Borrower", passed: shg.applicantType === "Member Micro-Enterprise" },
        { rule: "Gujarat Industry / Service / Business Sector", passed: isGujarat },
        { rule: "Project Cost Within ₹8L–₹25L Norm", passed: externalNeed <= 2500000 },
      ],
      indicativeEligibilityAmount:
        shg.applicantType === "Member Micro-Enterprise"
          ? `40% Rural Women Subsidy (30% Urban), capped up to ₹3,75,000`
          : `Near Match: Requires applying as an individual SHG woman entrepreneur rather than group SHG`,
      whyMatched: [
        "Gujarat flagship bankable subsidy offering 40% subsidy for Rural Women (30% Urban Women) across Industry, Service, and Business sectors.",
        "Ideal if an SHG member scales an individual tailoring, spice, or service unit.",
      ],
      conditionsToVerify: [
        "Applicant age 18–65, minimum 4th pass or relevant training/experience.",
        "Cannot combine VBY subsidy with PMFME capital subsidy for the same asset.",
      ],
      exclusions: [
        "Designed for individual artisans/entrepreneurs—collective SHG groups normally route via DAY-NRLM / MMUY.",
      ],
      requiredDocuments: [
        "Individual Aadhaar, Ration Card & Age Proof",
        "Training / Experience Certificate",
        "Project Report & Bank Consent",
      ],
      sourceAnchor: "Commissionerate of Cottage & Rural Industries (e-MSME / Digital Gujarat)",
      ruleVersion: "RULE-GUJ-VBY-2026.1",
      lastVerifiedDate: "12 Nov 2026",
    },
    {
      id: "sch-pmfme-seed",
      schemeName: "PMFME — SHG Seed Capital Route (via GLPC / CLF)",
      agency: "MoFPI · GLPC Federation Channel",
      isGlpcCore: true,
      instrumentType: "SHG Seed Capital",
      fitStatus: isFoodProcessing && isGroupSHG ? "Near Match — Conditional" : "Not Applicable / Excluded",
      matchScore: isFoodProcessing && isGroupSHG ? 72 : 12,
      eligibilityChecklist: [
        { rule: "Food-Processing SHG Members", passed: isFoodProcessing },
        { rule: "Routed via GLPC / CLF Channel", passed: isGroupSHG },
      ],
      indicativeEligibilityAmount: isFoodProcessing
        ? "Up to ₹40,000 per eligible SHG member for working capital / small tools via CLF"
        : "Excluded — non-food SHG",
      whyMatched: isFoodProcessing
        ? [
            "Relevant if individual SHG members already engaged in food processing seek working-capital seed support through prescribed GLPC/CLF channels.",
          ]
        : ["Activity is outside food-processing sector."],
      conditionsToVerify: [
        "Verify whether members have already availed PMFME seed capital earlier (one-time per eligible member).",
        "Confirm active GLPC/CLF channel allocation in " + shg.district + " district.",
      ],
      exclusions: [
        "Distinct from enterprise credit-linked capital subsidy — cannot be claimed for the same cost item.",
      ],
      requiredDocuments: [
        "SHG member list with existing food-processing activity proof",
        "Cluster Level Federation (CLF) recommendation",
      ],
      sourceAnchor: "PMFME SHG Seed Capital Guidelines & GLPC Circulars",
      ruleVersion: "RULE-PMFME-SEED-2026.1",
      lastVerifiedDate: "12 Nov 2026",
    },
    {
      id: "sch-glpc-rf",
      schemeName: "GLPC — Revolving Fund (RF) Early-Stage Corpus Grant",
      agency: "GLPC · DAY-NRLM Gujarat",
      isGlpcCore: true,
      instrumentType: "Grant / Revolving Fund",
      fitStatus:
        isGroupSHG && shgAgeYears <= 2 && shg.corpusBalance < 50000
          ? "Strong Fit — Verify Conditions"
          : isGroupSHG
          ? "Near Match — Conditional"
          : "Not Applicable / Excluded",
      matchScore:
        (isGroupSHG ? 25 : 0) +
        (shgAgeYears <= 2 ? 25 : 5) +
        (shg.corpusBalance < 50000 ? 20 : 5),
      eligibilityChecklist: [
        { rule: "Sakhi Mandal Group", passed: isGroupSHG },
        { rule: "Early-Stage Group (≤ 2 Years) / Low Corpus", passed: shgAgeYears <= 2 || shg.corpusBalance < 50000 },
        { rule: "Panchasutra Practised ≥ 3 Months", passed: shg.panchasutraScore >= 3 },
      ],
      indicativeEligibilityAmount: "₹10,000 – ₹15,000 one-time grant (likely already availed by mature SHGs)",
      whyMatched: [
        "Foundational GLPC grant to strengthen internal lending corpus before bank credit linkage.",
      ],
      conditionsToVerify: [
        `Group formed in ${shg.formationYear} (${shgAgeYears} yrs old, corpus ₹${shg.corpusBalance.toLocaleString("en-IN")}) — verify if RF was already disbursed.`,
      ],
      exclusions: [
        "One-time grant only; cannot fund ₹1L+ machinery expansion.",
      ],
      requiredDocuments: [
        "3–6 Month Panchasutra Register",
        "SHG Bank Account Verification",
      ],
      sourceAnchor: "GLPC Mission Mangalam — Revolving Fund Norms",
      ruleVersion: "RULE-GLPC-RF-2026.1",
      lastVerifiedDate: "12 Nov 2026",
    },
    {
      id: "sch-mudra",
      schemeName: "PM MUDRA Yojana (Shishu / Kishore / Tarun)",
      agency: "DFS · Government of India",
      isGlpcCore: false,
      instrumentType: "Micro-Enterprise Term/WC",
      fitStatus:
        shg.applicantType === "Member Micro-Enterprise"
          ? "Absolute Match"
          : "Not Applicable / Excluded",
      matchScore: shg.applicantType === "Member Micro-Enterprise" ? 90 : 15,
      eligibilityChecklist: [
        { rule: "Individual / Proprietor Micro-Enterprise", passed: shg.applicantType === "Member Micro-Enterprise" },
        { rule: "Non-Farm Income-Generating Activity", passed: true },
      ],
      indicativeEligibilityAmount:
        shg.applicantType === "Member Micro-Enterprise"
          ? "Up to ₹50,000 (Shishu) or ₹5,00,000 (Kishore) per eligible individual"
          : "Excluded at Group SHG level — requires individual/legal micro-enterprise borrower",
      whyMatched:
        shg.applicantType === "Member Micro-Enterprise"
          ? ["Selected applicant type is Member Micro-Enterprise (individual/proprietor borrower)."]
          : [
              `Current applicant is "${shg.applicantType}". MUDRA targets individual micro-enterprise borrowers rather than collective SHG group linkage.`,
            ],
      conditionsToVerify: [
        "Check personal credit bureau history & lender MUDRA policy if applying individually.",
      ],
      exclusions: [
        "Do NOT assume an SHG group qualifies as a single MUDRA borrower.",
        "Do not duplicate project cost across DAY-NRLM group loan and individual MUDRA loan.",
      ],
      requiredDocuments: ["Individual KYC", "Udyam Registration", "Cash-flow estimate"],
      sourceAnchor: "Department of Financial Services — PMMY Guidelines",
      ruleVersion: "RULE-PMMY-2026.1",
      lastVerifiedDate: "10 Nov 2026",
    },
  ];

  return schemes.sort((a, b) => b.matchScore - a.matchScore);
}

export function getDemoOffersForCase(shg: SHGCase): DemoLenderOffer[] {
  const totalCost = shg.costLines.reduce((s, c) => s + c.amount, 0);
  const externalNeed = Math.max(50000, totalCost - shg.ownContribution);
  const tenor = shg.timelineMonths || 36;

  // Standard monthly reducing balance formula for illustrative estimation only
  const calcEMI = (p: number, annualPct: number, m: number) => {
    const r = annualPct / 12 / 100;
    if (r === 0) return Math.round(p / m);
    return Math.round((p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1));
  };

  return [
    {
      id: "off-bob",
      lenderName: "Bank of Baroda (DEMO)",
      branchOrChannel: shg.linkedBranch,
      productName: "Baroda SHG Enterprise Term + CCL (Illustrative)",
      borrowerType: shg.applicantType,
      indicativeAmountINR: externalNeed,
      tenorMonths: tenor,
      aprBasis: "Illustrative ~9.85% p.a. (Subject to published MCLR + DAY-NRLM subvention norms)",
      estimatedMonthlyInstalmentINR: calcEMI(externalNeed, 9.85, tenor),
      processingFee: "Nil / As per published PSB SHG tariff (Verify at branch)",
      penalChargeBasis: "Only on overdue portion per RBI Fair Practices / Penal Charges circular",
      securityMargin: "Nil collateral up to prescribed NRLM limit; 10–15% group margin",
      requiredDocsCount: 5,
      kfsStatus: "Illustrative KFS template attached — final KFS issued only by bank",
      sourceDate: "Product catalogue stub · 15 Nov 2026",
      rankingNote: "Ordered alphabetically — no paid ranking",
    },
    {
      id: "off-sbi",
      lenderName: "State Bank of India (DEMO)",
      branchOrChannel: "Nearest Rural / Semi-Urban Branch",
      productName: "Swayam Sidhha SHG Credit Linkage (Illustrative)",
      borrowerType: shg.applicantType,
      indicativeAmountINR: externalNeed,
      tenorMonths: tenor,
      aprBasis: "Illustrative ~9.70%–10.25% p.a. (Subject to bank grading & latest circular)",
      estimatedMonthlyInstalmentINR: calcEMI(externalNeed, 10.0, tenor),
      processingFee: "Nil up to ₹3,00,000 per published SHG guidelines (Verify)",
      penalChargeBasis: "Non-compounding penal charge on delayed instalment only",
      securityMargin: "Hypothecation of machinery/stock; no third-party collateral up to norm",
      requiredDocsCount: 6,
      kfsStatus: "Illustrative KFS summary — verify at branch prior to signing",
      sourceDate: "Product catalogue stub · 15 Nov 2026",
      rankingNote: "Ordered alphabetically — no paid ranking",
    },
    {
      id: "off-bggb",
      lenderName: "Baroda Gujarat Gramin Bank (DEMO)",
      branchOrChannel: `${shg.block} Regional Rural Bank Branch`,
      productName: "RRB Mission Mangalam SHG Livelihood Loan (Illustrative)",
      borrowerType: shg.applicantType,
      indicativeAmountINR: externalNeed,
      tenorMonths: tenor,
      aprBasis: "Illustrative ~10.40% p.a. (Verify RRB current board-approved rate)",
      estimatedMonthlyInstalmentINR: calcEMI(externalNeed, 10.4, tenor),
      processingFee: "0%–0.25% subject to current RRB tariff sheet",
      penalChargeBasis: "As per RRB RBI-compliant penal charge schedule",
      securityMargin: "Group inter-se guarantee + asset hypothecation",
      requiredDocsCount: 5,
      kfsStatus: "Illustrative terms — not a binding sanction or commitment",
      sourceDate: "Product catalogue stub · 15 Nov 2026",
      rankingNote: "Ordered alphabetically — no paid ranking",
    },
  ];
}

export const AUDIT_EVENTS_DEMO = [
  { id: "aud-1", time: "25 Nov 2026 · 16:31", actor: "Meenaben Patel (Bank Sakhi)", action: "Updated Financing Blueprint cost split for SCL-AND-2026-0104", scope: "Capex ₹1,35,000 / WC ₹1,15,000" },
  { id: "aud-2", time: "25 Nov 2026 · 14:12", actor: "R. K. Jadeja (GLPC Officer)", action: "Assigned FSSAI verification task to Anand cluster queue", scope: "Case SCL-AND-2026-0104" },
  { id: "aud-3", time: "22 Nov 2026 · 11:05", actor: "Hansaben Parmar (SHG Leader)", action: "Granted purpose-specific consent (con-2) for pre-application pack", scope: "Expires 22 Feb 2027" },
  { id: "aud-4", time: "18 Nov 2026 · 15:18", actor: "System Rule Engine", action: "Loaded versioned scheme catalogue v2026.1 (DEMO)", scope: "DAY-NRLM, PMFME, PMMY" },
];
