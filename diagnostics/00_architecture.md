# Phase 0 — Architecture & Codebase Recon (`Sakhi CreditLink`)

## 1. Tech Stack & Project Structure
- **Framework**: React `18.3.1` + TypeScript `5.7.3` + Vite `6.0.11` (`package.json:11-29`)
- **Styling**: Tailwind CSS `3.4.17` (`tailwind.config.ts`) + custom CSS tokens & glass classes (`src/index.css:1-155`)
- **UI Primitives**: shadcn-style aliases (`@/components/ui`, `@/lib/utils`, `components.json:12-18`), `lucide-react` `0.475.0`, `framer-motion` `14.14.0` + `motion` `12.4.7` (duplicate animation libs!)
- **Fonts**: `Inter`, `DM Serif Display`, `JetBrains Mono` imported via `@import` in `src/index.css:1` **and** `Inter`, `JetBrains Mono`, `Noto Sans Gujarati`, `Source Serif 4` linked in `index.html:9-12`.
- **Routing**: **None** (no React Router / URL hash state). Single-state switch in `src/App.tsx:125-128` (`appView: "landing" | "portal"` and `screen: NavScreenId`). Refreshing loses current screen & created cases.

## 2. Screen, Component & Data Inventory

| File | Role | State / Data Source | Status |
| :--- | :--- | :--- | :--- |
| `src/App.tsx` | Shell, 5-stage header, role/lang/search | In-memory `useState(SHG_CASES_DEMO)` (`:126`) | Active (`577` lines) |
| `src/screens/LandingPage.tsx` | Public landing + tilted Govt Portal marquee | Hardcoded `GOVT_PORTALS`, `LIVELIHOOD_CARDS`, unlabelled stats (`:165-168`) | Active (`445` lines) |
| `src/screens/SHGIntakeScreen.tsx` | 3-step live SHG intake + LokOS check | Uses `lokos-adapter.ts`, creates `SHGCase` (`:158`) | Active (`861` lines) |
| `src/screens/FinancePassportScreen.tsx` | Identity, Panchasutra, docs, consent, geo/OTP | Reads `shg`, mutates local UI + `onUpdateCase` | Active |
| `src/screens/CreditDemandScreen.tsx` | Capex vs Working Capital split | Reads `shg.costLines` (read-only! `onUpdateCase` unused) | Active |
| `src/screens/FinancingBlueprintScreen.tsx` | 6–12 mo sales ledger, EMI, DSCR | Local state seeded from `shg.unitEconomics` | Active |
| `src/screens/LivelihoodEvidenceScreen.tsx` | Unit economics + buyer POs | Reads/appends `shg.buyerEvidence` | Active |
| `src/screens/SchemeMatchScreen.tsx` | 9 Gujarat/GLPC schemes + Apply/Bank Picker | `getSchemeMatchesForCase(shg)` + `getDemoOffersForCase(shg)` | Active |
| `src/screens/OfferComparisonScreen.tsx` | Side-by-side 3-bank KFS comparison | `getDemoOffersForCase(shg)` (all hardcoded stubs) | Active |
| `src/screens/ApplicationPackScreen.tsx` | Completeness, JSON/Print dossier, queries | Mutates `shg.queries` & `shg.timeline` | Active |
| `src/screens/PostDisbursementGuardScreen.tsx` | Repayment streak, 0% subvention, lean warning | Local `pulseLog` + `onUpdateCase` | Active |
| `src/screens/CommandCentreScreen.tsx` | Funnel, priority queue, block matrix | Hardcoded `FUNNEL_METRICS_DEMO`, `DISTRICT_MATRIX_DEMO` | Active |
| `src/screens/DirectoryScreen.tsx` | Searchable SHG cards | Reads `cases` | Active |
| `src/screens/FieldFollowupsScreen.tsx` | Bank Sakhi task queue + visit note | Mutates `shg.tasks` & `shg.timeline` | Active |
| `src/screens/ProgrammeInsightsScreen.tsx` | Delay patterns & pilot protocol | Hardcoded `bottleneckPatterns` + `FUNNEL_METRICS_DEMO` | Active |
| `src/screens/RoleProfitDashboardScreen.tsx` | 5-role view, LokOS CSV sync, Profit calc | Reads `cases`, `lokos-adapter.ts`, local sliders | Active |
| `src/screens/HeroComponentScreen.tsx` | Legacy ColdEmailCrowdHero wrapper | Unrouted in `App.tsx` | **DEAD CODE** |
| `src/components/ui/cold-email-crowd-hero.tsx` | Open Peeps outbound sales hero | Fetches 22 SVGs from `supabase.co` (`:10-13`) | **DEAD CODE** |
| `src/components/ui/demo.tsx` | Demo wrapper for `ColdEmailCrowdHero` | Unrouted | **DEAD CODE** |
| `src/components/ui/hero-3-demo.tsx` | Demo wrapper for `AnimatedMarqueeHero` | Unrouted | **DEAD CODE** |

