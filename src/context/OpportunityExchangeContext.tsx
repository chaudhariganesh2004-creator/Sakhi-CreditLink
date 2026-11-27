import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BUYER_OPPORTUNITIES,
  EXCHANGE_SHGS,
  type BuyerOpportunity,
} from "@/data/opportunityExchangeData";
import {
  DEFAULT_MATCH_WEIGHTS,
  type MatchWeights,
  type WhatIfInputs,
} from "@/lib/opportunity-engine";

const STORAGE_KEY = "sakhi-opportunity-exchange:v1";

interface PersistedExchangeState {
  selectedOpportunityId: string | null;
  matchFoundByOpp: Record<string, boolean>;
  weights: MatchWeights;
  selectedShgIdsByOpp: Record<string, string[]>;
  networkBuiltByOpp: Record<string, boolean>;
  leadCoordinatorByOpp: Record<string, string>;
  costByOpp: Record<string, number>;
  workingCapitalByOpp: Record<string, number>;
  whatIfInputs: WhatIfInputs;
}

function buildDefaultSelectedByOpp(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const opp of BUYER_OPPORTUNITIES) {
    map[opp.id] = EXCHANGE_SHGS.filter((s) => s.category === opp.category).map(
      (s) => s.id
    );
  }
  return map;
}

function buildDefaultLeadByOpp(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const opp of BUYER_OPPORTUNITIES) {
    const first = EXCHANGE_SHGS.find((s) => s.category === opp.category);
    if (first) map[opp.id] = first.id;
  }
  return map;
}

function buildDefaultCostByOpp(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const opp of BUYER_OPPORTUNITIES) {
    map[opp.id] = opp.defaultTotalCostINR;
  }
  return map;
}

function buildDefaultCapitalByOpp(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const opp of BUYER_OPPORTUNITIES) {
    map[opp.id] = EXCHANGE_SHGS.filter((s) => s.category === opp.category).reduce(
      (sum, s) => sum + s.workingCapitalINR,
      0
    );
  }
  return map;
}

const DEFAULT_WHAT_IF: WhatIfInputs = {
  orderQuantity: 5000,
  numberOfShgs: 5,
  avgCapacityPerShg: 1000,
  availableWorkingCapitalINR: 55000,
  totalProductionCostINR: 175000,
};

function createInitialState(): PersistedExchangeState {
  return {
    selectedOpportunityId: null,
    matchFoundByOpp: {},
    weights: { ...DEFAULT_MATCH_WEIGHTS },
    selectedShgIdsByOpp: buildDefaultSelectedByOpp(),
    networkBuiltByOpp: {},
    leadCoordinatorByOpp: buildDefaultLeadByOpp(),
    costByOpp: buildDefaultCostByOpp(),
    workingCapitalByOpp: buildDefaultCapitalByOpp(),
    whatIfInputs: { ...DEFAULT_WHAT_IF },
  };
}

function loadSessionState(): PersistedExchangeState {
  const fallback = createInitialState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedExchangeState>;
    return {
      ...fallback,
      ...parsed,
      weights: parsed.weights ? { ...DEFAULT_MATCH_WEIGHTS, ...parsed.weights } : fallback.weights,
      selectedShgIdsByOpp: {
        ...fallback.selectedShgIdsByOpp,
        ...(parsed.selectedShgIdsByOpp ?? {}),
      },
      leadCoordinatorByOpp: {
        ...fallback.leadCoordinatorByOpp,
        ...(parsed.leadCoordinatorByOpp ?? {}),
      },
      costByOpp: {
        ...fallback.costByOpp,
        ...(parsed.costByOpp ?? {}),
      },
      workingCapitalByOpp: {
        ...fallback.workingCapitalByOpp,
        ...(parsed.workingCapitalByOpp ?? {}),
      },
      whatIfInputs: parsed.whatIfInputs
        ? { ...DEFAULT_WHAT_IF, ...parsed.whatIfInputs }
        : fallback.whatIfInputs,
    };
  } catch {
    return fallback;
  }
}

