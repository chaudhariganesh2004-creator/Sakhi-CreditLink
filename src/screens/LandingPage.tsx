import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  Globe,
  MapPin,
  Shield,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

interface LandingPageProps {
  onEnterPortal: () => void;
}

const SHG_MARQUEE_IMAGES = [
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
  "/images/shg-hero.jpg",
  "/images/shg-food.jpg",
  "/images/shg-dairy.jpg",
  "/images/shg-tailoring.jpg",
];

const GOVT_PORTALS = [
  {
    name: "DAY-NRLM / Aajeevika",
    tag: "SHG Bank Linkage",
    desc: "Official National Rural Livelihoods Mission portal for SHG CCL, interest subvention, and LokOS guidelines.",
    url: "https://aajeevika.gov.in/",
    accent: "from-emerald-600 to-teal-700",
  },
  {
    name: "PMFME Portal (MoFPI)",
    tag: "35% Capital Subsidy",
    desc: "Micro Food Processing Enterprises scheme portal for machinery & fixed-capital subsidy applications.",
    url: "https://pmfme.mofpi.gov.in/",
    accent: "from-amber-600 to-orange-700",
  },
  {
    name: "JanSamarth Portal",
    tag: "Credit-Linked Schemes",
    desc: "Unified Government of India portal to check eligibility and apply across 12+ credit-linked schemes.",
    url: "https://www.jansamarth.in/",
    accent: "from-sky-600 to-blue-700",
  },
  {
    name: "PM MUDRA Yojana",
    tag: "Micro-Enterprise Loans",
    desc: "Official PMMY guidelines for Shishu, Kishore, and Tarun non-farm micro-enterprise credit.",
    url: "https://www.mudra.org.in/",
    accent: "from-teal-700 to-emerald-800",
  },
  {
    name: "Udyam Registration",
    tag: "MSME Identity",
    desc: "Zero-cost Government of India MSME registration required by banks and PMFME subsidy workflows.",
    url: "https://udyamregistration.gov.in/",
    accent: "from-indigo-600 to-slate-800",
  },
  {
    name: "GLPC Mission Mangalam",
    tag: "Gujarat State Nodal",
    desc: "Gujarat Livelihood Promotion Company portal for district cluster federations and Bank Sakhi support.",
    url: "https://glpc.gujarat.gov.in/",
    accent: "from-[#0D4F3C] to-[#148060]",
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
  const duplicatedPortals = [...GOVT_PORTALS, ...GOVT_PORTALS];

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
            <a href="#govt-portals" className="hover:text-[var(--sakhi-slate)] transition-colors">Govt Portals</a>
            <a href="#livelihoods" className="hover:text-[var(--sakhi-slate)] transition-colors">SHG Enterprises</a>
            <a href="#features" className="hover:text-[var(--sakhi-slate)] transition-colors">Capabilities</a>
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

      {/* ─── Animated Marquee Hero (hero-3 style) ─── */}
      <div className="pt-14 gradient-mesh">
        <AnimatedMarqueeHero
          tagline="SFIC 2026 · PS000311 · Gujarat SHG Credit Gateway"
          title={
            <>
              From Group Savings{" "}
              <span className="text-[var(--sakhi-forest)]">to Enterprise Credit</span>
              <span className="text-[var(--sakhi-gold)]">.</span>
            </>
          }
          description="Verify your NRLM LokOS registration, run a 6–12 month sales-backed financial diagnosis, match 9 Gujarat & GLPC schemes, and export a bank-ready dossier in minutes."
          ctaText="Start Credit Application →"
          images={SHG_MARQUEE_IMAGES}
          onCtaClick={onEnterPortal}
        />
      </div>

      {/* ─── iOS Glass Stat Strip ─── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
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
      </section>

      {/* ─── Official Government Scheme Portals (Animated Tilted Marquee Style) ─── */}
      <section id="govt-portals" className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full ios-pill px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
            <Globe className="h-3.5 w-3.5" />
            Direct Official Portals
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-[var(--sakhi-slate)]">
            Connected to Government Credit Portals
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-[15.5px] text-[var(--sakhi-muted)] leading-relaxed">
            Sakhi CreditLink prepares your group&apos;s verified dossier and connects you directly to
            official Central &amp; Gujarat Government portals for final submission.
          </p>
        </div>

        {/* Animated Tilted Portal Card Marquee (hovering pauses/lifts any card to click) */}
        <div className="relative mt-12 w-full overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            className="flex gap-5 w-max px-4"
            animate={{
              x: ["0%", "-50%"],
              transition: {
                ease: "linear",
                duration: 38,
                repeat: Infinity,
              },
            }}
            whileHover={{ transition: { duration: 120 } }}
          >
            {duplicatedPortals.map((portal, idx) => (
              <motion.a
                key={`${portal.name}-${idx}`}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
                style={{ rotate: `${idx % 2 === 0 ? -1.8 : 2.2}deg` }}
                className="group flex w-72 sm:w-80 flex-shrink-0 flex-col justify-between rounded-3xl ios-glass-strong p-6 transition-shadow hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full bg-gradient-to-r ${portal.accent} px-3 py-1 text-[11px] font-semibold text-white shadow-sm`}>
                      {portal.tag}
                    </span>
                    <ExternalLink className="h-4 w-4 text-[var(--sakhi-muted)] group-hover:text-[var(--sakhi-forest)]" />
                  </div>
                  <h3 className="mt-4 text-[18px] font-bold text-[var(--sakhi-slate)] group-hover:text-[var(--sakhi-forest)]">
                    {portal.name}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sakhi-muted)]">
                    {portal.desc}
                  </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--sakhi-forest)]">
                  Visit Official Portal <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SHG Livelihood Photos Showcase ─── */}
      <section id="livelihoods" className="py-16">
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
      <section id="features" className="py-16">
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
                desc: "Structured intake separating Capex from Working Capital with 6–12 month sales-backed EMI & DSCR.",
                color: "bg-[var(--sakhi-forest)]",
              },
              {
                icon: Target,
                title: "9-Scheme Gujarat Engine",
                desc: "Deterministic matching across GLPC 0% Subvention, MMUY, CIF, VBY, PMFME & MUDRA with Apply + Bank Picker.",
                color: "bg-[var(--sakhi-gold)]",
              },
              {
                icon: FileCheck2,
                title: "Verified Appraisal Pack",
                desc: "Geo-tagged field proof, 3-bearer Quorum OTP, API Setu checks, and one-click printable PDF & JSON dossiers.",
                color: "bg-[var(--sakhi-emerald)]",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="rounded-3xl ios-glass p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${feat.color} shadow-lg`}>
                  <feat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-[19px] font-bold text-[var(--sakhi-slate)]">{feat.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--sakhi-muted)]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-16">
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
              { step: "01", title: "Verify LokOS ID", desc: "Auto-populate SHG identity & Panchasutra from GLPC snapshot.", icon: Sparkles },
              { step: "02", title: "Sales-Backed EMI", desc: "Enter 6–12 month sales to compute natural EMI & lean-month DSCR.", icon: Shield },
              { step: "03", title: "Match & Choose Bank", desc: "Apply under Absolute Match Gujarat/GLPC schemes & pick a bank.", icon: BarChart3 },
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
