import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  LogOut,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import {
  SHG_CASES_DEMO,
  type AppLanguage,
  type NavScreenId,
  type PortalRole,
  type SHGCase,
  type UserRole,
} from "@/data/sakhi-data";
import {
  clearCasesStorage,
  loadCasesState,
  saveCasesState,
} from "@/lib/storage";
import { resetLokOSSnapshotStorage } from "@/lib/lokos-adapter";
import { SimulatedBadge } from "@/components/shared/ui-primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LandingPage = lazy(() =>
  import("@/screens/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const ReadinessHubScreen = lazy(() =>
  import("@/screens/ReadinessHubScreen").then((m) => ({ default: m.ReadinessHubScreen }))
);
const SHGIntakeScreen = lazy(() =>
  import("@/screens/SHGIntakeScreen").then((m) => ({ default: m.SHGIntakeScreen }))
);
const FinancePassportScreen = lazy(() =>
  import("@/screens/FinancePassportScreen").then((m) => ({ default: m.FinancePassportScreen }))
);
const CashFlowBlueprintStepper = lazy(() =>
  import("@/screens/CashFlowBlueprintStepper").then((m) => ({
    default: m.CashFlowBlueprintStepper,
  }))
);
const SchemeMatchScreen = lazy(() =>
  import("@/screens/SchemeMatchScreen").then((m) => ({ default: m.SchemeMatchScreen }))
);
const ApplicationPackScreen = lazy(() =>
  import("@/screens/ApplicationPackScreen").then((m) => ({ default: m.ApplicationPackScreen }))
);
const PostDisbursementGuardScreen = lazy(() =>
  import("@/screens/PostDisbursementGuardScreen").then((m) => ({
    default: m.PostDisbursementGuardScreen,
  }))
);
const BankBranchQueueScreen = lazy(() =>
  import("@/screens/BankBranchQueueScreen").then((m) => ({
    default: m.BankBranchQueueScreen,
  }))
);
const OfferComparisonScreen = lazy(() =>
  import("@/screens/OfferComparisonScreen").then((m) => ({ default: m.OfferComparisonScreen }))
);
const CommandCentreScreen = lazy(() =>
  import("@/screens/CommandCentreScreen").then((m) => ({ default: m.CommandCentreScreen }))
);
const ProgrammeInsightsScreen = lazy(() =>
  import("@/screens/ProgrammeInsightsScreen").then((m) => ({
    default: m.ProgrammeInsightsScreen,
  }))
);
const DirectoryScreen = lazy(() =>
  import("@/screens/DirectoryScreen").then((m) => ({ default: m.DirectoryScreen }))
);
const FieldFollowupsScreen = lazy(() =>
  import("@/screens/FieldFollowupsScreen").then((m) => ({ default: m.FieldFollowupsScreen }))
);
const RoleProfitDashboardScreen = lazy(() =>
  import("@/screens/RoleProfitDashboardScreen").then((m) => ({
    default: m.RoleProfitDashboardScreen,
  }))
);

type AppView = "landing" | "portal";

interface RoleNavConfig {
  label: string;
  legacyRole: UserRole;
  defaultScreen: NavScreenId;
  navItems: { id: NavScreenId; label: string; labelGu: string }[];
}

