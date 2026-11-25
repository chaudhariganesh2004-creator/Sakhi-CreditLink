import React, { useMemo, useState } from "react";
import {
  Activity,
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
  Scale,
  Search,
  Shield,
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
import { CommandCentreScreen } from "@/screens/CommandCentreScreen";
import { DirectoryScreen } from "@/screens/DirectoryScreen";
import { FinancePassportScreen } from "@/screens/FinancePassportScreen";
import { CreditDemandScreen } from "@/screens/CreditDemandScreen";
import { FinancingBlueprintScreen } from "@/screens/FinancingBlueprintScreen";
import { SchemeMatchScreen } from "@/screens/SchemeMatchScreen";
import { OfferComparisonScreen } from "@/screens/OfferComparisonScreen";
import { ApplicationPackScreen } from "@/screens/ApplicationPackScreen";
import { LivelihoodEvidenceScreen } from "@/screens/LivelihoodEvidenceScreen";
import { FieldFollowupsScreen } from "@/screens/FieldFollowupsScreen";
import { ProgrammeInsightsScreen } from "@/screens/ProgrammeInsightsScreen";
import { LandingPage } from "@/screens/LandingPage";
import { cn } from "@/lib/utils";

type AppView = "landing" | "portal";

// Navigation tabs for the portal — clean top nav approach
const PORTAL_TABS: { id: NavScreenId; label: string; icon: React.ElementType; group: "programme" | "case" }[] = [
  { id: "command-centre", label: "Command Centre", icon: LayoutDashboard, group: "programme" },
  { id: "shg-directory", label: "Directory", icon: Users, group: "programme" },
  { id: "finance-passport", label: "Finance Passport", icon: BookOpenCheck, group: "case" },
  { id: "credit-demand", label: "Credit Demand", icon: FileSpreadsheet, group: "case" },
  { id: "financing-blueprint", label: "Blueprint", icon: Activity, group: "case" },
  { id: "livelihood-evidence", label: "Livelihood", icon: Building2, group: "case" },
  { id: "scheme-match", label: "Scheme Match", icon: Compass, group: "case" },
  { id: "offer-comparison", label: "Offers", icon: Scale, group: "case" },
  { id: "application-pack", label: "Application Pack", icon: FolderCheck, group: "case" },
  { id: "field-followups", label: "Follow-ups", icon: ClipboardCheck, group: "programme" },
  { id: "programme-insights", label: "Insights", icon: BarChart3, group: "programme" },
];

export function App() {
  const [appView, setAppView] = useState<AppView>("landing");
  const [cases, setCases] = useState<SHGCase[]>(SHG_CASES_DEMO);
  const [activeCaseId, setActiveCaseId] = useState<string>(SHG_CASES_DEMO[0].id);
  const [screen, setScreen] = useState<NavScreenId>("command-centre");
  const [role, setRole] = useState<UserRole>("bank-sakhi");
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [selectedLenderId, setSelectedLenderId] = useState<string>("off-bob");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCaseSwitcher, setShowCaseSwitcher] = useState(false);

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) ?? cases[0],
    [cases, activeCaseId]
  );

  const handleUpdateCase = (updated: SHGCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
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

  const isCaseScreen = PORTAL_TABS.find(t => t.id === screen)?.group === "case";

  if (appView === "landing") {
    return <LandingPage onEnterPortal={() => setAppView("portal")} />;
  }

  const renderScreen = () => {
    switch (screen) {
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
        return <SchemeMatchScreen shg={activeCase} onNavigate={handleNavigate} />;
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
    <div className="min-h-screen bg-[var(--sakhi-surface)]">
      {/* ─── Top Navigation Bar ─── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--sakhi-border)] bg-white/95 backdrop-blur-xl">
        {/* Primary nav row */}
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 lg:px-6">
          {/* Left: Brand + Back */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sakhi-forest)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-[15px] font-bold tracking-tight text-[var(--sakhi-slate)]">
                  Sakhi CreditLink
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-[var(--sakhi-border)]" />

            {/* Active case context pill (for case screens) */}
            {isCaseScreen && (
              <button
                onClick={() => setShowCaseSwitcher(!showCaseSwitcher)}
                className="group flex items-center gap-2 rounded-lg border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-3 py-1.5 text-[13px] transition-all hover:border-[var(--sakhi-forest)]/30 hover:bg-white"
              >
                <span className="font-semibold text-[var(--sakhi-slate)]">{activeCase.shgName}</span>
                <span className="text-[var(--sakhi-muted)]">·</span>
                <span className="text-[var(--sakhi-muted)]">{activeCase.block}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--sakhi-muted)] transition-transform group-hover:text-[var(--sakhi-forest)]" />
              </button>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--sakhi-border)] text-[var(--sakhi-muted)] transition-colors hover:bg-[var(--sakhi-surface)] hover:text-[var(--sakhi-slate)]"
              aria-label="Search"
            >
              {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>

            {/* Language */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-[var(--sakhi-border)] bg-white px-2 py-1 text-[12px]">
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

            {/* Role switcher */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--sakhi-border)] bg-white px-2.5 py-1 text-[12px]">
              <Shield className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
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

            {/* Back to Landing */}
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

        {/* Tab navigation row */}
        <div className="border-t border-[var(--sakhi-border)] bg-white">
          <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {PORTAL_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = screen === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors",
                      active
                        ? "border-[var(--sakhi-forest)] text-[var(--sakhi-forest)]"
                        : "border-transparent text-[var(--sakhi-muted)] hover:text-[var(--sakhi-slate)] hover:border-slate-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {showSearch && (
        <div className="fixed inset-x-0 top-[104px] z-40 border-b border-[var(--sakhi-border)] bg-white shadow-xl shadow-black/5">
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
          <div className="fixed left-[200px] top-[52px] z-40 w-80 rounded-xl border border-[var(--sakhi-border)] bg-white p-2 shadow-xl shadow-black/10">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              Switch Active SHG
            </div>
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
                <div>
                  <div className="text-[13px] font-semibold">{c.shgName}</div>
                  <div className="text-[11px] text-[var(--sakhi-muted)]">{c.block} · {c.activity}</div>
                </div>
                <span className="text-[12px] font-semibold text-[var(--sakhi-forest)] tabular-nums">{c.readinessScore}%</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="pt-[104px]">
        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

export default App;
