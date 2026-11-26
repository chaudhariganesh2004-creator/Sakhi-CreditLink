import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Database,
  IndianRupee,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import type { SHGCase } from "@/data/sakhi-data";
import {
  getLokOSAdapterState,
  verifySHGByLokosId,
  type LokOSAdapterMode,
} from "@/lib/lokos-adapter";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SHGIntakeProps {
  onCreateCase: (newCase: SHGCase) => void;
  onCancel?: () => void;
}

const ACTIVITY_PRESETS = [
  { label: "Food Processing (Papad / Spice / Bakery)", value: "Papad & Spice Processing", isFood: true, defaultProduct: "Packaged Food Product (1 kg)" },
  { label: "Dairy & Ghee Processing", value: "Ghee & Cultured Dairy", isFood: true, defaultProduct: "Cultured Ghee (500 ml jar)" },
  { label: "Garments & Tailoring", value: "School Uniform & Garments", isFood: false, defaultProduct: "Tailored Garment Set" },
  { label: "Bio-fertilizer & Agri-input", value: "Bio-fertilizer & Nursery", isFood: false, defaultProduct: "Vermicompost (50 kg bag)" },
  { label: "Handicrafts & Retail Enterprise", value: "Artisan Handicrafts", isFood: false, defaultProduct: "Handcrafted Unit" },
];

