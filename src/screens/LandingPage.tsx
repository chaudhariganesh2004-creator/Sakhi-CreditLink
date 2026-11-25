import React from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Fingerprint,
  MapPin,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onEnterPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Top Navigation ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sakhi-forest)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[var(--sakhi-slate)]">
                Sakhi CreditLink
              </span>
              <span className="ml-2 rounded-full bg-[var(--sakhi-mint)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--sakhi-forest)]">
                Gujarat Pilot
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[var(--sakhi-muted)]">
            <a href="#features" className="hover:text-[var(--sakhi-slate)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--sakhi-slate)] transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-[var(--sakhi-slate)] transition-colors">Impact</a>
          </div>
          <button
            onClick={onEnterPortal}
            className="group flex items-center gap-2 rounded-xl bg-[var(--sakhi-forest)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-[var(--sakhi-forest)]/20 transition-all hover:bg-[var(--sakhi-forest-deep)] hover:shadow-xl hover:shadow-[var(--sakhi-forest)]/30"
          >
            Enter Portal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-16">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 left-1/4 h-[600px] w-[600px] rounded-full bg-[var(--sakhi-forest)]/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--sakhi-gold)]/[0.04] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--sakhi-border)] bg-white px-4 py-2 shadow-sm animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="text-[13px] font-medium text-[var(--sakhi-muted)]">
                  SFIC 2026 · PS000311 · Gujarat Livelihoods
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-[48px] leading-[1.1] tracking-tight text-[var(--sakhi-slate)] md:text-[60px] animate-fade-in-up animation-delay-100">
                From group savings{" "}
                <span className="text-[var(--sakhi-forest)]">to enterprise credit</span>
                <span className="text-[var(--sakhi-gold)]">.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-[18px] leading-relaxed text-[var(--sakhi-muted)] animate-fade-in-up animation-delay-200">
                Sakhi CreditLink bridges the gap between SHG demand and bank-ready 
                application packs — with transparent scheme matching, evidence-based 
                financing blueprints, and purpose-specific consent.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
                <button
                  onClick={onEnterPortal}
                  className="group flex items-center gap-2.5 rounded-2xl bg-[var(--sakhi-forest)] px-7 py-4 text-[16px] font-semibold text-white shadow-xl shadow-[var(--sakhi-forest)]/25 transition-all hover:bg-[var(--sakhi-forest-deep)] hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <Sparkles className="h-5 w-5" />
                  Explore the Portal
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 rounded-2xl border border-[var(--sakhi-border)] bg-white px-7 py-4 text-[16px] font-semibold text-[var(--sakhi-slate)] shadow-sm transition-all hover:border-[var(--sakhi-forest)]/20 hover:shadow-md"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Hero Visual — Minimal abstract card */}
            <div className="relative hidden lg:block animate-fade-in-up animation-delay-400">
              <div className="relative mx-auto w-full max-w-md">
                {/* Floating metric cards */}
                <div className="absolute -left-6 top-8 z-10 rounded-2xl border border-[var(--sakhi-border)] bg-white p-5 shadow-xl shadow-black/5 animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sakhi-mint)]">
                      <Users className="h-5 w-5 text-[var(--sakhi-forest)]" />
                    </div>
                    <div>
                      <div className="text-[24px] font-bold text-[var(--sakhi-slate)] tabular-nums">148</div>
                      <div className="text-[12px] text-[var(--sakhi-muted)]">SHGs with verified demand</div>
                    </div>
                  </div>
                </div>

                {/* Main card */}
                <div className="rounded-3xl border border-[var(--sakhi-border)] bg-gradient-to-br from-white to-[var(--sakhi-surface)] p-8 shadow-2xl shadow-black/5">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--sakhi-forest)]">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-[var(--sakhi-slate)]">Ujjwal Mahila SHG</div>
                      <div className="text-[13px] text-[var(--sakhi-muted)]">Papad & Spice Processing · Anand</div>
                    </div>
                  </div>

                  {/* Progress visualization */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[var(--sakhi-muted)]">Application Readiness</span>
                      <span className="text-[14px] font-bold text-[var(--sakhi-forest)]">84%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--sakhi-surface)]">
                      <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[var(--sakhi-forest)] to-[var(--sakhi-emerald)]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="rounded-xl bg-[var(--sakhi-surface)] p-3.5">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--sakhi-muted)]">External Need</div>
                        <div className="mt-1 text-[20px] font-bold text-[var(--sakhi-slate)] tabular-nums">₹2.15L</div>
                      </div>
                      <div className="rounded-xl bg-[var(--sakhi-gold-light)] p-3.5">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--sakhi-muted)]">Own Share</div>
                        <div className="mt-1 text-[20px] font-bold text-[var(--sakhi-slate)] tabular-nums">₹35K</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--sakhi-mint)] px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-[var(--sakhi-forest)]" />
                    <span className="text-[13px] font-medium text-[var(--sakhi-forest)]">3 schemes matched · Finance plan ready</span>
                  </div>
                </div>

                {/* Bottom floating card */}
                <div className="absolute -bottom-4 -right-6 z-10 rounded-2xl border border-[var(--sakhi-border)] bg-white p-4 shadow-xl shadow-black/5 animate-scale-in" style={{animationDelay: '600ms'}}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sakhi-gold-light)]">
                      <TrendingUp className="h-4 w-4 text-[var(--sakhi-gold)]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--sakhi-slate)]">₹3.62 Cr</div>
                      <div className="text-[11px] text-[var(--sakhi-muted)]">Pipeline demand identified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="border-y border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
            {[
              { value: "148", label: "SHGs with Verified Demand", sub: "Anand & Kheda Districts" },
              { value: "₹3.62 Cr", label: "Total Pipeline Value", sub: "Pre-application demand" },
              { value: "84%", label: "Average Readiness Score", sub: "Across active cases" },
              { value: "61", label: "Lender-Ready Packs", sub: "Complete & verified" },
            ].map((stat, i) => (
              <div key={i} className="px-6 py-8 text-center md:px-8">
                <div className="font-display text-[32px] text-[var(--sakhi-slate)] animate-count" style={{animationDelay: `${i * 150}ms`}}>
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[14px] font-semibold text-[var(--sakhi-slate)]">{stat.label}</div>
                <div className="mt-0.5 text-[12px] text-[var(--sakhi-muted)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              <Zap className="h-3.5 w-3.5" />
              Core Capabilities
            </div>
            <h2 className="font-display text-[40px] text-[var(--sakhi-slate)]">
              Everything a Bank Sakhi needs
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--sakhi-muted)]">
              Three capabilities that transform how SHGs navigate the journey from enterprise aspiration to lender-ready credit application.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Fingerprint,
                title: "Demand Diagnosis",
                desc: "Structured cost capture separating capex from working capital. Panchasutra validation. Field-verified provenance at every line item.",
                color: "bg-[var(--sakhi-forest)]",
                iconColor: "text-white",
              },
              {
                icon: Target,
                title: "Transparent Scheme Matching",
                desc: "Rule-based matching against DAY-NRLM, PMFME, MUDRA with explicit exclusions. No hidden ranking. Every condition surfaced for verification.",
                color: "bg-[var(--sakhi-gold)]",
                iconColor: "text-white",
              },
              {
                icon: FileCheck2,
                title: "Lender-Ready Packs",
                desc: "Complete application bundles with cash-flow evidence, buyer purchase orders, consent records, and document checklists — ready for bank appraisal.",
                color: "bg-[var(--sakhi-emerald)]",
                iconColor: "text-white",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-[var(--sakhi-border)] bg-white p-8 transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feat.color} shadow-lg`}>
                  <feat.icon className={`h-7 w-7 ${feat.iconColor}`} />
                </div>
                <h3 className="text-[20px] font-bold text-[var(--sakhi-slate)]">{feat.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--sakhi-muted)]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-y border-[var(--sakhi-border)] bg-[var(--sakhi-surface)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--sakhi-border)] bg-white px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-[var(--sakhi-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              The Journey
            </div>
            <h2 className="font-display text-[40px] text-[var(--sakhi-slate)]">
              From enquiry to bank branch
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--sakhi-muted)]">
              A structured, transparent pathway guided by your Bank Sakhi
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Identify Demand",
                desc: "Bank Sakhi captures enterprise aspiration and costs during cluster meeting.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Build Finance Passport",
                desc: "Panchasutra validation, documents, and unit economics verified in the field.",
                icon: Shield,
              },
              {
                step: "03",
                title: "Match & Compare",
                desc: "Rule-engine matches eligible schemes. SHG reviews and chooses financing route.",
                icon: BarChart3,
              },
              {
                step: "04",
                title: "Submit Pack",
                desc: "Complete application pack handed to bank branch for appraisal. Bank retains sanction authority.",
                icon: FileCheck2,
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="absolute right-0 top-12 hidden h-px w-6 bg-[var(--sakhi-border)] md:block" style={{right: '-12px'}} />
                )}
                <div className="rounded-2xl border border-[var(--sakhi-border)] bg-white p-6 transition-all hover:shadow-lg hover:shadow-black/5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-[36px] text-[var(--sakhi-forest)]/20">{s.step}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--sakhi-mint)]">
                      <s.icon className="h-5 w-5 text-[var(--sakhi-forest)]" />
                    </div>
                  </div>
                  <h3 className="text-[17px] font-bold text-[var(--sakhi-slate)]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--sakhi-muted)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Impact / Pilot Context ─── */}
      <section id="impact" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl bg-[var(--sakhi-forest)] p-12 md:p-16 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--sakhi-forest)] via-[var(--sakhi-forest-deep)] to-[#063426]" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent" />
            
            <div className="relative z-10 grid gap-12 md:grid-cols-2 items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-white/80">
                  <Shield className="h-3.5 w-3.5" />
                  SFIC 2026 · PS000311
                </div>
                <h2 className="font-display text-[36px] text-white leading-tight md:text-[42px]">
                  Bridging the last mile of SHG enterprise credit
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                  Operating under GLPC Mission Mangalam, this pilot gateway serves Anand & Kheda 
                  districts — complementing the NRLM SHG-Bank Linkage Portal with pre-application 
                  readiness and transparent scheme navigation.
                </p>
                <button
                  onClick={onEnterPortal}
                  className="mt-8 group flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-[15px] font-semibold text-[var(--sakhi-forest)] shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Explore the Pilot Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "5", label: "Districts", sub: "Pilot coverage" },
                  { val: "14+", label: "Bank Sakhis", sub: "Active facilitators" },
                  { val: "29", label: "Sanctioned", sub: "Applications cleared" },
                  { val: "₹78L", label: "Disbursed", sub: "To SHG enterprises" },
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5">
                    <div className="font-display text-[32px] text-white">{m.val}</div>
                    <div className="mt-1 text-[14px] font-semibold text-white/90">{m.label}</div>
                    <div className="text-[12px] text-white/50">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Governance Footer ─── */}
      <footer className="border-t border-[var(--sakhi-border)] bg-[var(--sakhi-surface)]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sakhi-forest)]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-[16px] font-bold text-[var(--sakhi-slate)]">Sakhi CreditLink</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--sakhi-muted)]">
                SHG Finance & Enterprise Growth Gateway. A pre-application readiness tool 
                complementing the NRLM SHG-Bank Linkage Portal.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">Governance</h4>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--sakhi-muted)]">
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--sakhi-forest)]" />
                  Banks retain full sanction authority
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--sakhi-forest)]" />
                  Purpose-specific consent only
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--sakhi-forest)]" />
                  No paid lender ranking
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--sakhi-muted)]">Context</h4>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--sakhi-muted)]">
                <li>GLPC Mission Mangalam · Gujarat</li>
                <li>SFIC 2026 · Problem Statement PS000311</li>
                <li>Pilot: Anand & Kheda Districts</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-[var(--sakhi-border)] pt-6 text-[12px] text-[var(--sakhi-muted)]">
            <span>© 2026 Sakhi CreditLink · Illustrative Prototype</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
              Demo Data — Not Live Bank Integration
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
