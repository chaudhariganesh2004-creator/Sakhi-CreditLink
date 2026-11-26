import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Globe,
  ShieldCheck,
} from "lucide-react";
import type { AppLanguage, PortalRole } from "@/data/sakhi-data";
import { Button } from "@/components/ui/button";
import { Card, SimulatedBadge } from "@/components/ui/primitives";

interface LandingPageProps {
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onEnterPortal: (targetRole?: PortalRole) => void;
}

const GOVT_PORTALS = [
  {
    name: "DAY-NRLM / Aajeevika",
    tag: "SHG Bank Linkage",
    desc: "National Rural Livelihoods Mission portal for Sakhi Mandal CCL, interest subvention, and LokOS norms.",
    url: "https://aajeevika.gov.in/",
  },
  {
    name: "PMFME Portal (MoFPI)",
    tag: "35% Capital Subsidy",
    desc: "Micro Food Processing Enterprises portal for machinery and fixed-capital subsidy applications.",
    url: "https://pmfme.mofpi.gov.in/",
  },
  {
    name: "JanSamarth Portal",
    tag: "Credit-Linked Schemes",
    desc: "Unified Government of India portal to check eligibility across credit-linked schemes.",
    url: "https://www.jansamarth.in/",
  },
  {
    name: "PM MUDRA Yojana",
    tag: "Micro-Enterprise Loans",
    desc: "Official PMMY guidelines for Shishu, Kishore, and Tarun non-farm micro-enterprise loans.",
    url: "https://www.mudra.org.in/",
  },
  {
    name: "Udyam Registration",
    tag: "MSME Identity",
    desc: "Zero-cost Government of India MSME registration required by banks and PMFME workflows.",
    url: "https://udyamregistration.gov.in/",
  },
  {
    name: "GLPC Mission Mangalam",
    tag: "Gujarat State Nodal",
    desc: "Gujarat Livelihood Promotion Company portal for district cluster federations and Bank Sakhis.",
    url: "https://glpc.gujarat.gov.in/",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onChangeLanguage,
  onEnterPortal,
}) => {
  const isGu = language === "gu";

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#141A23]">
      {/* ─── Clean Single-Row Institutional Header ─── */}
      <header className="sticky top-0 z-40 border-b border-[#DFDBD0] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0F5E4E] text-white font-mono text-[12px] font-semibold">
              SC
            </div>
            <div className="truncate">
              <span className="text-[15px] font-bold tracking-tight text-[#141A23]">
                Sakhi CreditLink
              </span>
              <span className="ml-2 hidden sm:inline font-mono text-[11px] text-[#475467]">
                Gujarat · PS000311
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block">
              <SimulatedBadge compact />
            </div>

            <div
              className="inline-flex rounded-md border border-[#C9C3B4] bg-[#FAF8F4] p-0.5 text-[12px]"
              role="group"
              aria-label="Language selector"
            >
              <button
                type="button"
                onClick={() => onChangeLanguage("en")}
                className={`min-h-[32px] rounded px-2.5 font-medium transition-colors duration-150 ${
                  language === "en" ? "bg-[#0F5E4E] text-white" : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage("gu")}
                className={`min-h-[32px] rounded px-2.5 font-medium transition-colors duration-150 ${
                  language === "gu" ? "bg-[#0F5E4E] text-white" : "text-[#475467] hover:text-[#141A23]"
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            <Button variant="primary" size="sm" onClick={() => onEnterPortal("shg-sakhi")}>
              {isGu ? "પોર્ટલ ખોલો" : "Open Live Demo"}
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Editorial 2-Column Hero ─── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#DFDBD0] bg-[#F2EFE8] px-2.5 py-1 font-mono text-[11px] font-medium text-[#475467]">
                SEVA First Innovation · PS000311
              </span>
              <SimulatedBadge />
            </div>

            <h1 className="font-serif text-[34px] md:text-[46px] font-semibold leading-[1.12] tracking-tight text-[#141A23]">
              {isGu
                ? "સખી મંડળોને લક્ષ્યાંકથી વાસ્તવિક બેંક ધિરાણ સુધી લઈ જતું પ્લેટફોર્મ."
                : "Move Sakhi Mandals from credit targets to real bank access."}
            </h1>

            <p className="max-w-xl text-[15.5px] leading-relaxed text-[#475467]">
              {isGu
                ? "લોકOS ચકાસણી, ૬× કોર્પસ નિયમ, ૬–૧૨ મહિનાના વેચાણ આધારિત રોકડ પ્રવાહ અને ૦% વ્યાજ સબવેન્શન ટ્રેકિંગ સાથે બેંક-તૈયાર અરજી પેક."
                : "Verify NRLM LokOS identity, size working capital vs Capex against RBI's 6× corpus norm, match Gujarat & GLPC schemes, and track bank branch SLAs."}
            </p>

            {/* Target vs Access Gap Callout */}
            <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#B45309]">
                  The Target-vs-Access Gap (Illustrative Baseline)
                </span>
                <span className="font-mono text-[11px] text-[#B45309]">Simulated pilot</span>
              </div>
              <p className="mt-1.5 text-[13.5px] text-[#141A23]">
                Systems track <strong>number of SHGs linked</strong>, while real access stalls on{" "}
                <strong>time-to-credit (34d → 18d target)</strong>, <strong>under-sized tickets</strong>, and{" "}
                <strong>missing cashbook / buyer proof</strong>.
              </p>
            </div>

            {/* Role Entry CTAs (1 Primary + 1 Secondary) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button variant="primary" size="lg" onClick={() => onEnterPortal("shg-sakhi")}>
                {isGu ? "સખી મંડળ / બેંક સખી તરીકે દાખલ થાઓ" : "Enter as SHG / Bank Sakhi"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onEnterPortal("bank-branch")}>
                Enter as Bank Branch
              </Button>
              <Button variant="tertiary" size="lg" onClick={() => onEnterPortal("district-official")}>
                District Official View
              </Button>
            </div>
          </div>

          {/* Static Authentic SHG Photo */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden">
              <img
                src="/images/shg-hero.jpg"
                alt="Sakhi Mandal women members reviewing enterprise ledger in Gujarat"
                width={900}
                height={640}
                className="h-[300px] md:h-[340px] w-full object-cover"
              />
              <div className="border-t border-[#DFDBD0] bg-white px-4 py-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[13px] font-semibold text-[#141A23]">
                    Ujjwal Sakhi Mandal · Chikhodra, Anand
                  </div>
                  <div className="text-[12px] text-[#475467]">
                    Papad &amp; Spice Unit · Simulated case walkthrough
                  </div>
                </div>
                <span className="font-mono text-[12px] font-semibold text-[#0F5E4E]">₹2.15L</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Simulated Pilot Metrics Strip ─── */}
      <section className="border-y border-[#DFDBD0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#475467]">
              Anand &amp; Kheda Illustrative Pilot Snapshot
            </span>
            <SimulatedBadge />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "148", label: "SHGs Identified (Simulated)", sub: "Anand & Kheda blocks" },
              { value: "₹3.62 Cr", label: "Indicative Demand (Simulated)", sub: "Capex + WC separated" },
              { value: "61", label: "Lender-Ready Packs (Simulated)", sub: "Verified checklist" },
              { value: "29", label: "Sanctioned Packs (Simulated)", sub: "Branch tracking" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-4">
                <div className="font-mono text-[26px] font-semibold text-[#141A23] tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-[#141A23]">{stat.label}</div>
                <div className="mt-0.5 text-[12px] text-[#475467]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (3 Crisp Steps) ─── */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-[26px] font-semibold text-[#141A23]">
          How Sakhi CreditLink Works in 3 Steps
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Verify LokOS & RBI 6× Corpus",
              desc: "Pull Sakhi Mandal identity from GLPC snapshot and check RBI first-dose eligibility: max(6× corpus, ₹1.5L) with 6-month active books.",
            },
            {
              step: "02",
              title: "Build Cash-Flow Blueprint",
              desc: "Separate Capex from Working Capital, attach 6–12 month sales ledger, and check lean-month EMI coverage.",
            },
            {
              step: "03",
              title: "Match, Submit & Guard 0%",
              desc: "Match 9 Gujarat/GLPC schemes, send bank-ready dossier, track branch SLA timers, and protect 0% interest subvention.",
            },
          ].map((item) => (
            <Card key={item.step} className="p-5">
              <div className="font-mono text-[12px] font-semibold text-[#0F5E4E]">STEP {item.step}</div>
              <h3 className="mt-2 text-[16px] font-semibold text-[#141A23]">{item.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#475467]">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Official Government Portals (Static Accessible Grid) ─── */}
      <section id="govt-portals" className="border-t border-[#DFDBD0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0F5E4E]">
                <Globe className="h-3.5 w-3.5" /> Official Portals Directory
              </div>
              <h2 className="mt-1 font-serif text-[26px] font-semibold text-[#141A23]">
                Direct Government Scheme &amp; Registration Links
              </h2>
            </div>
            <p className="max-w-md text-[13px] text-[#475467]">
              Sakhi CreditLink prepares pre-application packs and links out to official government portals for submission.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GOVT_PORTALS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-lg border border-[#DFDBD0] bg-[#FAF8F4] p-5 transition-colors duration-150 hover:border-[#0F5E4E] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
                      {portal.tag}
                    </span>
                    <ExternalLink className="h-4 w-4 text-[#475467] group-hover:text-[#0F5E4E]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-[15.5px] font-semibold text-[#141A23] group-hover:text-[#0F5E4E]">
                    {portal.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#475467]">{portal.desc}</p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0F5E4E]">
                  Open official portal <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust & DPDP Act 2023 Footer ─── */}
      <footer className="border-t border-[#DFDBD0] bg-[#F2EFE8]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 text-[12.5px] text-[#475467] md:flex-row md:items-center md:px-6">
          <div className="flex items-center gap-2 font-semibold text-[#141A23]">
            <ShieldCheck className="h-4 w-4 text-[#0F5E4E]" aria-hidden="true" />
            <span>Sakhi CreditLink · Gujarat Pilot Prototype</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" /> Banks retain sanction authority
            </span>
            <span>Purpose-specific consent (DPDP Act 2023)</span>
            <span>Zero paid lender ranking</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
