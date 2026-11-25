import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  Globe,
  MapPin,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onEnterPortal: () => void;
}

const GOVT_PORTALS = [
  {
    name: "DAY-NRLM / Aajeevika",
    tag: "SHG Bank Linkage",
    desc: "Official National Rural Livelihoods Mission portal for SHG CCL, interest subvention, and LokOS guidelines.",
    url: "https://aajeevika.gov.in/",
  },
  {
    name: "PMFME Portal (MoFPI)",
    tag: "35% Capital Subsidy",
    desc: "Micro Food Processing Enterprises scheme portal for machinery & fixed-capital subsidy applications.",
    url: "https://pmfme.mofpi.gov.in/",
  },
  {
    name: "JanSamarth National Portal",
    tag: "Credit-Linked Schemes",
    desc: "Unified Government of India portal to check eligibility and apply across 12+ credit-linked schemes.",
    url: "https://www.jansamarth.in/",
  },
  {
    name: "PM MUDRA Yojana",
    tag: "Micro-Enterprise Loans",
    desc: "Official PMMY guidelines for Shishu, Kishore, and Tarun non-farm micro-enterprise credit.",
    url: "https://www.mudra.org.in/",
  },
  {
    name: "Udyam Registration (MSME)",
    tag: "Enterprise Identity",
    desc: "Zero-cost Government of India MSME registration required by banks and PMFME subsidy workflows.",
    url: "https://udyamregistration.gov.in/",
  },
  {
    name: "GLPC — Mission Mangalam",
    tag: "Gujarat State Nodal",
    desc: "Gujarat Livelihood Promotion Company portal for district cluster federations and Bank Sakhi support.",
    url: "https://glpc.gujarat.gov.in/",
  },
];