const ROLE_CONFIGS: Record<PortalRole, RoleNavConfig> = {
  "shg-sakhi": {
    label: "SHG / Bank Sakhi",
    legacyRole: "bank-sakhi",
    defaultScreen: "readiness-hub",
    navItems: [
      { id: "readiness-hub", label: "Readiness Hub", labelGu: "તૈયારી હબ" },
      { id: "shg-intake", label: "Intake", labelGu: "અરજી દાખલ" },
      { id: "finance-passport", label: "Finance Passport", labelGu: "ફાઇનાન્સ પાસપોર્ટ" },
      { id: "cashflow-blueprint", label: "Cash-flow blueprint", labelGu: "રોકડ પ્રવાહ" },
      { id: "scheme-match", label: "Scheme Match", labelGu: "યોજના મેચિંગ" },
      { id: "application-pack", label: "Application Pack", labelGu: "અરજી પેક" },
      { id: "post-disbursement", label: "0% Subvention Guard", labelGu: "૦% વ્યાજ રક્ષક" },
    ],
  },
  "bank-branch": {
    label: "Bank Branch",
    legacyRole: "bank-officer",
    defaultScreen: "bank-queue",
    navItems: [
      { id: "bank-queue", label: "Queue", labelGu: "બેંક કતાર" },
      { id: "application-pack", label: "Application Pack", labelGu: "અરજી પેક" },
      { id: "offer-comparison", label: "Offer Comparison", labelGu: "બેંક શરતો" },
    ],
  },
  "district-official": {
    label: "District Official",
    legacyRole: "glpc-officer",
    defaultScreen: "command-centre",
    navItems: [
      { id: "command-centre", label: "Command Centre", labelGu: "કમાન્ડ સેન્ટર" },
      { id: "programme-insights", label: "Programme Insights", labelGu: "કાર્યક્રમ વિશ્લેષણ" },
      { id: "shg-directory", label: "Directory", labelGu: "જૂથ ડિરેક્ટરી" },
      { id: "field-followups", label: "Field Follow-ups", labelGu: "ફીલ્ડ ફોલો-અપ" },
      { id: "role-profit-dashboard", label: "Sustainability and pilot assumptions", labelGu: "પાયલોટ અને ટકાઉપણું" },
    ],
  },
};

function parseHashRoute(): { view: AppView; role: PortalRole; screen: NavScreenId } {
  if (typeof window === "undefined") {
    return { view: "landing", role: "shg-sakhi", screen: "readiness-hub" };
  }
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  if (!raw) {
    return { view: "landing", role: "shg-sakhi", screen: "readiness-hub" };
  }
  const [rolePart, screenPart] = raw.split("/");
  if (rolePart && rolePart in ROLE_CONFIGS) {
    const validRole = rolePart as PortalRole;
    const cfg = ROLE_CONFIGS[validRole];
    const allowed = cfg.navItems.some((item) => item.id === screenPart);
    return {
      view: "portal",
      role: validRole,
      screen: allowed ? (screenPart as NavScreenId) : cfg.defaultScreen,
    };
  }
  return { view: "landing", role: "shg-sakhi", screen: "readiness-hub" };
}

function ScreenSkeleton() {
  return (
    <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading view">
      <div className="h-8 w-64 rounded-md bg-[#E6E1D6]" />
      <div className="h-4 w-80 max-w-full rounded-md bg-[#ECE8DF]" />
      <div className="grid gap-4 pt-2 sm:grid-cols-3">
        <div className="h-24 rounded-lg border border-[#DFDBD0] bg-white" />
        <div className="h-24 rounded-lg border border-[#DFDBD0] bg-white" />
        <div className="h-24 rounded-lg border border-[#DFDBD0] bg-white" />
      </div>
      <div className="h-56 rounded-lg border border-[#DFDBD0] bg-white" />
    </div>
  );
}