export const SHGIntakeScreen: React.FC<SHGIntakeProps> = ({ onCreateCase, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Phased LokOS Adapter Gate (Day 1: GLPC Cluster Snapshot -> Scale: Official LokOS API)
  const adapterState = getLokOSAdapterState();
  const [lokosInput, setLokosInput] = useState("GJ-AND-042-SHG-1189");
  const [lokosStatus, setLokosStatus] = useState<"idle" | "checking" | "verified" | "unregistered">("idle");
  const [verifiedLokosId, setVerifiedLokosId] = useState<string | null>(null);
  const [verifiedMode, setVerifiedMode] = useState<LokOSAdapterMode>(adapterState.mode);

  // Step 1: SHG Identity & Governance
  const [shgName, setShgName] = useState("");
  const [district, setDistrict] = useState("Anand");
  const [block, setBlock] = useState("Anand Rural");
  const [village, setVillage] = useState("");
  const [membersCount, setMembersCount] = useState(12);
  const [formationYear, setFormationYear] = useState(2022);
  const [presidentName, setPresidentName] = useState("");
  const [applicantType, setApplicantType] = useState<SHGCase["applicantType"]>("SHG Group Enterprise");
  const [panchasutraChecks, setPanchasutraChecks] = useState({
    regularMeetings: true,
    regularSavings: true,
    internalLending: true,
    timelyRepayment: true,
    updatedBooks: true,
  });

  // Step 2: Enterprise & Credit Need (Capex vs Working Capital)
  const [activity, setActivity] = useState("Papad & Spice Processing");
  const [purposeSummary, setPurposeSummary] = useState("");
  const [capexAmount, setCapexAmount] = useState(135000);
  const [capexLabel, setCapexLabel] = useState("Machinery & equipment setup");
  const [wcAmount, setWcAmount] = useState(115000);
  const [wcLabel, setWcLabel] = useState("Raw material, packaging & 60-day cycle buffer");
  const [ownContribution, setOwnContribution] = useState(35000);
  const [existingDebt, setExistingDebt] = useState(0);
  const [corpusBalance, setCorpusBalance] = useState(140000);
  const [timelineMonths, setTimelineMonths] = useState(36);

  // Step 3: Unit Economics & Market Readiness
  const [primaryProduct, setPrimaryProduct] = useState("Packaged Food Product (1 kg)");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(185);
  const [directCostPerUnit, setDirectCostPerUnit] = useState(122);
  const [overheadPerUnit, setOverheadPerUnit] = useState(21);
  const [currentMonthlyUnits, setCurrentMonthlyUnits] = useState(350);
  const [projectedMonthlyUnits, setProjectedMonthlyUnits] = useState(650);
  const [buyerName, setBuyerName] = useState("");
  const [buyerMonthlyValue, setBuyerMonthlyValue] = useState(45000);

  const totalCost = Math.max(0, capexAmount) + Math.max(0, wcAmount);
  const externalNeed = Math.max(0, totalCost - Math.max(0, ownContribution));
  const panchasutraScore = Object.values(panchasutraChecks).filter(Boolean).length;

  const verifyLokosRegistration = async (idOverride?: string) => {
    const query = (idOverride ?? lokosInput).trim().toUpperCase();
    if (!query) return;
    setLokosStatus("checking");
    const res = await verifySHGByLokosId(query);
    if (res.verified && res.record) {
      const match = res.record;
      setShgName(match.shgName);
      setDistrict(match.district);
      setBlock(match.block);
      setVillage(match.village);
      setMembersCount(match.membersCount);
      setFormationYear(match.formationYear);
      setPresidentName(match.presidentName);
      setPanchasutraChecks(match.panchasutraChecks);
      setVerifiedLokosId(match.lokosId);
      setVerifiedMode(res.mode);
      setLokosStatus("verified");
    } else {
      setVerifiedLokosId(null);
      setLokosStatus("unregistered");
    }
  };

  const fillQuickSample = () => {
    setLokosInput("GJ-AND-042-SHG-1189");
    setVerifiedLokosId("GJ-AND-042-SHG-1189");
    setLokosStatus("verified");
    setShgName("Shakti Mahila Enterprise SHG");
    setDistrict("Anand");
    setBlock("Anand Rural");
    setVillage("Karamsad");
    setMembersCount(12);
    setFormationYear(2021);
    setPresidentName("Gitaben Patel");
    setApplicantType("SHG Group Enterprise");
    setActivity("Papad & Spice Processing");
    setPurposeSummary("Semi-automated spice grinding & hygienic packaging unit");
    setCapexAmount(140000);
    setCapexLabel("Spice pulverizer & sealing machinery");
    setWcAmount(95000);
    setWcLabel("Raw spices, food-grade pouches & operating buffer");
    setOwnContribution(35000);
    setExistingDebt(25000);
    setCorpusBalance(155000);
    setTimelineMonths(36);
    setPrimaryProduct("Blended Masala Pack (1 kg)");
    setSellingPricePerUnit(210);
    setDirectCostPerUnit(135);
    setOverheadPerUnit(22);
    setCurrentMonthlyUnits(380);
    setProjectedMonthlyUnits(680);
    setBuyerName("Anand District Co-op Store");
    setBuyerMonthlyValue(52000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = shgName.trim() || "New Sakhi SHG";
    const idSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 16);
    const codeNum = Math.floor(1000 + Math.random() * 8999);
    const caseCode = `SCL-${district.slice(0, 3).toUpperCase()}-2026-${codeNum}`;

    const readinessBase = 55 + panchasutraScore * 5 + (buyerName.trim() ? 10 : 0) + (ownContribution > 0 ? 5 : 0);
    const readinessScore = Math.min(96, readinessBase);

    const newCase: SHGCase = {
      id: `case-${idSlug}-${Date.now()}`,
      caseCode,
      shgName: cleanName,
      shgNameGu: cleanName,
      lokosId: verifiedLokosId ?? `GJ-${district.slice(0, 3).toUpperCase()}-SHG-${codeNum}`,
      district,
      block,
      cluster: `${block} Cluster`,
      village: village.trim() || block,
      activity,
      activityGu: activity,
      membersCount,
      formationYear,
      bankSakhiName: "Meenaben Patel",
      bankSakhiPhone: "+91 98XXX XX412",
      linkedBranch: `Bank of Baroda — ${block}`,
      stage: "Route matched",
      daysInStage: 1,
      readinessScore,
      panchasutraScore,
      panchasutraChecks,
      officeBearers: [
        { role: "President", name: presidentName.trim() || "SHG President", verified: true },
        { role: "Secretary", name: "Group Secretary", verified: true },
        { role: "Treasurer", name: "Group Treasurer", verified: true },
      ],
      existingDebt,
      monthlySavingsPerMember: 200,
      corpusBalance,
      applicantType,
      purposeSummary: purposeSummary.trim() || `${activity} expansion & working capital`,
      purposeSummaryGu: purposeSummary.trim() || activity,
      timelineMonths,
      ownContribution,
      costLines: [
        {
          id: `cl-cap-${Date.now()}`,
          label: capexLabel.trim() || "Machinery & Fixed Assets",
          labelGu: capexLabel.trim() || "મશીનરી",
          category: "Capex",
          amount: capexAmount,
          provenance: "Self-declared",
          note: "Captured during SHG digital intake",
        },
        {
          id: `cl-wc-${Date.now()}`,
          label: wcLabel.trim() || "Raw Material & Working Capital",
          labelGu: wcLabel.trim() || "કાચો માલ",
          category: "Working Capital",
          amount: wcAmount,
          provenance: "Self-declared",
          note: "Separated from Capex for accurate scheme eligibility",
        },
      ],
      documents: [
        {
          id: `doc-1-${Date.now()}`,
          name: "SHG Resolution & Inter-se Agreement (Tharav)",
          nameGu: "જૂથ ઠરાવ",
          category: "Identity & Governance",
          status: "Uploaded — Pending Check",
          provenance: "Self-declared",
          updatedAt: "Today",
          requiredFor: ["DAY-NRLM", "Bank Pack"],
        },
        {
          id: `doc-2-${Date.now()}`,
          name: "Panchasutra Register & Bank Passbook",
          nameGu: "પંચસૂત્ર રજિસ્ટર",
          category: "Financial Books",
          status: panchasutraScore === 5 ? "Verified" : "Uploaded — Pending Check",
          provenance: panchasutraScore === 5 ? "Field-verified" : "Self-declared",
          updatedAt: "Today",
          requiredFor: ["DAY-NRLM", "Bank Pack"],
        },
        {
          id: `doc-3-${Date.now()}`,
          name: "Machinery Vendor Quotation",
          nameGu: "મશીનરી ક્વોટેશન",
          category: "Scheme Specific",
          status: "Missing",
          provenance: "Self-declared",
          updatedAt: "Pending",
          requiredFor: ["PMFME", "Term Loan"],
        },
      ],
      consents: [
        {
          id: `con-${Date.now()}`,
          purpose: "Digital diagnosis, scheme matching & pre-application readiness",
          recipient: "Sakhi CreditLink & Assigned Bank Sakhi",
          scope: "SHG profile, Panchasutra summary, cost split & cash-flow blueprint",
          grantedBy: presidentName.trim() || cleanName,
          grantedOn: "Today",
          expiresOn: "6 months",
          status: "Active",
        },
      ],
      buyerEvidence: buyerName.trim()
        ? [
            {
              id: `be-${Date.now()}`,
              buyerName: buyerName.trim(),
              channel: "Local Retail Cooperative",
              evidenceType: "Written Purchase Order",
              monthlyVolumeKg: Math.round(projectedMonthlyUnits * 0.6),
              monthlyValueINR: buyerMonthlyValue,
              provenance: "Self-declared",
            },
          ]
        : [],
      unitEconomics: {
        primaryProduct,
        unitLabel: "unit",
        sellingPricePerUnit,
        directCostPerUnit,
        overheadPerUnit,
        currentMonthlyUnits,
        projectedMonthlyUnits,
        peakMonths: "Oct–Mar",
        leanMonths: "Jul–Aug",
      },
      tasks: [
        {
          id: `tsk-${Date.now()}`,
          title: "Attach vendor quotation & verify Panchasutra passbook",
          owner: "Bank Sakhi",
          ownerRole: "bank-sakhi",
          dueDate: "In 3 days",
          status: "Due Today",
          priority: "High",
        },
      ],
      queries: [],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          stage: "Digital Intake Completed",
          actor: presidentName.trim() || cleanName,
          timestamp: "Just now",
          note: `Submitted ${formatINR(externalNeed)} external credit need (${formatINR(capexAmount)} Capex / ${formatINR(wcAmount)} Working Capital).`,
        },
      ],
      bottleneckReason: "Vendor quotation pending upload for Pack Complete",
    };

    onCreateCase(newCase);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 " >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--sakhi-mint)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
            <Sparkles className="h-3.5 w-3.5" /> Live Credit Assessment
          </div>
          <h1 className="mt-2 font-serif font-semibold text-[32px] leading-tight text-[var(--sakhi-slate)]">
            Start SHG Credit Application
          </h1>
          <p className="mt-1 text-[14px] text-[var(--sakhi-muted)]">
            Enter your group&apos;s details in 3 quick steps to run instant financial diagnosis and scheme matching.
          </p>
        </div>

        <button
          type="button"
          onClick={fillQuickSample}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--sakhi-border)] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[var(--sakhi-forest)]  transition-all hover:bg-[var(--sakhi-mint)]/40"
        >
          <Wand2 className="h-3.5 w-3.5" /> Quick Fill Sample
        </button>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: 1, label: "Group Profile", icon: Users },
          { num: 2, label: "Credit Need", icon: IndianRupee },
          { num: 3, label: "Unit Economics", icon: Building2 },
        ].map((item) => {
          const active = step === item.num;
          const done = step > item.num;
          const Icon = item.icon;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => setStep(item.num as 1 | 2 | 3)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3.5 text-left transition-all",
                active
                  ? "border-[var(--sakhi-forest)] bg-white  ring-1 ring-[var(--sakhi-forest)]/15"
                  : done
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-[var(--sakhi-border)] bg-white/60 text-[var(--sakhi-muted)]"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold",
                  active
                    ? "bg-[var(--sakhi-forest)] text-white"
                    : done
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--sakhi-surface)] text-[var(--sakhi-muted)]"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">
                  Step {item.num}
                </div>
                <div className="truncate text-[13.5px] font-bold text-[var(--sakhi-slate)]">
                  {item.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="rounded-lg border border-[var(--sakhi-border)] bg-white p-6 md:p-8  space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            {/* Simulated NRLM / LokOS Verification Gate */}
            <div className="rounded-lg border border-[var(--sakhi-forest)]/20 bg-[var(--sakhi-mint)]/45 p-4 md:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[var(--sakhi-forest)]" />
                  <span className="text-[13px] font-bold text-[var(--sakhi-slate)]">
                    NRLM / LokOS Registration Check (Simulated API)
                  </span>
                </div>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10.5px] font-semibold text-[var(--sakhi-forest)] border border-[var(--sakhi-forest)]/15">
                  {adapterState.mode === "official-api"
                    ? "Scale: Official LokOS API"
                    : `Day-1: GLPC Snapshot (${adapterState.count} SHGs)`}
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={lokosInput}
                  onChange={(e) => {
                    setLokosInput(e.target.value);
                    if (lokosStatus !== "idle") setLokosStatus("idle");
                  }}
                  placeholder="Enter NRLM LokOS SHG ID (e.g. GJ-AND-042-SHG-1189)"
                  className="h-10 flex-1 rounded-lg border border-[var(--sakhi-border)] bg-white px-3.5 font-mono text-[13px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => verifyLokosRegistration()}
                  disabled={lokosStatus === "checking"}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-4 text-[12.5px] font-semibold text-white hover:bg-[var(--sakhi-forest-deep)] disabled:opacity-60"
                >
                  {lokosStatus === "checking" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking NRLM...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" /> Verify &amp; Auto-Fill
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-[var(--sakhi-muted)]">
                <span>Test IDs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLokosInput("GJ-AND-042-SHG-1189");
                    verifyLokosRegistration("GJ-AND-042-SHG-1189");
                  }}
                  className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--sakhi-forest)] border border-[var(--sakhi-border)] hover:bg-emerald-50"
                >
                  GJ-AND-042-SHG-1189 (Registered)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLokosInput("UNREG-SHG-0000");
                    verifyLokosRegistration("UNREG-SHG-0000");
                  }}
                  className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-red-600 border border-[var(--sakhi-border)] hover:bg-red-50"
                >
                  UNREG-SHG-0000 (Unregistered)
                </button>
              </div>

              {lokosStatus === "verified" && (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>
                      Verified via {verifiedMode === "official-api" ? "Official NRLM LokOS API" : "GLPC Authorised LokOS Snapshot"}:
                    </strong>{" "}
                    Group identity, office bearer, and Panchasutra records auto-populated below — zero duplicate entry.
                  </span>
                </div>
              )}

              {lokosStatus === "unregistered" && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] text-red-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <span>
                    <strong>Access Restricted:</strong> This ID is not found in the NRLM / LokOS registry. Only NRLM-registered SHGs can proceed. Please register via your GLPC Cluster /{" "}
                    <a href="https://aajeevika.gov.in/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                      aajeevika.gov.in
                    </a>.
                  </span>
                </div>
              )}
            </div>

            {lokosStatus !== "verified" ? (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-5 text-[13px] text-[var(--sakhi-muted)]">
                <Lock className="h-5 w-5 shrink-0 text-[var(--sakhi-forest)]" />
                <span>
                  Verify an NRLM / LokOS SHG ID above (or click <strong>Quick Fill Sample</strong>) to unlock and auto-fill the SHG profile.
                </span>
              </div>
            ) : null}

            <div className={cn("grid gap-4 sm:grid-cols-2 transition-opacity", lokosStatus !== "verified" && "opacity-45 pointer-events-none select-none")}>
              <div className="sm:col-span-2">
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">
                  SHG / Enterprise Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={shgName}
                  onChange={(e) => setShgName(e.target.value)}
                  placeholder="e.g., Shakti Mahila Enterprise SHG"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                >
                  <option value="Anand">Anand</option>
                  <option value="Kheda">Kheda</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Mehsana">Mehsana</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Block / Taluka</label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g., Anand Rural"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g., Chikhodra"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">SHG President / Leader</label>
                <input
                  type="text"
                  value={presidentName}
                  onChange={(e) => setPresidentName(e.target.value)}
                  placeholder="e.g., Hansaben Parmar"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Applicant Type</label>
                <select
                  value={applicantType}
                  onChange={(e) => setApplicantType(e.target.value as SHGCase["applicantType"])}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                >
                  <option value="SHG Group Enterprise">SHG Group Enterprise</option>
                  <option value="Member Micro-Enterprise">Member Micro-Enterprise</option>
                  <option value="Federation / FPO">Federation / FPO</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Members</label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={membersCount}
                    onChange={(e) => setMembersCount(Number(e.target.value) || 10)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 font-mono text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Formed Year</label>
                  <input
                    type="number"
                    min={2005}
                    max={2026}
                    value={formationYear}
                    onChange={(e) => setFormationYear(Number(e.target.value) || 2022)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 font-mono text-[14px]"
                  />
                </div>
              </div>
            </div>

            {/* Panchasutra quick checks */}
            <div className="rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12.5px] font-bold text-[var(--sakhi-slate)]">Panchasutra Readiness ({panchasutraScore}/5)</span>
                <span className="text-[11.5px] text-[var(--sakhi-muted)]">Check active habits</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { key: "regularMeetings", label: "Regular Meetings" },
                  { key: "regularSavings", label: "Regular Savings" },
                  { key: "internalLending", label: "Internal Lending" },
                  { key: "timelyRepayment", label: "Timely Repayment" },
                  { key: "updatedBooks", label: "Updated Books" },
                ].map((item) => {
                  const checked = panchasutraChecks[item.key as keyof typeof panchasutraChecks];
                  return (
                    <label key={item.key} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[12.5px] border border-[var(--sakhi-border)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setPanchasutraChecks((prev) => ({ ...prev, [item.key]: !checked }))
                        }
                        className="accent-[var(--sakhi-forest)]"
                      />
                      <span className="font-medium text-[var(--sakhi-slate)]">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Livelihood / Enterprise Sector</label>
                <select
                  value={activity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActivity(val);
                    const preset = ACTIVITY_PRESETS.find((p) => p.value === val);
                    if (preset) setPrimaryProduct(preset.defaultProduct);
                  }}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                >
                  {ACTIVITY_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Purpose Summary</label>
                <input
                  type="text"
                  value={purposeSummary}
                  onChange={(e) => setPurposeSummary(e.target.value)}
                  placeholder="e.g., Machinery purchase & 60-day raw material stock for expansion"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px] text-[var(--sakhi-slate)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 space-y-3">
                <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--sakhi-forest)]">Capital Expenditure (Capex)</div>
                <input
                  type="text"
                  value={capexLabel}
                  onChange={(e) => setCapexLabel(e.target.value)}
                  placeholder="Machinery / equipment"
                  className="h-10 w-full rounded-lg border border-[var(--sakhi-border)] bg-white px-3 text-[13px]"
                />
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={capexAmount}
                  onChange={(e) => setCapexAmount(Number(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-[var(--sakhi-border)] bg-white px-3 font-mono text-[14px] font-bold"
                />
              </div>

              <div className="rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] p-4 space-y-3">
                <div className="text-[12px] font-bold uppercase tracking-wider text-amber-700">Working Capital</div>
                <input
                  type="text"
                  value={wcLabel}
                  onChange={(e) => setWcLabel(e.target.value)}
                  placeholder="Raw material & buffer"
                  className="h-10 w-full rounded-lg border border-[var(--sakhi-border)] bg-white px-3 text-[13px]"
                />
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={wcAmount}
                  onChange={(e) => setWcAmount(Number(e.target.value) || 0)}
                  className="h-10 w-full rounded-lg border border-[var(--sakhi-border)] bg-white px-3 font-mono text-[14px] font-bold"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">SHG Own Contribution (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={ownContribution}
                  onChange={(e) => setOwnContribution(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Repayment Tenor (Months)</label>
                <select
                  value={timelineMonths}
                  onChange={(e) => setTimelineMonths(Number(e.target.value))}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 font-mono text-[14px]"
                >
                  <option value={24}>24 months (2 years)</option>
                  <option value={36}>36 months (3 years)</option>
                  <option value={48}>48 months (4 years)</option>
                  <option value={60}>60 months (5 years)</option>
                </select>
              </div>
            </div>

            {/* Live Need Calculation Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Calculated External Credit Need</div>
                <div className="text-[12.5px] text-[var(--sakhi-muted)]">
                  Total Project {formatINR(totalCost)} − Own Share {formatINR(ownContribution)}
                </div>
              </div>
              <div className="font-serif font-semibold text-[28px] text-[var(--sakhi-forest)] tabular-nums">
                {formatINR(externalNeed)}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Primary Product / Service</label>
                <input
                  type="text"
                  value={primaryProduct}
                  onChange={(e) => setPrimaryProduct(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Selling Price / Unit (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={sellingPricePerUnit}
                  onChange={(e) => setSellingPricePerUnit(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Direct Cost / Unit (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={directCostPerUnit}
                  onChange={(e) => setDirectCostPerUnit(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Current Monthly Units</label>
                <input
                  type="number"
                  min={0}
                  value={currentMonthlyUnits}
                  onChange={(e) => setCurrentMonthlyUnits(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Projected Post-Loan Units / Mo</label>
                <input
                  type="number"
                  min={1}
                  value={projectedMonthlyUnits}
                  onChange={(e) => setProjectedMonthlyUnits(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Primary Buyer / Channel (Optional)</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g., Local Retail Co-op / GLPC Saras"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--sakhi-slate)]">Est. Monthly Buyer Value (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={buyerMonthlyValue}
                  onChange={(e) => setBuyerMonthlyValue(Number(e.target.value) || 0)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3.5 font-mono text-[14px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--sakhi-border)] pt-5">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--sakhi-border)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--sakhi-slate)] hover:bg-[var(--sakhi-surface)]"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg px-4 py-2.5 text-[13px] font-medium text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && lokosStatus !== "verified"}
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--sakhi-forest)] px-6 py-2.5 text-[13.5px] font-semibold text-white  hover:bg-[var(--sakhi-forest-deep)] disabled:opacity-45 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--sakhi-forest)] px-6 py-3 text-[14px] font-semibold text-white shadow-md shadow-[var(--sakhi-forest)]/20 hover:bg-[var(--sakhi-forest-deep)]"
            >
              <Sparkles className="h-4 w-4" /> Run Digital Diagnosis &amp; Match
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
