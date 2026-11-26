# Phase 1 — Problem-Solution Fit Audit (`PS000311: From Credit Target to Credit Access`)

## 1. SHG-to-Bank Journey & Top Failure Points (Gujarat Context)

| Stage | Real Gujarat / RBI Process | Top Failure Points | Currently Covered? |
| :--- | :--- | :--- | :--- |
| **1. Formation & Internal Lending** | Sakhi Mandal formed (`10–20` women), savings + internal lending (`>= 6 months` active books per RBI norm, NOT merely bank A/C date) | Irregular meeting/cashbook records; missing `Tharav` resolution | Partial (`PanchasutraChecks` booleans, no 6-month books check) |
| **2. Grading (A/B/C)** | NABARD/GLPC grading (meetings, savings, recovery, bookkeeping) | Grading delayed 30–90 days in block offices | **Missing** (only `panchasutraScore / 5`, no formal A/B/C grade) |
| **3. Bank Savings Account** | Active SB operation (~6 months satisfactory operation; individual member SB accounts NOT required by RBI) | Branch demands individual KYC/SB for all 12 members | **Missing** (no RBI rule check flagging unlawful branch demands!) |
| **4. Credit Sizing & MCP** | RBI First Dose: `max(6 × corpus, ₹1.5L)` (2nd: `8× / ₹3L`, 3rd: `≥ ₹6L` per MCP) | **Low ticket size** (branches give flat ₹1L instead of 6× corpus); Capex mixed with WC | Partial (Capex/WC split exists, **6× corpus formula missing!**) |
| **5. Scheme & Branch Submission** | NRLM Bank Linkage / Gujarat 0% subvention / MMUY / PMFME / VBY | **Mission–Bank data mismatch** (LokOS vs CBS); silent branch parking | Partial (LokOS snapshot + bank picker exist; no rejection codes) |
| **6. Appraisal & Sanction** | Branch inspection, sanction, stamp-duty waiver (`≤ ₹10L`) | **Branch reluctance**, no status visibility, zero SLA escalation | **Missing** (no SLA timer or LDM/BLBC escalation!) |
| **7. Utilisation & Repayment** | Asset purchase, monthly EMI, Gujarat **0% interest subvention** | Missed single EMI forfeits 0% subvention; no lean-month buffer | Covered (`PostDisbursementGuardScreen.tsx`) |
| **8. Repeat / Enhanced Linkage** | Graduation from Dose 1 → Dose 2 (`8× / ₹3L`) → Dose 3 (`₹6L+`) | **Slow repeat linkage** despite 100% repayment history | **Missing** (no Repeat Dose Eligibility trigger) |

## 2. Feature-to-User-to-Metric Mapping (0–5 Fit Score)

| Feature / File | Target User | Failure Point Addressed | Metric Moved | Score |
| :--- | :--- | :--- | :--- | :---: |
| `SHGIntakeScreen.tsx` (LokOS gate + 3-step) | Sakhi / SHG Leader | LokOS–app duplication; structured demand | Time-to-pack, data completeness | **4/5** |
| `FinancingBlueprintScreen.tsx` (6–12m sales + EMI) | Sakhi / Bank Officer | Arbitrary ticket sizing; branch skepticism | Adequate ticket size, appraisal speed | **4/5** |
| `SchemeMatchScreen.tsx` (9 Gujarat schemes + Apply) | SHG / Sakhi | Wrong scheme/subsidy expectation; low awareness | First-time-right routing | **4/5** |
| `PostDisbursementGuardScreen.tsx` (0% Guard) | Sakhi / SHG | Subvention loss, lean-month default | On-time repayment, repeat readiness | **4/5** |
| `FinancePassportScreen.tsx` (Geo/OTP/API checks) | Sakhi / Bank Officer | Unverified self-declared data | Branch trust, query reduction | **3.5/5** |
| `ApplicationPackScreen.tsx` (Dossier + Print + Queries) | Sakhi / Bank Officer | Missing docs & untracked branch queries | First-time-complete pack rate | **3.5/5** |
| `CommandCentreScreen.tsx` (Funnel + Queue) | GLPC / District Official | Blindness to where packs stall | Time-in-stage, bottleneck fix | **3/5** *(hardcoded metrics)* |
| `OfferComparisonScreen.tsx` | SHG Leader | Opaque terms across banks | Informed borrower choice | **3/5** *(all 3 banks have identical EMI logic)* |
| `RoleProfitDashboardScreen.tsx` | Admin / Jury / GLPC | Sustainability question | Platform revenue viability | **2.5/5** *(mixes SHG & Admin P&L!)* |
| `AnimatedMarqueeHero` + Tilted Govt Portals (`LandingPage.tsx`) | Visitor / SHG | First impression & scheme access | Entry clarity | **2/5** *(visually flashy, slows mobile)* |
| `HeroComponentScreen` / `ColdEmailCrowdHero` | None (Dev) | None — leftover B2B SaaS outbound template | None | **0/5 (Remove)** |