interface OpportunityExchangeContextValue {
  opportunities: BuyerOpportunity[];
  selectedOpportunity: BuyerOpportunity;
  hasExplicitSelection: boolean;
  selectOpportunity: (oppId: string) => void;
  matchesRevealed: boolean;
  revealMatches: () => void;
  weights: MatchWeights;
  setWeights: (next: MatchWeights) => void;
  selectedShgIds: string[];
  toggleShgSelection: (shgId: string) => void;
  setSelectedShgIds: (ids: string[]) => void;
  networkBuilt: boolean;
  buildCollectiveNetwork: () => void;
  leadCoordinatorId: string;
  setLeadCoordinatorId: (shgId: string) => void;
  productionCostINR: number;
  setProductionCostINR: (val: number) => void;
  availableCapitalINR: number;
  setAvailableCapitalINR: (val: number) => void;
  whatIfInputs: WhatIfInputs;
  setWhatIfInputs: (next: WhatIfInputs) => void;
  resetWhatIfInputs: () => void;
  proposalModalOpen: boolean;
  openProposalModal: () => void;
  closeProposalModal: () => void;
  resetExchangeDemo: () => void;
}

const OpportunityExchangeContext = createContext<OpportunityExchangeContextValue | null>(
  null
);

export const OpportunityExchangeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<PersistedExchangeState>(() => loadSessionState());
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const activeOppId = state.selectedOpportunityId ?? BUYER_OPPORTUNITIES[0].id;
  const selectedOpportunity =
    BUYER_OPPORTUNITIES.find((o) => o.id === activeOppId) ?? BUYER_OPPORTUNITIES[0];

  const selectOpportunity = (oppId: string) => {
    const opp = BUYER_OPPORTUNITIES.find((o) => o.id === oppId);
    if (!opp) return;
    const pool = EXCHANGE_SHGS.filter((s) => s.category === opp.category);
    const totalPoolCap = pool.reduce((sum, s) => sum + s.availableCapacity, 0);
    const totalPoolWorkingCap = pool.reduce((sum, s) => sum + s.workingCapitalINR, 0);

    setState((prev) => ({
      ...prev,
      selectedOpportunityId: opp.id,
      whatIfInputs: {
        orderQuantity: opp.quantity,
        numberOfShgs: pool.length,
        avgCapacityPerShg: Math.max(1, Math.round(totalPoolCap / Math.max(1, pool.length))),
        availableWorkingCapitalINR:
          prev.workingCapitalByOpp[opp.id] ?? totalPoolWorkingCap,
        totalProductionCostINR: prev.costByOpp[opp.id] ?? opp.defaultTotalCostINR,
      },
    }));
  };

  const revealMatches = () => {
    setState((prev) => ({
      ...prev,
      matchFoundByOpp: {
        ...prev.matchFoundByOpp,
        [selectedOpportunity.id]: true,
      },
    }));
  };

  const setWeights = (next: MatchWeights) => {
    setState((prev) => ({ ...prev, weights: next }));
  };

  const toggleShgSelection = (shgId: string) => {
    setState((prev) => {
      const current = prev.selectedShgIdsByOpp[selectedOpportunity.id] ?? [];
      const exists = current.includes(shgId);
      const updated = exists
        ? current.filter((id) => id !== shgId)
        : [...current, shgId];
      return {
        ...prev,
        selectedShgIdsByOpp: {
          ...prev.selectedShgIdsByOpp,
          [selectedOpportunity.id]: updated,
        },
      };
    });
  };

  const setSelectedShgIds = (ids: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedShgIdsByOpp: {
        ...prev.selectedShgIdsByOpp,
        [selectedOpportunity.id]: ids,
      },
    }));
  };

  const buildCollectiveNetwork = () => {
    const allCategoryIds = EXCHANGE_SHGS.filter(
      (s) => s.category === selectedOpportunity.category
    ).map((s) => s.id);
    setState((prev) => ({
      ...prev,
      networkBuiltByOpp: {
        ...prev.networkBuiltByOpp,
        [selectedOpportunity.id]: true,
      },
      selectedShgIdsByOpp: {
        ...prev.selectedShgIdsByOpp,
        [selectedOpportunity.id]: allCategoryIds,
      },
    }));
  };

  const setLeadCoordinatorId = (shgId: string) => {
    setState((prev) => ({
      ...prev,
      leadCoordinatorByOpp: {
        ...prev.leadCoordinatorByOpp,
        [selectedOpportunity.id]: shgId,
      },
    }));
  };

  const setProductionCostINR = (val: number) => {
    const safe = Math.max(0, Number.isFinite(val) ? Math.round(val) : 0);
    setState((prev) => ({
      ...prev,
      costByOpp: {
        ...prev.costByOpp,
        [selectedOpportunity.id]: safe,
      },
    }));
  };

  const setAvailableCapitalINR = (val: number) => {
    const safe = Math.max(0, Number.isFinite(val) ? Math.round(val) : 0);
    setState((prev) => ({
      ...prev,
      workingCapitalByOpp: {
        ...prev.workingCapitalByOpp,
        [selectedOpportunity.id]: safe,
      },
    }));
  };

  const setWhatIfInputs = (next: WhatIfInputs) => {
    setState((prev) => ({
      ...prev,
      whatIfInputs: {
        orderQuantity: Math.max(0, Number.isFinite(next.orderQuantity) ? next.orderQuantity : 0),
        numberOfShgs: Math.max(0, Number.isFinite(next.numberOfShgs) ? next.numberOfShgs : 0),
        avgCapacityPerShg: Math.max(
          1,
          Number.isFinite(next.avgCapacityPerShg) ? next.avgCapacityPerShg : 1
        ),
        availableWorkingCapitalINR: Math.max(
          0,
          Number.isFinite(next.availableWorkingCapitalINR) ? next.availableWorkingCapitalINR : 0
        ),
        totalProductionCostINR: Math.max(
          0,
          Number.isFinite(next.totalProductionCostINR) ? next.totalProductionCostINR : 0
        ),
      },
    }));
  };

  const resetWhatIfInputs = () => {
    const pool = EXCHANGE_SHGS.filter((s) => s.category === selectedOpportunity.category);
    const totalPoolCap = pool.reduce((sum, s) => sum + s.availableCapacity, 0);
    const totalPoolWorkingCap = pool.reduce((sum, s) => sum + s.workingCapitalINR, 0);
    setWhatIfInputs({
      orderQuantity: selectedOpportunity.quantity,
      numberOfShgs: pool.length,
      avgCapacityPerShg: Math.max(1, Math.round(totalPoolCap / Math.max(1, pool.length))),
      availableWorkingCapitalINR: totalPoolWorkingCap,
      totalProductionCostINR: selectedOpportunity.defaultTotalCostINR,
    });
  };

  const resetExchangeDemo = () => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setState(createInitialState());
    setProposalModalOpen(false);
  };

  return (
    <OpportunityExchangeContext.Provider
      value={{
        opportunities: BUYER_OPPORTUNITIES,
        selectedOpportunity,
        hasExplicitSelection: Boolean(state.selectedOpportunityId),
        selectOpportunity,
        matchesRevealed: Boolean(state.matchFoundByOpp[selectedOpportunity.id]),
        revealMatches,
        weights: state.weights,
        setWeights,
        selectedShgIds:
          state.selectedShgIdsByOpp[selectedOpportunity.id] ?? [],
        toggleShgSelection,
        setSelectedShgIds,
        networkBuilt: Boolean(state.networkBuiltByOpp[selectedOpportunity.id]),
        buildCollectiveNetwork,
        leadCoordinatorId:
          state.leadCoordinatorByOpp[selectedOpportunity.id] ?? "",
        setLeadCoordinatorId,
        productionCostINR:
          state.costByOpp[selectedOpportunity.id] ??
          selectedOpportunity.defaultTotalCostINR,
        setProductionCostINR,
        availableCapitalINR:
          state.workingCapitalByOpp[selectedOpportunity.id] ?? 0,
        setAvailableCapitalINR,
        whatIfInputs: state.whatIfInputs,
        setWhatIfInputs,
        resetWhatIfInputs,
        proposalModalOpen,
        openProposalModal: () => setProposalModalOpen(true),
        closeProposalModal: () => setProposalModalOpen(false),
        resetExchangeDemo,
      }}
    >
      {children}
    </OpportunityExchangeContext.Provider>
  );
};

export function useOpportunityExchange(): OpportunityExchangeContextValue {
  const ctx = useContext(OpportunityExchangeContext);
  if (!ctx) {
    throw new Error("useOpportunityExchange must be used inside OpportunityExchangeProvider");
  }
  return ctx;
}
