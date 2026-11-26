# Phase 3 — Technical, Accessibility, i18n & Demo Resilience Diagnostic

## 1. Bugs & Broken State Flows

| Severity | Location | Issue | Fix |
| :---: | :--- | :--- | :--- |
| **P0** | `src/App.tsx:419-424` | Changing the 5-role dropdown forces navigation to `role-profit-dashboard`, showing startup P&L sliders even when selecting `SHG Leader` or `Bank Officer`. | Route each role to its true workspace (**SHG/Sakhi**, **Bank Branch**, **District Official**); move pilot assumptions to Impact/Official view. |
| **P0** | `src/App.tsx:126` & `src/lib/lokos-adapter.ts:56` | Zero persistence (`useState` + module object only). Refreshing browser wipes new intake SHGs, uploaded LokOS CSVs, and logged pulses. | Persist `cases` & `lokosSnapshot` in `localStorage` with a safe schema version + **"Reset Demo"** button. |
| **P0** | `src/App.tsx:405-415` | Language selector includes `"hi"` (Hindi), which does **nothing** (`showGu = language === "en-gu"` only), and selector is `hidden xl:flex` (invisible on `< 1280px`!). | Build proper `en` / `gu` (`ગુજરાતી`) / `hi` (`हिन्दी`) dictionary covering navigation, headers, checklists & buttons; make switcher always visible. |
| **P0** | `src/screens/LandingPage.tsx:165-168, 402-405` | Unverified numbers (`148 SHGs`, `₹3.62 Cr`, `₹78L Disbursed`) shown without `"Simulated data"` label. | Add explicit `"Simulated pilot data"` badge/caption on every stat strip & sample card. |
| **P1** | `src/screens/CreditDemandScreen.tsx:11` | `role` and `onUpdateCase` unused; users cannot edit or add Capex/WC line items after intake. | Allow editing/adding Capex/WC items or merge cleanly into Readiness view. |
| **P1** | `src/screens/HeroComponentScreen.tsx`, `cold-email-crowd-hero.tsx`, `demo.tsx`, `hero-3-demo.tsx` | Dead files (`cold-email-crowd-hero.tsx` embeds 22 external `supabase.co` URLs & B2B SaaS copy). | Remove dead SaaS demo files or isolate cleanly before freeze. |
| **P1** | `src/screens/PostDisbursementGuardScreen.tsx:45-53` | `actualMonthlySales` and `onTimeStreak` use local `useState` initialized only on mount — switching SHGs does NOT reset state! | Key component by `shg.id` (`key={activeCase.id}`) or sync via `useEffect([shg.id])`. |

## 2. Responsiveness (`360px`, `390px`, `768px`, `1440px`)
- **`360px / 390px` (Mobile — Critical for Bank Sakhis)**:
  - **P0**: `App.tsx:317-486` stacks a two-tier fixed header (`~102px` tall) + horizontal scrolling nav pills + sub-nav pills. At `360px`, the stage pills clip/scroll awkwardly and steal ~18% of screen height.
  - **P0**: No sticky mobile bottom action bar (`Primary CTA`) on multi-step screens (`SHGIntakeScreen`, `FinancePassportScreen`, `SchemeMatchScreen`).
  - **P1**: Wide tables (`OfferComparisonScreen.tsx:76`, `CommandCentreScreen.tsx:222`, `RoleProfitDashboardScreen.tsx:242`) require horizontal scrolling with no mobile card fallback.
  - **P1**: `FinancingBlueprintScreen.tsx:177` renders 12 monthly input columns (`grid-cols-3` on mobile) — crowded at `360px`.
- **`768px` (Tablet) & `1440px` (Desktop — Judge Projector)**:
  - `App.tsx:403` hides the language switcher below `1280px` (`hidden xl:flex`), so even at `1024px` (standard laptop/projector resolution!) judges cannot switch to Gujarati!

