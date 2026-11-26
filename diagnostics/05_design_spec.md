# Phase 5 — Anti-"AI Slop" Redesign Specification (`Sakhi CreditLink`)

## 1. Explicit Purge List (Remove Immediately in Phase 6)
- **Zero glassmorphism**: Remove `.ios-canvas`, `.ios-glass`, `.ios-glass-strong`, `.ios-glass-dark`, `.ios-pill`, and all `backdrop-filter: blur(...)`.
- **Zero decorative/tilted motion**: Remove `AnimatedMarqueeHero` (`hero-3.tsx` on landing), remove tilted/scrolling Govt Portal carousel, remove `ColdEmailCrowdHero` & `gradient-mesh`.
- **Zero generic cards/radii**: Replace `rounded-3xl` / `rounded-2xl` everywhere with disciplined `rounded-lg` (`8px`) and `rounded-md` (`6px`) institutional borders (`1px solid`). Replace 3 identical icon feature cards on landing with an editorial 2-column problem/solution + numbered workflow.
- **Zero unlabelled fake stats**: Every sample number carries a visible **"Simulated data"** badge.

## 2. Design Tokens (Rooted in Gujarat Rural Finance)

| Token | Value | Rationale |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FAF8F4` (Warm Khadi / Ledger Paper) | High contrast, calm in bright outdoor sunlight for field Sakhis, zero glare |
| `--bg-surface` | `#FFFFFF` (Crisp Card) / `#F2EFE8` (Table Header) | Clear surface separation via `1px solid #DFDBD0` borders, not blur/shadows |
| `--color-primary` | `#0F5E4E` (Deep Forest Emerald) | Signals NABARD/rural prosperity & bank-grade institutional trust; `>7:1` contrast with `#FFFFFF` |
| `--color-primary-hover` | `#0A4539` | Darker emerald for hover/active states |
| `--color-accent` | `#B45309` (Warm Terracotta / Amber) | Gujarat craft warmth; reserved strictly for highlights, milestones & caution notices |
| `--text-primary` | `#141A23` (Deep Ink Charcoal) | `15:1` WCAG AAA contrast on `#FAF8F4` / `#FFFFFF` |
| `--text-secondary` | `#475467` | `7.1:1` WCAG AA+ contrast for labels & descriptions |
| `--status-success` | `#047857` on `#ECFDF5` (Border `#A7F3D0`) | Verified / Eligible / On-Time |
| `--status-warning` | `#B45309` on `#FFFBEB` (Border `#FDE68A`) | Pending / Near Match / SLA Warning |
| `--status-danger` | `#B91C1C` on `#FEF2F2` (Border `#FECACA`) | Missing / Rejected / SLA Breached |
| `--status-info` | `#1D4ED8` on `#EFF6FF` (Border `#BFDBFE`) | Under Bank Appraisal / Submitted |

- **Typography**: `Inter` + `Noto Sans Gujarati` (always first in `body` stack!), `Source Serif 4` for display headlines, `JetBrains Mono` (`tabular-nums`) for all `₹` amounts, IDs, and ratios.
- **8pt Spacing Grid**: `4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`.
- **Elevation**: Flat by default (`1px solid #DFDBD0`); shadow reserved only for dropdowns/modals (`0 4px 12px rgba(20,26,35,0.08)`).

## 3. Button System (Strict Hierarchy & States)
Every interactive button uses a single shared `<Button />` primitive (`min-h-[44px]` on mobile, `min-h-[38px]` on dense desktop rows, `focus-visible:ring-2 focus-visible:ring-[#0F5E4E] focus-visible:ring-offset-2`):
- **Primary** (max **1 per screen**): `bg-[#0F5E4E] text-white hover:bg-[#0A4539] disabled:opacity-50`
- **Secondary**: `border border-[#D0C9BA] bg-white text-[#141A23] hover:bg-[#F2EFE8]`
- **Tertiary / Ghost**: `text-[#0F5E4E] hover:bg-[#E8F3EF]`
- **Destructive**: `bg-[#B91C1C] text-white hover:bg-[#991B1B]`
- **Mobile Sticky Action Bar**: Fixed bottom bar (`border-t bg-white p-3 lg:hidden`) holding the screen's single Primary CTA on `360px–768px`.

## 4. Information Architecture & Wireframe Specs (6 Core Surfaces)

### Surface 1: Landing Page (`src/screens/LandingPage.tsx`)
- **Top Bar**: Logo (`Sakhi CreditLink · Gujarat`), `"Simulated data"` pill, Language Toggle (`EN | ગુજરાતી | हिन्दी`), Primary CTA (`Open Live Demo`).
- **Hero (2-Column Editorial)**:
  - Left: One-line promise (*"Move Sakhi Mandals from credit targets to real bank access"*), 1 stark Target-vs-Access metric callout (*"~100% SHGs have bank accounts, yet access stalls on time-to-credit, low ticket sizes & undocumented cash flows — illustrative pilot gap"*), 2 clear entry CTAs (**Enter as SHG / Bank Sakhi**, **Enter as Bank / District Official**), + **Live 90s Demo** link.
  - Right: Static crisp photograph (`/images/shg-hero.jpg`, compressed `< 150 KB`) with caption: *"Ujjwal Sakhi Mandal, Chikhodra (Anand) · Simulated case"*.