## 3. Real vs Mocked vs Hardcoded
- **Real (Client-Side Computed)**: EMI reducing-balance math (`FinancingBlueprintScreen.tsx:86-93`, `sakhi-data.ts:1357`), Capex/WC separation, DSCR & lean-month stress ratio, 9-scheme eligibility rule scoring (`sakhi-data.ts:942-1350`), CSV parsing for LokOS (`lokos-adapter.ts:80-118`) and 6–12 mo sales (`FinancingBlueprintScreen.tsx:107-127`), JSON pack download (`ApplicationPackScreen.tsx:74-99`), `window.print()`.
- **Simulated / Mocked**: `lokos-adapter.ts` (2 pre-seeded SHGs in module RAM), `verifyApiSetu` & `captureGeoProof` (`FinancePassportScreen.tsx`, hardcoded GPS `22.5645° N, 72.9289° E`), 3 lender offers (`Bank of Baroda`, `SBI`, `BGGB`), `PostDisbursementGuardScreen` initial 4-month pulse log.
- **Hardcoded Static Figures**: `LandingPage.tsx:165-168` (`148`, `₹3.62 Cr`, `84%`, `61`) & `:402-405` (`5`, `14+`, `29`, `₹78L`); `FUNNEL_METRICS_DEMO` (`sakhi-data.ts:272-283`); `DISTRICT_MATRIX_DEMO` (`sakhi-data.ts:285-351`); `bottleneckPatterns` (`ProgrammeInsightsScreen.tsx:7-12`).

## 4. Build, Console & Audit Results
- **TypeScript + Vite Build (`npm run build`)**: Exited `0` (verified on latest codebase: `dist/index.html` `1.00 kB`, `dist/assets/index-BPrTgnNW.css` `44.35 kB`, `dist/assets/index-CdkQMJiL.js` `559.85 kB` — **Vite warns chunk > 500 kB**).
- **Dev Server (`http://localhost:5173/`)**: Returns `HTTP 200`.
- **Lighthouse Mobile Audit**: **Not run** — `npx --no-install lighthouse` returned `npm ERR! 403 Forbidden` (not installed locally and sandbox blocks registry fetch), and headless Edge hung on local GPU/updater calls. Flagged as `P1` to run pre-finale outside sandbox.
- **Broken Links, Dead Controls, Placeholders**:
  - **P0**: `LandingPage.tsx:165-168, 402-405` displays unverified pilot figures (`148 SHGs`, `₹3.62 Cr`, `₹78L Disbursed`) with **no "Illustrative / Simulated" label** (also `DemoBadge` in `ui-primitives.tsx:6` suppresses compact badge by returning `null`!).
  - **P0**: `App.tsx:405-415` Hindi (`"hi"`) language option does nothing (`showGu = language === "en-gu"` only; `"hi"` falls back to English), and the selector is `hidden xl:flex` (hidden on mobile & 1280px screens).
  - **P0**: `CreditDemandScreen.tsx` has unused `role` / `onUpdateCase` — SHGs cannot add/edit cost items after intake.
  - **P1**: `ColdEmailCrowdHero` (`src/components/ui/cold-email-crowd-hero.tsx:17-22`) contains leftover SaaS cold-email copy (`"Linear is hiring 4 AEs"`, `"Attio raised $52M"`) and external `supabase.co` SVGs; though unrouted, it sits in the repo.
  - **P1**: `public/images/*.jpg` totals **3.47 MB** across 4 unoptimized JPGs (`shg-hero.jpg` is `1.02 MB`).
  - **P2**: No `lorem ipsum` found anywhere in `src/`. All 6 external URLs in `LandingPage.tsx:34-76` use valid `https://` official domains (`aajeevika.gov.in`, `pmfme.mofpi.gov.in`, `jansamarth.in`, `mudra.org.in`, `udyamregistration.gov.in`, `glpc.gujarat.gov.in`).