const LIVELIHOOD_CARDS = [
  {
    title: "Food Processing & Spices",
    scheme: "DAY-NRLM + PMFME Capex",
    image: "/images/shg-food.jpg",
    desc: "Papad rolling, spice pulverizers, millet bakeries, and FSSAI-compliant packaging units.",
  },
  {
    title: "Dairy & Value-Added Ghee",
    scheme: "SHG Term + CCL",
    image: "/images/shg-dairy.jpg",
    desc: "Milk cream separators, cultured A2 ghee kettles, and cooperative supply linkage.",
  },
  {
    title: "Garments & Tailoring Units",
    scheme: "DAY-NRLM / MUDRA",
    image: "/images/shg-tailoring.jpg",
    desc: "Motorized lockstitch clusters, school uniforms, and institutional bulk orders.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal }) => {
  return (
    <div className="min-h-screen ios-canvas">
      {/* ─── iOS Frosted Glass Navigation ─── */}
      <nav className="fixed top-3 inset-x-4 z-50 mx-auto max-w-7xl rounded-2xl ios-glass-strong">
        <div className="flex h-16 items-center justify-between px-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sakhi-forest)] shadow-md shadow-[var(--sakhi-forest)]/25">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-[17px] font-bold tracking-tight text-[var(--sakhi-slate)]">
                Sakhi CreditLink
              </span>
              <span className="ml-2 hidden sm:inline-block rounded-full bg-[var(--sakhi-mint)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
                Gujarat Pilot
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[var(--sakhi-muted)]">
            <a href="#features" className="hover:text-[var(--sakhi-slate)] transition-colors">Capabilities</a>
            <a href="#livelihoods" className="hover:text-[var(--sakhi-slate)] transition-colors">SHG Enterprises</a>
            <a href="#govt-portals" className="hover:text-[var(--sakhi-slate)] transition-colors">Govt Portals</a>
            <a href="#how-it-works" className="hover:text-[var(--sakhi-slate)] transition-colors">How It Works</a>
          </div>

          <button
            onClick={onEnterPortal}
            className="group flex items-center gap-2 rounded-xl bg-[var(--sakhi-forest)] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-lg shadow-[var(--sakhi-forest)]/25 transition-all hover:bg-[var(--sakhi-forest-deep)] hover:-translate-y-0.5"
          >
            Enter Portal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-2 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="text-[12.5px] font-medium text-[var(--sakhi-slate)]">
                  SFIC 2026 · PS000311 · Gujarat SHG Credit Gateway
                </span>
              </div>

              <h1 className="font-display text-[46px] leading-[1.08] tracking-tight text-[var(--sakhi-slate)] md:text-[58px] animate-fade-in-up animation-delay-100">
                From group savings{" "}
                <span className="text-[var(--sakhi-forest)]">to enterprise credit</span>
                <span className="text-[var(--sakhi-gold)]">.</span>
              </h1>

              <p className="mt-6 text-[17.5px] leading-relaxed text-[var(--sakhi-muted)] animate-fade-in-up animation-delay-200">
                Enter your SHG&apos;s enterprise needs in 3 guided steps. Sakhi CreditLink diagnoses
                cash-flow viability, matches eligible schemes like DAY-NRLM &amp; PMFME, and
                assembles a bank-ready application dossier.
              </p>

              <div className="mt-9 flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
                <button
                  onClick={onEnterPortal}
                  className="group flex items-center gap-2.5 rounded-2xl bg-[var(--sakhi-forest)] px-7 py-4 text-[15.5px] font-semibold text-white shadow-xl shadow-[var(--sakhi-forest)]/25 transition-all hover:bg-[var(--sakhi-forest-deep)] hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <Sparkles className="h-5 w-5" />
                  Start Credit Application
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#govt-portals"
                  className="flex items-center gap-2 rounded-2xl ios-glass px-7 py-4 text-[15.5px] font-semibold text-[var(--sakhi-slate)] transition-all hover:-translate-y-0.5"
                >
                  Official Scheme Portals
                </a>
              </div>
            </div>

            {/* Hero Photo + iOS Glass Overlay Cards */}
            <div className="relative lg:col-span-6 animate-fade-in-up animation-delay-400">
              <div className="relative mx-auto max-w-xl">
                <div className="overflow-hidden rounded-[28px] border border-white/80 shadow-2xl shadow-slate-900/10">
                  <img
                    src="/images/shg-hero.jpg"
                    alt="Women Self-Help Group members reviewing enterprise credit plans"
                    className="h-[380px] w-full object-cover md:h-[430px]"
                  />
                </div>

                {/* Top-left iOS Glass Pill */}
                <div className="absolute -left-3 top-6 rounded-2xl ios-glass-strong p-4 animate-scale-in md:-left-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sakhi-mint)]">
                      <Users className="h-5 w-5 text-[var(--sakhi-forest)]" />
                    </div>
                    <div>
                      <div className="text-[20px] font-bold text-[var(--sakhi-slate)] tabular-nums">148 SHGs</div>
                      <div className="text-[11.5px] text-[var(--sakhi-muted)]">Verified credit pipeline</div>
                    </div>
                  </div>
                </div>

                {/* Bottom-right iOS Glass Card */}
                <div className="absolute -bottom-5 right-3 left-3 sm:left-auto sm:w-80 rounded-2xl ios-glass-strong p-4 animate-scale-in md:-right-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[var(--sakhi-forest)]">Digital Diagnosis Ready</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">84% Score</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/70">
                    <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[var(--sakhi-forest)] to-[var(--sakhi-emerald)]" />
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-[12px] text-[var(--sakhi-muted)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Capex &amp; Working Capital separated cleanly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iOS Glass Stat Strip */}
        <div className="mx-auto max-w-7xl px-6 pb-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "148", label: "SHGs Assessed", sub: "Anand & Kheda Pilot" },
              { value: "₹3.62 Cr", label: "Pipeline Demand", sub: "Pre-application verified" },
              { value: "84%", label: "Avg Readiness", sub: "Panchasutra + Unit Economics" },
              { value: "61", label: "Bank-Ready Packs", sub: "First-time complete" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl ios-glass px-5 py-6 text-center">
                <div className="font-display text-[32px] text-[var(--sakhi-slate)] animate-count" style={{ animationDelay: `${i * 120}ms` }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-[13.5px] font-semibold text-[var(--sakhi-slate)]">{stat.label}</div>
                <div className="mt-0.5 text-[12px] text-[var(--sakhi-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHG Livelihood Photos Showcase ─── */}
      <section id="livelihoods" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
                Rural Women Collectives
              </div>
              <h2 className="font-display text-[38px] text-[var(--sakhi-slate)]">
                Built for real SHG enterprises
              </h2>
            </div>
            <button
              onClick={onEnterPortal}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--sakhi-forest)] hover:underline"
            >
              Assess your enterprise <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {LIVELIHOOD_CARDS.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-3xl ios-glass transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full ios-glass-strong px-3 py-1 text-[11px] font-semibold text-[var(--sakhi-forest)]">
                    {item.scheme}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-[18px] font-bold text-[var(--sakhi-slate)]">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--sakhi-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              <Zap className="h-3.5 w-3.5 text-[var(--sakhi-forest)]" />
              Core Capabilities
            </div>
            <h2 className="font-display text-[38px] text-[var(--sakhi-slate)]">
              Everything a Bank Sakhi &amp; SHG needs
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Fingerprint,
                title: "Demand Diagnosis",
                desc: "Structured intake separating Capex from Working Capital with Panchasutra validation and unit-economics DSCR.",
                color: "bg-[var(--sakhi-forest)]",
              },
              {
                icon: Target,
                title: "Transparent Scheme Matching",
                desc: "Deterministic matching across DAY-NRLM, PMFME, and MUDRA with explicit exclusions and zero paid ranking.",
                color: "bg-[var(--sakhi-gold)]",
              },
              {
                icon: FileCheck2,
                title: "Bank-Ready Appraisal Pack",
                desc: "One-click printable & JSON dossier with buyer evidence, purpose-specific consent, and document checklists.",
                color: "bg-[var(--sakhi-emerald)]",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="rounded-3xl ios-glass p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-5 flex h-13 w-13 h-12 w-12 items-center justify-center rounded-2xl ${feat.color} shadow-lg`}>
                  <feat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-[19px] font-bold text-[var(--sakhi-slate)]">{feat.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--sakhi-muted)]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Official Government Scheme Portals (Direct Access) ─── */}
      <section id="govt-portals" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
              <Globe className="h-3.5 w-3.5" />
              Direct Official Portals
            </div>
            <h2 className="font-display text-[38px] text-[var(--sakhi-slate)]">
              Government Scheme &amp; Registration Links
            </h2>
            <p className="mt-3 text-[15px] text-[var(--sakhi-muted)]">
              Sakhi CreditLink prepares your group&apos;s dossier and connects directly to official
              Central &amp; Gujarat Government portals for final submission.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOVT_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl ios-glass p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[var(--sakhi-mint)] px-3 py-1 text-[11px] font-semibold text-[var(--sakhi-forest)]">
                      {portal.tag}
                    </span>
                    <ExternalLink className="h-4 w-4 text-[var(--sakhi-muted)] transition-colors group-hover:text-[var(--sakhi-forest)]" />
                  </div>
                  <h3 className="mt-4 text-[17px] font-bold text-[var(--sakhi-slate)] group-hover:text-[var(--sakhi-forest)]">
                    {portal.name}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sakhi-muted)]">
                    {portal.desc}
                  </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--sakhi-forest)]">
                  Open official website <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              4-Step Process
            </div>
            <h2 className="font-display text-[38px] text-[var(--sakhi-slate)]">
              From SHG intake to bank branch
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              { step: "01", title: "Enter SHG Details", desc: "Capture group profile, Panchasutra status, and Capex/WC split.", icon: Sparkles },
              { step: "02", title: "Digital Diagnosis", desc: "Instant 3-scenario cash-flow, EMI, and DSCR viability check.", icon: Shield },
              { step: "03", title: "Match & Compare", desc: "Check DAY-NRLM / PMFME fit and compare lender terms fairly.", icon: BarChart3 },
              { step: "04", title: "Export Bank Pack", desc: "Print or download the verified dossier for branch appraisal.", icon: FileCheck2 },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl ios-glass p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-[34px] text-[var(--sakhi-forest)]/25">{s.step}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sakhi-mint)]">
                    <s.icon className="h-5 w-5 text-[var(--sakhi-forest)]" />
                  </div>
                </div>
                <h3 className="text-[16.5px] font-bold text-[var(--sakhi-slate)]">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sakhi-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Impact Banner ─── */}
      <section id="impact" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl ios-glass-dark p-10 md:p-14 relative">
            <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-white/85">
                  <Shield className="h-3.5 w-3.5" />
                  SFIC 2026 · PS000311
                </div>
                <h2 className="font-display text-[34px] text-white leading-tight md:text-[40px]">
                  Ready to assess your SHG&apos;s credit readiness?
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-white/75">
                  Start a live application in 2 minutes. Banks retain full sanction authority;
                  Sakhi CreditLink ensures your group walks into the branch fully prepared.
                </p>
                <button
                  onClick={onEnterPortal}
                  className="mt-7 group flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[15px] font-semibold text-[var(--sakhi-forest)] shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Start Credit Application
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "5", label: "Pilot Blocks", sub: "Anand & Kheda" },
                  { val: "14+", label: "Bank Sakhis", sub: "Cluster facilitators" },
                  { val: "29", label: "Sanctioned", sub: "Verified packs" },
                  { val: "₹78L", label: "Disbursed", sub: "SHG enterprises" },
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5">
                    <div className="font-display text-[30px] text-white">{m.val}</div>
                    <div className="mt-1 text-[13.5px] font-semibold text-white/90">{m.label}</div>
                    <div className="text-[12px] text-white/55">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Governance Footer ─── */}
      <footer className="mt-8 border-t border-white/60 ios-glass">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--sakhi-forest)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-[var(--sakhi-slate)]">Sakhi CreditLink</span>
            </div>
            <div className="flex flex-wrap gap-6 text-[13px] text-[var(--sakhi-muted)]">
              <span>Banks retain sanction authority</span>
              <span>•</span>
              <span>Purpose-specific consent</span>
              <span>•</span>
              <span>No paid lender ranking</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