export function App() {
  const initialRoute = useMemo(() => parseHashRoute(), []);
  const initialStored = useMemo(() => loadCasesState(), []);

  const [appView, setAppView] = useState<AppView>(initialRoute.view);
  const [portalRole, setPortalRole] = useState<PortalRole>(initialRoute.role);
  const [screen, setScreen] = useState<NavScreenId>(initialRoute.screen);
  const [cases, setCases] = useState<SHGCase[]>(initialStored.cases);
  const [activeCaseId, setActiveCaseId] = useState<string>(initialStored.activeCaseId);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [selectedLenderId, setSelectedLenderId] = useState<string>("off-bob");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCaseSwitcher, setShowCaseSwitcher] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const roleConfig = ROLE_CONFIGS[portalRole];
  const legacyRole = roleConfig.legacyRole;

  useEffect(() => {
    saveCasesState(cases, activeCaseId);
  }, [cases, activeCaseId]);

  // Sync URL hash cleanly on state changes
  useEffect(() => {
    const targetHash = appView === "landing" ? "#/" : `#/${portalRole}/${screen}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [appView, portalRole, screen]);

  // Support browser back / forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setAppView(parsed.view);
      setPortalRole(parsed.role);
      setScreen(parsed.screen);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) ?? cases[0],
    [cases, activeCaseId]
  );

  const handleUpdateCase = (updated: SHGCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleCreateCase = (newCase: SHGCase) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    setScreen("cashflow-blueprint");
  };

  const handleRoleSwitch = (nextRole: PortalRole) => {
    setPortalRole(nextRole);
    setScreen(ROLE_CONFIGS[nextRole].defaultScreen);
    setAppView("portal");
    setShowSearch(false);
    setShowCaseSwitcher(false);
  };

  const handleNavigate = (target: NavScreenId) => {
    // Map sub-screens inside Cash-flow blueprint to the unified stepper
    if (
      target === "credit-demand" ||
      target === "livelihood-evidence" ||
      target === "financing-blueprint"
    ) {
      setScreen("cashflow-blueprint");
      return;
    }
    // Find which role owns target if jumping across
    const ownerEntry = (Object.entries(ROLE_CONFIGS) as [PortalRole, RoleNavConfig][]).find(
      ([, cfg]) => cfg.navItems.some((item) => item.id === target)
    );
    if (ownerEntry && ownerEntry[0] !== portalRole) {
      setPortalRole(ownerEntry[0]);
    }
    setScreen(target);
  };

  const handleSelectCase = (caseId: string, navigateTo?: NavScreenId) => {
    setActiveCaseId(caseId);
    if (navigateTo) handleNavigate(navigateTo);
    setGlobalSearch("");
    setShowSearch(false);
    setShowCaseSwitcher(false);
  };

  const handleResetDemo = () => {
    clearCasesStorage();
    resetLokOSSnapshotStorage();
    setCases(SHG_CASES_DEMO);
    setActiveCaseId(SHG_CASES_DEMO[0].id);
    setSelectedLenderId("off-bob");
    setConfirmReset(false);
    setScreen(ROLE_CONFIGS[portalRole].defaultScreen);
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
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] p-6"><ScreenSkeleton /></div>}>
        <LandingPage
          language={language}
          onChangeLanguage={setLanguage}
          onEnterPortal={(targetRole) => handleRoleSwitch(targetRole ?? "shg-sakhi")}
        />
      </Suspense>
    );
  }

  // Mobile sticky bottom CTA for current screen (at most 1 primary CTA per screen)
  const mobileAction: { label: string; onClick: () => void } | null = (() => {
    switch (screen) {
      case "readiness-hub":
        return { label: "Open Cash-flow blueprint", onClick: () => handleNavigate("cashflow-blueprint") };
      case "finance-passport":
        return { label: "Next: Cash-flow blueprint", onClick: () => handleNavigate("cashflow-blueprint") };
      case "scheme-match":
        return { label: "Next: Application Pack", onClick: () => handleNavigate("application-pack") };
      case "application-pack":
        return { label: "View 0% Subvention Guard", onClick: () => handleNavigate("post-disbursement") };
      case "bank-queue":
        return { label: "View Product Terms", onClick: () => handleNavigate("offer-comparison") };
      case "command-centre":
        return { label: "Open SHG Directory", onClick: () => handleNavigate("shg-directory") };
      default:
        return null;
    }
  })();

  const renderScreen = () => {
    switch (screen) {
      case "readiness-hub":
        return (
          <ReadinessHubScreen
            key={activeCase.id}
            shg={activeCase}
            language={language}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "shg-intake":
        return (
          <SHGIntakeScreen
            onCreateCase={handleCreateCase}
            onCancel={() => handleNavigate("readiness-hub")}
          />
        );
      case "finance-passport":
        return (
          <FinancePassportScreen
            key={activeCase.id}
            shg={activeCase}
            role={legacyRole}
            language={language}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "cashflow-blueprint":
        return (
          <CashFlowBlueprintStepper
            key={activeCase.id}
            shg={activeCase}
            role={legacyRole}
            language={language}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "scheme-match":
        return (
          <SchemeMatchScreen
            key={activeCase.id}
            shg={activeCase}
            selectedLenderId={selectedLenderId}
            onSelectLender={setSelectedLenderId}
            onNavigate={handleNavigate}
          />
        );
      case "application-pack":
        return (
          <ApplicationPackScreen
            key={activeCase.id}
            shg={activeCase}
            role={legacyRole}
            selectedLenderId={selectedLenderId}
            onUpdateCase={handleUpdateCase}
          />
        );
      case "post-disbursement":
        return (
          <PostDisbursementGuardScreen
            key={activeCase.id}
            shg={activeCase}
            cases={cases}
            onUpdateCase={handleUpdateCase}
            onSelectCase={handleSelectCase}
          />
        );
      case "bank-queue":
        return (
          <BankBranchQueueScreen
            cases={cases}
            activeCaseId={activeCase.id}
            language={language}
            onSelectCase={handleSelectCase}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "offer-comparison":
        return (
          <OfferComparisonScreen
            key={activeCase.id}
            shg={activeCase}
            selectedLenderId={selectedLenderId}
            onSelectLender={setSelectedLenderId}
            onNavigate={handleNavigate}
          />
        );
      case "command-centre":
        return (
          <CommandCentreScreen
            cases={cases}
            activeCaseId={activeCase.id}
            role={legacyRole}
            onSelectCase={handleSelectCase}
            onUpdateCase={handleUpdateCase}
            onNavigate={handleNavigate}
          />
        );
      case "programme-insights":
        return <ProgrammeInsightsScreen cases={cases} />;
      case "shg-directory":
        return (
          <DirectoryScreen
            cases={cases}
            activeCaseId={activeCase.id}
            onSelectCase={handleSelectCase}
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
      case "role-profit-dashboard":
        return (
          <RoleProfitDashboardScreen
            cases={cases}
            role={legacyRole}
            onChangeRole={() => {}}
            onSelectCase={handleSelectCase}
            onNavigate={handleNavigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#141A23]">
      {/* ─── Single-Row 56px Header (strictly <=56px at 360px) ─── */}
      <header className="sticky top-0 z-50 h-14 border-b border-[#DFDBD0] bg-white">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-2 px-3 md:px-6">
          {/* Left: Logo + 3-Role Switcher */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setAppView("landing")}
              className="flex items-center gap-2 rounded-md p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]"
              title="Back to Landing Page"
            >
              <img
                src="/images/sakhi-logo.jpg"
                alt="Sakhi CreditLink logo"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-md border border-[#DFDBD0] bg-white object-contain p-0.5"
              />
              <span className="hidden lg:inline text-[14.5px] font-bold tracking-tight text-[#141A23]">
                Sakhi CreditLink
              </span>
            </button>

            <label htmlFor="portal-role-select" className="sr-only">
              Select role workspace
            </label>
            <select
              id="portal-role-select"
              value={portalRole}
              onChange={(e) => handleRoleSwitch(e.target.value as PortalRole)}
              className="h-9 max-w-[138px] sm:max-w-none rounded-md border border-[#C9C3B4] bg-[#FAF8F4] px-2 text-[12px] sm:text-[12.5px] font-semibold text-[#141A23] focus:border-[#0F5E4E] focus:outline-none"
            >
              {(Object.keys(ROLE_CONFIGS) as PortalRole[]).map((rk) => (
                <option key={rk} value={rk}>
                  {ROLE_CONFIGS[rk].label}
                </option>
              ))}
            </select>

            <div className="hidden xl:block">
              <SimulatedBadge compact />
            </div>
          </div>

          {/* Right: Language EN | ગુજરાતી (always visible!), Search, Reset demo, Exit */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="inline-flex items-center rounded-md border border-[#C9C3B4] bg-[#FAF8F4] p-0.5 text-[11.5px]"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "h-7 rounded px-2 font-semibold transition-colors duration-150",
                  language === "en" ? "bg-[#0F5E4E] text-white" : "text-[#475467]"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("gu")}
                className={cn(
                  "h-7 rounded px-2 font-semibold transition-colors duration-150",
                  language === "gu" ? "bg-[#0F5E4E] text-white" : "text-[#475467]"
                )}
              >
                ગુજ
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#C9C3B4] bg-white text-[#475467] hover:bg-[#F2EFE8]"
              aria-label="Search SHGs"
            >
              {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>

            {confirmReset ? (
              <div className="flex items-center gap-1 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-1.5 py-1 text-[11px]">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="rounded bg-[#B91C1C] px-2 py-0.5 font-semibold text-white"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-1 font-medium text-[#475467]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-[#C9C3B4] bg-white px-2 text-[12px] font-medium text-[#475467] hover:bg-[#FFFBEB] hover:text-[#B45309]"
                title="Reset demo"
                aria-label="Reset demo"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Reset demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAppView("landing")}
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#C9C3B4] bg-white text-[#475467] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
              aria-label="Exit to landing"
              title="Back to landing"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── One-Row Role Workflow Nav + Active SHG Context ─── */}
      <nav
        aria-label="Role workflow navigation"
        className="border-b border-[#DFDBD0] bg-[#F2EFE8]"
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-3 py-1.5 md:px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {roleConfig.navItems.map((item) => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "min-h-[38px] shrink-0 rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]",
                    active
                      ? "bg-[#0F5E4E] text-white"
                      : "text-[#475467] hover:bg-white hover:text-[#141A23]"
                  )}
                >
                  {language === "gu" ? item.labelGu : item.label}
                </button>
              );
            })}
          </div>

          {/* Active SHG Switcher & Simulated Pill */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="xl:hidden">
              <SimulatedBadge compact />
            </div>
            <button
              type="button"
              onClick={() => setShowCaseSwitcher(!showCaseSwitcher)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#C9C3B4] bg-white px-2.5 text-[12px] font-semibold text-[#141A23] hover:bg-[#FAF8F4]"
            >
              <span className="max-w-[160px] truncate">{activeCase.shgName}</span>
              <span className="font-mono text-[#0F5E4E]">{activeCase.readinessScore}%</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#475467]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Popover */}
      {showSearch && (
        <div className="border-b border-[#DFDBD0] bg-white px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475467]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search SHGs by name, case ID, or activity..."
                autoFocus
                className="h-10 w-full rounded-md border border-[#C9C3B4] bg-[#FAF8F4] pl-9 pr-3 text-[13.5px] focus:border-[#0F5E4E] focus:bg-white focus:outline-none"
              />
            </div>
            {searchMatches.length > 0 && (
              <div className="mt-2 divide-y divide-[#DFDBD0] rounded-md border border-[#DFDBD0] bg-white">
                {searchMatches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectCase(m.id, "finance-passport")}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-[#FAF8F4]"
                  >
                    <span className="font-semibold text-[#141A23]">{m.shgName}</span>
                    <span className="font-mono text-[12px] text-[#0F5E4E]">{m.caseCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Case Switcher Popover (with flat modal shadow only) */}
      {showCaseSwitcher && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowCaseSwitcher(false)} />
          <div className="fixed right-4 top-24 z-40 w-80 rounded-lg border border-[#C9C3B4] bg-white p-2 shadow-[0_4px_12px_rgba(20,26,35,0.08)]">
            <div className="mb-1.5 flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475467]">
                Switch Active SHG
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCaseSwitcher(false);
                  handleNavigate("shg-intake");
                }}
                className="text-[12px] font-semibold text-[#0F5E4E] hover:underline"
              >
                + New SHG
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#F2EFE8]">
              {cases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCase(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left transition-colors duration-150",
                    c.id === activeCaseId ? "bg-[#ECFDF5] text-[#0F5E4E]" : "hover:bg-[#FAF8F4]"
                  )}
                >
                  <div className="min-w-0 pr-2">
                    <div className="truncate text-[13px] font-semibold">{c.shgName}</div>
                    <div className="truncate text-[11.5px] text-[#475467]">{c.block} · {c.activity}</div>
                  </div>
                  <span className="font-mono text-[12px] font-semibold tabular-nums">{c.readinessScore}%</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={cn("mx-auto max-w-[1320px] px-4 py-6 md:px-6 md:py-8", mobileAction && "pb-24 md:pb-8")}>
        <Suspense fallback={<ScreenSkeleton />}>
          {renderScreen()}
        </Suspense>
      </main>

      {/* Sticky Mobile Bottom Action Bar (56px + safe-area, single primary CTA) */}
      {mobileAction && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DFDBD0] bg-white px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden no-print">
          <Button variant="primary" className="w-full" onClick={mobileAction.onClick}>
            {mobileAction.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
