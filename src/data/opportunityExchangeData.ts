/**
 * Simulated data for Sakhi Opportunity Exchange (PS000311 · Seva First Innovation Challenge).
 * All buyer opportunities, SHG production capacities, and budgets below are simulated demonstration data.
 */

export type OpportunityCategory = "millet" | "tailoring" | "dairy";

export interface BuyerOpportunity {
  id: string;
  category: OpportunityCategory;
  buyerName: string;
  productName: string;
  quantity: number;
  unitLabel: string;
  budgetINR: number;
  deadlineDays: number;
  location: string;
  district: string;
  status: "Open" | "Closing Soon";
  defaultTotalCostINR: number;
  qualitySpec: string;
  packagingSpec: string;
}

export interface ExchangeSHG {
  id: string;
  code: string;
  name: string;
  location: string;
  district: string;
  distanceKm: number;
  category: OpportunityCategory;
  productExpertise: string;
  availableCapacity: number;
  workingCapitalINR: number;
  maxDeliveryDays: number;
  productCompatibilityRaw: number; // 0..100 rule input based on equipment + skill match
  sharedResourceRole: string;
  isCriticalResource: boolean;
  criticalResourceName?: string;
}

export const OPPORTUNITY_SIMULATED_NOTICE =
  "Simulated demonstration data. Not a real order or bank approval.";

export const BUYER_OPPORTUNITIES: BuyerOpportunity[] = [
  {
    id: "opp-millet",
    category: "millet",
    buyerName: "Regional Food Distributor",
    productName: "Millet Snack Packages",
    quantity: 5000,
    unitLabel: "packs",
    budgetINR: 250000,
    deadlineDays: 30,
    location: "Gandhinagar, Gujarat",
    district: "Gandhinagar",
    status: "Open",
    defaultTotalCostINR: 175000,
    qualitySpec: "Roasted Ragi & Bajra mix, < 4% moisture, FSSAI batch label",
    packagingSpec: "150g nitrogen-flushed food-grade pouch with MRP barcode",
  },
  {
    id: "opp-uniform",
    category: "tailoring",
    buyerName: "State School Uniform Supplier",
    productName: "Primary School Uniform Sets",
    quantity: 1500,
    unitLabel: "sets",
    budgetINR: 375000,
    deadlineDays: 45,
    location: "Mehsana, Gujarat",
    district: "Mehsana",
    status: "Open",
    defaultTotalCostINR: 262500,
    qualitySpec: "Pre-shrunk cotton blend, double-stitched seams, sizes 6–12",
    packagingSpec: "Size-tagged polybag bundles of 10 sets in moisture-proof carton",
  },
  {
    id: "opp-dairy",
    category: "dairy",
    buyerName: "Regional Dairy Cooperative",
    productName: "Artisanal A2 Ghee & Paneer Packs",
    quantity: 2000,
    unitLabel: "packs",
    budgetINR: 400000,
    deadlineDays: 20,
    location: "Anand, Gujarat",
    district: "Anand",
    status: "Open",
    defaultTotalCostINR: 280000,
    qualitySpec: "Bilona A2 ghee (500 ml) & chilled paneer with cold-chain seal",
    packagingSpec: "Tamper-evident glass jar / vacuum pouch with batch date",
  },
];

