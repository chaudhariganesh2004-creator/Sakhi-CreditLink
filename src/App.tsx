import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  BookOpenCheck,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Compass,
  FileSpreadsheet,
  FolderCheck,
  Languages,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RotateCcw,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  ROLE_META,
  SHG_CASES_DEMO,
  type AppLanguage,
  type NavScreenId,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import {
  clearCasesStorage,
  loadCasesState,
  saveCasesState,
} from "@/lib/storage";
import { resetLokOSSnapshotStorage } from "@/lib/lokos-adapter";
import { SHGIntakeScreen } from "@/screens/SHGIntakeScreen";
import { RoleProfitDashboardScreen } from "@/screens/RoleProfitDashboardScreen";
import { CommandCentreScreen } from "@/screens/CommandCentreScreen";
import { DirectoryScreen } from "@/screens/DirectoryScreen";
import { FinancePassportScreen } from "@/screens/FinancePassportScreen";
import { CreditDemandScreen } from "@/screens/CreditDemandScreen";
import { FinancingBlueprintScreen } from "@/screens/FinancingBlueprintScreen";
import { SchemeMatchScreen } from "@/screens/SchemeMatchScreen";
import { OfferComparisonScreen } from "@/screens/OfferComparisonScreen";
import { ApplicationPackScreen } from "@/screens/ApplicationPackScreen";
import { PostDisbursementGuardScreen } from "@/screens/PostDisbursementGuardScreen";
import { LivelihoodEvidenceScreen } from "@/screens/LivelihoodEvidenceScreen";
import { FieldFollowupsScreen } from "@/screens/FieldFollowupsScreen";
import { ProgrammeInsightsScreen } from "@/screens/ProgrammeInsightsScreen";
import { LandingPage } from "@/screens/LandingPage";
import { cn } from "@/lib/utils";

type AppView = "landing" | "portal";

type ProcessCategoryId =
  | "application"
  | "diagnosis"
  | "matching"
  | "pack"
  | "programme";

interface ProcessCategory {
  id: ProcessCategoryId;
  stepLabel: string;
  label: string;
  defaultScreen: NavScreenId;
  items: { id: NavScreenId; label: string; icon: React.ElementType }[];
}

const PROCESS_CATEGORIES: ProcessCategory[] = [
  {
    id: "application",
    stepLabel: "01",
    label: "Application",
    defaultScreen: "shg-intake",
    items: [
      { id: "shg-intake", label: "New SHG Intake", icon: PlusCircle },
      { id: "finance-passport", label: "Finance Passport", icon: BookOpenCheck },
      { id: "credit-demand", label: "Credit Demand", icon: FileSpreadsheet },
    ],
  },
  {
    id: "diagnosis",
    stepLabel: "02",
    label: "Diagnosis",
    defaultScreen: "financing-blueprint",
    items: [
      { id: "financing-blueprint", label: "Financing Blueprint", icon: Activity },
      { id: "livelihood-evidence", label: "Livelihood Evidence", icon: Building2 },
    ],
  },
  {
    id: "matching",
    stepLabel: "03",
    label: "Matching",
    defaultScreen: "scheme-match",
    items: [
      { id: "scheme-match", label: "Scheme Match", icon: Compass },
      { id: "offer-comparison", label: "Offer Comparison", icon: Scale },
    ],
  },
  {
    id: "pack",
    stepLabel: "04",
    label: "Application Pack",
    defaultScreen: "application-pack",
    items: [
      { id: "application-pack", label: "Pack & Submission", icon: FolderCheck },
      { id: "post-disbursement", label: "Post-Disbursement & 0% Guard", icon: ShieldCheck },
    ],
  },
  {
    id: "programme",
    stepLabel: "05",
    label: "Programme",
    defaultScreen: "command-centre",
    items: [
      { id: "command-centre", label: "Command Centre", icon: LayoutDashboard },
      { id: "shg-directory", label: "SHG Directory", icon: Users },
      { id: "field-followups", label: "Field Follow-ups", icon: ClipboardCheck },
      { id: "programme-insights", label: "Insights", icon: BarChart3 },
      { id: "role-profit-dashboard", label: "Role & Profit Hub", icon: BadgeIndianRupee },
    ],
  },
];