## 3. Performance & Bundle Size
- **P0 (Images)**: `public/images/` contains **3.47 MB** across 4 JPGs (`shg-hero.jpg` `1.02 MB`, `shg-tailoring.jpg` `874 KB`, `shg-dairy.jpg` `800 KB`, `shg-food.jpg` `783 KB`). On rural 3G/4G (`~1.5 Mbps`), landing page loads >18 seconds!
- **P1 (JS Bundle)**: `npm run build` produces `dist/assets/index-CdkQMJiL.js` at **`559.85 kB`** (`160.22 kB` gzip) — triggers Vite's >500 kB warning. Both `framer-motion` (`14.14.0`) AND `motion` (`12.4.7`) are installed (`package.json:14,16`). Removing `motion`/dead hero + lazy-loading screens will slash bundle size below `250 kB`.
- **P1 (Fonts)**: `index.html:10` loads 4 font families (`Inter`, `JetBrains Mono`, `Noto Sans Gujarati`, `Source Serif 4`) AND `src/index.css:1` redundantly `@import`s 3 font families (`Inter`, `DM Serif Display`, `JetBrains Mono`). Removing `@import` from `src/index.css` eliminates render-blocking CSS waterfall.
- **P2 (Lighthouse)**: Could not execute automated Lighthouse CLI in sandbox (`403` on npm fetch); must verify Mobile Performance/Accessibility scores once P0 fixes land.

## 4. Accessibility (WCAG 2.2 AA & GIGW)
- **P0 (Tap Targets `< 44px`)**: Search (`h-8 w-8` = `32px`), Exit (`h-8 w-8` = `32px` in `App.tsx:397,438`), test ID chips (`py-0.5` ≈ `22px` in `SHGIntakeScreen.tsx:439,450`), and sub-nav buttons (`py-1.5` ≈ `30px`) fail mobile `44×44px` minimum touch targets.
- **P1 (Contrast)**: `text-white/55` on `ios-glass-dark` (`LandingPage.tsx:410`), `text-[var(--sakhi-muted)]` (`#64748B`) on tinted mint/amber glass (`bg-emerald-50`, `bg-white/72`), and `text-[var(--sakhi-forest)]/25` decorative step numbers sit close to or below `4.5:1` contrast.
- **P1 (Forms & Focus)**: Several `<select>` and `<input>` controls lack explicit `<label htmlFor>` associations (`FinancingBlueprintScreen.tsx:249-269`), custom checkboxes in `SHGIntakeScreen.tsx:605` lack visible `focus-visible` rings, and accordions (`SchemeMatchScreen.tsx:120`, `FinancePassportScreen.tsx`) lack `aria-expanded` / `aria-controls`.

## 5. i18n (Gujarati, Hindi, English) & Low-Bandwidth
- **P0 (Gujarati Font Applied Incorrectly)**: `index.html:10` loads `Noto Sans Gujarati`, and `tailwind.config.ts:11` includes it in `fontFamily.sans`, **but `src/index.css:44` overrides `body` with `font-family: 'Inter', -apple-system, ...`**—excluding `Noto Sans Gujarati`!
- **P1 (Incomplete Translation)**: Only `FinancePassportScreen` and `CreditDemandScreen` render partial Gujarati fields; all headings, navigation, RBI explanations, and scheme rules stay English-only.

## 6. Security, Privacy (DPDP Act 2023) & Demo Resilience
- **Security**: Clean — `.gitignore` excludes `.env`, `*.exv`, and strategy `.md`; no API keys or real PII in `src/` (names/phones like `+91 98XXX XX412` are masked/fictional).
- **P1 (Privacy / DPDP Act 2023)**: `FinancePassportScreen` shows `ConsentRecord` cards, but lacks a clear **Digital Personal Data Protection (DPDP) Act 2023** notice, Data Fiduciary identity (GLPC/LSP), granular opt-in checkboxes, and working **Revoke Consent** button.
- **P0 (Demo Resilience)**: If Wi-Fi drops on stage:
  - Google Fonts CDN (`fonts.googleapis.com`) fails → fallback system fonts must include clean Gujarati fallback.
  - External links (`GOVT_PORTALS`) require internet → fine as outbound links, shouldn't block portal flow.
  - **No "Reset Demo" button** and **no `localStorage` persistence** → risking lost state on accidental reload during Q&A.