export const EXCHANGE_SHGS: ExchangeSHG[] = [
  // 5 Millet SHGs (1,000 + 1,200 + 800 + 1,000 + 1,000 = 5,000 units; Working Capital = ₹55,000)
  {
    id: "shg-millet-a",
    code: "SHG A",
    name: "SHG A · Pragati Millet Sakhi Mandal",
    location: "Adalaj, Gandhinagar",
    district: "Gandhinagar",
    distanceKm: 12,
    category: "millet",
    productExpertise: "Millet Roasting & Snack Processing",
    availableCapacity: 1000,
    workingCapitalINR: 14000,
    maxDeliveryDays: 24,
    productCompatibilityRaw: 96,
    sharedResourceRole: "Food Processing Machine",
    isCriticalResource: true,
    criticalResourceName: "Food Processing Machine (SHG A)",
  },
  {
    id: "shg-millet-b",
    code: "SHG B",
    name: "SHG B · Nari Shakti Food Unit",
    location: "Kalol, Gandhinagar",
    district: "Gandhinagar",
    distanceKm: 18,
    category: "millet",
    productExpertise: "Automated Pouch Sealing & Snack Prep",
    availableCapacity: 1200,
    workingCapitalINR: 15000,
    maxDeliveryDays: 25,
    productCompatibilityRaw: 94,
    sharedResourceRole: "Packaging Equipment",
    isCriticalResource: true,
    criticalResourceName: "Packaging Equipment (SHG B)",
  },
  {
    id: "shg-millet-c",
    code: "SHG C",
    name: "SHG C · Sujalam Grain Collective",
    location: "Mansa, Gandhinagar",
    district: "Gandhinagar",
    distanceKm: 22,
    category: "millet",
    productExpertise: "Grain Cleaning, Grading & Dry Storage",
    availableCapacity: 800,
    workingCapitalINR: 9000,
    maxDeliveryDays: 26,
    productCompatibilityRaw: 88,
    sharedResourceRole: "Storage Facility",
    isCriticalResource: true,
    criticalResourceName: "Storage Facility (SHG C)",
  },
  {
    id: "shg-millet-d",
    code: "SHG D",
    name: "SHG D · Mahila Ekta Udhyog",
    location: "Dahegam, Gandhinagar",
    district: "Gandhinagar",
    distanceKm: 26,
    category: "millet",
    productExpertise: "Millet Mixing, Seasoning & Batch Sorting",
    availableCapacity: 1000,
    workingCapitalINR: 9000,
    maxDeliveryDays: 28,
    productCompatibilityRaw: 86,
    sharedResourceRole: "Workforce",
    isCriticalResource: false,
  },
  {
    id: "shg-millet-e",
    code: "SHG E",
    name: "SHG E · Asha Deep Sakhi Group",
    location: "Kadi Border, Mehsana",
    district: "Mehsana",
    distanceKm: 34,
    category: "millet",
    productExpertise: "Batch Roasting & Dispatch Workforce",
    availableCapacity: 1000,
    workingCapitalINR: 8000,
    maxDeliveryDays: 29,
    productCompatibilityRaw: 84,
    sharedResourceRole: "Workforce",
    isCriticalResource: false,
  },

  // 4 Tailoring / Uniform SHGs (450 + 400 + 350 + 300 = 1,500 sets; Working Capital = ₹82,500)
  {
    id: "shg-tailor-a",
    code: "SHG T1",
    name: "Surbhi Khadi & Tailoring SHG",
    location: "Unjha, Mehsana",
    district: "Mehsana",
    distanceKm: 14,
    category: "tailoring",
    productExpertise: "Industrial Lockstitch & Uniform Stitching",
    availableCapacity: 450,
    workingCapitalINR: 25000,
    maxDeliveryDays: 38,
    productCompatibilityRaw: 95,
    sharedResourceRole: "Motorized Stitching Line",
    isCriticalResource: true,
    criticalResourceName: "Motorized Stitching Line (Surbhi SHG)",
  },
  {
    id: "shg-tailor-b",
    code: "SHG T2",
    name: "Navjivan Silai Sakhi Mandal",
    location: "Visnagar, Mehsana",
    district: "Mehsana",
    distanceKm: 19,
    category: "tailoring",
    productExpertise: "Fabric Cutting & Pattern Grading",
    availableCapacity: 400,
    workingCapitalINR: 22500,
    maxDeliveryDays: 40,
    productCompatibilityRaw: 92,
    sharedResourceRole: "Master Cutting Table",
    isCriticalResource: true,
    criticalResourceName: "Master Cutting Table (Navjivan SHG)",
  },
  {
    id: "shg-tailor-c",
    code: "SHG T3",
    name: "Tejaswi Garment Collective",
    location: "Vijapur, Mehsana",
    district: "Mehsana",
    distanceKm: 26,
    category: "tailoring",
    productExpertise: "Buttoning, Overlock & Quality Finishing",
    availableCapacity: 350,
    workingCapitalINR: 18500,
    maxDeliveryDays: 42,
    productCompatibilityRaw: 88,
    sharedResourceRole: "Steam Iron & Finishing Unit",
    isCriticalResource: true,
    criticalResourceName: "Steam Iron & Finishing Unit (Tejaswi SHG)",
  },
  {
    id: "shg-tailor-d",
    code: "SHG T4",
    name: "Ambika Vastra Sakhi Group",
    location: "Kheralu, Mehsana",
    district: "Mehsana",
    distanceKm: 35,
    category: "tailoring",
    productExpertise: "School Shirt & Skirt Tailoring Crew",
    availableCapacity: 300,
    workingCapitalINR: 16500,
    maxDeliveryDays: 43,
    productCompatibilityRaw: 84,
    sharedResourceRole: "Workforce",
    isCriticalResource: false,
  },

  // 4 Dairy SHGs (600 + 550 + 450 + 400 = 2,000 packs; Working Capital = ₹90,000)
  {
    id: "shg-dairy-a",
    code: "SHG D1",
    name: "Narmada Dairy Sakhi Mandal",
    location: "Dharmaj, Anand",
    district: "Anand",
    distanceKm: 10,
    category: "dairy",
    productExpertise: "Bilona A2 Ghee Boiling & Clarification",
    availableCapacity: 600,
    workingCapitalINR: 30000,
    maxDeliveryDays: 16,
    productCompatibilityRaw: 97,
    sharedResourceRole: "SS Ghee Boiling & Cream Separator",
    isCriticalResource: true,
    criticalResourceName: "SS Ghee Boiling & Cream Separator (Narmada SHG)",
  },
  {
    id: "shg-dairy-b",
    code: "SHG D2",
    name: "Amulya Dugdh Utpadak SHG",
    location: "Petlad, Anand",
    district: "Anand",
    distanceKm: 16,
    category: "dairy",
    productExpertise: "Fresh Paneer Pressing & Cold Chilling",
    availableCapacity: 550,
    workingCapitalINR: 24000,
    maxDeliveryDays: 17,
    productCompatibilityRaw: 93,
    sharedResourceRole: "Cold Storage Chiller",
    isCriticalResource: true,
    criticalResourceName: "Cold Storage Chiller (Amulya SHG)",
  },
  {
    id: "shg-dairy-c",
    code: "SHG D3",
    name: "Borsad Mahila Dairy Collective",
    location: "Borsad, Anand",
    district: "Anand",
    distanceKm: 22,
    category: "dairy",
    productExpertise: "Glass Jar Sterilization & Vacuum Sealing",
    availableCapacity: 450,
    workingCapitalINR: 20000,
    maxDeliveryDays: 18,
    productCompatibilityRaw: 89,
    sharedResourceRole: "Vacuum Packaging & Batch Labeling",
    isCriticalResource: true,
    criticalResourceName: "Vacuum Packaging & Labeling (Borsad SHG)",
  },
  {
    id: "shg-dairy-d",
    code: "SHG D4",
    name: "Kheda Gau-Amrut Sakhi Group",
    location: "Nadiad, Kheda",
    district: "Kheda",
    distanceKm: 28,
    category: "dairy",
    productExpertise: "Milk Sourcing & Dispatch Logistics",
    availableCapacity: 400,
    workingCapitalINR: 16000,
    maxDeliveryDays: 19,
    productCompatibilityRaw: 85,
    sharedResourceRole: "Workforce",
    isCriticalResource: false,
  },
];