- **How It Works (3 Numbered Steps)**: `01 Verify LokOS & 6× Corpus` → `02 Build Cash-Flow Blueprint` → `03 Track Bank SLA & 0% Subvention`.
- **Official Portals Grid (Static, Accessible)**: Clean 6-link reference table/grid (`DAY-NRLM`, `PMFME`, `JanSamarth`, `MUDRA`, `Udyam`, `GLPC`) — zero scrolling motion!
- **Trust & DPDP Bar**: Explicit RBI norms alignment + DPDP Act 2023 purpose-consent summary.

### Surface 2: SHG / Bank Sakhi Workspace
- **Top Context**: Active Sakhi Mandal (`Ujjwal Sakhi Mandal · Anand Rural`), Language Switcher, **New Intake** trigger, **Reset Demo** control.
- **Screen A — Guided Intake (`SHGIntakeScreen`)**: LokOS verification gate → 3-step form (`Group & RBI 6× Corpus Check` → `Capex vs WC Demand` → `6–12 Mo Sales & Unit Economics`).
- **Screen B — Readiness & Action Hub (Unified SHG View)**:
  - **Readiness Score (`84/100`) with plain-language "Why?" breakdown** (Panchasutra `30/30`, RBI `6-month active books` + `6× Corpus = ₹9.84L drawing power`, Missing docs `-16 pts`).
  - **Missing Checklist + Upload / Quorum OTP / Geo-Tag** (1-click fixes update score live!).
  - **Next-Best-Action Card** + **Application Tracker Timeline** (with Bank SLA countdown + **WhatsApp/Voice Gujarati Nudge preview**).
  - **Gujarat & GLPC 9-Scheme Match + Apply & Pick Bank**.
  - **Post-Disbursement & 0% Subvention Guard + Dose 1→2→3 Repeat Linkage indicator**.

### Surface 3: Bank Branch Manager Workspace
- **Prioritised Queue**: SHGs sorted by **Readiness Score desc** & **SLA Days Remaining** (`Bank of Baroda — Chikhodra`).
- **1-Click Appraisal Summary Drawer**: Panchasutra score, NABARD A/B/C Grade, 6-month books status, **RBI Eligible Drawing Power (`max(6× corpus, ₹1.5L)`) vs Requested Amount**, Capex/WC split, 6–12 mo sales DSCR & lean-month coverage, and auto-generated **Micro Credit Plan (MCP)** printable view.
- **Decision Bar (with SLA Timer `14-day norm`)**:
  - **Sanction / Approve** (moves stage to `Sanctioned`)
  - **Raise Query** (with standardized reason codes: `DOC-QUOTE`, `DOC-FSSAI`, `MCP-MISMATCH`, `BUYER-PROOF`)
  - **Reject with Mandatory Reason Code** (logged directly into District Rejection Analytics!).

### Surface 4: District / State Official Dashboard (GLPC / SLBC)
- **Target vs. Access Header Strip (4 Cards, labelled Simulated)**:
  1. *Target Linked vs. Actual Sanctioned* (`148 Target / 29 Sanctioned` + gap)
  2. *Median Time-to-Credit* (`34 days baseline -> 18 days Sakhi pack`)
  3. *Avg Ticket vs. RBI Eligible `6× Corpus`* (`₹1.8L vs ₹4.6L eligible — Ticket Gap 61%`)
  4. *Repeat Linkage Rate (Dose 2+)* (`22%`)
- **Conversion Funnel + 33-District / Block Access Matrix**: Sortable by Time-to-Credit, Sanction %, and SLA Breaches (`>14 days`).
- **Bottleneck & Rejection-Reason Analytics**: Breakdown of bank rejection/query codes + 1-click **"Send Cluster Nudge / Escalate to LDM"** action.

### Surface 5: Impact, Scale & Sustainability (Official/Admin Sub-tab)
- Assumptions table (`1 Pilot Block` → `33 Gujarat Districts` → `National NRLM`), Pilot KPI baseline/endline framework, B2G + Flat-Fee Bank LSP sustainability calculator (explicitly restricted to **Official/Admin view**, never shown to SHGs).

### Surface 6: Trust, Governance & Integration Drawer/Section
- Data sources (`GLPC LokOS CSV Snapshot` + `Post-MoU API Setu / NRLM`), **DPDP Act 2023** compliance (purpose-limited consent, 90-day expiry, working Revoke button), and **RBI SHG-BLP Policy Guardrails** (banks retain sanction authority; member individual SB accounts not prerequisite).

## 5. Component Inventory for Phase 6
`AppShell` (role-driven 3-mode header + mobile bottom bar + Reset Demo + `localStorage` hook), `Button`, `SimulatedBadge`, `StatusChip`, `ReadinessBreakdownCard`, `RBIDrawingPowerCheck`, `BankAppraisalQueue`, `BankDecisionModal` (Approve/Query/Reject + reason codes), `TargetVsAccessPanel`, `GujaratiNudgePreview`, `TrustAndDPDPPanel`, `i18n.ts` (`en` / `gu` / `hi`).