## 3. "Theatre Features" Flagged
1. **`P0` Remove — `ColdEmailCrowdHero` / `HeroComponentScreen` (`src/components/ui/cold-email-crowd-hero.tsx`)**: Unrelated B2B cold-email Open Peeps demo still sits in repo with external `supabase.co` links.
2. **`P0` Rework — `RoleProfitDashboardScreen.tsx` wired to SHG Leader role (`App.tsx:423`)**: Switching the role dropdown to **SHG Leader** or **Bank Officer** dumps them onto an **Admin Profit Calculator** (`Sakhi CreditLink Profit Calculator`). A real SHG woman (`SHG Leader`) or Bank Manager should NEVER see platform B2G SaaS margins—they need *their own* dedicated dashboard!
3. **`P1` Rework — `AnimatedMarqueeHero` & Tilted Govt Portal Marquee (`LandingPage.tsx:145-242`)**: Tilted rotating cards (`-2deg`/`5deg`, infinite `motion.div` marquee) look like a creative video agency template (original `hero-3.tsx` was "Engage Audiences with Stunning Videos"), NOT a credible rural-credit gateway for NABARD/IAS judges. Moving links make clickable official portals harder to tap on mobile.
4. **`P1` Merge — `CreditDemandScreen.tsx` + `LivelihoodEvidenceScreen.tsx` + `FinancingBlueprintScreen.tsx`**: Having 3 separate screens for costs, unit economics, and sales forces 6+ clicks; merge or sequence cleanly into a single cohesive **Financial Readiness & Blueprint** workspace.

## 4. Missing Features a Competition Judge Will Expect
- **`P0` RBI First-Dose Drawing Power Calculator (`max(6 × corpus, ₹1.5L)`) & Grading Badge (A/B/C)**: Right now, `SchemeMatchScreen` ignores RBI's exact `6× corpus or ₹1.5L` floor and `6-month active books` rule, and doesn't flag illegal bank demands (like demanding savings accounts for every member).
- **`P0` True Role-Based Views**: Separate views for **1) SHG / Bank Sakhi**, **2) Bank Branch Manager** (prioritised queue, 1-click summary, **Approve / Query / Reject with standardized RBI/NRLM reason codes**, SLA countdown), and **3) District/State Official** (**Target vs. Access** dashboard).
- **`P0` Target-vs-Access Dashboard + Rejection-Reason Analytics + SLA Escalation Timers**: `CommandCentreScreen` shows a stage funnel, NOT **Sanctioned Target vs. Actual Access** (Time-to-Credit days, Ticket Adequacy %, Rejection Reason breakdown like *"CIBIL mismatch / Incomplete MCP / Branch inspection delay"*, Repeat Linkage %).
- **`P1` Repeat / Enhanced Linkage Pathway**: Dose 1 (`6× / ₹1.5L`) → Dose 2 (`8× / ₹3L`) → Dose 3 (`₹6L+`) graduation tracker.
- **`P1` Genuine Gujarati (`ગુજરાતી`) UI & Voice/WhatsApp-Style Nudges**: Currently `language === "hi"` is dead, and Gujarati only covers ~15 labels across 2 screens.

## 5. Verdict: Does It Shift "Target" to "Access"?
**Partially (~55%) — and this is our biggest opportunity.**
Right now, the app excels at **pre-application preparation** (LokOS verification, Capex/WC separation, 6–12 mo sales EMI, 9 Gujarat schemes, 0% subvention guard), which tackles *why packs get rejected*. However, **it still measures pipeline counts (`148 SHGs`, `61 packs`) rather than explicitly contrasting Government Targets vs. Real Credit Access** (Time-to-Credit, Eligible Ticket `6× corpus` vs Sanctioned Ticket gap, Rejection Reason Codes, Branch SLA timers, and Repeat Linkage). Fixing this in `CommandCentre` + `Bank Branch View` + `SHG/Sakhi View` turns the entire narrative directly into the problem statement (`PS000311`).