export function App() {
  const initialStored = useMemo(() => loadCasesState(), []);
  const [appView, setAppView] = useState<AppView>("landing");
  const [cases, setCases] = useState<SHGCase[]>(initialStored.cases);
  const [activeCaseId, setActiveCaseId] = useState<string>(initialStored.activeCaseId);
  const [screen, setScreen] = useState<NavScreenId>("shg-intake");
  const [role, setRole] = useState<UserRole>("shg-leader");
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [selectedLenderId, setSelectedLenderId] = useState<string>("off-bob");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCaseSwitcher, setShowCaseSwitcher] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    saveCasesState(cases, activeCaseId);
  }, [cases, activeCaseId]);

  const handleResetDemo = () => {
    clearCasesStorage();
    resetLokOSSnapshotStorage();
    setCases(SHG_CASES_DEMO);
    setActiveCaseId(SHG_CASES_DEMO[0].id);
    setSelectedLenderId("off-bob");
    setConfirmReset(false);
    setScreen("shg-intake");
  };

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) ?? cases[0],
    [cases, activeCaseId]
  );

  const activeCategory = useMemo(
    () =>
      PROCESS_CATEGORIES.find((cat) =>
        cat.items.some((item) => item.id === screen)
      ) ?? PROCESS_CATEGORIES[0],
    [screen]
  );

  const handleUpdateCase = (updated: SHGCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleCreateCase = (newCase: SHGCase) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    // Start the diagnosis & matching flow immediately on their newly entered data
    setScreen("financing-blueprint");
  };

  const handleSelectCase = (caseId: string, navigateTo?: NavScreenId) => {
    setActiveCaseId(caseId);
    if (navigateTo) setScreen(navigateTo);
    setGlobalSearch("");
    setShowSearch(false);
    setShowCaseSwitcher(false);
  };

  const handleNavigate = (target: NavScreenId) => {
    setScreen(target);
  };

  const searchMatches = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return cases.filter(
      (c) =>
        c.shgName.toLowerCase().includes(q) ||
        c.caseCode.toLowerCase().includes(q) ||
        c.block.toLowerCase().includes(q) ||
        c.activity.toLowerCase().includes(q)
    );
  }, [cases, globalSearch]);

  if (appView === "landing") {
    return (
      <LandingPage
        onEnterPortal={() => {
          setScreen("shg-intake");
          setAppView("portal");
        }}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "shg-intake":
        return (
          <SHGIntakeScreen
            onCreateCase={handleCreateCase}
            onCancel={() => setScreen("finance-passport")}
          />
        );
      case "role-profit-dashboard":
        return (
          <RoleProfitDashboardScreen
            cases={cases}
            role={role}
            onChangeRole={setRole}
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        );
      case "command-centre":
        return (
          <CommandCentreScreen
            cases={cases}
            activeCaseId={activeCase.id}
            role={role}
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        );
      case "shg-directory":
        return (
          <DirectoryScreen
            cases={cases}
            activeCaseId={activeCase.id}
            onSelectCase={handleSelectCase}
          />
        );
      case "finance-passport":
        return (
          <FinancePassportScreen
            shg={activeCase}
            role={role}
            language={language}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "credit-demand":
        return (
          <CreditDemandScreen
            shg={activeCase}
            role={role}
            language={language}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "financing-blueprint":
        return (
          <FinancingBlueprintScreen shg={activeCase} onNavigate={handleNavigate} />
        );
      case "scheme-match":
        return (
          <SchemeMatchScreen
            shg={activeCase}
            selectedLenderId={selectedLenderId}
            onSelectLender={setSelectedLenderId}
            onNavigate={handleNavigate}
          />
        );
      case "offer-comparison":
        return (
          <OfferComparisonScreen
            shg={activeCase}
            selectedLenderId={selectedLenderId}
            onSelectLender={setSelectedLenderId}
            onNavigate={handleNavigate}
          />
        );
      case "application-pack":
        return (
          <ApplicationPackScreen
            shg={activeCase}
            role={role}
            selectedLenderId={selectedLenderId}
            onUpdateCase={handleUpdateCase}
          />
        );
      case "post-disbursement":
        return (
          <PostDisbursementGuardScreen
            shg={activeCase}
            cases={cases}
            onUpdateCase={handleUpdateCase}
            onSelectCase={handleSelectCase}
          />
        );
      case "livelihood-evidence":
        return (
          <LivelihoodEvidenceScreen
            shg={activeCase}
            onUpdateCase={handleUpdateCase}
          />
        );
      case "field-followups":
        return (
          <FieldFollowupsScreen
            cases={cases}
            onSelectCase={handleSelectCase}
            onUpdateCase={handleUpdateCase}
          />
        );
      case "programme-insights":
        return <ProgrammeInsightsScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ios-canvas">
      {/* ─── Clean 5-Stage iOS Frosted Glass Navigation Bar ─── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/60 ios-glass-strong">
        {/* Primary Row: Brand + 5 Process Stages + Controls */}
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
          {/* Brand + Active SHG */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAppView("landing")}
              className="flex items-center gap-2.5 text-left"
              title="Back to Landing Page"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sakhi-forest)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="hidden md:inline text-[15px] font-bold tracking-tight text-[var(--sakhi-slate)]">
                Sakhi CreditLink
              </span>
            </button>

            <div className="hidden sm:block h-5 w-px bg-[var(--sakhi-border)]" />

            {/* Active SHG Switcher Pill */}
            {screen !== "shg-intake" && (
              <button
                onClick={() => setShowCaseSwitcher(!showCaseSwitcher)}
                className="group hidden sm:flex items-center gap-2 rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-2.5 py-1 text-[12.5px] transition-all hover:border-[var(--sakhi-forest)]/30 hover:bg-white"
              >
                <span className="max-w-[150px] truncate font-semibold text-[var(--sakhi-slate)]">
                  {activeCase.shgName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--sakhi-muted)]" />
              </button>
            )}
          </div>

          {/* Center: 5 Process Stage Categories */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {PROCESS_CATEGORIES.map((cat) => {
              const isCurrent = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNavigate(cat.defaultScreen)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all",
                    isCurrent
                      ? "bg-[var(--sakhi-forest)] text-white shadow-sm"
                      : "text-[var(--sakhi-muted)] hover:bg-[var(--sakhi-surface)] hover:text-[var(--sakhi-slate)]"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10.5px]",
                      isCurrent ? "text-white/75" : "text-[var(--sakhi-muted)]"
                    )}
                  >
                    {cat.stepLabel}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {screen !== "shg-intake" && (
              <button
                onClick={() => handleNavigate("shg-intake")}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-[var(--sakhi-forest)]/25 bg-[var(--sakhi-mint)] px-3 py-1.5 text-[12px] font-semibold text-[var(--sakhi-forest)] transition-colors hover:bg-[var(--sakhi-forest)] hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5" /> New Application
              </button>
            )}

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--sakhi-border)] text-[var(--sakhi-muted)] transition-colors hover:bg-[var(--sakhi-surface)] hover:text-[var(--sakhi-slate)]"
              aria-label="Search"
            >
              {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>

            <div className="hidden xl:flex items-center gap-1 rounded-lg border border-[var(--sakhi-border)] bg-white px-2 py-1 text-[12px]">
              <Languages className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                aria-label="Select language"
                className="bg-transparent font-medium text-[var(--sakhi-slate)] focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="en-gu">EN + ગુજરાતી</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[var(--sakhi-border)] bg-white px-2 py-1 text-[12px]">
              <Shield className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  setScreen("role-profit-dashboard");
                }}
                aria-label="Switch user role"
                className="bg-transparent font-medium text-[var(--sakhi-slate)] focus:outline-none cursor-pointer"
              >
                {(Object.keys(ROLE_META) as UserRole[]).map((rk) => (
                  <option key={rk} value={rk}>
                    {ROLE_META[rk].shortLabel}
                  </option>
                ))}
              </select>
            </div>

            {confirmReset ? (
              <div className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11.5px]">
                <span className="font-semibold text-red-700">Reset demo?</span>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="rounded bg-red-600 px-2 py-0.5 font-semibold text-white hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded px-1.5 py-0.5 font-medium text-slate-600 hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[var(--sakhi-border)] bg-white px-2.5 text-[11.5px] font-medium text-[var(--sakhi-muted)] transition-colors hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
                title="Reset demo data to initial seed"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Reset demo</span>
              </button>
            )}

            <button
              onClick={() => setAppView("landing")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--sakhi-border)] text-[var(--sakhi-muted)] transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              aria-label="Exit portal"
              title="Back to landing"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-navigation Row: Shows only the 1–4 tools inside the active category */}
        <div className="border-t border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]/80">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-1.5 lg:px-6">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
                {activeCategory.label}:
              </span>
              {activeCategory.items.map((item) => {
                const Icon = item.icon;
                const active = screen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all",
                      active
                        ? "bg-white text-[var(--sakhi-forest)] shadow-sm ring-1 ring-[var(--sakhi-border)]"
                        : "text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {screen !== "shg-intake" && (
              <div className="hidden md:flex items-center gap-2 text-[12px] text-[var(--sakhi-muted)]">
                <span className="font-mono">{activeCase.caseCode}</span>
                <span>·</span>
                <span className="font-semibold text-[var(--sakhi-forest)]">
                  {activeCase.readinessScore}% Ready
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {showSearch && (
        <div className="fixed inset-x-0 top-[98px] z-40 border-b border-[var(--sakhi-border)] bg-white shadow-xl shadow-black/5">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sakhi-muted)]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search SHGs by name, case ID, or activity..."
                autoFocus
                className="h-11 w-full rounded-xl border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] pl-10 pr-4 text-[14px] text-[var(--sakhi-slate)] placeholder:text-[var(--sakhi-muted)] focus:border-[var(--sakhi-forest)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sakhi-forest)]/10"
              />
            </div>
            {searchMatches.length > 0 && (
              <div className="mt-3 space-y-1 rounded-xl border border-[var(--sakhi-border)] bg-white p-2">
                {searchMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectCase(m.id, "finance-passport")}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--sakhi-surface)]"
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--sakhi-slate)]">{m.shgName}</div>
                      <div className="text-[12px] text-[var(--sakhi-muted)]">{m.activity} · {m.block}</div>
                    </div>
                    <span className="font-mono text-[12px] text-[var(--sakhi-forest)]">{m.caseCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Case switcher dropdown */}
      {showCaseSwitcher && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowCaseSwitcher(false)} />
          <div className="fixed left-4 sm:left-[180px] top-[52px] z-40 w-80 rounded-xl border border-[var(--sakhi-border)] bg-white p-2 shadow-xl shadow-black/10">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
                Active SHG Cases
              </span>
              <button
                onClick={() => {
                  setShowCaseSwitcher(false);
                  handleNavigate("shg-intake");
                }}
                className="text-[11.5px] font-semibold text-[var(--sakhi-forest)] hover:underline"
              >
                + New SHG
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCase(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
                    c.id === activeCaseId
                      ? "bg-[var(--sakhi-mint)] text-[var(--sakhi-forest)]"
                      : "hover:bg-[var(--sakhi-surface)] text-[var(--sakhi-slate)]"
                  )}
                >
                  <div className="min-w-0 pr-2">
                    <div className="truncate text-[13px] font-semibold">{c.shgName}</div>
                    <div className="truncate text-[11px] text-[var(--sakhi-muted)]">{c.block} · {c.activity}</div>
                  </div>
                  <span className="shrink-0 text-[12px] font-semibold text-[var(--sakhi-forest)] tabular-nums">{c.readinessScore}%</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="pt-[118px]">
        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

export default App;
