# Phase 4 — UI/UX Benchmark Research

*Benchmarked patterns across 10 reference systems (via product documentation, design system specs, and search research; live browser automation was unavailable in this environment due to Chrome DevTools port error).*

## What NOT to Do (NRLM MIS & Legacy Govt Portal Anti-Patterns)
- **Spreadsheet data-dumps**: Endless multi-column tables (`State > District > Block > Village > SHG`) forcing horizontal scroll & pinch-zoom on mobile.
- **5-level nested menus**: Bureaucratic folder hierarchies instead of task-based workflows.
- **Post-submit form failure**: Cryptic errors after clicking Submit instead of inline validation & 1-thing-per-page progressive disclosure.

## Benchmark Pattern Table

| Component | Best-Practice Pattern | Source | Where Applied in Sakhi CreditLink |
| :--- | :--- | :--- | :--- |
| **Navigation** | Role-based top bar with max 3–4 items (`My Tasks`, `Queue`, `District View`) + contextual breadcrumbs; zero 12-tab clutter | **Linear**, **GOV.UK**, **GIGW 3.0** | Replace 5×3 dual header in `App.tsx` with clean **3-Role Switcher + 1-row workflow nav** + sticky mobile bottom CTA bar |
| **Hero & Landing** | One clear value sentence, one key problem stat, 3-step visual flow, and direct role entry CTAs — **no** moving carousels or decorative bloat | **GOV.UK**, **JanSamarth**, **Stripe** | Replace `AnimatedMarqueeHero` & tilted portal carousel in `LandingPage.tsx` with calm editorial split hero + static official portal directory |
| **CTA Hierarchy** | Strictly **1 Primary CTA per screen** (`solid high-contrast`), paired with restrained secondary/tertiary actions | **GOV.UK**, **Material 3** | Enforce 1 primary action per view (`Submit Pack`, `Approve / Query`, `Run Diagnosis`) |
| **Button System & States** | Distinct Primary, Secondary, Tertiary, Destructive; `≥ 44px` height on mobile; explicit `hover`, `focus-visible` ring, `disabled`, and `loading` spinner states | **GOV.UK**, **Carbon**, **UX4G** | Standardize `Button` component in `src/components/ui/button.tsx` across all screens |
| **Steppers** | Linear "One thing per page / step" indicator with step number, active label, completed checkmark, and sticky Next/Back footer | **GOV.UK**, **JanSamarth**, **Material 3** | Upgrade `SHGIntakeScreen` 3-step wizard with mobile bottom bar & clear validation |
| **Status Chips** | Semantic pill with icon + text (never color alone) for WCAG AA readability | **Carbon**, **Stripe Dashboard** | `StageChip`, `ComplianceChip` (`Eligible`, `Pending`, `Query`, `Blocked`) |
| **Application Tracker Timelines** | Vertical chronological spine with timestamp, actor, SLA countdown badge (`Days left / Overdue`), and next owner | **UMANG**, **JanSamarth**, **Stripe** | `ApplicationPackScreen` + SHG Tracker + Bank Branch SLA timer (`14-day norm`) |
| **Data Tables** | Tabular numerals (`tabular-nums`), sticky header, status filter chips, inline row action, and **mobile card view `< 768px`** | **Stripe Dashboard**, **Carbon** | `BankQueueTable`, `DirectoryScreen`, `DistrictMatrix` (cards on mobile, tables on desktop) |
| **Funnel & Heatmap Charts** | Clean horizontal bar conversion with % drop-off labels, plus high-contrast choropleth/tile grid comparing **Target vs. Access** | **Our World in Data**, **Stripe** | District/State Official Dashboard: Target vs Access funnel & 33-district Gujarat grid |
| **Empty States** | Friendly icon + plain-language explanation + **1 primary recovery CTA** (never a dead `"No data"` cell) | **GPay / PhonePe**, **Kiva** | Empty buyer evidence, empty queries, zero search results (`+ Add First Buyer` / `Reset Filter`) |
| **Language Switcher** | Always visible top-bar toggle (`English / ગુજરાતી / हिन्दी`) switching real UI labels, numbers, and voice hints | **UX4G**, **GIGW 3.0**, **Khatabook** | Visible at all breakpoints in header (`App.tsx`) + full `i18n` string dictionary |
| **Help / Support** | Plain-language "Why this score?" micro-drawers + WhatsApp/IVR audio nudge preview for low-literacy users | **Khatabook**, **GPay** | SHG/Sakhi screen: plain Gujarati "Why?" explanation + WhatsApp nudge card |
| **Trust Signals** | Purpose-specific consent badge, DPDP Act 2023 notice, `"Simulated data"` pill, verified LokOS/RBI source anchors | **GPay**, **Kiva**, **UX4G** | Visible on Intake, Consent drawer, Landing stats, and Official Trust panel |
| **Mobile Bottom Bars** | Fixed bottom action bar (`pb-safe`, `min-h-[56px]`) for thumb-friendly primary progression on `360–390px` screens | **Khatabook**, **PhonePe**, **Material 3** | Sticky mobile CTA bar on SHG/Sakhi & Intake flows |
