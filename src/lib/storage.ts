import { SHG_CASES_DEMO, type SHGCase } from "@/data/sakhi-data";

export const CASES_STORAGE_KEY = "sakhi-creditlink:v1";
const STORAGE_VERSION = 1;

interface PersistedCasesPayload {
  version: number;
  activeCaseId?: string;
  cases: SHGCase[];
}

export function loadCasesState(): { cases: SHGCase[]; activeCaseId: string } {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return { cases: SHG_CASES_DEMO, activeCaseId: SHG_CASES_DEMO[0].id };
    }
    const raw = window.localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      return { cases: SHG_CASES_DEMO, activeCaseId: SHG_CASES_DEMO[0].id };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedCasesPayload>;
    if (
      !parsed ||
      parsed.version !== STORAGE_VERSION ||
      !Array.isArray(parsed.cases) ||
      parsed.cases.length === 0
    ) {
      return { cases: SHG_CASES_DEMO, activeCaseId: SHG_CASES_DEMO[0].id };
    }
    const validCases = parsed.cases.filter(
      (c): c is SHGCase => Boolean(c && typeof c.id === "string" && typeof c.shgName === "string")
    );
    if (validCases.length === 0) {
      return { cases: SHG_CASES_DEMO, activeCaseId: SHG_CASES_DEMO[0].id };
    }
    const activeExists = validCases.some((c) => c.id === parsed.activeCaseId);
    return {
      cases: validCases,
      activeCaseId: activeExists && parsed.activeCaseId ? parsed.activeCaseId : validCases[0].id,
    };
  } catch {
    return { cases: SHG_CASES_DEMO, activeCaseId: SHG_CASES_DEMO[0].id };
  }
}

export function saveCasesState(cases: SHGCase[], activeCaseId: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const payload: PersistedCasesPayload = {
      version: STORAGE_VERSION,
      activeCaseId,
      cases,
    };
    window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private-browsing write failures
  }
}

export function clearCasesStorage(): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(CASES_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
